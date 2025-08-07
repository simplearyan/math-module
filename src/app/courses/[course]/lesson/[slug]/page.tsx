import { getLessonBySlug } from "@/lib/lesson"; // your existing lesson fetching utility
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour ISR

interface Params {
  slug: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;

  const lesson = await getLessonBySlug(slug);
  if (!lesson) {
    return {
      title: "Lesson Not Found",
      description: "The requested lesson could not be found.",
      openGraph: {
        title: "Lesson Not Found",
        description: "The requested lesson could not be found.",
      },
      twitter: {
        card: "summary",
        title: "Lesson Not Found",
        description: "The requested lesson could not be found.",
      },
    };
  }

  const { frontmatter } = lesson;

  const title = frontmatter.title || "Untitled Lesson";
  const description = frontmatter.description || "Learn this lesson.";
  const date = frontmatter.date || undefined;

  // Construct absolute URL for the image if present
  const imageUrl = frontmatter.image
    ? new URL(frontmatter.image, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").toString()
    : undefined;

  // Construct canonical URL for the lesson page
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/courses/lesson/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: date,
      images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
      creator: "@your_twitter_handle", // replace with your Twitter handle if desired
    },
  };
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const { frontmatter, renderedContent } = lesson;

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{frontmatter.title}</CardTitle>
          {frontmatter.date && (
            <p className="text-base text-muted-foreground mb-2">
              {new Date(frontmatter.date).toLocaleDateString()}
            </p>
          )}
          {frontmatter.description && (
            <CardDescription className="text-lg">{frontmatter.description}</CardDescription>
          )}
        </CardHeader>
        {frontmatter.image && (
          <div className="rounded overflow-hidden mb-4">
            {/* Next.js Image can be used here if domains are configured */}
            <img
              src={frontmatter.image}
              alt={frontmatter.title}
              className="w-full max-h-80 object-cover rounded"
            />
          </div>
        )}
        <CardContent className="prose max-w-none dark:prose-invert">
          {renderedContent}
        </CardContent>
      </Card>
    </main>
  );
}
