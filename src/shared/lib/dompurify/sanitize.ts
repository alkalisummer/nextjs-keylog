import createDOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  try {
    const DOMPurify = createDOMPurify as unknown as typeof import('dompurify');

    (DOMPurify as any).addHook?.('uponSanitizeAttribute', (node: any, data: any) => {
      if (data.attrName === 'href' && typeof data.attrValue === 'string' && data.attrValue.trim() === '') {
        data.keepAttr = false;
      }
    });

    return (DOMPurify as any).sanitize(html ?? '', {
      FORBID_TAGS: ['link', 'meta', 'style', 'script'],
      KEEP_CONTENT: true,
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  } catch {
    return html ?? '';
  }
}

export default sanitizeHtml;
