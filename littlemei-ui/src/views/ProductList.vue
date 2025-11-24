<template>
  <div class="product-list">
    <div class="list-header">
      <div class="title-section">
        <h1>{{ categoryTitle }}</h1>
        <button class="view-more">{{ filteredProducts.length }} {{ t('product.items') }}</button>
      </div>

      <div class="filters">
        <button class="filter-btn" @click="toggleSort">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
          </svg>
          {{ sortLabel }}
        </button>
        <button 
          class="filter-btn"
          :class="{ active: filters.priceRange !== 'all' }"
          @click="togglePriceFilter"
        >
          {{ t('filter.priceRange') }}
        </button>
        <button 
          class="filter-btn"
          :class="{ active: filters.newOnly }"
          @click="filters.newOnly = !filters.newOnly"
        >
          {{ t('filter.newArrivals') }}
        </button>
        <button class="more-filters">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2"></circle>
            <circle cx="12" cy="12" r="2"></circle>
            <circle cx="12" cy="19" r="2"></circle>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="no-results">
      <p>{{ t('filter.noResults') }}</p>
      <button @click="clearFilters" class="clear-btn">{{ t('filter.clearFilters') }}</button>
    </div>

    <div v-else class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
        @click="handleProductClick(product)"
      >
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
          <span v-if="product.isNew" class="new-badge">{{ t('product.new') }}</span>
          <button 
            class="wishlist-btn" 
            :class="{ active: cartStore.isInWishlist(product.id) }"
            @click.stop="toggleWishlist(product)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" :fill="cartStore.isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button class="quick-add-btn" @click.stop="addToCart(product)">
            {{ t('product.quickAdd') }}
          </button>
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <div class="rating">
            <span class="stars">★★★★★</span>
            <span class="review-count">({{ product.reviews }})</span>
          </div>
          <p class="product-price">${{ product.price }}</p>
          <div class="colors">
            <span v-for="(color, index) in product.colors.slice(0, 3)" :key="index" class="color-dot" :title="color"></span>
            <span v-if="product.colors.length > 3" class="more-colors">+{{ product.colors.length - 3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast" :class="toastType">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()
const productsStore = useProductsStore()

const loading = ref(true)
const sortBy = ref('default')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const filters = ref({
  priceRange: 'all',
  newOnly: false
})

const categoryTitle = computed(() => {
  const category = route.params.category
  if (category === 'new') return t('nav.newIn')
  return t(`categories.${category}`)
})

const sortLabel = computed(() => {
  const labelKeys = {
    default: 'filter.sortOptions.default',
    'price-low': 'filter.sortOptions.priceLow',
    'price-high': 'filter.sortOptions.priceHigh',
    'rating': 'filter.sortOptions.rating',
    'popular': 'filter.sortOptions.popular'
  }
  return t(labelKeys[sortBy.value])
})

const filteredProducts = computed(() => {
  let products = route.params.category === 'new' 
    ? productsStore.newProducts 
    : productsStore.getProductsByCategory(route.params.category)

  // Apply filters
  if (filters.value.newOnly) {
    products = products.filter(p => p.isNew)
  }

  if (filters.value.priceRange !== 'all') {
    const [min, max] = filters.value.priceRange.split('-').map(Number)
    products = products.filter(p => p.price >= min && (max ? p.price <= max : true))
  }

  // Apply sorting
  if (sortBy.value === 'price-low') {
    products = [...products].sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    products = [...products].sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'rating') {
    products = [...products].sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'popular') {
    products = [...products].sort((a, b) => b.reviews - a.reviews)
  }

  return products
})

const toggleSort = () => {
  const sortOptions = ['default', 'price-low', 'price-high', 'rating', 'popular']
  const currentIndex = sortOptions.indexOf(sortBy.value)
  sortBy.value = sortOptions[(currentIndex + 1) % sortOptions.length]
}

const togglePriceFilter = () => {
  const priceOptions = ['all', '0-50', '50-100', '100-200']
  const currentIndex = priceOptions.indexOf(filters.value.priceRange)
  filters.value.priceRange = priceOptions[(currentIndex + 1) % priceOptions.length]
}

const clearFilters = () => {
  filters.value = {
    priceRange: 'all',
    newOnly: false
  }
  sortBy.value = 'default'
}

const toggleWishlist = (product) => {
  const added = cartStore.toggleWishlist(product)
  showToastMessage(added ? t('product.addedToWishlist') : t('product.removedFromWishlist'), 'success')
}

const addToCart = (product) => {
  cartStore.addToCart(product)
  showToastMessage(t('product.addedToCart'), 'success')
}

const handleProductClick = (product) => {
  router.push(`/product/${product.id}`)
}

const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.product-list {
  padding: 20px 0;
}

.list-header {
  margin-bottom: 40px;
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.title-section h1 {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.view-more {
  background: transparent;
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: #000;
  background: #f5f5f5;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

.more-filters {
  padding: 10px 15px;
  background: #000;
  color: #fff;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.more-filters:hover {
  transform: scale(1.05);
}

.loading {
  text-align: center;
  padding: 100px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff69b4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-results {
  text-align: center;
  padding: 100px 20px;
}

.no-results p {
  font-size: 20px;
  color: #666;
  margin-bottom: 20px;
}

.clear-btn {
  background: #000;
  color: #fff;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-8px);
}

.product-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.new-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #ff69b4;
  color: #fff;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.wishlist-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
}

.product-card:hover .wishlist-btn {
  opacity: 1;
}

.wishlist-btn:hover,
.wishlist-btn.active {
  background: #ff69b4;
  color: #fff;
  transform: scale(1.1);
}

.quick-add-btn {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: #000;
  color: #fff;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  opacity: 0;
  transition: all 0.3s;
  white-space: nowrap;
}

.product-card:hover .quick-add-btn {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.quick-add-btn:hover {
  background: #333;
  transform: translateX(-50%) translateY(0) scale(1.05);
}

.product-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.stars {
  color: #ffc107;
  font-size: 14px;
  letter-spacing: 1px;
}

.review-count {
  font-size: 12px;
  color: #999;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 8px;
}

.colors {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #e0e0e0;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-dot:hover {
  transform: scale(1.2);
}

.color-dot:nth-child(1) {
  background: #4a5f7f;
}

.color-dot:nth-child(2) {
  background: #f5e6d3;
}

.color-dot:nth-child(3) {
  background: linear-gradient(135deg, #ff6b9d 0%, #c06bff 50%, #6bddff 100%);
}

.more-colors {
  font-size: 12px;
  color: #999;
}

.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #000;
  color: #fff;
  padding: 16px 24px;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.toast.success {
  background: #4caf50;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .title-section h1 {
    font-size: 28px;
  }

  .filters {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 10px;
  }

  .filter-btn {
    white-space: nowrap;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .toast {
    bottom: 20px;
    right: 20px;
    left: 20px;
  }
}
</style>
