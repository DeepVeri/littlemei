<template>
  <div class="outfits-page">
    <div class="page-header">
      <h1>{{ t('home.outfitDesign.title') }}</h1>
      <p>{{ t('home.outfitDesign.subtitle') }}</p>
    </div>

    <!-- 特色功能展示 -->
    <div class="features-section">
      <div class="feature-card highlight">
        <div class="feature-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </div>
        <h3>{{ t('outfits.features.designer.title') }}</h3>
        <p>{{ t('outfits.features.designer.desc') }}</p>
      </div>
      
      <div class="feature-card highlight ai-feature">
        <div class="feature-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
            <path d="M9 11h6v6H9z" opacity="0.3"/>
          </svg>
        </div>
        <h3>{{ t('outfits.features.aiTryOn.title') }}</h3>
        <p>{{ t('outfits.features.aiTryOn.desc') }}</p>
        <span class="ai-badge">AI</span>
      </div>
    </div>

    <div class="outfit-grid">
      <div 
        v-for="(outfit, index) in designedOutfits" 
        :key="outfit.id"
        class="outfit-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="handleOutfitClick(outfit)"
      >
        <div class="outfit-images">
          <div class="main-image" :style="{ background: outfit.bgColor }">
            <img :src="outfit.mainImage" :alt="outfit.name" />
            <span class="designer-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              {{ outfit.designer }}
            </span>
          </div>
          <div class="thumbnail-grid">
            <img 
              v-for="(thumb, idx) in outfit.thumbnails" 
              :key="idx"
              :src="thumb" 
              :alt="`Item ${idx + 1}`"
              class="thumbnail-item"
            />
          </div>
        </div>
        <div class="outfit-info">
          <div class="outfit-header">
            <h3>{{ outfit.name }}</h3>
            <span class="outfit-tag">{{ outfit.pieces }}件套装</span>
          </div>
          <p class="outfit-desc">{{ outfit.description }}</p>
          <div class="outfit-footer">
            <div class="price-info">
              <span class="outfit-price">${{ outfit.price }}</span>
              <span class="original-price" v-if="outfit.originalPrice">${{ outfit.originalPrice }}</span>
              <span class="save-badge" v-if="outfit.originalPrice">省${{ outfit.originalPrice - outfit.price }}</span>
            </div>
            <div class="action-buttons">
              <button class="ai-tryon-btn" @click.stop="handleAITryOn(outfit)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/>
                </svg>
                {{ t('outfits.aiTryOn') }}
              </button>
              <button class="add-cart-btn" @click.stop="addToCart(outfit)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 2v6h6V2M19 9v6h-6V9M15 15v6H9v-6"></path>
                </svg>
                {{ t('product.quickAdd') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../stores/cart'

const { t } = useI18n()
const cartStore = useCartStore()

const showToast = ref(false)
const toastMessage = ref('')

const designedOutfits = ref([
  {
    id: 'outfit1',
    name: '甜美约会风',
    designer: '小美设计师',
    pieces: 3,
    description: '粉色针织开衫 + 白色连衣裙 + 小白鞋',
    price: 159.99,
    originalPrice: 219.99,
    bgColor: 'linear-gradient(135deg, #ffeef8 0%, #fff5f9 100%)',
    mainImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=100&h=100&fit=crop'
    ]
  },
  {
    id: 'outfit2',
    name: '职场精英装',
    designer: 'Emma设计师',
    pieces: 4,
    description: '黑色西装外套 + 白衬衫 + 高腰裤 + 高跟鞋',
    price: 289.99,
    originalPrice: 389.99,
    bgColor: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
    mainImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=100&h=100&fit=crop'
    ]
  },
  {
    id: 'outfit3',
    name: '街头潮流范',
    designer: 'Coco设计师',
    pieces: 4,
    description: '牛仔外套 + 印花T恤 + 破洞牛仔裤 + 运动鞋',
    price: 199.99,
    originalPrice: 279.99,
    bgColor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    mainImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
    ]
  },
  {
    id: 'outfit4',
    name: '度假休闲风',
    designer: 'Lisa设计师',
    pieces: 3,
    description: '碎花连衣裙 + 编织包 + 平底凉鞋',
    price: 139.99,
    originalPrice: 199.99,
    bgColor: 'linear-gradient(135deg, #fff9e6 0%, #ffecb3 100%)',
    mainImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=100&h=100&fit=crop'
    ]
  },
  {
    id: 'outfit5',
    name: '优雅晚宴装',
    designer: 'Sophie设计师',
    pieces: 4,
    description: '丝绸衬衫 + 半身长裙 + 高跟鞋 + 珍珠项链',
    price: 349.99,
    originalPrice: 499.99,
    bgColor: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    mainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop'
    ]
  },
  {
    id: 'outfit6',
    name: '运动活力装',
    designer: 'Anna设计师',
    pieces: 3,
    description: '运动内衣 + 瑜伽裤 + 运动鞋',
    price: 119.99,
    originalPrice: 169.99,
    bgColor: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    mainImage: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400&h=500&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=100&h=100&fit=crop'
    ]
  }
])

