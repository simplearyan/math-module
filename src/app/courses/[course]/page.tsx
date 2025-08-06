import { fetchCourseContent, revalidate } from "@/lib/course";
import { LessonCard } from "@/components/courses/LessonCard";
import matter from "gray-matter";

// export const revalidate = 3600; // 1 hour ISR

interface Params {
  course: string;
}

type CourseFile = {
  path: string;
  name: string;
  content: string | null;
  children?: CourseFile[];
};

export default async function SingleCoursePage({ params }: { params: Promise<Params> }) {
  const { course } = await params; // ✅ Await params
  const courseSlug = course;

  // Fetch all courses (folders)
  const allCourses = await fetchCourseContent("courses");

  // Find the requested course folder by slug (name)
  const currentCourse = allCourses.find((c) => c.name === courseSlug);

  if (!currentCourse || !currentCourse.children) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">Course not found</h1>
        <p>Sorry, we couldn't find the requested course.</p>
      </main>
    );
  }

  // Parse frontmatter metadata for each lesson
  const lessons = await Promise.all(
    currentCourse.children.map(async (lesson) => {
      if (!lesson.content) return null;

      // Parse front matter
      const { data } = matter(lesson.content);

      const title = data.title || lesson.name.replace(/\.(md|mdx)$/, "");
      const description = data.description || "";
      const date = data.date || "";
      const image = data.image || "";
      const duration = data.duration || "";
      const slug = data.slug || lesson.name.replace(/\.(md|mdx)$/, "");

      return {
        slug,
        title,
        description,
        date,
        image,
        duration,
      };
    })
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">{currentCourse.name}</h1>

      {lessons.filter(Boolean).length === 0 ? (
        <p>No lessons found in this course.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lessons.map(
            (lesson) =>
              lesson && (
                <LessonCard
                  key={lesson.slug}
                  slug={lesson.slug}
                  title={lesson.title}
                  description={lesson.description}
                  date={lesson.date}
                  image={lesson.image}
                  duration={lesson.duration}
                />
              )
          )}
        </div>
      )}
    </main>
  );
}
