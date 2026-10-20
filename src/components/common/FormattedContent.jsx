import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * FormattedContent
 * Renders online article text with rich paragraph spacing, headings,
 * and clearly visible clickable links that redirect safely to external or internal sources.
 */
export function FormattedContent({ content, className = '' }) {
  if (!content) return null;

  // Split into paragraphs by double newlines or single newlines
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-5 text-foreground/90 leading-relaxed ${className}`}>
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Subheadings: ### Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={bIdx} className="text-xl sm:text-2xl font-bold text-foreground mt-6 mb-2">
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }

        // Section Headings: ## Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={bIdx} className="text-2xl sm:text-3xl font-extrabold text-foreground mt-8 mb-3">
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(line => line.trim());
          return (
            <ul key={bIdx} className="list-disc list-inside space-y-1.5 pl-2 my-3">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="text-sm sm:text-base">
                  {renderTextWithLinks(item.replace(/^[-*]\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        // Standard paragraph with links
        return (
          <p key={bIdx} className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
            {renderTextWithLinks(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parses markdown [text](url) and raw URLs into clickable links.
 */
function renderTextWithLinks(text) {
  // Regex matches [Link Text](https://...) OR raw https?://[^\s]+
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)|(https?:\/\/[^\s\)]+)/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Plain text before match
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Markdown link: [match[1]](match[2])
      const linkText = match[1];
      const linkUrl = match[2];
      elements.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-2 hover:opacity-80 transition inline-flex items-center gap-0.5 mx-0.5"
        >
          {linkText}
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
    } else if (match[3]) {
      // Raw URL: match[3]
      const rawUrl = match[3];
      elements.push(
        <a
          key={match.index}
          href={rawUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-2 hover:opacity-80 transition inline-flex items-center gap-0.5 mx-0.5 break-all"
        >
          {rawUrl}
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Trailing text
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}

export default FormattedContent;
