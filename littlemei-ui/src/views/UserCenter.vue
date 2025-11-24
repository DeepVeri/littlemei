<template>
  <div class="user-center-page">
    <div class="user-center-container">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="user-avatar">
          <img :src="userInfo.avatar || '/default-avatar.png'" :alt="userInfo.name">
          <button class="edit-avatar-btn" @click="showAvatarUpload = true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>
        </div>
        <div class="user-info">
          <h2>{{ userInfo.name }}</h2>
          <p class="user-email">{{ userInfo.email }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">{{ orderStats.total }}</span>
              <span class="stat-label">{{ t('userCenter.orders') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ cartStore.wishlistCount }}</span>
              <span class="stat-label">{{ t('userCenter.wishlist') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ availableCoupons.length }}</span>
              <span class="stat-label">{{ t('userCenter.coupons') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页导航 -->
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span>{{ t(`userCenter.tabs.${tab.id}`) }}</span>
        </button>
      </div>

      <!-- 标签页内容 -->
      <div class="tab-content">
        <!-- 个人信息 -->
        <div v-show="activeTab === 'profile'" class="profile-section">
          <div class="section-header">
            <h3>{{ t('userCenter.personalInfo') }}</h3>
            <button v-if="!isEditing" @click="startEdit" class="edit-btn">
              {{ t('userCenter.edit') }}
            </button>
          </div>

          <div class="info-form">
            <div class="form-row">
              <div class="form-group">
                <label>{{ t('userCenter.fullName') }}</label>
                <input 
                  v-model="editForm.name" 
                  type="text" 
                  :disabled="!isEditing"
                  :placeholder="t('userCenter.enterFullName')"
                >
              </div>
              <div class="form-group">
                <label>{{ t('userCenter.gender') }}</label>
                <select v-model="editForm.gender" :disabled="!isEditing">
                  <option value="">{{ t('userCenter.selectGender') }}</option>
                  <option value="male">{{ t('userCenter.male') }}</option>
                  <option value="female">{{ t('userCenter.female') }}</option>
                  <option value="other">{{ t('userCenter.other') }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>{{ t('userCenter.email') }}</label>
                <input v-model="editForm.email" type="email" :disabled="!isEditing">
              </div>
              <div class="form-group">
                <label>{{ t('userCenter.phone') }}</label>
                <input v-model="editForm.phone" type="tel" :disabled="!isEditing">
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('userCenter.birthday') }}</label>
              <input v-model="editForm.birthday" type="date" :disabled="!isEditing">
            </div>

            <div v-if="isEditing" class="form-actions">
              <button @click="saveProfile" class="save-btn">{{ t('userCenter.save') }}</button>
              <button @click="cancelEdit" class="cancel-btn">{{ t('userCenter.cancel') }}</button>
            </div>
          </div>
        </div>

        <!-- 订单历史 -->
        <div v-show="activeTab === 'orders'" class="orders-section">
          <div class="order-filters">
            <button 
              v-for="status in orderStatuses" 
              :key="status.id"
              class="filter-btn"
              :class="{ active: orderFilter === status.id }"
              @click="orderFilter = status.id"
            >
              {{ t(`userCenter.orderStatus.${status.id}`) }}
              <span v-if="status.count > 0" class="count-badge">{{ status.count }}</span>
            </button>
          </div>

          <div class="orders-list">
            <div v-if="filteredOrders.length === 0" class="empty-state">
              <div class="empty-icon">📦</div>
              <p>{{ t('userCenter.noOrders') }}</p>
            </div>

            <div v-for="order in filteredOrders" :key="order.id" class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <span class="order-number">{{ t('userCenter.orderNumber') }}: {{ order.orderNumber }}</span>
                  <span class="order-date">{{ formatDate(order.date) }}</span>
                </div>
                <span class="order-status" :class="order.status">
                  {{ t(`userCenter.orderStatus.${order.status}`) }}
                </span>
              </div>

              <div class="order-items">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                  <img :src="item.image" :alt="item.name">
                  <div class="item-details">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.specs }}</p>
                    <p class="quantity">× {{ item.quantity }}</p>
                  </div>
                  <div class="item-price">${{ item.price }}</div>
                </div>
              </div>

              <div class="order-footer">
                <div class="order-total">
                  {{ t('userCenter.total') }}: <strong>${{ order.total.toFixed(2) }}</strong>
                </div>
                <div class="order-actions">
                  <button v-if="order.status === 'pending'" @click="payOrder(order)" class="action-btn primary">
                    {{ t('userCenter.pay') }}
                  </button>
                  <button v-if="order.status === 'shipped'" @click="confirmReceive(order)" class="action-btn primary">
                    {{ t('userCenter.confirmReceive') }}
                  </button>
                  <button @click="viewOrderDetail(order)" class="action-btn">
                    {{ t('userCenter.viewDetails') }}
                  </button>
                  <button v-if="order.status === 'completed'" @click="reviewOrder(order)" class="action-btn">
                    {{ t('userCenter.review') }}
                  </button>
                  <button v-if="order.status === 'pending'" @click="cancelOrder(order)" class="action-btn danger">
                    {{ t('userCenter.cancelOrder') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 地址管理 -->
        <div v-show="activeTab === 'addresses'" class="addresses-section">
          <div class="section-header">
            <h3>{{ t('userCenter.addressManagement') }}</h3>
            <button @click="showAddressModal = true" class="add-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              {{ t('userCenter.addAddress') }}
            </button>
          </div>

          <div class="addresses-grid">
            <div v-for="addr in addresses" :key="addr.id" class="address-card" :class="{ default: addr.isDefault }">
              <div v-if="addr.isDefault" class="default-badge">{{ t('userCenter.defaultAddress') }}</div>
              <div class="address-header">
                <h4>{{ addr.name }}</h4>
                <span class="phone">{{ addr.phone }}</span>
              </div>
              <p class="address-detail">
                {{ addr.province }} {{ addr.city }} {{ addr.district }}<br>
                {{ addr.street }}
              </p>
              <div class="address-actions">
                <button @click="editAddress(addr)" class="action-link">{{ t('userCenter.edit') }}</button>
                <button @click="deleteAddress(addr.id)" class="action-link danger">{{ t('userCenter.delete') }}</button>
                <button v-if="!addr.isDefault" @click="setDefaultAddress(addr.id)" class="action-link">
                  {{ t('userCenter.setDefault') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 优惠券 -->
        <div v-show="activeTab === 'coupons'" class="coupons-section">
          <div class="coupon-filters">
            <button 
              v-for="filter in couponFilters" 
              :key="filter.id"
              class="filter-btn"
              :class="{ active: couponFilter === filter.id }"
              @click="couponFilter = filter.id"
            >
              {{ t(`userCenter.couponFilter.${filter.id}`) }}
            </button>
          </div>

          <div class="coupons-grid">
            <div v-if="filteredCoupons.length === 0" class="empty-state">
              <div class="empty-icon">🎟️</div>
              <p>{{ t('userCenter.noCoupons') }}</p>
            </div>

            <div v-for="coupon in filteredCoupons" :key="coupon.id" class="coupon-card" :class="{ expired: coupon.isExpired, used: coupon.isUsed }">
              <div class="coupon-left">
                <div class="coupon-value">
                  <span class="symbol">$</span>
                  <span class="amount">{{ coupon.discount }}</span>
                </div>
                <div class="coupon-condition">{{ t('userCenter.minOrder') }} ${{ coupon.minAmount }}</div>
              </div>
              <div class="coupon-right">
                <h4 class="coupon-title">{{ coupon.title }}</h4>
                <p class="coupon-desc">{{ coupon.description }}</p>
                <div class="coupon-meta">
                  <span class="coupon-code">{{ coupon.code }}</span>
                  <span class="coupon-expiry">
                    {{ t('userCenter.validUntil') }}: {{ formatDate(coupon.expiry) }}
                  </span>
                </div>
                <button 
                  v-if="!coupon.isExpired && !coupon.isUsed" 
                  @click="useCoupon(coupon)"
                  class="use-btn"
                >
                  {{ t('userCenter.useNow') }}
                </button>
                <span v-if="coupon.isUsed" class="status-badge used">{{ t('userCenter.used') }}</span>
                <span v-if="coupon.isExpired" class="status-badge expired">{{ t('userCenter.expired') }}</span>
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

const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()

// 用户信息
const userInfo = ref({
  name: 'Zhang San',
  email: 'zhangsan@example.com',
  phone: '138-0000-0000',
  avatar: '',
  gender: 'male',
  birthday: '1990-01-01'
})

// 编辑状态
const isEditing = ref(false)
const editForm = ref({ ...userInfo.value })
const showAvatarUpload = ref(false)

// 当前标签页
const activeTab = ref('profile')
const tabs = [
  { id: 'profile', icon: '👤' },
  { id: 'orders', icon: '📦' },
  { id: 'addresses', icon: '📍' },
  { id: 'coupons', icon: '🎟️' }
]

// 订单数据
const orders = ref([
  {
    id: 1,
    orderNumber: 'ORD20250108001',
    date: '2025-01-08',
    status: 'pending',
    items: [
      { id: 1, name: 'Cream Bomber Jacket', image: '/api/placeholder/80/100', specs: 'Size: M, Color: Cream', quantity: 1, price: 79.99 }
    ],
    total: 85.98
  },
  {
    id: 2,
    orderNumber: 'ORD20250105002',
    date: '2025-01-05',
    status: 'shipped',
    items: [
      { id: 2, name: 'Pink Faux Fur Coat', image: '/api/placeholder/80/100', specs: 'Size: L, Color: Pink', quantity: 1, price: 149.99 }
    ],
    total: 149.99
  },
  {
    id: 3,
    orderNumber: 'ORD20241220003',
    date: '2024-12-20',
    status: 'completed',
    items: [
      { id: 3, name: 'Black Puffer Coat', image: '/api/placeholder/80/100', specs: 'Size: S, Color: Black', quantity: 2, price: 129.99 }
    ],
    total: 259.98
  }
])

const orderFilter = ref('all')
const orderStatuses = computed(() => [
  { id: 'all', count: orders.value.length },
  { id: 'pending', count: orders.value.filter(o => o.status === 'pending').length },
  { id: 'paid', count: orders.value.filter(o => o.status === 'paid').length },
  { id: 'shipped', count: orders.value.filter(o => o.status === 'shipped').length },
  { id: 'completed', count: orders.value.filter(o => o.status === 'completed').length },
  { id: 'cancelled', count: orders.value.filter(o => o.status === 'cancelled').length }
])

const filteredOrders = computed(() => {
  if (orderFilter.value === 'all') return orders.value
  return orders.value.filter(o => o.status === orderFilter.value)
})

const orderStats = computed(() => ({
  total: orders.value.length,
  pending: orders.value.filter(o => o.status === 'pending').length,
  completed: orders.value.filter(o => o.status === 'completed').length
}))

// 地址数据
const addresses = ref([
  {
    id: 1,
    name: 'Zhang San',
    phone: '138-0000-0000',
    province: 'Beijing',
    city: 'Beijing',
    district: 'Chaoyang District',
    street: 'No. 123 Wangjing Street',
    isDefault: true
  },
  {
    id: 2,
    name: 'Li Si',
    phone: '139-0000-0000',
    province: 'Shanghai',
    city: 'Shanghai',
    district: 'Pudong New Area',
    street: 'No. 456 Century Avenue',
    isDefault: false
  }
])

const showAddressModal = ref(false)

// 优惠券数据
const coupons = ref([
  {
    id: 1,
    code: 'SAVE20',
    title: '$20 Off',
    description: 'For orders over $100',
    discount: 20,
    minAmount: 100,
    expiry: '2025-12-31',
    isUsed: false,
    isExpired: false
  },
  {
    id: 2,
    code: 'NEWUSER',
    title: '$15 Off',
    description: 'New user exclusive',
    discount: 15,
    minAmount: 0,
    expiry: '2025-06-30',
    isUsed: false,
    isExpired: false
  },
  {
    id: 3,
    code: 'WINTER10',
    title: '$10 Off',
    description: 'Winter sale',
    discount: 10,
    minAmount: 50,
    expiry: '2024-12-31',
    isUsed: false,
    isExpired: true
  },
  {
    id: 4,
    code: 'USED50',
    title: '$50 Off',
    description: 'Already used',
    discount: 50,
    minAmount: 200,
    expiry: '2025-12-31',
    isUsed: true,
    isExpired: false
  }
])

const couponFilter = ref('available')
const couponFilters = [
  { id: 'all' },
  { id: 'available' },
  { id: 'used' },
  { id: 'expired' }
]

const availableCoupons = computed(() => {
  return coupons.value.filter(c => !c.isUsed && !c.isExpired)
})

const filteredCoupons = computed(() => {
  switch (couponFilter.value) {
    case 'available':
      return coupons.value.filter(c => !c.isUsed && !c.isExpired)
    case 'used':
      return coupons.value.filter(c => c.isUsed)
    case 'expired':
      return coupons.value.filter(c => c.isExpired)
    default:
      return coupons.value
  }
})

// Toast提示
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 个人信息操作
function startEdit() {
  isEditing.value = true
  editForm.value = { ...userInfo.value }
}

function cancelEdit() {
  isEditing.value = false
  editForm.value = { ...userInfo.value }
}

function saveProfile() {
  userInfo.value = { ...editForm.value }
  isEditing.value = false
  showToastMessage(t('userCenter.profileUpdated'), 'success')
}

// 订单操作
function payOrder(order) {
  showToastMessage(t('userCenter.redirectingToPayment'), 'info')
  router.push('/checkout')
}

function confirmReceive(order) {
  if (confirm(t('userCenter.confirmReceiveOrder'))) {
    order.status = 'completed'
    showToastMessage(t('userCenter.orderCompleted'), 'success')
  }
}

function viewOrderDetail(order) {
  showToastMessage(t('userCenter.viewingOrderDetail'), 'info')
}

function reviewOrder(order) {
  showToastMessage(t('userCenter.reviewFeatureComingSoon'), 'info')
}

function cancelOrder(order) {
  if (confirm(t('userCenter.confirmCancelOrder'))) {
    order.status = 'cancelled'
    showToastMessage(t('userCenter.orderCancelled'), 'success')
  }
}

// 地址操作
function editAddress(addr) {
  showToastMessage(t('userCenter.editingAddress'), 'info')
  showAddressModal.value = true
}

function deleteAddress(id) {
  if (confirm(t('userCenter.confirmDeleteAddress'))) {
    const index = addresses.value.findIndex(a => a.id === id)
    if (index > -1) {
      addresses.value.splice(index, 1)
      showToastMessage(t('userCenter.addressDeleted'), 'success')
    }
  }
}

function setDefaultAddress(id) {
  addresses.value.forEach(addr => {
    addr.isDefault = addr.id === id
  })
  showToastMessage(t('userCenter.defaultAddressSet'), 'success')
}

// 优惠券操作
function useCoupon(coupon) {
  router.push('/cart')
  showToastMessage(t('userCenter.couponApplied'), 'success')
}

// 工具函数
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

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
.user-center-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.user-center-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 用户卡片 */
.user-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 30px;
  align-items: center;
  margin-bottom: 30px;
}

.user-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.edit-avatar-btn svg {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.edit-avatar-btn:hover {
  transform: scale(1.1);
}

.user-info {
  flex: 1;
}

.user-info h2 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 8px;
}

.user-email {
  color: #718096;
  margin-bottom: 20px;
}

.user-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
}

/* 标签页 */
.tabs {
  background: white;
  border-radius: 16px;
  padding: 10px;
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #718096;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.tab-icon {
  font-size: 1.3rem;
}

.tab-btn:hover {
  background: #f7fafc;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 标签页内容 */
.tab-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f7fafc;
}

.section-header h3 {
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 700;
}

.edit-btn,
.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn svg {
  width: 18px;
  height: 18px;
}

.edit-btn:hover,
.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 个人信息表单 */
.info-form {
  max-width: 800px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #667eea;
  outline: none;
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f7fafc;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.save-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.cancel-btn {
  flex: 1;
  background: white;
  color: #718096;
  padding: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #cbd5e0;
}

/* 订单列表 */
.order-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  color: #718096;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-btn:hover {
  border-color: #cbd5e0;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.count-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.85rem;
}

.filter-btn.active .count-badge {
  background: rgba(255, 255, 255, 0.3);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 2px solid #f7fafc;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.order-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.order-header {
  background: #f7fafc;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-number {
  font-weight: 700;
  color: #2d3748;
}

.order-date {
  font-size: 0.85rem;
  color: #718096;
}

.order-status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.order-status.pending {
  background: #fed7aa;
  color: #7c2d12;
}

.order-status.paid {
  background: #bfdbfe;
  color: #1e3a8a;
}

.order-status.shipped {
  background: #bfdbfe;
  color: #1e40af;
}

.order-status.completed {
  background: #c6f6d5;
  color: #22543d;
}

.order-status.cancelled {
  background: #fed7d7;
  color: #742a2a;
}

.order-items {
  padding: 20px;
}

.order-item {
  display: flex;
  gap: 15px;
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #f7fafc;
}

.order-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.order-item img {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  color: #2d3748;
  margin-bottom: 5px;
}

.item-details p {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 3px;
}

.quantity {
  font-weight: 600;
}

.item-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
}

.order-footer {
  padding: 15px 20px;
  background: #f7fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total {
  font-size: 1.1rem;
  color: #4a5568;
}

.order-total strong {
  font-size: 1.3rem;
  color: #667eea;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.action-btn:not(.primary):not(.danger) {
  background: white;
  border: 2px solid #e2e8f0;
  color: #718096;
}

.action-btn:not(.primary):not(.danger):hover {
  border-color: #cbd5e0;
}

.action-btn.danger {
  background: white;
  border: 2px solid #fc8181;
  color: #fc8181;
}

.action-btn.danger:hover {
  background: #fc8181;
  color: white;
}

/* 地址管理 */
.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.address-card {
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  position: relative;
  transition: all 0.3s ease;
}

.address-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.address-card.default {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.default-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.address-header h4 {
  color: #2d3748;
  font-size: 1.1rem;
}

.phone {
  color: #718096;
  font-size: 0.9rem;
}

.address-detail {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 20px;
}

.address-actions {
  display: flex;
  gap: 15px;
  padding-top: 15px;
  border-top: 1px solid #f7fafc;
}

.action-link {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-link:hover {
  text-decoration: underline;
}

.action-link.danger {
  color: #fc8181;
}

/* 优惠券 */
.coupons-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.coupon-card {
  display: flex;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.coupon-card:hover:not(.expired):not(.used) {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.coupon-card.expired,
.coupon-card.used {
  opacity: 0.6;
}

.coupon-left {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 150px;
}

.coupon-value {
  display: flex;
  align-items: flex-start;
}

.symbol {
  font-size: 1.5rem;
  margin-top: 5px;
}

.amount {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}

.coupon-condition {
  font-size: 0.85rem;
  opacity: 0.9;
}

.coupon-right {
  flex: 1;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.coupon-title {
  font-size: 1.3rem;
  color: #2d3748;
}

.coupon-desc {
  color: #718096;
  margin-bottom: 10px;
}

.coupon-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.coupon-code {
  background: #f7fafc;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  color: #667eea;
}

.coupon-expiry {
  font-size: 0.85rem;
  color: #718096;
}

.use-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.use-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  align-self: flex-start;
}

.status-badge.used {
  background: #cbd5e0;
  color: #4a5568;
}

.status-badge.expired {
  background: #fed7d7;
  color: #742a2a;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  color: #718096;
  font-size: 1.1rem;
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

.toast.info {
  border-left-color: #4299e1;
  color: #2c5282;
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
  .addresses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .user-center-page {
    padding: 20px 10px;
  }

  .user-card {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }

  .user-stats {
    justify-content: center;
  }

  .tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .tab-btn {
    flex-shrink: 0;
  }

  .tab-content {
    padding: 20px 15px;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .order-filters {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .filter-btn {
    flex-shrink: 0;
  }

  .order-header,
  .order-footer {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .order-actions {
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 100px;
  }

  .addresses-grid {
    grid-template-columns: 1fr;
  }

  .coupon-card {
    flex-direction: column;
  }

  .coupon-left {
    min-width: auto;
    padding: 20px;
  }

  .toast {
    right: 15px;
    bottom: 15px;
    left: 15px;
  }
}
</style>

