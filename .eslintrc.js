module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-console': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'max-len': ['error', { code: 170 }],
    'import/no-unresolved': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.js', ',json'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
