<template>
  <div class="product-detail" v-if="product">
    <div class="detail-container">
      <!-- 左侧：图片展示区 -->
      <div class="product-gallery">
        <div class="main-image">
          <img :src="currentImage" :alt="product.name" />
          <button 
            v-if="product.isNew" 
            class="new-badge"
          >
            {{ t('product.new') }}
          </button>
          <button 
            class="wishlist-btn" 
            :class="{ active: cartStore.isInWishlist(product.id) }"
            @click="toggleWishlist"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" :fill="cartStore.isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="thumbnail-list">
          <div 
            v-for="(img, index) in productImages" 
            :key="index"
            class="thumbnail"
            :class="{ active: currentImage === img }"
            @click="currentImage = img"
          >
            <img :src="img" :alt="`${product.name} ${index + 1}`" />
          </div>
        </div>
      </div>

      <!-- 右侧：商品信息区 -->
      <div class="product-info-section">
        <div class="product-header">
          <h1>{{ product.name }}</h1>
          <div class="rating-section">
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= product.rating }">★</span>
            </div>
            <span class="rating-text">{{ product.rating }}/5.0</span>
            <span class="reviews-count">({{ product.reviews }} {{ t('product.reviews') }})</span>
          </div>
        </div>

        <div class="price-section">
          <span class="current-price">${{ product.price }}</span>
          <span class="original-price" v-if="originalPrice">${{ originalPrice }}</span>
          <span class="discount-badge" v-if="originalPrice">-{{ discount }}%</span>
        </div>

        <div class="product-description">
          <p>{{ product.description }}</p>
        </div>

        <!-- 颜色选择 -->
        <div class="option-section">
          <div class="option-header">
            <span class="option-label">{{ t('productDetail.color') }}</span>
            <span class="option-value">{{ selectedColor }}</span>
          </div>
          <div class="color-options">
            <button
              v-for="color in product.colors"
              :key="color"
              class="color-option"
              :class="{ active: selectedColor === color }"
              @click="selectedColor = color"
              :title="color"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <!-- 尺码选择 -->
        <div class="option-section">
          <div class="option-header">
            <span class="option-label">{{ t('productDetail.size') }}</span>
            <span class="option-value">{{ selectedSize }}</span>
            <button class="size-guide-btn" @click="showSizeGuide = true">
              {{ t('productDetail.sizeGuide') }}
            </button>
          </div>
          <div class="size-options">
            <button
              v-for="size in product.sizes"
              :key="size"
              class="size-option"
              :class="{ active: selectedSize === size }"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="option-section">
          <div class="option-header">
            <span class="option-label">{{ t('productDetail.quantity') }}</span>
          </div>
          <div class="quantity-selector">
            <button class="qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <input type="number" v-model.number="quantity" min="1" max="99" class="qty-input" />
            <button class="qty-btn" @click="increaseQuantity" :disabled="quantity >= 99">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button class="add-to-cart-btn" @click="handleAddToCart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 2v6h6V2M19 9v6h-6V9M15 15v6H9v-6"></path>
            </svg>
            {{ t('productDetail.addToCart') }}
          </button>
          <button class="buy-now-btn" @click="handleBuyNow">
            {{ t('productDetail.buyNow') }}
          </button>
        </div>

        <!-- 商品特点 -->
        <div class="product-features">
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <span>{{ t('productDetail.features.quality') }}</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="M12 6v6l4 2"></path>
            </svg>
            <span>{{ t('productDetail.features.shipping') }}</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
            <span>{{ t('productDetail.features.returns') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品详情和评论 Tab -->
    <div class="detail-tabs">
      <div class="tab-headers">
        <button 
          class="tab-header" 
          :class="{ active: activeTab === 'details' }"
          @click="activeTab = 'details'"
        >
          {{ t('productDetail.tabs.details') }}
        </button>
        <button 
          class="tab-header" 
          :class="{ active: activeTab === 'reviews' }"
          @click="activeTab = 'reviews'"
        >
          {{ t('productDetail.tabs.reviews') }} ({{ product.reviews }})
        </button>
      </div>

      <div class="tab-content">
        <!-- 详细描述 -->
        <div v-if="activeTab === 'details'" class="details-content">
          <h3>{{ t('productDetail.productDetails') }}</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">{{ t('productDetail.material') }}:</span>
              <span class="value">Cotton Blend</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t('productDetail.care') }}:</span>
              <span class="value">Machine Wash Cold</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t('productDetail.origin') }}:</span>
              <span class="value">Imported</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t('productDetail.fit') }}:</span>
              <span class="value">Regular Fit</span>
            </div>
          </div>
          <div class="description-text">
            <p>{{ product.description }}</p>
            <p>This stylish piece combines comfort with modern design. Perfect for any occasion, it features high-quality materials and expert craftsmanship.</p>
          </div>
        </div>

        <!-- 用户评论 -->
        <div v-if="activeTab === 'reviews'" class="reviews-content">
          <div class="reviews-summary">
            <div class="rating-overview">
              <div class="rating-number">{{ product.rating }}</div>
              <div class="rating-stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= product.rating }">★</span>
              </div>
              <div class="rating-count">{{ product.reviews }} {{ t('product.reviews') }}</div>
            </div>
          </div>

          <div class="reviews-list">
            <div v-for="review in mockReviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="reviewer-avatar">{{ review.name[0] }}</div>
                  <div>
                    <div class="reviewer-name">{{ review.name }}</div>
                    <div class="review-date">{{ review.date }}</div>
                  </div>
                </div>
                <div class="review-rating">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
                </div>
              </div>
              <div class="review-content">{{ review.comment }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 相关推荐 -->
    <div class="related-products">
      <h2>{{ t('productDetail.relatedProducts') }}</h2>
      <div class="products-grid">
        <div 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct.id"
          class="product-card"
          @click="goToProduct(relatedProduct.id)"
        >
          <div class="product-image">
            <img :src="relatedProduct.image" :alt="relatedProduct.name" />
          </div>
          <div class="product-info">
            <h3>{{ relatedProduct.name }}</h3>
            <p class="product-price">${{ relatedProduct.price }}</p>
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

    <!-- 尺码指南弹窗 -->
    <Transition name="modal">
      <div v-if="showSizeGuide" class="modal-overlay" @click="showSizeGuide = false">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="showSizeGuide = false">×</button>
          <h3>{{ t('productDetail.sizeGuide') }}</h3>
          <table class="size-table">
            <thead>
              <tr>
                <th>{{ t('productDetail.size') }}</th>
                <th>{{ t('productDetail.bust') }}</th>
                <th>{{ t('productDetail.waist') }}</th>
                <th>{{ t('productDetail.hips') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>XS</td>
                <td>81-84 cm</td>
                <td>61-64 cm</td>
                <td>86-89 cm</td>
              </tr>
              <tr>
                <td>S</td>
                <td>86-89 cm</td>
                <td>66-69 cm</td>
                <td>91-94 cm</td>
              </tr>
              <tr>
                <td>M</td>
                <td>91-94 cm</td>
                <td>71-74 cm</td>
                <td>96-99 cm</td>
              </tr>
              <tr>
                <td>L</td>
                <td>96-99 cm</td>
                <td>76-79 cm</td>
                <td>101-104 cm</td>
              </tr>
              <tr>
                <td>XL</td>
                <td>101-104 cm</td>
                <td>81-84 cm</td>
                <td>106-109 cm</td>
              </tr>
            </tbody>
          </table>
        </div>
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

const product = ref(null)
const currentImage = ref('')
const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)
const activeTab = ref('details')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const showSizeGuide = ref(false)

const productImages = computed(() => {
  if (!product.value) return []
  // 模拟多张图片
  return [
    product.value.image,
    product.value.image,
    product.value.image,
    product.value.image
  ]
})

const originalPrice = computed(() => {
  if (!product.value) return null
  return product.value.price * 1.3
})

const discount = computed(() => {
  if (!originalPrice.value) return 0
  return Math.round(((originalPrice.value - product.value.price) / originalPrice.value) * 100)
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return productsStore.products
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4)
})

const mockReviews = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2024-01-15',
    comment: 'Absolutely love this! The quality is amazing and it fits perfectly. Highly recommend!'
  },
  {
    id: 2,
    name: 'Emily Chen',
    rating: 4,
    date: '2024-01-10',
    comment: 'Great product! The color is exactly as shown in the pictures. Very satisfied with my purchase.'
  },
  {
    id: 3,
    name: 'Jessica Smith',
    rating: 5,
    date: '2024-01-05',
    comment: 'Perfect fit and excellent quality. Will definitely buy more from this store!'
  }
])

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

