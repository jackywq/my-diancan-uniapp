module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue'
  ],
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    plus: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly'
  },
  rules: {
    'vue/multi-word-component-names': 'off', // Uniapp pages typically use index.vue
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'vue/no-undef-components': ['error', {
      ignorePatterns: [
        'view', 'text', 'image', 'navigator', 'scroll-view', 'swiper', 'swiper-item',
        'button', 'input', 'form', 'label', 'picker', 'picker-view', 'picker-view-column',
        'radio', 'radio-group', 'checkbox', 'checkbox-group', 'switch', 'slider',
        'textarea', 'icon', 'progress', 'rich-text', 'movable-view', 'movable-area',
        'cover-view', 'cover-image', 'match-media', 'map', 'canvas', 'web-view', 'ad',
        'uni-*' // 忽略 uni-ui 相关组件
      ]
    }]
  }
}
