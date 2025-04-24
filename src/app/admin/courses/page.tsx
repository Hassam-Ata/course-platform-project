import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import {
  CourseSectionTable,
  CourseTable as DbCourseTable,
  LessonTable,
  UserCourseAccessTable,
} from "@/drizzle/schema";
import { getCourseGlobalTag } from "@/features/courses/db/cache/courses";
import { getUserCourseAccessGlobalTag } from "@/features/courses/db/cache/userCourseAccess";
import { getCourseSectionGlobalTag } from "@/features/courseSections/db/cache";
import { getLessonGlobalTag } from "@/features/lessons/db/cache/lessons";
import { asc, countDistinct, eq } from "drizzle-orm";
import { Pencil, Trash2 } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="container my-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm tracking-tight">
          📚 Courses
        </h1>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:brightness-110 text-white rounded-lg px-4 py-2 shadow"
        >
          <Link href="/admin/courses/new">+ New Course</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 shadow-md">
        <table className="min-w-full text-sm text-white table-auto">
          <thead className="bg-white/10 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Course Name</th>
              <th className="px-6 py-4 text-left">Sections</th>
              <th className="px-6 py-4 text-left">Lessons</th>
              <th className="px-6 py-4 text-left">Students</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/5">
            {courses.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-white/10 transition-all duration-150"
              >
                <td className="px-6 py-4 font-medium">{course.name}</td>
                <td className="px-6 py-4">{course.sectionsCount}</td>
                <td className="px-6 py-4">{course.lessonsCount}</td>
                <td className="px-6 py-4">{course.studentsCount}</td>
                <td className="px-6 py-4 space-x-2">
                  <Link
                    href={`/admin/courses/${course.id}/edit`}
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Link>
                  <Link
                    href={`/admin/courses/${course.id}/delete`}
                    className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function getCourses() {
  "use cache";
  cacheTag(
    getCourseGlobalTag(),
    getUserCourseAccessGlobalTag(),
    getCourseSectionGlobalTag(),
    getLessonGlobalTag()
  );

  return db
    .select({
      id: DbCourseTable.id,
      name: DbCourseTable.name,
      sectionsCount: countDistinct(CourseSectionTable),
      lessonsCount: countDistinct(LessonTable),
      studentsCount: countDistinct(UserCourseAccessTable),
    })
    .from(DbCourseTable)
    .leftJoin(
      CourseSectionTable,
      eq(CourseSectionTable.courseId, DbCourseTable.id)
    )
    .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
    .leftJoin(
      UserCourseAccessTable,
      eq(UserCourseAccessTable.courseId, DbCourseTable.id)
    )
    .orderBy(asc(DbCourseTable.name))
    .groupBy(DbCourseTable.id);
}
