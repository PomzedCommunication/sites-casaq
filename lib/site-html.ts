import parse from 'html-react-parser';
import type { ReactNode } from 'react';

export function parseSiteHtml(value?: string | null): ReactNode {
  if (!value) {
    return null;
  }

  return parse(value);
}