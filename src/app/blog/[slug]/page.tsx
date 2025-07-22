import { notFound } from 'next/navigation'; // For handling 404
import { getPostById, getPostList, Post } from '@/lib/blog'; // Import your blog fetching utilities
import type { Metadata } from 'next'; // Import Metadata type for generateMetadata

// This line is KEPT for Edge Runtime compatibility
// export const runtime = 'edge';

/**
 * generateStaticParams is a Next.js function that allows you to pre-render
 * dynamic routes at build time. This improves performance and SEO.
 * It will fetch all post IDs and create a static page for each.
 */
// export async function generateStaticParams() {
//   const posts = await getPostList(); // Get all post metadata

//   // Return an array of objects, where each object has the 'slug' parameter
//   // that corresponds to the dynamic segment in the route.
//   return posts.map((post) => ({
//     slug: post.id,
//   }));
// }

/**
 * generateMetadata is a Next.js function to dynamically set SEO metadata
 * for each blog post page based on its content.
 */
export async function generateMetadata({ params }: {params:Promise<{ slug: string }>}): Promise<Metadata> {

    // Destructure slug directly for clarity and to potentially resolve the Next.js warning
  const { slug } = await params;

  const post = await getPostById(slug);

  // If post not found, Next.js will handle the 404 (via notFound() call in the component)
  // but we should provide a default or generic metadata here if post is null.
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  // Construct the full URL for the image if available
  const imageUrl = post.image ? new URL(post.image, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString() : undefined;

  return {
    title: post.title,
    description: post.description || `Read "${post.title}" by ${post.author}.`,
    keywords: post.tags?.join(', ') || post.title.split(' ').join(', '),
    openGraph: {
      title: post.title,
      description: post.description || `Read "${post.title}" by ${post.author}.`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: imageUrl ? [{ url: imageUrl, alt: post.title }] : [],
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.description || `Read "${post.title}" by ${post.author}.`,
      creator: `@${post.author.replace(/\s+/g, '')}` || '@your_twitter_handle', // Replace with a real twitter handle
      images: imageUrl ? [imageUrl] : [],
    },
  };
}


/**
 * The main Server Component for displaying a single blog post.
 * This will now run on the Edge and use ISR for caching.
 */
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const {slug}  = await params
  const post = await getPostById(slug);

  // If the post is not found (e.g., getPostById returns null due to 404 from GitHub),
  // Next.js's notFound() function will display the closest 404.tsx or the default 404 page.
  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto p-4 max-w-4xl pt-8 pb-16">
      {/* Optional: Display thumbnail image if available */}
      {post.image && (
        <div className="mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto object-cover rounded-lg shadow-md"
            style={{ maxHeight: '400px' }} // Limit max height for cover images
          />
        </div>
      )}

      <h1 className="text-4xl font-extrabold mb-4 leading-tight text-gray-900 dark:text-gray-100">
        {post.title}
      </h1>

      <div className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex flex-wrap gap-x-4">
        <span>By: {post.author}</span>
        <span>On: {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2">
            Tags:
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-800 dark:text-gray-200">
        {/* Render the processed Markdown content directly */}
        {post.content}
      </div>
    </article>
  );
}