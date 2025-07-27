// components/mdx-components.tsx
import React from 'react';
import Image from 'next/image'; // If you want to use Next.js Image for markdown images
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Assuming shadcn/ui cn helper
// Import any custom components you want to use in your MDX here
// For example, if you have a Callout component:
// import { Callout } from '@/components/callout'; // Create this component if needed

const components = {
  // Map standard HTML elements to custom components if desired
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-2 scroll-m-20 text-4xl font-bold tracking-tight" {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0" {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight" {...props} />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight" {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className="mt-2" {...props} />
  ),
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement> & { href?: string }) => (
    <Link href={props.href || "#"} className="font-medium text-blue-600 underline" {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // Use Next.js Image component for optimization if it's a local or allowed external image
    <Image
      className={cn("rounded-md border", className)} // cn from shadcn/ui utils
      alt={alt || ''}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...(props as any)} // Cast props to any to avoid type issues with Image component
    />
  ),
  // Add your custom components here for MDX:
  // Callout: Callout, // Example: If you created a components/callout.tsx
};

export default components;