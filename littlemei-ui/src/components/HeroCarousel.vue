<template>
  <section class="hero-carousel">
    <div class="carousel-container">
      <div class="scroll-container">
        <div class="product-cards" ref="cardsContainer">
          <div 
            v-for="(card, i) in displayCards" 
            :key="`card-${i}`"
            class="product-card"
          >
            <div class="card-badge" v-if="card.badge">{{ card.badge }}</div>
            <div class="card-image">
              <img :src="card.image" :alt="card.title" />
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-subtitle">{{ card.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const cardsContainer = ref(null)
let scrollInterval = null

const cards = [
  {
    badge: '先鉴别后发货',
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&h=500&fit=crop',
    title: '海量潮品',
    subtitle: '独家首发'
  },
  {
    badge: '超多模版',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
    title: '一键成片',
    subtitle: '简单快捷'
  },
  {
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop',
    title: '得物榜单',
    subtitle: '精心推荐'
  },
  {
    badge: 'AR科技',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=500&fit=crop',
    title: '不止试鞋',
    subtitle: '全新体验'
  },
  {
    badge: '热门',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
    title: '个性定制',
    subtitle: '专享服务'
  },
  {
    badge: '限量',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
    title: '万物品牌',
    subtitle: '任意挑选'
  },
  {
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    title: '运动潮鞋',
    subtitle: '限时特惠'
  },
  {
    badge: '爆款',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop',
    title: '街头时尚',
    subtitle: '新品首发'
  }
]

// 复制卡片数组以实现无限循环
const displayCards = computed(() => {
  return [...cards, ...cards, ...cards]
})

const startAutoScroll = () => {
  scrollInterval = setInterval(() => {
    if (cardsContainer.value) {
      const container = cardsContainer.value
      const scrollWidth = container.scrollWidth / 3 // 因为我们复制了3次
      
      // 平滑滚动
      container.scrollLeft += 1
      
      // 当滚动到第一组的末尾时，重置到开始位置
      if (container.scrollLeft >= scrollWidth) {
        container.scrollLeft = 0
      }
    }
  }, 20) // 每20ms滚动1px，实现平滑效果
}

const stopAutoScroll = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }
}

onMounted(() => {
  startAutoScroll()
})

onUnmounted(() => {
  stopAutoScroll()
})
</script>

<style scoped>
.hero-carousel {
  width: 100%;
  margin-bottom: 60px;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 380px;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  align-items: center;
  padding: 40px 0;
}

.scroll-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.product-cards {
  display: flex;
  gap: 20px;
  overflow-x: hidden;
  overflow-y: hidden;
  padding: 10px;
  scrollbar-width: none;
}

.product-cards::-webkit-scrollbar {
  display: none;
}

.product-card {
  flex: 0 0 200px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

.card-image {
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.product-card:hover .card-image img {
  transform: scale(1.1);
}

.card-content {
  padding: 16px;
  background: #fff;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
  line-height: 1.3;
}

.card-subtitle {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}



/* 平板端 */
@media (max-width: 1024px) {
  .carousel-container {
    height: 350px;
    padding: 30px 0;
  }

  .product-cards {
    gap: 15px;
  }

  .product-card {
    flex: 0 0 180px;
  }

  .card-image {
    height: 220px;
  }
}

/* 移动端 */
@media (max-width: 768px) {
  .carousel-container {
    height: 320px;
    padding: 25px 0;
    border-radius: 16px;
  }

  .product-cards {
    gap: 12px;
  }

  .product-card {
    flex: 0 0 160px;
  }

  .card-image {
    height: 200px;
  }

  .card-content {
    padding: 12px;
  }

  .card-title {
    font-size: 14px;
  }

  .card-subtitle {
    font-size: 12px;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .carousel-container {
    height: 280px;
    padding: 20px 0;
  }

  .product-cards {
    gap: 10px;
  }

  .product-card {
    flex: 0 0 140px;
  }

  .card-image {
    height: 180px;
  }

  .card-badge {
    padding: 4px 8px;
    font-size: 9px;
  }
}
</style>

