import antfu from '@antfu/eslint-config'
import perfectionist from 'eslint-plugin-perfectionist'

export default antfu({
  files: [
    '**/*.html',
    '**/*.js',
    '**/*.json',
    '**/*.md',
    '**/*.toml',
    '**/*.ts',
    '**/*.vue',
    '**/*.xml',
    '**/*.yaml',
  ],

  formatters: {
    css: 'prettier',
    html: 'prettier',
    markdown: 'prettier',
  },

  ignores: [
  ],

  jsonc: true,

  plugins: {
    perfectionist,
  },

  rules: {
    'jsonc/sort-keys': [
      'error',
    ],
    'perfectionist/sort-objects': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
    'vue/attributes-order': [
      'error',
      {
        alphabetical: true,
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        multiline: 1,
        singleline: 3,
      },
    ],
  },

  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  typescript: true,

  vue: true,

  yaml: true,
})
