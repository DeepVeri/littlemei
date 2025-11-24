import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale } = useI18n()

  // 从 localStorage 加载保存的语言
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && (savedLocale === 'zh-CN' || savedLocale === 'en-US')) {
    locale.value = savedLocale
  }

  // 监听语言变化并保存到 localStorage
  watch(locale, (newLocale) => {
    localStorage.setItem('locale', newLocale)
    // 更新 HTML lang 属性
    document.documentElement.lang = newLocale === 'zh-CN' ? 'zh' : 'en'
  }, { immediate: true })

  return {
    locale
  }
}


