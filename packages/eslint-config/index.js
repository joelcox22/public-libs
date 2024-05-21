import * as fs from 'fs';
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import json from 'eslint-plugin-json';
import markdown from 'eslint-plugin-markdown';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import Debug from 'debug';

const debug = Debug('@joelbot/eslint-config');

const ignores = fs.existsSync('.gitignore')
  ? fs
      .readFileSync('.gitignore', 'utf-8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => !line.startsWith('#') && line.trim() !== '')
  : [];

debug('calculated eslint ignore list from .gitignore:', ignores);

const config = [
  {
    ignores: [...ignores, '**/dist/**'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{j,t}s'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react,
      'react-hooks': hooks,
    },
    rules: {
      ...react.configs.all.rules,
      'react-hooks/exhaustive-deps': 2,
      'react-hooks/rules-of-hooks': 2,
      'react/jsx-no-literals': 0,
      'react/jsx-no-bind': [1, { allowArrowFunctions: true }],
      'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
      'react/destructuring-assignment': 0,
      'react/no-unused-prop-types': 1,
      'react/jsx-sort-props': 0,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    processor: json.processors['.json'],
    rules: json.configs.recommended.rules,
  },
  {
    files: ['**/*.md'],
    processor: markdown.processors.markdown,
  },
  eslintPluginPrettierRecommended,
];

export default config;
