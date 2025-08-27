import { parseImgfileArr } from '@/entities/post/lib';

export const getEditorToolbar = () => {
  return [
    ['bold', 'italic', 'strike', 'hr'],
    ['image', 'table'],
    ['ul', 'ol', 'task'],
    ['code', 'codeblock'],
  ];
};

export const sanitizeHashtag = (value: string) => value.trim().replace(/^#/, '');

export const extractThumbnail = (htmlContent: string): string => {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : '';
};

export const getObjectNameFromUrl = (url: string) => (url.split('/').pop() || '').split('?')[0];

export const extractImageNamesFromHtml = (html: string) => {
  try {
    return parseImgfileArr(typeof html === 'string' ? html : '');
  } catch {
    return [] as string[];
  }
};

export const diff = (left: string[], right: string[]) => left.filter(name => !right.includes(name));
