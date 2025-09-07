import createDOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  try {
    const DOMPurify = createDOMPurify as unknown as typeof import('dompurify');
    return (DOMPurify as any).sanitize(html ?? '', {
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  } catch {
    return html ?? '';
  }
}

export default sanitizeHtml;
