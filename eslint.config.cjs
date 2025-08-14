const { FlatCompat } = require('@eslint/eslintrc');
const reactCompiler = require('eslint-plugin-react-compiler');

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  {
    ignores: ['node_modules', 'dist', '.next'],
  },
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      /* warn */
      'react-compiler/react-compiler': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'no-var': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',

      /* error */
      'prefer-const': 'error',

      /* off */
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'prefer-spread': 'off',
    },
  },
];
