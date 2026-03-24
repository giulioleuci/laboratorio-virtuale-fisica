// @ts-ignore
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';
import type React from 'react';

/**
 * Parses an HTML string into React elements using html-react-parser
 * and sanitizes it using DOMPurify.
 * Whitelisted tags: sub, sup, b, i, strong, em, span.
 * All attributes are stripped.
 */
export function parseHtml(html: string): string | React.ReactNode | React.ReactNode[] {
  if (!html) return '';

  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['sub', 'sup', 'b', 'i', 'strong', 'em', 'span'],
    ALLOWED_ATTR: [] // Strip all attributes
  });

  // parse string back to React elements safely, bypassing dangerouslySetInnerHTML
  return parse(cleanHtml);
}
