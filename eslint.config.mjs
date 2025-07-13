import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  { ignores: ['dist', 'node_modules', 'build', 'public', 'assets'] },
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
    },
    rules: {},
  },
];
