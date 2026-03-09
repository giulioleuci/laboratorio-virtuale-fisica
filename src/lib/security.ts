/**
 * Sanitizes an HTML string by allowing only a whitelist of tags and stripping all attributes.
 * Whitelisted tags: sub, sup, b, i, strong, em, span.
 * All other characters are escaped.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  const whitelistedTags = ['sub', 'sup', 'b', 'i', 'strong', 'em', 'span'];
  let result = '';
  let i = 0;

  while (i < html.length) {
    if (html[i] === '<') {
      // Potential tag
      const closingBracketIndex = html.indexOf('>', i);
      if (closingBracketIndex !== -1) {
        const tagContent = html.substring(i + 1, closingBracketIndex).trim();
        const isClosingTag = tagContent.startsWith('/');
        const tagName = isClosingTag
          ? tagContent.substring(1).trim().split(/\s+/)[0].toLowerCase()
          : tagContent.split(/\s+/)[0].toLowerCase();

        if (whitelistedTags.includes(tagName)) {
          // It's a whitelisted tag, keep it but strip attributes
          result += isClosingTag ? `</${tagName}>` : `<${tagName}>`;
          i = closingBracketIndex + 1;
          continue;
        }
      }
      // Not a whitelisted tag or malformed, escape the '<'
      result += '&lt;';
      i++;
    } else if (html[i] === '>') {
      result += '&gt;';
      i++;
    } else if (html[i] === '&') {
      // Check if it's already an entity we might want to preserve?
      // For now, following the memory: "escaping other characters"
      // and code review noted double-escaping.
      // But we must stick to a safe approach.
      result += '&amp;';
      i++;
    } else if (html[i] === '"') {
      result += '&quot;';
      i++;
    } else if (html[i] === "'") {
      result += '&#39;';
      i++;
    } else {
      result += html[i];
      i++;
    }
  }

  return result;
}
