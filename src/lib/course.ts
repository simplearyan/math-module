import { octokit, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, GITHUB_BRANCH } from './github';
import matter from 'gray-matter';
import React from 'react';

export interface CourseIndexData {
  frontmatter: Record<string, any>;
  rawContent: string;
  // Optionally add renderedContent: React.ReactNode if you parse MDX/Markdown to React later
}

export interface CourseFile {
  path: string;
  name: string;
  content: string | null;             // Raw content for lesson files (.md or .mdx)
  children?: CourseFile[];            // Present for directories
  indexData?: CourseIndexData | null; // Parsed _index.md(x) course metadata
}

/**
 * Checks if a file exists at a path in the repo.
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    const response = await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path,
      ref: GITHUB_BRANCH,
    });
    // If it does not throw, file exists
    return true;
  } catch (error: any) {
    // 404 means file does not exist; rethrow others
    if (error.status === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Fetches and parses the index file (_index.md or _index.mdx) if it exists.
 */
async function fetchIndexData(dirPath: string): Promise<CourseIndexData | null> {
  const indexCandidates = ['_index.md', '_index.mdx'];

  for (const fileName of indexCandidates) {
    const fullPath = `${dirPath}/${fileName}`;
    const exists = await fileExists(fullPath);
    if (!exists) continue;

    try {
      const fileRes = await octokit.repos.getContent({
        owner: GITHUB_REPO_OWNER,
        repo: GITHUB_REPO_NAME,
        path: fullPath,
        ref: GITHUB_BRANCH,
      });

      if (fileRes.data && 'content' in fileRes.data && typeof fileRes.data.content === 'string') {
        const rawContent = Buffer.from(fileRes.data.content, 'base64').toString('utf-8');
        const parsed = matter(rawContent);

        return {
          frontmatter: parsed.data,
          rawContent,
          // Optionally add renderedContent here if you want to pre-render the markdown later
        };
      }
    } catch (error) {
      // Silently ignore errors reading the index file, fallback to null
      console.warn(`Could not fetch/parse index file at ${fullPath}:`, error);
      return null;
    }
  }
  return null;
}

/**
 * Recursively fetches all folders, subfolders, and .md/.mdx files from the given GitHub repo path,
 * and additionally reads _index.md/mdx files in each folder for course-level metadata.
 *
 * @param path The repo path to fetch content from ('' for root or course root)
 */
export async function fetchCourseContent(path = ''): Promise<CourseFile[]> {
  try {
    const res = await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path: path || '',
      ref: GITHUB_BRANCH,
    });

    if (!Array.isArray(res.data)) {
      // If somehow a file is fetched instead of folder at this path, return empty array
      return [];
    }

    const contents: CourseFile[] = [];

    for (const item of res.data) {
      if (item.type === 'dir') {
        // Fetch index metadata for course/folder
        const indexData = await fetchIndexData(item.path);

        // Recursively fetch children lessons/folders
        const children = await fetchCourseContent(item.path);

        contents.push({
          path: item.path,
          name: item.name,
          content: null,
          children,
          indexData,
        });
      } else if (
        item.type === 'file' &&
        (item.name.endsWith('.md') || item.name.endsWith('.mdx')) &&
        !item.name.startsWith('_index') // Skip _index md files as they are handled in fetchIndexData()
      ) {
        try {
          const fileRes = await octokit.repos.getContent({
            owner: GITHUB_REPO_OWNER,
            repo: GITHUB_REPO_NAME,
            path: item.path,
            ref: GITHUB_BRANCH,
          });
          let fileContent: string | null = null;

          if (
            fileRes.data &&
            'content' in fileRes.data &&
            typeof fileRes.data.content === 'string'
          ) {
            fileContent = Buffer.from(fileRes.data.content, 'base64').toString('utf-8');
          }

          contents.push({
            path: item.path,
            name: item.name,
            content: fileContent,
          });
        } catch (err) {
          console.warn(`Could not fetch file content for ${item.path}`, err);
          // Skip file if fetch fails
        }
      }
    }

    return contents;
  } catch (error) {
    console.error('Error fetching course content from GitHub:', error);
    return [];
  }
}

// 1 hour ISR cache for Next.js app directory
export const revalidate = 3600;
