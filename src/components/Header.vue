<template>
  <header class="header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <div class="logo-content">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4C13 4 10 6 10 9C10 12 13 14 16 14C19 14 22 12 22 9C22 6 19 4 16 4Z" fill="url(#gradient1)"/>
              <path d="M16 14C11 14 6 16 6 20V24C6 26 8 28 10 28H22C24 28 26 26 26 24V20C26 16 21 14 16 14Z" fill="url(#gradient2)"/>
              <defs>
                <linearGradient id="gradient1" x1="10" y1="4" x2="22" y2="14" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#ff69b4"/>
                  <stop offset="100%" stop-color="#ff85c1"/>
                </linearGradient>
                <linearGradient id="gradient2" x1="6" y1="14" x2="26" y2="28" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#667eea"/>
                  <stop offset="100%" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>little<span class="me">mei</span></h1>
        </div>
      </router-link>
      
      <div class="search-bar">
        <input 
          type="text" 
          :placeholder="t('header.search')"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>

      <div class="header-actions">
        <button 
          class="icon-btn" 
          :title="t('header.wishlist')"
          @click="showWishlist = !showWishlist"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span v-if="cartStore.wishlistCount > 0" class="badge">{{ cartStore.wishlistCount }}</span>
        </button>
        
        <button 
          class="icon-btn cart-btn" 
          :title="t('header.cart')"
          @click="showCart = !showCart"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span v-if="cartStore.cartCount > 0" class="cart-count">{{ cartStore.cartCount }}</span>
        </button>
      </div>
    </div>

    <!-- Mini Cart Dropdown -->
    <Transition name="slide-fade">
      <div v-if="showCart" class="dropdown cart-dropdown" v-click-outside="() => showCart = false">
        <div class="dropdown-header">
          <h3>{{ t('cart.title') }} ({{ cartStore.cartCount }})</h3>
          <button @click="showCart = false" class="close-btn">×</button>
        </div>
        <div v-if="cartStore.items.length === 0" class="empty-state">
          <p>{{ t('cart.empty') }}</p>
          <button @click="showCart = false; $router.push('/category/new')" class="shop-btn">
            {{ t('cart.startShopping') }}
          </button>
        </div>
        <div v-else class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <img :src="item.image" :alt="item.name" />
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p class="item-price">${{ item.price }}</p>
              <div class="quantity-control">
                <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)">−</button>
                <span>{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)">+</button>
              </div>
            </div>
            <button @click="cartStore.removeFromCart(item.id)" class="remove-btn">×</button>
          </div>
        </div>
        <div v-if="cartStore.items.length > 0" class="cart-footer">
          <div class="total">
            <span>{{ t('cart.total') }}:</span>
            <strong>${{ cartStore.cartTotal.toFixed(2) }}</strong>
          </div>
          <button class="checkout-btn" @click="handleCheckout">
            {{ t('cart.checkout') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Wishlist Dropdown -->
    <Transition name="slide-fade">
      <div v-if="showWishlist" class="dropdown wishlist-dropdown" v-click-outside="() => showWishlist = false">
        <div class="dropdown-header">
          <h3>{{ t('wishlist.title') }} ({{ cartStore.wishlistCount }})</h3>
          <button @click="showWishlist = false" class="close-btn">×</button>
        </div>
        <div v-if="cartStore.wishlist.length === 0" class="empty-state">
          <p>{{ t('wishlist.empty') }}</p>
        </div>
        <div v-else class="wishlist-items">
          <div v-for="item in cartStore.wishlist" :key="item.id" class="wishlist-item">
            <img :src="item.image" :alt="item.name" />
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p class="item-price">${{ item.price }}</p>
              <button class="add-to-cart-btn" @click="handleAddToCart(item)">
                {{ t('wishlist.addToCart') }}
              </button>
            </div>
            <button @click="cartStore.toggleWishlist(item)" class="remove-btn">×</button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const { t, locale } = useI18n()
const cartStore = useCartStore()

const searchQuery = ref('')
const showCart = ref(false)
const showWishlist = ref(false)

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

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
  }
}

const handleCheckout = () => {
  showCart.value = false
  alert(t('cart.checkout'))
}

const handleAddToCart = (item) => {
  cartStore.addToCart(item)
}
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
}

.logo:hover .logo-content {
  transform: translateY(-2px);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.logo h1 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -1.5px;
  cursor: pointer;
  position: relative;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-style: italic;
  color: #2d2d2d;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.logo:hover h1 {
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1);
}

.logo h1::first-letter {
  font-size: 120%;
  font-weight: 800;
  color: #667eea;
}

.logo h1 .me {
  background: linear-gradient(135deg, #ff69b4 0%, #ff85c1 50%, #ffa0d5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  font-style: normal;
  position: relative;
  font-family: 'Georgia', 'Times New Roman', serif;
  display: inline-block;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2);
  }
}

.logo h1 .me::before {
  content: '';
  position: absolute;
  top: -8px;
  right: -8px;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #ff69b4, transparent);
  border-radius: 50%;
  animation: sparkle 2s ease-in-out infinite;
  opacity: 0;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

.logo h1 .me::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: -2px;
  right: -2px;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    #ff69b4 20%, 
    #ff85c1 50%, 
    #ffa0d5 80%, 
    transparent 100%
  );
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.4s ease;
  box-shadow: 0 0 8px rgba(255, 105, 180, 0.6);
}

.logo:hover h1 .me::after {
  opacity: 1;
  animation: glow 1.5s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(255, 105, 180, 0.6);
  }
  50% {
    box-shadow: 0 0 16px rgba(255, 105, 180, 0.9);
  }
}

