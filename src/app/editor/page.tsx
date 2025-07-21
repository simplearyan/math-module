"use client"; // This page uses a Client Component

import {
  useState
} from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import {
  useSession
} from 'next-auth/react'; // To check if user is logged in
import {
  signIn
} from 'next-auth/react'; // For sign-in redirection

export default function EditorPage() {
  const {
    data: session,
    status
  } = useSession(); // Get session data

  const [blogContent, setBlogContent] = useState<string>(`
---
title: My New Blog Post Title
date: ${new Date().toISOString().split('T')[0]}
author: ${session?.user?.name || 'Guest Editor'}
---

# Write Your Blog Post Here

Start typing your **Markdown** content.

## Features:
* **Bold**, *Italic*, 
* Lists
    * Item 1
    * Item 2

### Code Block
\`\`\`javascript
// JavaScript example
function helloWorld() {
  console.log("Hello, world!");
}
helloWorld();
\`\`\`



### Image
![Example Image](https://raw.githubusercontent.com/simplearyan/galactic-light-trials/main/assets/Screenshot.png)

**Hello world!!!**

\`\`\`js
// Example code block
function hello() {
  console.log("Hello, world!");
}
\`\`\`

KaTeX Block:

\`\`\`katex
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`

Inline math: $$c = \\pm\\sqrt{a^2 + b^2}$$

Mermaid Block:

\`\`\`mermaid
graph TD
    A[Hard] -->|Text| B(Round)
    B --> C{Decision}
    C -->|One| D[Result 1]
    C -->|Two| E[Result 2]
\`\`\`
`);

  // Show loading state or redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-4">You must be logged in to access the editor.</p>
        <button
          onClick={() => signIn()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Handle saving (conceptual - would involve API call)
  const handleSave = () => {
    console.log("Saving content:", blogContent);
    // TODO: Implement actual save logic:
    // 1. Extract front matter and content.
    // 2. Make an API call to your backend (e.g., /api/blog/save)
    //    This API would then interact with GitHub API to commit the changes.
    // 3. Handle success/error messages.
    alert("Save functionality not fully implemented. Check console for content.");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-16">
      <h1 className="text-4xl font-bold mb-8">Create/Edit Blog Post</h1>
      <div className="w-full max-w-6xl flex flex-col items-center">
        <MarkdownEditor
          initialValue={blogContent}
          onChange={setBlogContent}
          height="600px" // Adjust height as needed
        />
        <button
          onClick={handleSave}
          className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Save Post
        </button>
      </div>
    </main>
  );
}