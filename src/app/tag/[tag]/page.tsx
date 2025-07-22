// app/tags/[tag]/page.tsx
import Link from 'next/link';
import { getPostList } from '@/lib/blog';

// For static generation of all tag pages
// This will pre-render pages for every tag found in your blog posts
export async function generateStaticParams() {
  const allPosts = await getPostList();
  const allTags = new Set<string>();

  allPosts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => allTags.add(tag.toLowerCase()));
    }
  });

  return Array.from(allTags).map(tag => ({
    tag,
  }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  // Fetch all posts and filter by the provided tag
  const allPosts = await getPostList();
  const filteredPosts = allPosts.filter(post =>
    post.tags && post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">
        Posts tagged with "{tag}"
      </h1>
      <div className="w-full max-w-2xl">
        {filteredPosts.length === 0 ? (
          <p>No posts found for this tag.</p>
        ) : (
          <ul>
            {filteredPosts.map(({ id, title, date, author }) => (
              <li key={id} className="mb-4 p-4 border rounded-lg shadow-sm">
                <Link href={`/blog/${id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                  {title}
                </Link>
                <p className="text-sm text-gray-500">
                  {date} by {author}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link href="/blog" className="mt-8 text-blue-600 hover:underline">
        ← Back to All Posts
      </Link>
    </main>
  );
}