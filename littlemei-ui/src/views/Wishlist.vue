<template>
  <div class="wishlist-page">
    <div class="wishlist-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>{{ t('wishlist.title') }}</h1>
        <p class="item-count">{{ t('wishlist.itemCount', { count: cartStore.wishlistCount }) }}</p>
      </div>

      <!-- 空心愿单状态 -->
      <div v-if="cartStore.wishlist.length === 0" class="empty-wishlist">
        <div class="empty-icon">❤️</div>
        <h2>{{ t('wishlist.empty') }}</h2>
        <p>{{ t('wishlist.emptyDesc') }}</p>
        <button class="browse-btn" @click="router.push('/')">
          {{ t('wishlist.startBrowsing') }}
        </button>
      </div>

      <!-- 心愿单内容 -->
      <div v-else class="wishlist-content">
        <!-- 操作栏 -->
        <div class="wishlist-actions">
          <div class="select-section">
            <label class="select-all">
              <input type="checkbox" v-model="allSelected" @change="toggleSelectAll">
              <span>{{ t('wishlist.selectAll') }}</span>
            </label>
            <span class="selected-count">{{ t('wishlist.selectedCount', { count: selectedItems.length }) }}</span>
          </div>
          
          <div class="action-buttons">
            <button 
              class="batch-add-btn" 
              @click="addSelectedToCart"
              :disabled="selectedItems.length === 0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {{ t('wishlist.addToCart') }}
            </button>
            <button 
              class="batch-remove-btn"
              @click="removeSelected"
              :disabled="selectedItems.length === 0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              {{ t('wishlist.remove') }}
            </button>
          </div>
        </div>

        <!-- 排序和筛选 -->
        <div class="filter-bar">
          <div class="sort-section">
            <label>{{ t('wishlist.sortBy') }}:</label>
            <select v-model="sortBy" @change="applySorting">
              <option value="recent">{{ t('wishlist.sort.recent') }}</option>
              <option value="priceAsc">{{ t('wishlist.sort.priceAsc') }}</option>
              <option value="priceDesc">{{ t('wishlist.sort.priceDesc') }}</option>
              <option value="name">{{ t('wishlist.sort.name') }}</option>
            </select>
          </div>

          <div class="view-toggle">
            <button 
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="Grid View"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
            </button>
            <button 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
              title="List View"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="wishlist-grid" :class="viewMode">
          <div 
            v-for="item in sortedWishlist" 
            :key="item.id"
            class="wishlist-item"
            :class="{ selected: isSelected(item.id) }"
          >
            <input 
              type="checkbox" 
              class="item-checkbox"
              :checked="isSelected(item.id)"
              @change="toggleSelect(item.id)"
            >

            <div class="item-image" @click="goToProduct(item.id)">
              <img :src="item.image" :alt="item.name">
              <div class="item-overlay">
                <button class="quick-view-btn" @click.stop="goToProduct(item.id)">
                  {{ t('wishlist.quickView') }}
                </button>
              </div>
            </div>

            <div class="item-info">
              <h3 class="item-name" @click="goToProduct(item.id)">{{ item.name }}</h3>
              <p class="item-desc">{{ item.description }}</p>
              
              <div class="item-rating">
                <div class="stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= item.rating }">★</span>
                </div>
                <span class="rating-text">{{ item.rating }} ({{ item.reviews }})</span>
              </div>

              <div class="item-footer">
                <div class="item-price">
                  <span class="current-price">${{ item.price }}</span>
                  <span v-if="item.originalPrice" class="original-price">${{ item.originalPrice }}</span>
                  <span v-if="item.originalPrice" class="discount-badge">
                    -{{ Math.round((1 - item.price / item.originalPrice) * 100) }}%
                  </span>
                </div>

                <div class="item-actions">
                  <button 
                    class="add-to-cart-btn" 
                    @click="addSingleToCart(item)"
                    :title="t('wishlist.addToCart')"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>{{ t('wishlist.addToCart') }}</span>
                  </button>
                  
                  <button 
                    class="remove-btn" 
                    @click="removeItem(item)"
                    :title="t('wishlist.remove')"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- 库存状态 -->
              <div v-if="item.stock !== undefined" class="stock-status">
                <span v-if="item.stock > 10" class="in-stock">{{ t('wishlist.inStock') }}</span>
                <span v-else-if="item.stock > 0" class="low-stock">{{ t('wishlist.lowStock') }}</span>
                <span v-else class="out-stock">{{ t('wishlist.outOfStock') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 推荐商品 -->
        <div class="recommendations-section">
          <h2>{{ t('wishlist.youMayLike') }}</h2>
          <div class="recommendations-grid">
            <div 
              v-for="product in recommendedProducts" 
              :key="product.id"
              class="recommend-card"
              @click="goToProduct(product.id)"
            >
              <img :src="product.image" :alt="product.name">
              <h4>{{ product.name }}</h4>
              <div class="recommend-price">
                <span>${{ product.price }}</span>
                <button @click.stop="addToWishlist(product)" class="heart-btn">
                  ❤️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast提示 -->
    <Transition name="toast">
      <div v-if="showToast" class="toast" :class="toastType">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()
const productsStore = useProductsStore()

// 选中的商品
const selectedItemIds = ref(new Set())
const allSelected = computed({
  get: () => cartStore.wishlist.length > 0 && selectedItemIds.value.size === cartStore.wishlist.length,
  set: (value) => {
    if (value) {
      cartStore.wishlist.forEach(item => selectedItemIds.value.add(item.id))
    } else {
      selectedItemIds.value.clear()
    }
  }
})

const selectedItems = computed(() => {
  return cartStore.wishlist.filter(item => selectedItemIds.value.has(item.id))
})

// 视图模式
const viewMode = ref('grid') // 'grid' or 'list'

// 排序
const sortBy = ref('recent')
const sortedWishlist = computed(() => {
  const items = [...cartStore.wishlist]
  
  switch (sortBy.value) {
    case 'priceAsc':
      return items.sort((a, b) => a.price - b.price)
    case 'priceDesc':
      return items.sort((a, b) => b.price - a.price)
    case 'name':
      return items.sort((a, b) => a.name.localeCompare(b.name))
    case 'recent':
    default:
      return items.reverse() // 最近添加的在前
  }
})

// Toast提示
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 推荐商品
const recommendedProducts = computed(() => {
  return productsStore.products.slice(0, 4)
})

function isSelected(itemId) {
  return selectedItemIds.value.has(itemId)
}

function toggleSelect(itemId) {
  if (selectedItemIds.value.has(itemId)) {
    selectedItemIds.value.delete(itemId)
  } else {
    selectedItemIds.value.add(itemId)
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    cartStore.wishlist.forEach(item => selectedItemIds.value.add(item.id))
  } else {
    selectedItemIds.value.clear()
  }
}

// 批量添加到购物车
function addSelectedToCart() {
  if (selectedItems.value.length === 0) {
    showToastMessage(t('wishlist.selectItemsFirst'), 'warning')
    return
  }

  selectedItems.value.forEach(item => {
    cartStore.addToCart(item)
  })

  showToastMessage(t('wishlist.addedToCart', { count: selectedItems.value.length }), 'success')
  selectedItemIds.value.clear()
}

// 单个添加到购物车
function addSingleToCart(item) {
  cartStore.addToCart(item)
  showToastMessage(t('wishlist.itemAddedToCart'), 'success')
}

// 批量移除
function removeSelected() {
  if (selectedItems.value.length === 0) {
    showToastMessage(t('wishlist.selectItemsFirst'), 'warning')
    return
  }

  if (confirm(t('wishlist.confirmRemove', { count: selectedItems.value.length }))) {
    selectedItems.value.forEach(item => {
      cartStore.toggleWishlist(item)
    })
    selectedItemIds.value.clear()
    showToastMessage(t('wishlist.removedFromWishlist'), 'success')
  }
}

// 单个移除
function removeItem(item) {
  if (confirm(t('wishlist.confirmRemoveSingle'))) {
    cartStore.toggleWishlist(item)
    selectedItemIds.value.delete(item.id)
    showToastMessage(t('wishlist.removedFromWishlist'), 'success')
  }
}

// 跳转到商品详情
function goToProduct(id) {
  router.push(`/product/${id}`)
}

// 添加到心愿单
function addToWishlist(product) {
  cartStore.toggleWishlist(product)
  showToastMessage(t('wishlist.addedToWishlist'), 'success')
}

// 排序
function applySorting() {
  // 排序已经通过computed自动完成
}

// Toast提示
function showToastMessage(message, type = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.wishlist-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 10px;
  font-weight: 700;
}

.item-count {
  color: #718096;
  font-size: 1.1rem;
}

/* 空心愿单 */
.empty-wishlist {
  background: white;
  border-radius: 20px;
  padding: 80px 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-wishlist h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 10px;
}

.empty-wishlist p {
  color: #718096;
  margin-bottom: 30px;
}

.browse-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 40px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

/* 心愿单内容 */
.wishlist-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* 操作栏 */
.wishlist-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #f7fafc;
  margin-bottom: 20px;
}

.select-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #2d3748;
}

