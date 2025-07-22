// app/tags/[tag]/page.tsx
import { notFound } from 'next/navigation';
import { getPostList, Post } from '@/lib/blog';
import type { Metadata } from 'next';
import Link from 'next/link';


// This line is KEPT for Edge Runtime compatibility
// export const runtime = 'edge';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

/**
 * generateStaticParams is REMOVED for Option 2.
 * This page will be dynamically rendered on the Edge (SSR/ISR).
 */

// For static generation of all tag pages
// This will pre-render pages for every tag found in your blog posts
// export async function generateStaticParams() {
//   const allPosts = await getPostList();
//   const allTags = new Set<string>();

//   allPosts.forEach(post => {
//     if (post.tags) {
//       post.tags.forEach(tag => allTags.add(tag.toLowerCase()));
//     }
//   });

//   return Array.from(allTags).map(tag => ({
//     tag,
//   }));
// }

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;   // Await here
  const decodedTag = decodeURIComponent(tag);
    return {
    title: `Posts Tagged: ${decodedTag}`,
    description: `Browse all blog posts categorized under the '${decodedTag}' tag.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const {tag} = await params;
  const decodedTag  = decodeURIComponent(tag);
  const allPosts = await getPostList(); // Fetches all posts (with ISR caching in lib/blog.ts)

  // Filter posts to only include those with the current tag
  const taggedPosts = allPosts.filter(post => post.tags && post.tags.includes(decodedTag));

  if (taggedPosts.length === 0) {
    // Optionally, show a message or redirect if no posts found for the tag
    // For now, we'll just show the header and an empty list
    // notFound(); // Uncomment if you want a 404 for tags with no posts
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl pt-8 pb-16">
      <h1 className="text-4xl font-extrabold mb-8 leading-tight text-gray-900 dark:text-gray-100">
        Posts Tagged: <span className="text-blue-600 dark:text-blue-400">#{decodedTag}</span>
      </h1>

      {taggedPosts.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No posts found for this tag yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {taggedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="block group border dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-5">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  By {post.author} on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{post.description}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tagItem, index) => (
                      <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-1 rounded">
                        {tagItem}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}