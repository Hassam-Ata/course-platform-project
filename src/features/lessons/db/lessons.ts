import { db } from "@/drizzle/db";
import { CourseSectionTable, LessonTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateLessonCache } from "./cache/lessons";

export async function getNextCourseLessonOrder(sectionId: string) {
  const lesson = await db.query.LessonTable.findFirst({
    columns: { order: true },
    where: eq(LessonTable.sectionId, sectionId),
    orderBy: ({ order }, { desc }) => desc(order),
  });

  return lesson ? lesson.order + 1 : 0;
}

export async function insertLesson(data: typeof LessonTable.$inferInsert) {
  // Step 1: Get courseId from section
  const section = await db.query.CourseSectionTable.findFirst({
    columns: { courseId: true },
    where: eq(CourseSectionTable.id, data.sectionId),
  });

  if (!section) throw new Error("Invalid section ID, rollback aborted");

  // Step 2: Insert lesson
  const [newLesson] = await db.insert(LessonTable).values(data).returning();

  if (!newLesson) throw new Error("Failed to create lesson");

  // Step 3: Revalidate cache
  revalidateLessonCache({ courseId: section.courseId, id: newLesson.id });

  return newLesson;
}

export async function updateLesson(
  id: string,
  data: Partial<typeof LessonTable.$inferInsert>
) {
  // Step 1: Fetch current lesson
  const currentLesson = await db.query.LessonTable.findFirst({
    where: eq(LessonTable.id, id),
    columns: { sectionId: true },
  });

  if (!currentLesson) throw new Error("Lesson not found");

  // Step 2: Handle order if sectionId changes
  if (
    data.sectionId != null &&
    currentLesson.sectionId !== data.sectionId &&
    data.order == null
  ) {
    data.order = await getNextCourseLessonOrder(data.sectionId);
  }

  // Step 3: Update lesson
  const [updatedLesson] = await db
    .update(LessonTable)
    .set(data)
    .where(eq(LessonTable.id, id))
    .returning();

  if (!updatedLesson) throw new Error("Failed to update lesson");

  // Step 4: Fetch courseId for cache revalidation
  const section = await db.query.CourseSectionTable.findFirst({
    columns: { courseId: true },
    where: eq(CourseSectionTable.id, updatedLesson.sectionId),
  });

  if (!section) throw new Error("Course section not found");

  revalidateLessonCache({ courseId: section.courseId, id: updatedLesson.id });

  return updatedLesson;
}

export async function deleteLesson(id: string) {
  // Step 1: Find lesson before deleting
  const lesson = await db.query.LessonTable.findFirst({
    where: eq(LessonTable.id, id),
    columns: { sectionId: true },
  });

  if (!lesson) throw new Error("Lesson not found");

  // Step 2: Delete lesson
  const [deletedLesson] = await db
    .delete(LessonTable)
    .where(eq(LessonTable.id, id))
    .returning();

  if (!deletedLesson) throw new Error("Failed to delete lesson");

  // Step 3: Fetch courseId for cache revalidation
  const section = await db.query.CourseSectionTable.findFirst({
    columns: { courseId: true },
    where: eq(CourseSectionTable.id, lesson.sectionId),
  });

  if (!section) throw new Error("Course section not found");

  revalidateLessonCache({
    id: deletedLesson.id,
    courseId: section.courseId,
  });

  return deletedLesson;
}

export async function updateLessonOrders(lessonIds: string[]) {
  if (lessonIds.length === 0) return;

  // Step 1: Update lesson orders
  const updatedLessons = await Promise.all(
    lessonIds.map((id, index) =>
      db
        .update(LessonTable)
        .set({ order: index })
        .where(eq(LessonTable.id, id))
        .returning({ sectionId: LessonTable.sectionId, id: LessonTable.id })
    )
  );

  // Step 2: Find sectionId from updated lessons
  const sectionId = updatedLessons.flat()[0]?.sectionId;
  if (!sectionId) throw new Error("Invalid section ID, rollback aborted");

  // Step 3: Fetch courseId for cache revalidation
  const section = await db.query.CourseSectionTable.findFirst({
    columns: { courseId: true },
    where: eq(CourseSectionTable.id, sectionId),
  });

  if (!section) throw new Error("Course section not found");

  // Step 4: Revalidate cache
  updatedLessons.flat().forEach(({ id }) => {
    revalidateLessonCache({ courseId: section.courseId, id });
  });
}
