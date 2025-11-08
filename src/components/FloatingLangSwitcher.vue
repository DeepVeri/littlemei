<template>
  <div class="floating-lang-switcher" v-click-outside="() => showMenu = false">
    <button 
      class="lang-btn" 
      @click="showMenu = !showMenu"
      :class="{ active: showMenu }"
      :title="t('header.language')"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      <span class="lang-text">{{ currentLangText }}</span>
      <svg class="arrow" :class="{ open: showMenu }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <Transition name="slide-fade">
      <div v-if="showMenu" class="lang-menu">
        <div class="menu-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span>{{ t('header.language') }}</span>
        </div>
        <div class="lang-options">
          <button 
            v-for="lang in languages" 
            :key="lang.code"
            @click="switchLanguage(lang.code)"
            :class="{ active: locale === lang.code }"
            class="lang-option"
          >
            <span class="lang-flag">{{ lang.flag }}</span>
            <div class="lang-info">
              <span class="lang-name">{{ lang.label }}</span>
              <span class="lang-code">{{ lang.short }}</span>
            </div>
            <svg v-if="locale === lang.code" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const showMenu = ref(false)

const languages = ref([
  { code: 'zh-CN', label: '简体中文', short: '中文', flag: '🇨🇳' },
  { code: 'en-US', label: 'English', short: 'EN', flag: '🇺🇸' }
])

const currentLangText = computed(() => {
  return languages.value.find(lang => lang.code === locale.value)?.short || '中文'
})

const switchLanguage = (langCode) => {
  locale.value = langCode
  localStorage.setItem('locale', langCode)
  showMenu.value = false
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.floating-lang-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  animation: fadeInRight 0.5s ease-out;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.lang-btn {
  background: #fff;
  padding: 12px 18px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  min-width: 120px;
  justify-content: center;
}

.lang-btn:hover {
  border-color: #ff69b4;
  box-shadow: 0 6px 30px rgba(255, 105, 180, 0.3);
  transform: translateY(-2px);
}

.lang-btn.active {
  border-color: #ff69b4;
  background: linear-gradient(135deg, #fff 0%, #ffeef8 100%);
  box-shadow: 0 6px 30px rgba(255, 105, 180, 0.3);
}

.lang-text {
  font-weight: 700;
  font-size: 15px;
  color: #333;
}

.arrow {
  transition: transform 0.3s;
  color: #666;
}

.arrow.open {
  transform: rotate(180deg);
}

.lang-menu {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
  min-width: 260px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.lang-menu::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 35px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  border-left: 1px solid #f0f0f0;
  transform: rotate(45deg);
}

.menu-header {
  padding: 16px 18px;
  background: linear-gradient(135deg, #ffeef8 0%, #fff5f9 100%);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 15px;
  color: #ff69b4;
  border-bottom: 1px solid #ffb6d9;
}

.lang-options {
  padding: 10px;
}

.lang-option {
  width: 100%;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  transition: all 0.3s;
  font-size: 14px;
  position: relative;
  border: 2px solid transparent;
  margin-bottom: 6px;
}

.lang-option:last-child {
  margin-bottom: 0;
}

.lang-option:hover {
  background: #f8f8f8;
  transform: translateX(4px);
}

.lang-option.active {
  background: linear-gradient(135deg, #ffeef8 0%, #fff5f9 100%);
  border-color: #ffb6d9;
  box-shadow: 0 2px 10px rgba(255, 182, 217, 0.3);
}

.lang-option.active .lang-name {
  color: #ff69b4;
  font-weight: 700;
}

.lang-flag {
  font-size: 28px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.lang-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.lang-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.lang-code {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* 平板端 */
@media (max-width: 1024px) {
  .floating-lang-switcher {
    top: 18px;
    right: 18px;
  }
}

/* 移动端 - 大屏手机 */
@media (max-width: 768px) {
  .floating-lang-switcher {
    top: auto;
    bottom: 20px;
    right: 15px;
    animation: fadeInUp 0.5s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .lang-btn {
    padding: 12px 16px;
    min-width: 110px;
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }

  .lang-text {
    font-size: 14px;
  }

  .lang-menu {
    min-width: 250px;
    bottom: calc(100% + 15px);
    top: auto;
    right: 0;
  }

  .lang-menu::before {
    top: auto;
    bottom: -8px;
    right: 30px;
    transform: rotate(225deg);
  }
}

/* 移动端 - 小屏手机 */
@media (max-width: 480px) {
  .floating-lang-switcher {
    bottom: 15px;
    right: 12px;
  }

  .lang-text {
    display: none;
  }

  .lang-btn {
    min-width: auto;
    padding: 11px;
    width: 44px;
    height: 44px;
  }

  .lang-btn svg:first-child {
    margin: 0;
  }

  .arrow {
    display: none;
  }

  .lang-menu {
    min-width: 220px;
    right: 0;
    max-width: calc(100vw - 24px);
  }

  .lang-menu::before {
    right: 15px;
  }

  .menu-header {
    padding: 14px 16px;
  }

  .lang-options {
    padding: 8px;
  }

  .lang-option {
    padding: 12px 14px;
  }

  .lang-flag {
    font-size: 24px;
  }

  .lang-name {
    font-size: 14px;
  }
}

/* 超小屏幕 */
@media (max-width: 360px) {
  .floating-lang-switcher {
    bottom: 12px;
    right: 10px;
  }

  .lang-btn {
    width: 40px;
    height: 40px;
    padding: 10px;
  }

  .lang-menu {
    min-width: 200px;
  }
}
</style>

