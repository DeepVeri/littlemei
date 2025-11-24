<template>
  <div class="app">
    <Header />
    <div class="main-container" :class="{ 'full-width': isFullWidthPage }">
      <Sidebar v-if="!isFullWidthPage" />
      <main class="main-content">
        <router-view />
      </main>
    </div>
    <Footer />
    <FloatingLangSwitcher />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguage } from './composables/useLanguage'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Footer from './components/Footer.vue'
import FloatingLangSwitcher from './components/FloatingLangSwitcher.vue'

const route = useRoute()

// 初始化语言设置
useLanguage()

// 判断是否是全屏页面（商品详情页、购物车、结算页等）
const isFullWidthPage = computed(() => {
  const fullWidthRoutes = ['/product', '/cart', '/checkout', '/wishlist']
  return fullWidthRoutes.some(path => route.path.startsWith(path))
})

onMounted(() => {
  // 设置页面标题
  document.title = 'LittleMei - 女装时尚购物平台'
  
  // 刷新页面时强制滚动到顶部
  window.scrollTo(0, 0)
  // 确保在所有内容加载后也滚动到顶部
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 0)
})
</script>

<style scoped>
.app {
  width: 100%;
  background: #fafafa;
  min-height: 100vh;
}

.main-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
}

.main-container.full-width {
  max-width: 1600px;
  padding: 20px 40px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

/* 平板端 */
@media (max-width: 1024px) {
  .main-container {
    padding: 15px;
    gap: 20px;
  }

  .main-container.full-width {
    padding: 15px 20px;
  }
}

/* 移动端 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    padding: 10px;
    gap: 0;
  }

  .main-container.full-width {
    padding: 10px 15px;
  }

  .main-content {
    padding: 0;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .app {
    padding-bottom: 80px; /* 为浮动按钮留出空间 */
  }

  .main-container {
    padding: 8px;
  }
}

/* 超小屏幕 */
@media (max-width: 360px) {
  .main-container {
    padding: 6px;
  }
}
</style>