const handleOutfitClick = (outfit) => {
  console.log('Outfit clicked:', outfit)
}

const handleAITryOn = (outfit) => {
  showToastMessage(t('outfits.aiTryOnMessage'))
  // TODO: 实现AI试穿功能
  console.log('AI Try-on:', outfit)
}

const addToCart = (outfit) => {
  cartStore.addToCart(outfit)
  showToastMessage(t('product.addedToCart'))
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
.outfits-page {
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -1px;
}

.page-header p {
  font-size: 18px;
  color: #666;
}

/* 特色功能展示区 */
.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.feature-card {
  background: linear-gradient(135deg, #ffeef8 0%, #fff5f9 100%);
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.feature-card.highlight {
  border-color: #ff69b4;
  box-shadow: 0 8px 30px rgba(255, 105, 180, 0.2);
}

.feature-card.ai-feature {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-color: #667eea;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.feature-card .feature-icon {
  color: #ff69b4;
}

.feature-card.ai-feature .feature-icon {
  color: #667eea;
}

.feature-card h3 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #333;
  position: relative;
  z-index: 1;
}

.feature-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.ai-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  z-index: 1;
}

.outfit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.outfit-card {
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

.outfit-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.outfit-images {
  position: relative;
}

.main-image {
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.outfit-card:hover .main-image img {
  transform: scale(1.08);
}

.designer-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.designer-badge svg {
  color: #ffd700;
}

.thumbnail-grid {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.95);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.thumbnail-item {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.thumbnail-item:hover {
  transform: scale(1.1);
  border-color: #ff69b4;
}

.outfit-info {
  padding: 20px;
}

.outfit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.outfit-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.outfit-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.outfit-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  min-height: 44px;
}

.outfit-footer {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.outfit-price {
  font-size: 24px;
  font-weight: 800;
  color: #ff69b4;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.save-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #fff;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}

.ai-tryon-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.ai-tryon-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.ai-tryon-btn:hover::before {
  width: 300px;
  height: 300px;
}

.ai-tryon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.add-cart-btn {
  flex: 1;
  background: #fff;
  color: #333;
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s;
  border: 2px solid #e0e0e0;
  cursor: pointer;
}

.add-cart-btn:hover {
  border-color: #667eea;
  background: #f5f7ff;
  transform: translateY(-2px);
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
  .page-header h1 {
    font-size: 32px;
  }

  .features-section {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 40px;
  }

  .feature-card {
    padding: 30px 20px;
  }

  .feature-icon {
    width: 60px;
    height: 60px;
  }

  .feature-card h3 {
    font-size: 20px;
  }

  .outfit-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .main-image {
    height: 280px;
  }

  .thumbnail-item {
    width: 50px;
    height: 50px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .ai-tryon-btn,
  .add-cart-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 28px;
  }

  .outfit-grid {
    gap: 15px;
  }

  .main-image {
    height: 250px;
  }

  .outfit-info {
    padding: 15px;
  }

  .outfit-header h3 {
    font-size: 18px;
  }

  .outfit-tag {
    font-size: 10px;
    padding: 3px 10px;
  }

  .outfit-desc {
    font-size: 13px;
    min-height: 40px;
  }

  .outfit-price {
    font-size: 20px;
  }

  .thumbnail-grid {
    padding: 10px;
    gap: 6px;
  }

  .thumbnail-item {
    width: 45px;
    height: 45px;
  }
}
</style>

