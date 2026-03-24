import React from 'react';
import { parseHtml } from '@/lib/html-parser';

export function SafeHtml({ html }: { html: string }) {
  if (!html) return null;
  return <>{parseHtml(html)}</>;
}
