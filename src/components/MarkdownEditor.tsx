// components/MarkdownEditor.tsx
"use client";

import React from 'react';
import dynamic from "next/dynamic";
import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "katex/dist/katex.css";
import katex from "katex";
import mermaid from "mermaid";
import { getCodeString } from 'rehype-rewrite';

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

// Code block handler for both KaTeX and Mermaid
type CodeProps = {
  inline?: boolean;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};

const Code = ({ inline, children = [], className, ...props }: CodeProps) => {
  // KaTeX inline/block
  if (typeof children === "string" && /^\$\$(.*)\$\$/.test(children)) {
    const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, "$1"), { throwOnError: false });
    return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: "transparent" }} />;
  }
  let code = '';
  if (props.node && props.node.children) {
    code = getCodeString(props.node.children);
  } else if (Array.isArray(children) && children.length > 0) {
    code = children[0] as string;
  } else if (typeof children === 'string') {
    code = children;
  }
  if (typeof code === "string" && typeof className === "string") {
    if (/^language-mermaid/.test(className.toLocaleLowerCase())) {
      // Mermaid block rendering
      const demoid = useRef(`dome${randomid()}`);
      const [container, setContainer] = useState<HTMLDivElement | null>(null);
      useEffect(() => {
        if (container) {
          mermaid.render(demoid.current, code).then(({ svg }) => {
            container.innerHTML = svg;
          }).catch((error) => {
            container.innerHTML = error;
          });
        }
      }, [container, code]);
      const refElement = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) setContainer(node);
      }, []);
      return (
        <Fragment>
          <code id={demoid.current} style={{ display: "none" }} />
          <code ref={refElement} data-name="mermaid" />
        </Fragment>
      );
    }
    if (/^language-katex/.test(className.toLocaleLowerCase())) {
      const html = katex.renderToString(code, { throwOnError: false });
      return <code style={{ fontSize: "150%" }} dangerouslySetInnerHTML={{ __html: html }} />;
    }
  }
  return <code className={String(className)}>{children}</code>;
};

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  height?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue = `**Hello world!!!**

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
`,
  onChange,
  height = "auto",
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (val?: string) => {
    setValue(val || "");
    if (onChange) onChange(val || "");
  };

  return (
    <div>
      <MDEditor
        value={value}
        onChange={handleChange}
        previewOptions={{ components: { code: Code } }}
        height={height}
      />
    </div>
  );
};

export default MarkdownEditor;