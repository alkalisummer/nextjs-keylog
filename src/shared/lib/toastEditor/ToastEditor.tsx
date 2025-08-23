'use client';

import 'prismjs/themes/prism.css';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import { useEffect, useState, forwardRef } from 'react';
import 'tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css';
import type { Editor as EditorType, EditorProps } from '@toast-ui/react-editor';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';

const Editor = dynamic(() => import('@toast-ui/react-editor').then(m => m.Editor), { ssr: false });

export const ToastEditor = forwardRef<EditorType, EditorProps>((props, ref) => {
  const { plugins: externalPlugins, ...rest } = props;
  const [defaultPlugins, setDefaultPlugins] = useState<any[] | null>(null);

  useEffect(() => {
    if (externalPlugins) return; // 외부에서 플러그인을 주입하면 내부 로딩 스킵
    let isMounted = true;
    (async () => {
      const colorSyntax = await import('@toast-ui/editor-plugin-color-syntax');
      const fontSize = await import('tui-editor-plugin-font-size');
      const codeSyntaxHighlight = await import('@toast-ui/editor-plugin-code-syntax-highlight');
      if (isMounted) setDefaultPlugins([colorSyntax.default, fontSize.default, codeSyntaxHighlight.default]);
    })();
    return () => {
      isMounted = false;
    };
  }, [externalPlugins]);

  const resolvedPlugins = externalPlugins ?? defaultPlugins;

  if (!resolvedPlugins) return null;

  return <Editor ref={ref} plugins={resolvedPlugins} {...rest} />;
});

ToastEditor.displayName = 'ToastEditor';
