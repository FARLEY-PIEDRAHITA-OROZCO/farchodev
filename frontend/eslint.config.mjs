import reactHooks from 'eslint-plugin-react-hooks';

const config = {
  ignores: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/.next/**'],
  plugins: {
    'react-hooks': reactHooks,
  },
  rules: {
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
};

export default config;