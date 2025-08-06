// lib/github.ts
import { Octokit } from "@octokit/rest";

export const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER!;
export const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME!;
export const GITHUB_BLOG_PATH = process.env.GITHUB_BLOG_PATH || 'posts';
export const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'; // Default to 'main'

// Token for pushing (needs 'repo' scope)
const GITHUB_PUSH_TOKEN = process.env.GITHUB_PUSH_TOKEN;

// Token for fetching (can be the same as PUSH_TOKEN, or a separate token with 'repo' scope,
// or even public if the repo is public and you just need read access)
// For fetching public repos, you might not even need a token if not concerned about rate limits.
const GITHUB_FETCH_TOKEN = process.env.GITHUB_FETCH_TOKEN || GITHUB_PUSH_TOKEN;

if (!GITHUB_FETCH_TOKEN && !GITHUB_REPO_NAME) { // Basic check for fetch token if not public repo
  console.warn("GITHUB_FETCH_TOKEN or GITHUB_PUSH_TOKEN not set, fetching public repos might hit rate limits faster.");
}

export const octokit = new Octokit({
  auth: GITHUB_FETCH_TOKEN, // Use the fetch token for this octokit instance
});

// --- Existing Push-related functions (no changes here, just for context) ---

/**
 * Gets the latest commit SHA and tree SHA of the specified branch.
 */
export async function getLatestCommitSha(): Promise<{ commitSha: string; treeSha: string }> {
  const { data } = await octokit.repos.getBranch({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    branch: GITHUB_BRANCH,
  });
  return {
    commitSha: data.commit.sha,
    treeSha: data.commit.commit.tree.sha,
  };
}

/**
 * Creates a new Git blob for the file content.
 */
export async function createBlob(content: string): Promise<string> {
  const { data } = await octokit.git.createBlob({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    content: content,
    encoding: 'utf-8',
  });
  return data.sha;
}

/**
 * Creates a new Git tree with the updated file.
 */
export async function createTree(
  baseTreeSha: string,
  path: string, // Full path including directory, e.g., 'posts/my-new-post.md'
  blobSha: string
): Promise<string> {
  const { data } = await octokit.git.createTree({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    base_tree: baseTreeSha,
    tree: [
      {
        path: path,
        mode: '100644', // File mode for a regular file
        type: 'blob',
        sha: blobSha,
      },
    ],
  });
  return data.sha;
}

/**
 * Creates a new Git commit.
 */
export async function createCommit(
  commitSha: string,
  treeSha: string,
  message: string
): Promise<string> {
  const { data } = await octokit.git.createCommit({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    message: message,
    tree: treeSha,
    parents: [commitSha],
  });
  return data.sha;
}

/**
 * Updates the branch reference to the new commit.
 */
export async function updateBranch(newCommitSha: string): Promise<void> {
  await octokit.git.updateRef({
    owner: GITHUB_REPO_OWNER,
    repo: GITHUB_REPO_NAME,
    ref: `heads/${GITHUB_BRANCH}`,
    sha: newCommitSha,
  });
}

/**
 * High-level function to create or update a file in the GitHub repository.
 */
export async function createOrUpdateBlogPost(
  filePath: string, // Relative path within the repo, e.g., 'posts/my-new-post.md'
  content: string,
  commitMessage: string
): Promise<void> {
  try {
    const { commitSha, treeSha } = await getLatestCommitSha();
    const blobSha = await createBlob(content);
    const newTreeSha = await createTree(treeSha, filePath, blobSha);
    const newCommitSha = await createCommit(commitSha, newTreeSha, commitMessage);
    await updateBranch(newCommitSha);
    console.log(`Successfully pushed ${filePath} to GitHub.`);
  } catch (error) {
    console.error(`Error pushing ${filePath} to GitHub:`, error);
    throw new Error(`Failed to push to GitHub: ${error instanceof Error ? error.message : String(error)}`);
  }
}

