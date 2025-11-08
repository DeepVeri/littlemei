import { createI18n } from 'vue-i18n'
import zh from './locales/zh-CN'
import en from './locales/en-US'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN', // 默认语言为中文
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zh,
    'en-US': en
  }
})

export default i18n