const increaseQuantity = () => {
  if (quantity.value < 99) quantity.value++
}

const toggleWishlist = () => {
  const added = cartStore.toggleWishlist(product.value)
  showToastMessage(
    added ? t('product.addedToWishlist') : t('product.removedFromWishlist'),
    'success'
  )
}

const handleAddToCart = () => {
  if (!selectedSize.value) {
    showToastMessage(t('productDetail.selectSize'), 'error')
    return
  }
  
  const cartItem = {
    ...product.value,
    selectedColor: selectedColor.value,
    selectedSize: selectedSize.value,
    quantity: quantity.value
  }
  
  cartStore.addToCart(cartItem, quantity.value)
  showToastMessage(t('product.addedToCart'), 'success')
}

const handleBuyNow = () => {
  if (!selectedSize.value) {
    showToastMessage(t('productDetail.selectSize'), 'error')
    return
  }
  
  handleAddToCart()
  // TODO: 跳转到结算页面
  router.push('/checkout')
}

const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
  window.scrollTo(0, 0)
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
  const productId = parseInt(route.params.id)
  product.value = productsStore.getProductById(productId)
  
  if (product.value) {
    currentImage.value = product.value.image
    selectedColor.value = product.value.colors[0]
    selectedSize.value = ''
  } else {
    router.push('/')
  }
})
</script>

