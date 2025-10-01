module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  /**
   * 0 or 'off': Turn off the rule.
   * 1 or 'warn': Turn on the rule as a warning with yellow text color (does not cause the check to fail).
   * 2 or 'error': Turn on the rule as an error with red text color (exit code is 1, check fails).
   */
  rules: {
    // allow console output during development
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Set the maximum number of characters per comment line to 200, ignore URLs
    'max-len': ['error', {
      comments: 200,
      ignoreUrls: true,
      code: 200
    }],
    // Set the rule for dangling commas in objects, arrays, and imports/exports to never
    'comma-dangle': ['error', 'never'],
    // Set the rule for curly braces in objects and arrays to always have newlines if they span more than 8 lines
    'object-curly-newline': ['error', {
      minProperties: 8,
      consistent: true
    }],
    // Allow the use of i++ and i--
    'no-plusplus': 0,
    // Allow reassigning function parameters
    'no-param-reassign': ['error', { props: false }],
    // Since enum type definitions are always recognized as duplicate variables internally, turn off this rule
    'no-shadow': 0,
    // In Element UI, form validation rules may return late, so turn off this rule
    'consistent-return': 0,
    // Nested ternary operators are allowed
    'no-nested-ternary': 0,
    // Since Git environments have different linebreak styles (LF vs. CRLF), turn off this rule
    'linebreak-style': [0, process.env.NODE_ENV === 'production' ? 'unix' : 'windows'],
    // Below are all rules with @typescript-eslint prefix, turn them off
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
};
