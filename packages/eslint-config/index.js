import globals from 'globals';
import js from '@eslint/js';
import json from 'eslint-plugin-json';
import markdown from 'eslint-plugin-markdown';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const config = [
  js.configs.recommended,
  {
    files: ['**/*.json'],
    plugins: { json },
    processor: json.processors['.json'],
    rules: json.configs.recommended.rules,
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      semi: 'error',
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.md'],
    processor: markdown.processors.markdown,
  },
  eslintPluginPrettierRecommended,
];

export default config;
