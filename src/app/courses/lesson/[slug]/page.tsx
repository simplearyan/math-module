import { getLessonBySlug } from "@/lib/lesson"; // utility from above
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { notFound } from "next/navigation";

export const revalidate = 3600; // 1 hour ISR

interface Params {
  slug: string;
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
            {/* Next.js Image recommended, fallback to img for demo */}
            <img
              src={frontmatter.image}
              alt={frontmatter.title}
              className="w-full max-h-80 object-cover rounded"
            />
          </div>
        )}
        <CardContent className="prose max-w-none dark:prose-invert">
          {/* Rendered Markdown/MDX content here */}
          {renderedContent}
        </CardContent>
      </Card>
    </main>
  );
}
