"use server";
import { z } from "zod";
import { canCreateCourses } from "../permissions/courses";
import { courseSchema } from "../schemas/courses";
import { getCurrentUser } from "@/services/clerk";
import { insertCourse } from "../db/courses";
import { redirect } from "next/navigation";

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canCreateCourses(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your course" };
  }

  const course = await insertCourse(data);

  redirect(`/admin/courses/${course.id}/edit`);
}


export async function deleteCourse(id: string) {
  if (!canDeleteCourses(await getCurrentUser())) {
    return { error: true, message: "Error deleting your course" }
  }

  await deleteCourseDB(id)

  return { error: false, message: "Successfully deleted your course" }
}
