module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
      'prettier',
      'jest'
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "prettier/prettier": "warn",
        '@typescript-eslint/no-unused-vars': [
            'warn', 
            { 
              argsIgnorePattern: '_',
              varsIgnorePattern: '_',
            },
          ],
    }
}