<style scoped>
.product-detail {
  padding: 20px 0;
}

.detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
}

/* 图片展示区 */
.product-gallery {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.main-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: #f5f5f5;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #ff69b4;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: default;
}

.wishlist-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: none;
  cursor: pointer;
}

.wishlist-btn:hover,
.wishlist-btn.active {
  background: #ff69b4;
  color: #fff;
  transform: scale(1.1);
}

.thumbnail-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.thumbnail {
  aspect-ratio: 3/4;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s;
  opacity: 0.6;
}

.thumbnail:hover {
  opacity: 1;
}

.thumbnail.active {
  border-color: #667eea;
  opacity: 1;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品信息区 */
.product-info-section {
  padding: 20px 0;
}

.product-header h1 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 15px;
  line-height: 1.2;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 18px;
}

.star.filled {
  color: #ffc107;
}

.rating-text {
  font-weight: 600;
  font-size: 16px;
}

.reviews-count {
  color: #666;
  font-size: 14px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #e0e0e0;
}

.current-price {
  font-size: 42px;
  font-weight: 800;
  color: #ff69b4;
}

.original-price {
  font-size: 24px;
  color: #999;
  text-decoration: line-through;
}

.discount-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}

.product-description {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
}

.product-description p {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
}

/* 选项区域 */
.option-section {
  margin-bottom: 30px;
}

