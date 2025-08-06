import { fetchCourseContent } from "./course";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeReact from "rehype-react";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { Fragment } from "react";

// Custom components map (expand as needed)
import Callout from "@/components/Callout";

// Rehype-react custom components
const customRehypeReactOptions = {
  Fragment,
  jsx,
  jsxs,
  components: {
    Callout,
    // More mappings as needed
  }
};

export async function getLessonBySlug(slug: string) {
  // Recursively fetch lesson files to locate correct slug
  const allCourses = await fetchCourseContent("courses");
  let lessonFile = null;

  // Helper: flatten lessons from all courses
  function flattenLessons(courses: any[]): any[] {
    let out: any[] = [];
    for (const course of courses) {
      if (Array.isArray(course.children)) {
        out = out.concat(flattenLessons(course.children));
      } else if (course.content) {
        out.push(course);
      }
    }
    return out;
  }
  const allLessons = flattenLessons(allCourses);

  // Find lesson by slug in frontmatter or fileName
  for (const file of allLessons) {
    if (!file.content) continue;
    const { data } = matter(file.content);
    const fileSlug = data.slug || file.name.replace(/\.(md|mdx)$/, "");
    if (fileSlug === slug) {
      lessonFile = file;
      break;
    }
  }
  if (!lessonFile) return null;

  // Parse frontmatter and body
  const { data, content: markdownBody } = matter(lessonFile.content);

  // Convert Markdown/MDX to React components
  let renderedContent: React.ReactNode = null;
  try {
    const processed = await unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeReact, customRehypeReactOptions)
      .process(markdownBody);
    renderedContent = processed.result as React.ReactNode;
  } catch (err) {
    renderedContent = (
      <div className="text-red-600">Error rendering markdown/MDX.</div>
    );
  }
  return {
    frontmatter: data,
    renderedContent,
  };
}
