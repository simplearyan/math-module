import { notFound } from "next/navigation"; // For handling 404
import { getPostById, getPostList, Post } from "@/lib/blog"; // Import your blog fetching utilities
import type { Metadata } from "next"; // Import Metadata type for generateMetadata
import { BlogPostPage as Blog } from "@/components/pages/blog-post"; // Import the BlogPostPage component for rendering the post content
// This line is KEPT for Edge Runtime compatibility
// export const runtime = 'edge';

/**
 * generateMetadata is a Next.js function to dynamically set SEO metadata
 * for each blog post page based on its content.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Destructure slug directly for clarity and to potentially resolve the Next.js warning
  const { slug } = await params;

  const post = await getPostById(slug);

  // If post not found, Next.js will handle the 404 (via notFound() call in the component)
  // but we should provide a default or generic metadata here if post is null.
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  // Construct the full URL for the image if available
  const imageUrl = post.image
    ? new URL(
        post.image,
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      ).toString()
    : undefined;

  return {
    title: post.title,
    description: post.description || `Read "${post.title}" by ${post.author}.`,
    keywords: post.tags?.join(", ") || post.title.split(" ").join(", "),
    openGraph: {
      title: post.title,
      description:
        post.description || `Read "${post.title}" by ${post.author}.`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: imageUrl ? [{ url: imageUrl, alt: post.title }] : [],
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description:
        post.description || `Read "${post.title}" by ${post.author}.`,
      creator: `@${post.author.replace(/\s+/g, "")}` || "@your_twitter_handle", // Replace with a real twitter handle
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

/**
 * The main Server Component for displaying a single blog post.
 * This will now run on the Edge and use ISR for caching.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostById(slug);

  // If the post is not found (e.g., getPostById returns null due to 404 from GitHub),
  // Next.js's notFound() function will display the closest 404.tsx or the default 404 page.
  if (!post) {
    notFound();
  }

  // Render the blog post content using Markdown
  // Note: Ensure you have the necessary plugins for Markdown processing in your Tailwind config                
  return (
      <Blog post={post} />
  );
}
