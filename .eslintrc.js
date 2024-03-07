module.exports = {
  extends: [
    'eslint:recommended',
  ],
  env: {
    node: true,
    commonjs: true,
  },
  plugins: ['node'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: [
      'error',
      'never',
    ],
    quotes: [
      'error',
      'single',
    ],
    indent: ['error', 2],
    'comma-dangle': ['error', 'always-multiline'],
  },
}
