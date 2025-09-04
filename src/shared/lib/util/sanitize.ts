import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html ?? '';
  try {
    return DOMPurify.sanitize(html ?? '', {
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  } catch {
    return html ?? '';
  }
}

export default sanitizeHtml;