/* 添加装饰性元素 */
.logo h1::after {
  content: '✨';
  position: absolute;
  right: -25px;
  top: -5px;
  font-size: 14px;
  font-style: normal;
  opacity: 0;
  transition: all 0.3s;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(180deg);
  }
}

.logo:hover h1::after {
  opacity: 1;
}

.search-bar {
  flex: 1;
  max-width: 600px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 12px 45px 12px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-size: 14px;
  background: #f5f5f5;
  transition: all 0.3s;
}

.search-bar input:focus {
  background: #fff;
  border-color: #ff69b4;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
}

.search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.search-btn:hover {
  transform: translateY(-50%) scale(1.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-btn {
  background: transparent;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
  position: relative;
}

.icon-btn:hover {
  background: #f5f5f5;
  transform: scale(1.1);
}

.icon-btn:active {
  transform: scale(0.95);
}

.cart-count, .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #000;
  color: #fff;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  padding: 0 5px;
  animation: pop 0.3s ease;
}

@keyframes pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 30px;
  width: 400px;
  max-height: 600px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dropdown-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header h3 {
  font-size: 18px;
  font-weight: 700;
}

.close-btn {
  background: transparent;
  font-size: 28px;
  line-height: 1;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #000;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.shop-btn {
  background: #000;
  color: #fff;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  transition: transform 0.3s;
}

.shop-btn:hover {
  transform: scale(1.05);
}

.cart-items, .wishlist-items {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.cart-item, .wishlist-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-radius: 12px;
  background: #f8f8f8;
  margin-bottom: 15px;
  transition: background 0.3s;
}

.cart-item:hover, .wishlist-item:hover {
  background: #f0f0f0;
}

.cart-item img, .wishlist-item img {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-control button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.quantity-control button:hover {
  background: #000;
  color: #fff;
  border-color: #000;
}

.quantity-control span {
  min-width: 20px;
  text-align: center;
  font-weight: 600;
}

.remove-btn {
  background: transparent;
  font-size: 24px;
  line-height: 1;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #ffebee;
  color: #f44336;
}

.add-to-cart-btn {
  background: #000;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  transition: transform 0.2s;
}

.add-to-cart-btn:hover {
  transform: scale(1.05);
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background: #f8f8f8;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 18px;
}

.total strong {
  font-size: 24px;
}

.checkout-btn {
  width: 100%;
  background: #000;
  color: #fff;
  padding: 14px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 16px;
  transition: transform 0.3s;
}

.checkout-btn:hover {
  transform: scale(1.02);
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 平板端 */
@media (max-width: 1024px) {
  .header-content {
    padding: 18px 20px;
    gap: 15px;
  }

  .search-bar {
    max-width: 400px;
  }
}

/* 移动端 - 大屏手机 */
@media (max-width: 768px) {
  .header {
    position: relative;
  }

  .header-content {
    padding: 12px 15px;
    gap: 10px;
    flex-wrap: wrap;
  }

  .logo h1 {
    font-size: 24px;
  }

  .logo h1::after {
    font-size: 12px;
    right: -20px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .logo-icon svg {
    width: 28px;
    height: 28px;
  }

  .logo-content {
    gap: 8px;
  }

  /* 搜索框占满整行 */
  .search-bar {
    order: 3;
    width: 100%;
    max-width: none;
    margin-top: 8px;
  }

  .search-bar input {
    padding: 10px 40px 10px 18px;
    font-size: 14px;
  }

  .header-actions {
    gap: 10px;
  }

  .dropdown {
    width: calc(100vw - 30px);
    right: 15px;
    max-width: 380px;
  }

  .icon-btn {
    padding: 6px;
  }

  .icon-btn svg {
    width: 22px;
    height: 22px;
  }
}

/* 移动端 - 小屏手机 */
@media (max-width: 480px) {
  .header-content {
    padding: 10px 12px;
    gap: 8px;
  }

  .logo h1 {
    font-size: 20px;
  }

  .logo h1::after {
    font-size: 10px;
    right: -18px;
  }

  .logo-icon {
    width: 24px;
    height: 24px;
  }

  .logo-icon svg {
    width: 24px;
    height: 24px;
  }

  .logo-content {
    gap: 6px;
  }

  .search-bar {
    margin-top: 6px;
  }

  .search-bar input {
    padding: 9px 38px 9px 16px;
    font-size: 13px;
  }

  .header-actions {
    gap: 8px;
  }

  .icon-btn {
    padding: 5px;
  }

  .icon-btn svg {
    width: 20px;
    height: 20px;
  }

  .cart-count, .badge {
    min-width: 18px;
    height: 18px;
    font-size: 10px;
    padding: 0 4px;
  }

  .dropdown {
    width: calc(100vw - 24px);
    right: 12px;
  }

  .dropdown-header {
    padding: 16px;
  }

  .dropdown-header h3 {
    font-size: 16px;
  }

  .cart-items, .wishlist-items {
    padding: 15px;
  }

  .cart-item, .wishlist-item {
    padding: 12px;
  }

  .cart-item img, .wishlist-item img {
    width: 60px;
    height: 75px;
  }

  .item-details h4 {
    font-size: 13px;
  }

  .item-price {
    font-size: 14px;
  }
}

/* 超小屏幕 */
@media (max-width: 360px) {
  .logo h1 {
    font-size: 18px;
  }

  .logo h1::after {
    display: none;
  }

  .header-actions {
    gap: 6px;
  }
}
</style>
