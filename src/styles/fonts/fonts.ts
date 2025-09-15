import localFont from 'next/font/local';

export const spoqa = localFont({
  src: [
    { path: '../../../public/font/SpoqaHanSansNeo-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../../public/font/SpoqaHanSansNeo-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../../public/font/SpoqaHanSansNeo-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../../public/font/SpoqaHanSansNeo-Bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  fallback: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Noto Sans KR',
    'Apple SD Gothic Neo',
    'Malgun Gothic',
    'Arial',
    'sans-serif',
  ],
  adjustFontFallback: 'Arial',
  variable: '--font-spoqa',
});

export const figtree = localFont({
  src: [
    { path: '../../../public/font/Figtree-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../../public/font/Figtree-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../public/font/Figtree-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../../public/font/Figtree-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../../public/font/Figtree-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  fallback: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Noto Sans KR',
    'Apple SD Gothic Neo',
    'Malgun Gothic',
    'Arial',
    'sans-serif',
  ],
  adjustFontFallback: 'Arial',
  variable: '--font-figtree',
});

export const firaMono = localFont({
  src: [
    { path: '../../../public/font/FiraMono-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../public/font/FiraMono-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../../public/font/FiraMono-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
  adjustFontFallback: false,
  variable: '--font-fira-mono',
});
