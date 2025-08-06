import { octokit, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, GITHUB_BRANCH } from './github';

/**
 * Describes a course file or directory tree (recursive structure).
 */
export interface CourseFile {
  path: string;
  name: string;
  content: string | null;       // Raw content for lesson files, null for directories
  children?: CourseFile[];      // Only present for directories
}

/**
 * Recursively fetches all folders, subfolders, and Markdown/MDX files from the given GitHub repo path.
 * @param path The path within the repo ('' for root or subfolder path).
 */
export async function fetchCourseContent(path = ''): Promise<CourseFile[]> {
  try {
    // Fetch directory listing (or a single file)
    const res = await octokit.repos.getContent({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      path: path || '',
      ref: GITHUB_BRANCH,
    });

    // If single file, return empty (not expected at root or folder)
    if (!Array.isArray(res.data)) {
      return [];
    }

    const contents: CourseFile[] = [];

    for (const item of res.data) {
      if (item.type === 'dir') {
        // Recursively process subdirectories
        const children = await fetchCourseContent(item.path);
        contents.push({
          path: item.path,
          name: item.name,
          content: null,
          children,
        });
      } else if (
        item.type === 'file' &&
        (item.name.endsWith('.md') || item.name.endsWith('.mdx'))
      ) {
        // Fetch lesson file content
        const fileRes = await octokit.repos.getContent({
          owner: GITHUB_REPO_OWNER,
          repo: GITHUB_REPO_NAME,
          path: item.path,
          ref: GITHUB_BRANCH,
        });
        let fileContent = null;

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
      }
    }

    return contents;
  } catch (error) {
    console.error('Error fetching course content from GitHub:', error);
    return [];
  }
}

// 1 hour ISR cache
export const revalidate = 3600;
