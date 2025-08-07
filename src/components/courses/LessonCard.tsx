import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LessonCardProps {
  courseSlug: string;      // Added course slug
  slug: string;        // derived from file name, e.g. algebra-chapter-1
  title: string;
  description?: string;
  date?: string;
  image?: string;
  duration?: string;
}

export function LessonCard({ courseSlug, slug, title, description, date, image, duration }: LessonCardProps) {
  return (
    <Card className="hover:shadow-lg transition cursor-pointer">
      <Link href={`/courses/${encodeURIComponent(courseSlug)}/lesson/${slug}`}>
        {image && (
          <div className="relative h-36 w-full overflow-hidden rounded-t-md">
            <Image
              src={image}
              alt={title}
              fill
              quality={75}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {date && <p className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</p>}
        </CardHeader>
        <CardContent>
          <CardDescription>{description || 'No description available.'}</CardDescription>
          {duration && <p className="mt-2 text-xs text-muted-foreground">Duration: {duration}</p>}
        </CardContent>
      </Link>
    </Card>
  );
}
