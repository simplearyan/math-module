import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseCardProps {
  name: string;
  path: string;
  lessonCount: number;
}

export function CourseCard({ name, path, lessonCount }: CourseCardProps) {
  // The path is used as slug for the dynamic route
  return (
    <Card className="hover:shadow-lg transition cursor-pointer">
      <Link href={`/courses/${encodeURIComponent(name)}`}>
        <CardHeader>
          <CardTitle className="capitalize">{name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">Click to view lessons</p>
        </CardContent>
      </Link>
    </Card>
  );
}
