module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['prettier', 'unicorn'],
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'airbnb-typescript/base'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "unicorn/filename-case": [
      "error",
      {
        "case": "kebabCase"
      }
    ],
    'arrow-body-style': 'off',
    'import/prefer-default-export': 'off',
    "class-methods-use-this": 'off',
    "import/no-extraneous-dependencies": 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "ignoreRestSiblings": true}],
    "curly": "error",
    'prettier/prettier': 'error',
    '@typescript-eslint/indent': 'off'
  },
};
