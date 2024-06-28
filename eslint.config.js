import antfu from '@antfu/eslint-config'
import perfectionist from 'eslint-plugin-perfectionist'

export default antfu({
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
    'perfectionist/sort-objects': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
  },

  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  typescript: {
    tsconfigPath: 'tsconfig.json',
  },

  vue: true,

  yaml: true,
})
