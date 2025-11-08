<template>
  <div class="home">
    <HeroCarousel />

    <section class="stats">
      <div class="stat-item">
        <h3>{{ productsStore.products.length }}+</h3>
        <p>{{ t('home.stats.products') }}</p>
      </div>
      <div class="stat-item">
        <h3>100k+</h3>
        <p>{{ t('home.stats.customers') }}</p>
      </div>
      <div class="stat-item">
        <h3>{{ productsStore.categories.length }}</h3>
        <p>{{ t('home.stats.categories') }}</p>
      </div>
      <div class="stat-item">
        <h3>4.8★</h3>
        <p>{{ t('home.stats.rating') }}</p>
      </div>
    </section>

    <section class="featured-categories">
      <div class="section-header">
        <h2>{{ t('home.shopByCategory.title') }}</h2>
        <p>{{ t('home.shopByCategory.subtitle') }}</p>
      </div>
      <div class="categories-grid">
        <div 
          v-for="(category, index) in featuredCategories" 
          :key="category.id"
          class="category-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="$router.push(`/category/${category.id}`)"
        >
          <div class="category-image" :style="{ background: category.color }">
            <span class="category-emoji">{{ category.emoji }}</span>
          </div>
          <div class="category-info">
            <h3>{{ t(`categories.${category.id}`) }}</h3>
            <p>{{ category.count }} {{ t('product.items') }}</p>
          </div>
          <div class="category-arrow">→</div>
        </div>
      </div>
    </section>

    <section class="featured-products">
      <div class="section-header">
        <h2>{{ t('home.trending.title') }}</h2>
        <p>{{ t('home.trending.subtitle') }}</p>
      </div>
      <div class="products-grid">
        <div 
          v-for="product in trendingProducts" 
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
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <div class="rating">
              <span class="stars">★★★★★</span>
              <span class="review-count">({{ product.reviews }} {{ t('product.reviews') }})</span>
            </div>
            <p class="product-price">${{ product.price }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="newsletter">
      <div class="newsletter-content">
        <h2>{{ t('home.newsletter.title') }}</h2>
        <p>{{ t('home.newsletter.subtitle') }}</p>
        <form @submit.prevent="handleSubscribe" class="newsletter-form">
          <input 
            type="email" 
            v-model="email"
            :placeholder="t('home.newsletter.placeholder')" 
            required
          />
          <button type="submit">{{ t('home.newsletter.subscribe') }}</button>
        </form>
        <p class="privacy-note">{{ t('home.newsletter.privacy') }}</p>
      </div>
    </section>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">
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
import HeroCarousel from '../components/HeroCarousel.vue'

const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()
const productsStore = useProductsStore()

const email = ref('')
const showToast = ref(false)
const toastMessage = ref('')

const featuredCategories = ref([
  { id: 'coats', emoji: '🧥', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', count: 245 },
  { id: 'tops', emoji: '👚', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', count: 389 },
  { id: 'knitwear', emoji: '🧶', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', count: 156 },
  { id: 'dresses', emoji: '👗', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', count: 298 },
  { id: 'jeans', emoji: '👖', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', count: 178 },
  { id: 'shoes', emoji: '👠', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', count: 412 }
])

const trendingProducts = computed(() => {
  return productsStore.products.slice(0, 4)
})

const toggleWishlist = (product) => {
  const added = cartStore.toggleWishlist(product)
  showToastMessage(added ? t('product.addedToWishlist') : t('product.removedFromWishlist'))
}

const handleProductClick = (product) => {
  console.log('Product clicked:', product)
}

const handleSubscribe = () => {
  if (email.value) {
    showToastMessage(t('home.newsletter.success'))
    email.value = ''
  }
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}
</script>

<style scoped>
.home {
  padding: 20px 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
  padding: 40px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
  padding: 20px;
  border-radius: 16px;
  transition: all 0.3s;
}

.stat-item:hover {
  background: linear-gradient(135deg, #ffeef8 0%, #fff5f9 100%);
  transform: translateY(-5px);
}

.stat-item h3 {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-item p {
  color: #666;
  font-size: 16px;
}

.featured-categories,
.featured-products {
  margin-top: 80px;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -1px;
}

.section-header p {
  font-size: 18px;
  color: #666;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.category-card {
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s;
  background: #fff;
  border: 2px solid #f0f0f0;
  position: relative;
  animation: fadeIn 0.6s ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border-color: transparent;
}

.category-image {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s;
}

.category-card:hover .category-image {
  transform: scale(1.1);
}

.category-emoji {
  font-size: 90px;
  transition: transform 0.4s;
}

.category-card:hover .category-emoji {
  transform: rotate(10deg) scale(1.1);
}

.category-info {
  padding: 20px;
  background: #fff;
}

.category-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
}

.category-card p {
  color: #666;
  font-size: 14px;
}

.category-arrow {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  opacity: 0;
  transition: all 0.3s;
}

.category-card:hover .category-arrow {
  opacity: 1;
  transform: translateX(5px);
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
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 15px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
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
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  backdrop-filter: blur(10px);
}

.product-card:hover .wishlist-btn {
  opacity: 1;
}

.wishlist-btn:hover,
.wishlist-btn.active {
  background: #ff69b4;
  color: #fff;
  transform: scale(1.15);
}

.product-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
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
}

.newsletter {
  margin-top: 100px;
  padding: 80px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.newsletter::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.newsletter-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.newsletter h2 {
  font-size: 48px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 15px;
}

.newsletter p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.newsletter-form {
  display: flex;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto 15px;
}

.newsletter-form input {
  flex: 1;
  padding: 16px 24px;
  border-radius: 50px;
  border: none;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.95);
}

.newsletter-form input::placeholder {
  color: #999;
}

.newsletter-form button {
  padding: 16px 40px;
  background: #000;
  color: #fff;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s;
  white-space: nowrap;
}

.newsletter-form button:hover {
  background: #333;
  transform: scale(1.05);
}

.privacy-note {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 15px;
}

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

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 20px;
  }

  .stat-item h3 {
    font-size: 32px;
  }

  .section-header h2 {
    font-size: 32px;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .newsletter {
    padding: 40px 20px;
  }

  .newsletter h2 {
    font-size: 32px;
  }

  .newsletter-form {
    flex-direction: column;
  }
}
</style>
