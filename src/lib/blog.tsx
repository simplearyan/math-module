// lib/blog.ts
import React, { Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime'; // <-- IMPORTANT: New import for jsx and jsxs
import matter from 'gray-matter'; // To parse front matter from markdown files

// Markdown processing libraries
import { unified } from 'unified';
import remarkParse from 'remark-parse'; // To parse markdown
import remarkRehype from 'remark-rehype'; // To convert markdown AST to HTML AST
import { remark } from 'remark';
import rehypeReact from 'rehype-react';
import rehypeHighlight from 'rehype-highlight'; // For code syntax highlighting
import rehypeKatex from 'rehype-katex';     // For LaTeX math rendering
import remarkMath from 'remark-math';       // To parse math syntax in markdown

// Custom React component for markdown (e.g., a callout box)
import Callout from '@/components/Callout';

// Octokit and GitHub constants from lib/github.ts
import { octokit, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, GITHUB_BLOG_PATH, GITHUB_BRANCH } from '@/lib/github';

// Type definition for the output of rehype-react
import type { Options as RehypeReactOptions } from 'rehype-react';

/**
 * Interface for a blog post.
 * - `id`: The slug of the post (filename without .md extension).
 * - `title`, `date`, `author`, `description`, `image`, `tags`: Extracted from front matter.
 * - `content`: The processed Markdown as a React component tree (for display).
 * - `rawContent`: The raw Markdown content string (for editor pre-filling).
 */
export interface Post {
  id: string; // Slug (filename without .md)
  title: string;
  date: string; // ISO date string (e.g., '2023-10-27')
  author: string;
  description?: string; // Optional, for blog list preview
  image?: string;       // Optional, for blog list thumbnail
  tags?: string[];
  content: React.ReactNode; // Rendered React component tree
  rawContent: string;   // Raw markdown content for the editor
}

// Helper function to dynamically create React elements in rehype-react
// Corrected customRehypeReactOptions
const customRehypeReactOptions: RehypeReactOptions = {
  // Always include createElement for general compatibility
  // createElement: React.createElement,
  // *** THESE ARE CRUCIAL FOR PRODUCTION BUILDS WITH NEW JSX TRANSFORM ***
  Fragment: Fragment, // Provide the React Fragment component
  jsx: jsx,           // Provide the jsx runtime function
  jsxs: jsxs,         // Provide the jsxs runtime function (for multiple children)

  components: {
    'div': ({ className, children, ...props }) => {
      if (className && className.startsWith('callout-')) {
        const type = className.split('-')[1] as 'info' | 'warning' | 'error';
        return <Callout type={type} {...props}>{children}</Callout>;
      }
      return React.createElement('div', props, children);
    },
    // Add more custom component mappings here if needed
  },
};


/**
 * Processes a raw markdown string into a React component tree.
 * @param markdownContent The raw markdown string.
 * @returns A Promise resolving to a React.ReactNode (the rendered content).
 */

async function processMarkdownToReact(markdownContent: string): Promise<React.ReactNode> {
  // Temporarily bypass full processing to test if any content displays
  // return <div>Test content from markdown processor. Markdown length: {markdownContent.length}</div>;

  // Revert to original code after testing this simple return
  try {
    // ... (your existing processing code with debug logs) ...
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeReact, customRehypeReactOptions)
      .process(markdownContent);

    return processedContent.result as React.ReactNode;
  } catch (error) {
    console.error("Critical Error: Failed to process markdown to React.", error);
    return <p className="text-red-500">Error rendering markdown content. Check server logs for details.</p>;
  }
}


// Get the GitHub token for fetching (can be the same as PUSH_TOKEN, or a separate read-only token)
// It's crucial for authenticated requests to avoid low rate limits.
const GITHUB_FETCH_TOKEN = process.env.GITHUB_FETCH_TOKEN || process.env.GITHUB_PUSH_TOKEN;

// Get the revalidation time from environment variables, default to 1 hour if not set
const REVALIDATE_SECONDS = parseInt(process.env.BLOG_REVALIDATE_SECONDS || '3600', 10);

if (!GITHUB_FETCH_TOKEN) {
  console.warn("GITHUB_FETCH_TOKEN or GITHUB_PUSH_TOKEN not set. Using unauthenticated GitHub API requests for fetching, which have very low rate limits.");
}

/**
 * Fetches data from GitHub API with caching and revalidation.
 * @param url The GitHub API URL to fetch.
 * @returns The JSON response from GitHub.
 */
