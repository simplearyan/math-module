import { fetchCourseContent, revalidate } from "@/lib/course";
import { CourseCard } from "@/components/courses/CourseCard";

// export const revalidate = 3600; // 1 hour ISR

export default async function CoursesPage() {
  const courses = await fetchCourseContent("courses");

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Courses</h1>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.path}
              name={course.name}
              path={course.path}
              lessonCount={course.children ? course.children.length : 0}
            />
          ))}
        </div>
      )}
    </main>
  );
}
