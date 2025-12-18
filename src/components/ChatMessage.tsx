import { Sun, User } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

const ChatMessage = ({ role, content, isLoading }: ChatMessageProps) => {
  const isUser = role === "user";
  const [typedContent, setTypedContent] = useState<string>(isUser ? content : "");

  // Convert Markdown tables (pipe format) into bold paragraph lines: "Label is Value"
  const formatTableMarkdownToParagraphs = (src: string) => {
    const lines = src.split(/\r?\n/);
    const out: string[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      // Detect start of a table block
      if (/^\s*\|/.test(line)) {
        const header = lines[i];
        const sep = lines[i + 1] ?? "";
        // Basic separator detection (--- between pipes)
        const isSeparator = /^\s*\|?\s*-+\s*(\|\s*-+\s*)+\|?\s*$/.test(sep);
        if (isSeparator) {
          // Skip header and separator
          i += 2;
          // Consume table rows
          while (i < lines.length && /^\s*\|/.test(lines[i])) {
            const row = lines[i]
              .split("|")
              .map((s) => s.trim())
              .filter((s) => s.length > 0);
            if (row.length >= 2) {
              const label = row[0].replace(/^:+|:+$/g, "");
              const value = row[1];
              out.push(`**${label} is ${value}**`);
            }
            i += 1;
          }
          // Add a blank line after the converted block for spacing
          out.push("");
          continue;
        }
      }
      // Non-table line: keep as-is
      out.push(line);
      i += 1;
    }
    return out.join("\n");
  };

  const displayContent = isUser ? content : formatTableMarkdownToParagraphs(content);

  // Typewriter effect for assistant messages
  useEffect(() => {
    if (isUser) {
      setTypedContent(displayContent);
      return;
    }

    let i = 0;
    setTypedContent("");
    const stepMs = 18; // typing speed (ms per character)
    const timer = setInterval(() => {
      i += 1;
      setTypedContent(displayContent.slice(0, i));
      if (i >= displayContent.length) {
        clearInterval(timer);
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [displayContent, isUser]);

  return (
    <div
      className={`flex gap-4 animate-fade-in-up ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-primary/20 text-primary"
            : "bg-gradient-to-br from-aurora-teal/30 to-aurora-purple/30 text-aurora-teal"
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[85%] ${
          isUser
            ? "px-5 py-3 rounded-2xl bg-primary/20 border border-primary/30 text-foreground"
            : "glass-panel rounded-2xl px-6 py-4"
        }`}
      >
        {isLoading ? (
          <div className="flex gap-1.5 py-1">
            <span className="w-2 h-2 bg-aurora-teal rounded-full animate-typing-1" />
            <span className="w-2 h-2 bg-aurora-purple rounded-full animate-typing-2" />
            <span className="w-2 h-2 bg-aurora-green rounded-full animate-typing-3" />
          </div>
        ) : isUser ? (
          <p className="text-sm leading-relaxed">{content}</p>
        ) : (
          <div className="weather-response">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-xl font-display font-bold text-gradient mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-display font-semibold text-foreground mb-2">{children}</h2>
                ),
                p: ({ children }) => (
                  <p className="text-foreground/90 leading-relaxed mb-3 last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="text-primary font-semibold">{children}</strong>
                ),
                // Render tables as paragraphs with bold labels and data
                table: ({ children }) => (
                  <div className="space-y-2 my-3">{children}</div>
                ),
                thead: () => null,
                tbody: ({ children }) => <>{children}</>,
                tr: ({ children }) => {
                  const cells = React.Children.toArray(children);
                  const label = cells[0] ?? null;
                  const value = cells[1] ?? null;
                  return (
                    <p className="leading-relaxed text-foreground/90">
                      <span className="font-bold text-foreground mr-2">{label}:</span>
                      <span className="font-semibold text-primary">{value}</span>
                    </p>
                  );
                },
                td: ({ children }) => <>{children}</>,
                hr: () => (
                  <hr className="my-4 border-foreground/10" />
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 my-3">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2 text-foreground/90">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{children}</span>
                  </li>
                ),
                em: ({ children }) => (
                  <em className="text-muted-foreground italic">{children}</em>
                ),
              }}
            >
              {typedContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
