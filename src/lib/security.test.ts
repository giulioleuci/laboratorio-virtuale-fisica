import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sanitizeHtml } from './security.ts';

describe('sanitizeHtml', () => {
  it('should allow whitelisted tags', () => {
    const input = '<b>Bold</b> <i>Italic</i> <u>Underline</u> <sub>Sub</sub> <sup>Sup</sup> <strong>Strong</strong> <em>Em</em> <span>Span</span>';
    const output = sanitizeHtml(input);
    // Note: <u> is not whitelisted, so it should be escaped
    assert.strictEqual(output, '<b>Bold</b> <i>Italic</i> &lt;u&gt;Underline&lt;/u&gt; <sub>Sub</sub> <sup>Sup</sup> <strong>Strong</strong> <em>Em</em> <span>Span</span>');
  });

  it('should strip attributes from whitelisted tags', () => {
    const input = '<span style="color: red" onclick="alert(1)">Colored text</span>';
    const output = sanitizeHtml(input);
    assert.strictEqual(output, '<span>Colored text</span>');
  });

  it('should escape non-whitelisted tags', () => {
    const input = '<script>alert("XSS")</script><div>Div</div><img src="x" onerror="alert(1)">';
    const output = sanitizeHtml(input);
    assert.strictEqual(output, '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;&lt;div&gt;Div&lt;/div&gt;&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;');
  });

  it('should handle malformed tags', () => {
    const input = '<b Bold without closing';
    const output = sanitizeHtml(input);
    assert.strictEqual(output, '&lt;b Bold without closing');
  });

  it('should escape special characters outside tags', () => {
    const input = '5 > 3 & 2 < 4 "quote" \'single\'';
    const output = sanitizeHtml(input);
    assert.strictEqual(output, '5 &gt; 3 &amp; 2 &lt; 4 &quot;quote&quot; &#39;single&#39;');
  });

  it('should handle nested whitelisted tags', () => {
    const input = '<b><i>Bold and Italic</i></b>';
    const output = sanitizeHtml(input);
    assert.strictEqual(output, '<b><i>Bold and Italic</i></b>');
  });

  it('should handle case insensitivity for tags', () => {
    const input = '<B>Uppercase</B>';
    const output = sanitizeHtml(input);
    assert.strictEqual(output, '<b>Uppercase</b>');
  });

  it('should return empty string for empty input', () => {
    assert.strictEqual(sanitizeHtml(''), '');
    // @ts-ignore
    assert.strictEqual(sanitizeHtml(null), '');
  });
});