.select-all input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.selected-count {
  color: #718096;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.batch-add-btn,
.batch-remove-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.batch-add-btn svg,
.batch-remove-btn svg {
  width: 18px;
  height: 18px;
}

.batch-add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.batch-add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.batch-remove-btn {
  background: white;
  color: #fc8181;
  border: 2px solid #fc8181;
}

.batch-remove-btn:hover:not(:disabled) {
  background: #fc8181;
  color: white;
}

.batch-add-btn:disabled,
.batch-remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px 0;
}

.sort-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-section label {
  font-weight: 600;
  color: #4a5568;
}

.sort-section select {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-section select:focus {
  border-color: #667eea;
  outline: none;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.view-toggle button {
  width: 40px;
  height: 40px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-toggle button svg {
  width: 20px;
  height: 20px;
  color: #718096;
}

.view-toggle button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.view-toggle button.active svg {
  color: white;
}

/* 商品网格 */
.wishlist-grid {
  display: grid;
  gap: 25px;
  margin-bottom: 50px;
}

.wishlist-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.wishlist-grid.list {
  grid-template-columns: 1fr;
}

.wishlist-item {
  background: white;
  border: 2px solid #f7fafc;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.wishlist-grid.list .wishlist-item {
  flex-direction: row;
  align-items: center;
}

.wishlist-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.wishlist-item.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.item-checkbox {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  z-index: 10;
}

.item-image {
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  cursor: pointer;
}

.wishlist-grid.list .item-image {
  width: 200px;
  height: 250px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.wishlist-item:hover .item-image img {
  transform: scale(1.1);
}

.item-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.wishlist-item:hover .item-overlay {
  opacity: 1;
}

.quick-view-btn {
  background: white;
  color: #2d3748;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.wishlist-item:hover .quick-view-btn {
  transform: translateY(0);
}

.quick-view-btn:hover {
  background: #667eea;
  color: white;
}

.item-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-name {
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
  line-height: 1.4;
}

.item-name:hover {
  color: #667eea;
}

.item-desc {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #e2e8f0;
  font-size: 1rem;
}

.star.filled {
  color: #fbbf24;
}

.rating-text {
  color: #718096;
  font-size: 0.85rem;
}

.item-footer {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #f7fafc;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.original-price {
  font-size: 1.1rem;
  color: #a0aec0;
  text-decoration: line-through;
}

.discount-badge {
  background: #fc8181;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.add-to-cart-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn svg {
  width: 18px;
  height: 18px;
}

.add-to-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.remove-btn {
  width: 44px;
  height: 44px;
  background: #fed7d7;
  color: #fc8181;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn svg {
  width: 20px;
  height: 20px;
}

.remove-btn:hover {
  background: #fc8181;
  color: white;
}

.stock-status {
  margin-top: 10px;
}

.stock-status span {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

.in-stock {
  background: #c6f6d5;
  color: #22543d;
}

.low-stock {
  background: #fed7aa;
  color: #7c2d12;
}

.out-stock {
  background: #fed7d7;
  color: #742a2a;
}

/* 推荐商品 */
.recommendations-section {
  margin-top: 50px;
  padding-top: 40px;
  border-top: 2px solid #f7fafc;
}

.recommendations-section h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 25px;
  font-weight: 700;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.recommend-card {
  background: #f7fafc;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recommend-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.recommend-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.recommend-card h4 {
  padding: 15px;
  color: #2d3748;
  font-size: 1rem;
}

.recommend-price {
  padding: 0 15px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommend-price span {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
}

.heart-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.heart-btn:hover {
  transform: scale(1.2);
}

/* Toast提示 */
.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  z-index: 1000;
  border-left: 4px solid #48bb78;
}

.toast.success {
  border-left-color: #48bb78;
  color: #22543d;
}

.toast.warning {
  border-left-color: #f6ad55;
  color: #7c2d12;
}

.toast.error {
  border-left-color: #fc8181;
  color: #742a2a;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .wishlist-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .wishlist-page {
    padding: 20px 10px;
  }

  .wishlist-content {
    padding: 20px 15px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .wishlist-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .action-buttons {
    width: 100%;
  }

  .batch-add-btn,
  .batch-remove-btn {
    flex: 1;
  }

  .filter-bar {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .wishlist-grid.grid {
    grid-template-columns: 1fr;
  }

  .wishlist-grid.list .wishlist-item {
    flex-direction: column;
  }

  .wishlist-grid.list .item-image {
    width: 100%;
    height: 300px;
  }

  .item-image {
    height: 300px;
  }

  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .add-to-cart-btn span {
    display: none;
  }

  .toast {
    right: 15px;
    bottom: 15px;
    left: 15px;
  }
}
</style>

