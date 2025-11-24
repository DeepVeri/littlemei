<template>
  <aside class="sidebar">
    <nav class="nav-menu">
      <router-link to="/" class="nav-item home-item" exact-active-class="active">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
        <span>{{ t('nav.home') }}</span>
      </router-link>

      <router-link to="/outfits" class="nav-item featured-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span>{{ t('nav.outfitDesign') }}</span>
        <span class="badge">{{ outfitCount }}</span>
      </router-link>

      <router-link to="/category/verified" class="nav-item verified-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>
        <span>{{ t('nav.verified') }}</span>
        <span class="verified-badge">✓</span>
      </router-link>

      <div class="section-divider">
        <span>{{ t('nav.categories') }}</span>
      </div>

      <div class="category-section">
        <router-link 
          v-for="category in categories" 
          :key="category.id"
          :to="`/category/${category.id}`"
          class="nav-item category-item"
        >
          <div class="category-icon-wrapper">
            <span class="category-emoji">{{ category.emoji }}</span>
          </div>
          <div class="category-text">
            <span class="category-name">{{ t(`categories.${category.id}`) }}</span>
            <span class="category-count">{{ category.count }} {{ t('product.items') }}</span>
          </div>
        </router-link>
      </div>

      <div class="promo-card">
        <div class="promo-icon">🎁</div>
        <h4>{{ t('sidebar.freeShipping') }}</h4>
        <p>{{ t('sidebar.freeShippingDesc') }}</p>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductsStore } from '../stores/products'

const { t } = useI18n()
const productsStore = useProductsStore()

const categories = ref([
  { id: 'coats', emoji: '🧥', count: 245 },
  { id: 'tops', emoji: '👚', count: 389 },
  { id: 'knitwear', emoji: '🧶', count: 156 },
  { id: 'dresses', emoji: '👗', count: 298 },
  { id: 'jeans', emoji: '👖', count: 178 },
  { id: 'shoes', emoji: '👠', count: 412 }
])

const outfitCount = ref(6) // 6套原创搭配设计
const verifiedCount = computed(() => productsStore.verifiedProducts.length)
</script>

<style scoped>
.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 100px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f8f8f8;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover {
  background: #e8e8e8;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.nav-item.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.nav-item.active {
  background: #000;
  color: #fff;
  transform: translateX(5px);
}

.home-item {
  background: #fff;
  border: 2px solid #e8e8e8;
}

.home-item:hover {
  border-color: #000;
  background: #fafafa;
}

.home-item.router-link-active {
  border-color: #000;
  background: #000;
  color: #fff;
}

.featured-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 700;
  position: relative;
}

.featured-item:hover {
  transform: translateX(5px) scale(1.02);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.featured-item .badge {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
}

.verified-item {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
  font-weight: 700;
  position: relative;
  border: 2px solid transparent;
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
  }
  50% {
    box-shadow: 0 6px 25px rgba(245, 87, 108, 0.6);
  }
}

.verified-item:hover {
  transform: translateX(5px) scale(1.02);
  box-shadow: 0 6px 25px rgba(245, 87, 108, 0.5) !important;
}

.verified-badge {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  color: #f5576c;
  padding: 2px 8px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 900;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.section-divider {
  margin: 15px 0 10px;
  padding: 0 10px;
}

.section-divider span {
  font-size: 11px;
  font-weight: 700;
  color: #999;
  letter-spacing: 1px;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  padding: 12px 15px;
}

.category-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 10px;
  flex-shrink: 0;
  transition: all 0.3s;
}

.category-emoji {
  font-size: 22px;
  transition: transform 0.3s;
}

.nav-item:hover .category-emoji {
  transform: scale(1.2) rotate(5deg);
}

.category-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
}

.category-count {
  font-size: 11px;
  opacity: 0.7;
  font-weight: 500;
}

.promo-card {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #ffeef8 0%, #fff5f9 100%);
  border-radius: 16px;
  text-align: center;
  border: 2px dashed #ffb6d9;
  transition: all 0.3s;
}

.promo-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 182, 217, 0.3);
}

.promo-icon {
  font-size: 36px;
  margin-bottom: 10px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.promo-card h4 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #333;
}

.promo-card p {
  font-size: 13px;
  color: #666;
}

/* 平板端 */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }

  .nav-menu {
    gap: 6px;
  }

  .nav-item {
    padding: 12px 16px;
    font-size: 13px;
  }

  .category-item {
    padding: 10px 14px;
  }
}

/* 移动端 - 横向滚动 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    margin-bottom: 15px;
  }

  .nav-menu {
    position: static;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 10px 0;
    gap: 10px;
    scrollbar-width: thin;
    scrollbar-color: #ddd transparent;
    -webkit-overflow-scrolling: touch;
  }

  .nav-menu::-webkit-scrollbar {
    height: 4px;
  }

  .nav-menu::-webkit-scrollbar-track {
    background: transparent;
  }

  .nav-menu::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }

  .nav-item {
    flex-direction: column;
    min-width: 85px;
    padding: 12px 10px;
    text-align: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .nav-item span {
    white-space: nowrap;
    font-size: 11px;
  }

  .home-item,
  .featured-item,
  .verified-item {
    min-width: 75px;
  }

  .featured-item .badge,
  .verified-badge {
    position: static;
    transform: none;
    margin-top: 4px;
  }

  .verified-badge {
    width: auto;
    height: auto;
    border-radius: 10px;
  }

  .category-item {
    min-width: 95px;
    padding: 10px 8px;
  }

  .category-icon-wrapper {
    width: 42px;
    height: 42px;
    margin: 0 auto;
  }

  .category-emoji {
    font-size: 20px;
  }

  .category-text {
    align-items: center;
    gap: 3px;
  }

  .category-name {
    font-size: 11px;
    font-weight: 700;
  }

  .category-count {
    font-size: 10px;
    opacity: 0.8;
  }

  .section-divider {
    display: none;
  }

  .promo-card {
    min-width: 140px;
    padding: 12px;
    flex-shrink: 0;
  }

  .promo-icon {
    font-size: 26px;
    margin-bottom: 8px;
  }

  .promo-card h4 {
    font-size: 13px;
    margin-bottom: 4px;
  }

  .promo-card p {
    font-size: 11px;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .sidebar {
    margin-bottom: 12px;
  }

  .nav-menu {
    padding: 8px 0;
    gap: 8px;
  }

  .nav-item {
    min-width: 75px;
    padding: 10px 8px;
    gap: 6px;
  }

  .nav-item span {
    font-size: 10px;
  }

  .home-item,
  .featured-item,
  .verified-item {
    min-width: 65px;
  }

  .category-item {
    min-width: 85px;
  }

  .category-icon-wrapper {
    width: 38px;
    height: 38px;
  }

  .category-emoji {
    font-size: 18px;
  }

  .category-name {
    font-size: 10px;
  }

  .promo-card {
    min-width: 120px;
    padding: 10px;
  }

  .promo-icon {
    font-size: 22px;
  }

  .promo-card h4 {
    font-size: 12px;
  }

  .promo-card p {
    font-size: 10px;
  }
}

/* 超小屏幕 */
@media (max-width: 360px) {
  .nav-item {
    min-width: 70px;
  }

  .category-item {
    min-width: 80px;
  }
}
</style>