async function fetchFromGitHubApi(url: string): Promise<any> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (GITHUB_FETCH_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_FETCH_TOKEN}`;
  }

  // Use Next.js's fetch caching with revalidate option
  const response = await fetch(url, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS }, // Revalidate data after N seconds
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`GitHub API error for URL: ${url}. Status: ${response.status}. Body: ${errorBody}`);
    // Check for rate limit errors specifically
    if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
      const resetTime = new Date(parseInt(response.headers.get('X-RateLimit-Reset') || '0', 10) * 1000);
      throw new Error(`GitHub API rate limit exceeded. Resets at ${resetTime.toLocaleTimeString()} UTC. Try again later.`);
    }
    throw new Error(`Failed to fetch from GitHub API: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches the metadata (front matter) for all blog posts from GitHub.
 * This fetches the full content for each file to extract front matter.
 *
 * @returns A Promise resolving to an array of Post objects (with content as empty for list view).
 */
export async function getPostList(): Promise<Omit<Post, 'content' | 'rawContent'>[]> {
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_BLOG_PATH}?ref=${GITHUB_BRANCH}`;

  try {
    const files = await fetchFromGitHubApi(apiUrl);

    if (!Array.isArray(files)) {
      console.warn("GitHub getContent did not return an array for blog posts directory.");
      return [];
    }

    const postPromises = files
      .filter((file: any) => file.type === 'file' && file.name.endsWith('.md'))
      .map(async (file: any) => {
        // For the list, we still need to fetch each file to get its front matter
        // This is the most API-intensive part. Caching here is crucial.
        const fileContentData = await fetchFromGitHubApi(file.url); // Use the file.url provided by GitHub

        if (!fileContentData || typeof fileContentData.content !== 'string') {
          console.warn(`Could not fetch content for ${file.path}.`);
          return null;
        }

        const base64Content = fileContentData.content;
        const decodedContent = Buffer.from(base64Content, 'base64').toString('utf-8');

        try {
          const { data } = matter(decodedContent);
          return {
            id: file.name.replace(/\.md$/, ''),
            title: data.title || 'No Title',
            date: data.date || '',
            author: data.author || 'Anonymous',
            description: data.description || '',
            image: data.image || '',
            tags: (data.tags || []) as string[],
          };
        } catch (matterError) {
          console.error(`Error parsing front matter for ${file.name}:`, matterError);
          console.error("Problematic raw content (first 500 chars):", decodedContent.substring(0, 500));
          return null;
        }
      });

    const posts = (await Promise.all(postPromises)).filter(Boolean) as Omit<Post, 'content' | 'rawContent'>[];

    console.log(`Fetched ${posts.length} posts from GitHub.`);
    return posts;
  } catch (error) {
    console.error("Error fetching post list from GitHub:", error);
    return [];
  }
}

/**
 * Fetches a single blog post by its ID (slug) from GitHub,
 * including its rendered content and raw markdown content.
 */
export async function getPostById(id: string): Promise<Post | null> {
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_BLOG_PATH}/${id}.md?ref=${GITHUB_BRANCH}`;

  try {
    const fileContentData = await fetchFromGitHubApi(apiUrl);

    if (!fileContentData || typeof fileContentData.content !== 'string') {
      console.warn(`Could not fetch content for ${id}.md.`);
      return null;
    }

    const base64Content = fileContentData.content;
    const rawMarkdownContent = Buffer.from(base64Content, 'base64').toString('utf-8');

    let frontMatterData: any = {};
    let markdownBody: string = '';

    try {
      const { data, content } = matter(rawMarkdownContent);
      frontMatterData = data;
      markdownBody = content;
    } catch (matterError) {
      console.error(`Error parsing front matter for ${id}:`, matterError);
      console.error("Problematic raw content (first 500 chars):", rawMarkdownContent.substring(0, 500));
      return null;
    }

    const renderedContent = await processMarkdownToReact(markdownBody);

    return {
      id,
      title: frontMatterData.title || 'No Title',
      date: frontMatterData.date || '',
      author: frontMatterData.author || 'Anonymous',
      description: frontMatterData.description || '',
      image: frontMatterData.image || '',
      tags: (frontMatterData.tags || []) as string[],
      content: renderedContent,
      rawContent: rawMarkdownContent,
    };
  } catch (error) {
    if ((error as any).message && (error as any).message.includes('Failed to fetch from GitHub API')) {
      console.error(`Specific fetch error for post ${id}:`, error);
      // You might want to return null or throw a more specific error
    } else if ((error as any).status === 404) { // Direct status check won't work with fetch wrapper, need to parse error
        console.warn(`Post ${id} not found in GitHub repository.`);
        return null;
    }
    console.error(`Generic error fetching post ${id} from GitHub:`, error);
    return null;
  }
}