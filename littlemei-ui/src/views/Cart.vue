<template>
  <div class="cart-page">
    <div class="cart-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>{{ t('cart.title') }}</h1>
        <p class="item-count">{{ t('cart.itemCount', { count: cartStore.cartCount }) }}</p>
      </div>

      <!-- 空购物车状态 -->
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>{{ t('cart.empty') }}</h2>
        <p>{{ t('cart.emptyDesc') }}</p>
        <button class="continue-shopping-btn" @click="router.push('/')">
          {{ t('cart.continueShopping') }}
        </button>
      </div>

      <!-- 购物车内容 -->
      <div v-else class="cart-content">
        <!-- 左侧：商品列表 -->
        <div class="cart-items">
          <!-- 全选和删除 -->
          <div class="cart-actions">
            <label class="select-all">
              <input type="checkbox" v-model="allSelected" @change="toggleSelectAll">
              <span>{{ t('cart.selectAll') }}</span>
            </label>
            <button class="clear-selected" @click="deleteSelected" :disabled="selectedItems.length === 0">
              {{ t('cart.deleteSelected') }}
            </button>
          </div>

          <!-- 商品列表 -->
          <div class="items-list">
            <div 
              v-for="(item, index) in cartStore.items" 
              :key="`${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`" 
              class="cart-item"
              :class="{ 'out-of-stock': item.stock === 0 }"
            >
              <input 
                type="checkbox" 
                class="item-checkbox"
                :checked="isSelected(item.id)"
                @change="toggleSelect(item.id)"
                :disabled="item.stock === 0"
              >
              
              <div class="item-image" @click="goToProduct(item.id)">
                <img :src="item.image" :alt="item.name">
                <div v-if="item.stock === 0" class="stock-badge">{{ t('cart.outOfStock') }}</div>
              </div>

              <div class="item-info">
                <h3 class="item-name" @click="goToProduct(item.id)">{{ item.name }}</h3>
                <p class="item-desc">{{ item.description }}</p>
                
                <div class="item-specs">
                  <span v-if="item.selectedColor" class="spec-item">
                    {{ t('productDetail.color') }}: {{ item.selectedColor }}
                  </span>
                  <span v-if="item.selectedSize" class="spec-item">
                    {{ t('productDetail.size') }}: {{ item.selectedSize }}
                  </span>
                </div>

                <div class="item-footer">
                  <div class="item-price">
                    <span class="current-price">${{ item.price }}</span>
                    <span v-if="item.originalPrice" class="original-price">${{ item.originalPrice }}</span>
                  </div>

                  <div class="quantity-control">
                    <button 
                      class="qty-btn"
                      @click="decreaseQuantity(item)"
                      :disabled="item.quantity <= 1"
                    >-</button>
                    <input 
                      type="number" 
                      class="qty-input"
                      :value="item.quantity"
                      @change="updateQuantity(item, $event.target.value)"
                      min="1"
                      :max="item.stock || 99"
                    >
                    <button 
                      class="qty-btn"
                      @click="increaseQuantity(item)"
                      :disabled="item.stock && item.quantity >= item.stock"
                    >+</button>
                  </div>

                  <div class="item-total">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </div>

                  <button class="remove-btn" @click="removeItem(item)" :title="t('cart.remove')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：订单摘要 -->
        <div class="order-summary">
          <h2 class="summary-title">{{ t('cart.orderSummary') }}</h2>

          <!-- 优惠券 -->
          <div class="coupon-section">
            <div class="coupon-input-group">
              <input 
                v-model="couponCode"
                type="text" 
                class="coupon-input"
                :placeholder="t('cart.enterCoupon')"
                @keyup.enter="applyCoupon"
              >
              <button class="apply-coupon-btn" @click="applyCoupon">
                {{ t('cart.apply') }}
              </button>
            </div>
            
            <div v-if="appliedCoupon" class="applied-coupon">
              <span class="coupon-info">
                <svg class="coupon-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                {{ appliedCoupon.code }} (-${{ appliedCoupon.discount.toFixed(2) }})
              </span>
              <button class="remove-coupon" @click="removeCoupon">✕</button>
            </div>

            <!-- 可用优惠券列表 -->
            <div v-if="!appliedCoupon && availableCoupons.length > 0" class="available-coupons">
              <p class="coupons-label">{{ t('cart.availableCoupons') }}:</p>
              <div 
                v-for="coupon in availableCoupons" 
                :key="coupon.code"
                class="coupon-card"
                @click="selectCoupon(coupon)"
              >
                <div class="coupon-badge">{{ coupon.discount }}{{ coupon.type === 'percent' ? '%' : '$' }} {{ t('cart.off') }}</div>
                <div class="coupon-details">
                  <div class="coupon-code">{{ coupon.code }}</div>
                  <div class="coupon-condition">{{ t('cart.minOrder') }} ${{ coupon.minAmount }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 价格明细 -->
          <div class="price-details">
            <div class="price-row">
              <span>{{ t('cart.subtotal') }}</span>
              <span>${{ selectedSubtotal.toFixed(2) }}</span>
            </div>
            <div class="price-row">
              <span>{{ t('cart.shipping') }}</span>
              <span class="free">{{ shippingFee === 0 ? t('cart.free') : '$' + shippingFee.toFixed(2) }}</span>
            </div>
            <div v-if="appliedCoupon" class="price-row discount">
              <span>{{ t('cart.discount') }}</span>
              <span>-${{ appliedCoupon.discount.toFixed(2) }}</span>
            </div>
            <div class="price-row total">
              <span>{{ t('cart.total') }}</span>
              <span class="total-price">${{ finalTotal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- 结算按钮 -->
          <button 
            class="checkout-btn"
            @click="goToCheckout"
            :disabled="selectedItems.length === 0 || hasOutOfStock"
          >
            {{ t('cart.checkout') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <button class="continue-shopping-link" @click="router.push('/')">
            {{ t('cart.continueShopping') }}
          </button>

          <!-- 安全保障 -->
          <div class="security-badges">
            <div class="badge-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 16c-3.31-.91-6-5.11-6-8.59V6.39l6-2.25 6 2.25v2.62c0 3.48-2.69 7.68-6 8.59z"/>
              </svg>
              <span>{{ t('cart.securePayment') }}</span>
            </div>
            <div class="badge-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>{{ t('cart.moneyBack') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()

// 选中的商品
const selectedItemIds = ref(new Set())
const allSelected = computed({
  get: () => {
    const availableItems = cartStore.items.filter(item => item.stock !== 0)
    return availableItems.length > 0 && selectedItemIds.value.size === availableItems.length
  },
  set: (value) => {
    if (value) {
      cartStore.items.forEach(item => {
        if (item.stock !== 0) {
          selectedItemIds.value.add(item.id)
        }
      })
    } else {
      selectedItemIds.value.clear()
    }
  }
})

// 默认全选
if (cartStore.items.length > 0) {
  cartStore.items.forEach(item => {
    if (item.stock !== 0) {
      selectedItemIds.value.add(item.id)
    }
  })
}

const selectedItems = computed(() => {
  return cartStore.items.filter(item => selectedItemIds.value.has(item.id))
})

const hasOutOfStock = computed(() => {
  return selectedItems.value.some(item => item.stock === 0)
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
    cartStore.items.forEach(item => {
      if (item.stock !== 0) {
        selectedItemIds.value.add(item.id)
      }
    })
  } else {
    selectedItemIds.value.clear()
  }
}

function deleteSelected() {
  if (confirm(t('cart.confirmDelete'))) {
    const itemsToDelete = cartStore.items.filter(item => selectedItemIds.value.has(item.id))
    itemsToDelete.forEach(item => {
      cartStore.removeFromCart(item.id, item.selectedColor, item.selectedSize)
    })
    selectedItemIds.value.clear()
  }
}

// 优惠券
const couponCode = ref('')
const appliedCoupon = ref(null)

const availableCoupons = ref([
  { code: 'SAVE10', type: 'percent', discount: 10, minAmount: 50 },
  { code: 'SAVE20', type: 'percent', discount: 20, minAmount: 100 },
  { code: 'NEWUSER', type: 'fixed', discount: 15, minAmount: 0 },
  { code: 'FREESHIP', type: 'shipping', discount: 0, minAmount: 30 }
])

function applyCoupon() {
  const code = couponCode.value.trim().toUpperCase()
  const coupon = availableCoupons.value.find(c => c.code === code)
  
  if (!coupon) {
    alert(t('cart.invalidCoupon'))
    return
  }

  if (selectedSubtotal.value < coupon.minAmount) {
    alert(t('cart.couponMinAmount', { amount: coupon.minAmount }))
    return
  }

  appliedCoupon.value = {
    ...coupon,
    discount: coupon.type === 'percent' 
      ? (selectedSubtotal.value * coupon.discount / 100)
      : coupon.discount
  }
  
  couponCode.value = ''
}

function selectCoupon(coupon) {
  couponCode.value = coupon.code
  applyCoupon()
}

function removeCoupon() {
  appliedCoupon.value = null
}

// 价格计算
const selectedSubtotal = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const shippingFee = computed(() => {
  if (appliedCoupon.value?.type === 'shipping') return 0
  return selectedSubtotal.value >= 50 ? 0 : 5.99
})

const finalTotal = computed(() => {
  let total = selectedSubtotal.value + shippingFee.value
  if (appliedCoupon.value) {
    total -= appliedCoupon.value.discount
  }
  return Math.max(0, total)
})

// 商品操作
function goToProduct(id) {
  router.push(`/product/${id}`)
}

function removeItem(item) {
  if (confirm(t('cart.confirmRemove'))) {
    cartStore.removeFromCart(item.id, item.selectedColor, item.selectedSize)
    selectedItemIds.value.delete(item.id)
  }
}

function updateQuantity(item, value) {
  const quantity = parseInt(value) || 1
  const maxQty = item.stock || 99
  const finalQty = Math.max(1, Math.min(quantity, maxQty))
  cartStore.updateQuantity(item.id, finalQty, item.selectedColor, item.selectedSize)
}

function increaseQuantity(item) {
  const maxQty = item.stock || 99
  if (item.quantity < maxQty) {
    cartStore.updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)
  }
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)
  }
}

function goToCheckout() {
  if (selectedItems.value.length === 0) {
    alert(t('cart.selectItems'))
    return
  }
  
  if (hasOutOfStock.value) {
    alert(t('cart.removeOutOfStock'))
    return
  }

  // 这里可以跳转到结算页面
  router.push('/checkout')
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.cart-container {
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

/* 空购物车 */
.empty-cart {
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

.empty-cart h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 10px;
}

.empty-cart p {
  color: #718096;
  margin-bottom: 30px;
}

.continue-shopping-btn {
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

.continue-shopping-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

/* 购物车内容 */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
}

/* 商品列表 */
.cart-items {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #f7fafc;
  margin-bottom: 20px;
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

.clear-selected {
  background: none;
  border: 2px solid #fc8181;
  color: #fc8181;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-selected:hover:not(:disabled) {
  background: #fc8181;
  color: white;
}

.clear-selected:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 商品项 */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 120px 1fr;
  gap: 20px;
  padding: 20px;
  border: 2px solid #f7fafc;
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
}

.cart-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.cart-item.out-of-stock {
  opacity: 0.6;
  background: #f7fafc;
}

.item-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 50px;
}

.item-image {
  width: 120px;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-image:hover img {
  transform: scale(1.05);
}

.stock-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #fc8181;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-name {
  font-size: 1.2rem;
  color: #2d3748;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
}

.item-name:hover {
  color: #667eea;
}

.item-desc {
  color: #718096;
  font-size: 0.9rem;
}

.item-specs {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.spec-item {
  background: #f7fafc;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #4a5568;
}

.item-footer {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: auto;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #667eea;
}

.original-price {
  font-size: 1rem;
  color: #a0aec0;
  text-decoration: line-through;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f7fafc;
  border-radius: 10px;
  padding: 4px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-input {
  width: 50px;
  height: 32px;
  text-align: center;
  border: none;
  background: white;
  border-radius: 6px;
  font-weight: 600;
  color: #2d3748;
}

.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.item-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-left: auto;
}

.remove-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #fed7d7;
  color: #fc8181;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn svg {
  width: 20px;
  height: 20px;
}

.remove-btn:hover {
  background: #fc8181;
  color: white;
}

/* 订单摘要 */
.order-summary {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
}

.summary-title {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 25px;
  font-weight: 700;
}

/* 优惠券部分 */
.coupon-section {
  margin-bottom: 25px;
}

.coupon-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.coupon-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.coupon-input:focus {
  border-color: #667eea;
  outline: none;
}

.apply-coupon-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.apply-coupon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.applied-coupon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.coupon-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #22543d;
}

.coupon-icon {
  width: 20px;
  height: 20px;
}

.remove-coupon {
  background: none;
  border: none;
  color: #22543d;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.remove-coupon:hover {
  background: rgba(34, 84, 61, 0.1);
}

.available-coupons {
  margin-top: 15px;
}

.coupons-label {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.coupon-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.coupon-card:hover {
  border-color: #667eea;
  background: #f7fafc;
}

.coupon-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
}

.coupon-details {
  flex: 1;
}

.coupon-code {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.coupon-condition {
  font-size: 0.8rem;
  color: #718096;
}

/* 价格明细 */
.price-details {
  margin-bottom: 25px;
  padding: 20px 0;
  border-top: 2px solid #f7fafc;
  border-bottom: 2px solid #f7fafc;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #4a5568;
}

.price-row.discount {
  color: #48bb78;
}

.price-row.total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid #f7fafc;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
}

.total-price {
  color: #667eea;
  font-size: 1.8rem;
}

.free {
  color: #48bb78;
  font-weight: 600;
}

/* 结算按钮 */
.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.checkout-btn svg {
  width: 24px;
  height: 24px;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.continue-shopping-link {
  width: 100%;
  background: none;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.continue-shopping-link:hover {
  border-color: #667eea;
  color: #667eea;
}

/* 安全保障 */
.security-badges {
  margin-top: 25px;
  padding-top: 25px;
  border-top: 2px solid #f7fafc;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  color: #718096;
  font-size: 0.9rem;
}

.badge-item svg {
  width: 24px;
  height: 24px;
  color: #48bb78;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: 20px 10px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .cart-item {
    grid-template-columns: auto 80px 1fr;
    gap: 12px;
    padding: 15px;
  }

  .item-checkbox {
    margin-top: 30px;
  }

  .item-image {
    width: 80px;
    height: 110px;
  }

  .item-name {
    font-size: 1rem;
  }

  .item-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .item-total {
    margin-left: 0;
  }

  .current-price {
    font-size: 1.2rem;
  }

  .coupon-input-group {
    flex-direction: column;
  }

  .apply-coupon-btn {
    width: 100%;
  }

  .cart-actions {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .clear-selected {
    width: 100%;
  }
}
</style>

