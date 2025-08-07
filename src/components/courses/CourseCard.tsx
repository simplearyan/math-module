import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseCardProps {
  name: string;
  path: string;
  lessonCount: number;

  description?: string; // optional description from _index.md frontmatter
  image?: string;       // optional image URL from _index.md frontmatter
}

export function CourseCard({
  name,
  path,
  lessonCount,
  description,
  image,
}: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition cursor-pointer">
      <Link href={`/courses/${encodeURIComponent(name)}`}>
        {image && (
          <div className="relative h-36 w-full overflow-hidden rounded-t-md">
            <Image
              src={image}
              alt={name}
              fill
              quality={75}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
        )}
        <CardHeader className="pt-4">
          <CardTitle className="capitalize">{name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 line-clamp-3">
            {description || "Click to view lessons"}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
