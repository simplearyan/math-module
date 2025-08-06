// app/blog/page.tsx
import { getPostList } from '@/lib/blog';
import { BlogList } from '@/components/pages/blog-list';

export default async function BlogPage() {
  const posts = await getPostList();

  // Sort posts by date in descending order (newest first)
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
      <BlogList posts={sortedPosts} />

  );
}