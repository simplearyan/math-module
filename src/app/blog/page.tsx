// app/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import { getPostList } from '@/lib/blog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Import Shadcn Card components
import { BlogList } from '@/components/pages/blog-list';

export default async function BlogPage() {
  const posts = await getPostList();

  // Sort posts by date in descending order (newest first)
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    // <main className="container mx-auto px-4 py-8">
    //   <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-10 text-center">
    //     All Blog Posts
    //   </h1>

    //   {sortedPosts.length === 0 ? (
    //     <p className="text-center text-xl text-muted-foreground">
    //       No blog posts found. Start writing!
    //     </p>
    //   ) : (
    //     <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    //       {sortedPosts.map((post) => (
    //         <Link key={post.id} href={`/blog/${post.id}`} className="group block">
    //           <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary">
    //             {post.image && ( // Check if image exists in front matter
    //               <div className="relative w-full h-48 overflow-hidden">
    //                 <Image
    //                   src={post.image}
    //                   alt={post.title}
    //                   fill
    //                   style={{ objectFit: 'cover' }}
    //                   className="transition-transform duration-300 group-hover:scale-105"
    //                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    //                   priority={false} // Only make high priority for LCP images
    //                 />
    //               </div>
    //             )}
    //             {!post.image && ( // Placeholder if no image is provided
    //                 <div className="relative w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
    //                     No Image Available
    //                 </div>
    //             )}
    //             <CardHeader className="flex-grow">
    //               <CardTitle className="text-xl font-semibold leading-tight group-hover:text-primary">
    //                 {post.title}
    //               </CardTitle>
    //               {post.description && (
    //                 <CardDescription className="text-sm mt-2 line-clamp-3">
    //                   {post.description}
    //                 </CardDescription>
    //               )}
    //             </CardHeader>
    //             <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
    //               <span>{post.author}</span>
    //               <span>{new Date(post.date).toLocaleDateString()}</span>
    //             </CardFooter>
    //           </Card>
    //         </Link>
    //       ))}
    //     </section>
    //   )}
    // </main>
      <BlogList posts={sortedPosts} />

  );
}