.option-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.option-label {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.option-value {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.size-guide-btn {
  font-size: 13px;
  color: #667eea;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.size-guide-btn:hover {
  color: #5568d3;
}

.color-options,
.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-option,
.size-option {
  padding: 12px 24px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.color-option:hover,
.size-option:hover {
  border-color: #667eea;
  background: #f5f7ff;
}

.color-option.active,
.size-option.active {
  border-color: #667eea;
  background: #667eea;
  color: #fff;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  width: fit-content;
}

.qty-btn {
  width: 44px;
  height: 44px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.qty-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: #f5f7ff;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-input {
  width: 80px;
  height: 44px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  outline: none;
}

.qty-input:focus {
  border-color: #667eea;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 15px;
  margin: 40px 0;
}

.add-to-cart-btn,
.buy-now-btn {
  flex: 1;
  padding: 18px 32px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.add-to-cart-btn {
  background: #fff;
  color: #333;
  border: 2px solid #e0e0e0;
}

.add-to-cart-btn:hover {
  border-color: #667eea;
  background: #f5f7ff;
  transform: translateY(-2px);
}

.buy-now-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.buy-now-btn:hover {
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

/* 商品特点 */
.product-features {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 25px;
  background: #f8f8f8;
  border-radius: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
}

.feature-item svg {
  color: #667eea;
  flex-shrink: 0;
}

/* 详情Tab */
.detail-tabs {
  margin-bottom: 80px;
}

.tab-headers {
  display: flex;
  gap: 40px;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 40px;
}

.tab-header {
  padding: 15px 0;
  font-size: 18px;
  font-weight: 700;
  color: #999;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: -2px;
}

.tab-header:hover {
  color: #667eea;
}

.tab-header.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  padding: 20px 0;
}

.details-content h3 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 25px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.detail-item {
  display: flex;
  gap: 10px;
}

.detail-item .label {
  font-weight: 700;
  color: #333;
}

.detail-item .value {
  color: #666;
}

.description-text {
  line-height: 1.8;
  color: #666;
}

.description-text p {
  margin-bottom: 15px;
}

/* 评论区 */
.reviews-summary {
  margin-bottom: 40px;
  padding: 30px;
  background: #f8f8f8;
  border-radius: 16px;
}

.rating-overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.rating-number {
  font-size: 64px;
  font-weight: 800;
  color: #667eea;
}

.rating-stars {
  display: flex;
  gap: 4px;
}

.rating-stars .star {
  font-size: 24px;
}

.rating-count {
  font-size: 16px;
  color: #666;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.review-item {
  padding: 25px;
  background: #f8f8f8;
  border-radius: 16px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.reviewer-name {
  font-weight: 700;
  color: #333;
}

.review-date {
  font-size: 13px;
  color: #999;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.review-rating .star {
  font-size: 16px;
}

.review-content {
  line-height: 1.6;
  color: #666;
}

/* 相关推荐 */
.related-products {
  margin-bottom: 60px;
}

.related-products h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 30px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-8px);
}

.product-card .product-image {
  aspect-ratio: 3/4;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
}

.product-card .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card .product-info h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.product-card .product-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff69b4;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #4caf50;
  color: #fff;
  padding: 16px 24px;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.toast.error {
  background: #f44336;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 尺码指南弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f0f0f0;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-close:hover {
  background: #e0e0e0;
  transform: rotate(90deg);
}

.modal-content h3 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 25px;
}

.size-table {
  width: 100%;
  border-collapse: collapse;
}

.size-table th,
.size-table td {
  padding: 15px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.size-table th {
  background: #f8f8f8;
  font-weight: 700;
  color: #333;
}

.size-table td {
  color: #666;
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 响应式 */
@media (max-width: 1024px) {
  .detail-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .product-gallery {
    position: static;
  }

  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .product-header h1 {
    font-size: 28px;
  }

  .current-price {
    font-size: 32px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .tab-headers {
    gap: 20px;
  }

  .tab-header {
    font-size: 16px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .product-header h1 {
    font-size: 24px;
  }

  .thumbnail-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .current-price {
    font-size: 28px;
  }

  .color-options,
  .size-options {
    gap: 8px;
  }

  .color-option,
  .size-option {
    padding: 10px 18px;
  }
}
</style>

