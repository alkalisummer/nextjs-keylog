import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>{process.env.NODE_ENV === 'production' ? <meta httpEquiv='Content-Security-Policy' content='upgrade-insecure-requests'></meta> : <></>}</Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
