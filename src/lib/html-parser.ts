import parse from 'html-react-parser';
import type React from 'react';

const ALLOWED_TAGS = new Set(['sub', 'sup', 'b', 'i', 'strong', 'em', 'span']);

// Lightweight sanitizer that works in Node.js without jsdom.
// Strips all attributes and removes tags not in ALLOWED_TAGS (keeping their text content).
function sanitizeHtml(html: string): string {
  // Strip attributes and drop disallowed opening/self-closing tags
  let result = html.replace(/<([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*)?(\/?)>/g, (_, tag, _attrs, selfClose) => {
    if (ALLOWED_TAGS.has(tag.toLowerCase())) return `<${tag}${selfClose}>`;
    return '';
  });
  // Drop disallowed closing tags
  result = result.replace(/<\/([a-zA-Z][a-zA-Z0-9]*)>/g, (_, tag) => {
    if (ALLOWED_TAGS.has(tag.toLowerCase())) return `</${tag}>`;
    return '';
  });
  return result;
}

export function parseHtml(html: string): string | React.ReactNode | React.ReactNode[] {
  if (!html) return '';
  return parse(sanitizeHtml(html));
}
