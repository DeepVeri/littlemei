<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>{{ t('checkout.title') }}</h1>
        <div class="steps">
          <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <div class="step-number">1</div>
            <div class="step-label">{{ t('checkout.steps.address') }}</div>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <div class="step-number">2</div>
            <div class="step-label">{{ t('checkout.steps.shipping') }}</div>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
            <div class="step-number">3</div>
            <div class="step-label">{{ t('checkout.steps.payment') }}</div>
          </div>
          <div class="step-line"></div>
          <div class="step" :class="{ active: currentStep >= 4 }">
            <div class="step-number">4</div>
            <div class="step-label">{{ t('checkout.steps.confirm') }}</div>
          </div>
        </div>
      </div>

      <div class="checkout-content">
        <!-- 左侧：表单区域 -->
        <div class="checkout-form">
          <!-- 步骤1：收货地址 -->
          <div v-show="currentStep === 1" class="form-section">
            <h2>{{ t('checkout.shippingAddress') }}</h2>
            
            <!-- 已保存的地址 -->
            <div v-if="savedAddresses.length > 0" class="saved-addresses">
              <div 
                v-for="addr in savedAddresses" 
                :key="addr.id"
                class="address-card"
                :class="{ selected: selectedAddress?.id === addr.id }"
                @click="selectAddress(addr)"
              >
                <div class="address-header">
                  <div class="address-name">
                    {{ addr.name }} <span class="phone">{{ addr.phone }}</span>
                  </div>
                  <span v-if="addr.isDefault" class="default-badge">{{ t('checkout.default') }}</span>
                </div>
                <div class="address-detail">
                  {{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.street }}
                </div>
                <div class="address-actions">
                  <button @click.stop="editAddress(addr)" class="edit-btn">{{ t('checkout.edit') }}</button>
                  <button @click.stop="deleteAddress(addr.id)" class="delete-btn">{{ t('checkout.delete') }}</button>
                </div>
              </div>
            </div>

            <!-- 新增地址表单 -->
            <div class="address-form" v-if="showAddressForm">
              <div class="form-row">
                <div class="form-group">
                  <label>{{ t('checkout.receiverName') }} *</label>
                  <input v-model="addressForm.name" type="text" :placeholder="t('checkout.enterName')" required>
                </div>
                <div class="form-group">
                  <label>{{ t('checkout.phone') }} *</label>
                  <input v-model="addressForm.phone" type="tel" :placeholder="t('checkout.enterPhone')" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ t('checkout.province') }} *</label>
                  <select v-model="addressForm.province" required>
                    <option value="">{{ t('checkout.selectProvince') }}</option>
                    <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>{{ t('checkout.city') }} *</label>
                  <select v-model="addressForm.city" required>
                    <option value="">{{ t('checkout.selectCity') }}</option>
                    <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>{{ t('checkout.district') }} *</label>
                  <select v-model="addressForm.district" required>
                    <option value="">{{ t('checkout.selectDistrict') }}</option>
                    <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>{{ t('checkout.detailedAddress') }} *</label>
                <textarea v-model="addressForm.street" :placeholder="t('checkout.enterDetailedAddress')" rows="3" required></textarea>
              </div>

              <div class="form-group checkbox-group">
                <label>
                  <input v-model="addressForm.isDefault" type="checkbox">
                  {{ t('checkout.setAsDefault') }}
                </label>
              </div>

              <div class="form-actions">
                <button @click="saveAddress" class="save-btn">{{ t('checkout.saveAddress') }}</button>
                <button @click="cancelAddressForm" class="cancel-btn">{{ t('checkout.cancel') }}</button>
              </div>
            </div>

            <button v-if="!showAddressForm" @click="showAddressForm = true" class="add-address-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              {{ t('checkout.addNewAddress') }}
            </button>

            <button @click="goToStep(2)" class="next-btn" :disabled="!selectedAddress">
              {{ t('checkout.continue') }}
            </button>
          </div>

          <!-- 步骤2：配送方式 -->
          <div v-show="currentStep === 2" class="form-section">
            <h2>{{ t('checkout.shippingMethod') }}</h2>
            
            <div class="shipping-methods">
              <div 
                v-for="method in shippingMethods" 
                :key="method.id"
                class="shipping-card"
                :class="{ selected: selectedShipping?.id === method.id }"
                @click="selectShipping(method)"
              >
                <div class="shipping-header">
                  <div class="shipping-icon">{{ method.icon }}</div>
                  <div class="shipping-info">
                    <h3>{{ t(`checkout.shipping.${method.name}`) }}</h3>
                    <p>{{ t(`checkout.shipping.${method.name}Desc`) }}</p>
                  </div>
                  <div class="shipping-price">
                    {{ method.price === 0 ? t('cart.free') : `$${method.price.toFixed(2)}` }}
                  </div>
                </div>
                <div class="shipping-time">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {{ method.estimatedDays }} {{ t('checkout.businessDays') }}
                </div>
              </div>
            </div>

            <div class="form-nav">
              <button @click="goToStep(1)" class="back-btn">{{ t('checkout.back') }}</button>
              <button @click="goToStep(3)" class="next-btn" :disabled="!selectedShipping">
                {{ t('checkout.continue') }}
              </button>
            </div>
          </div>

          <!-- 步骤3：支付方式 -->
          <div v-show="currentStep === 3" class="form-section">
            <h2>{{ t('checkout.paymentMethod') }}</h2>
            
            <div class="payment-methods">
              <div 
                v-for="method in paymentMethods" 
                :key="method.id"
                class="payment-card"
                :class="{ selected: selectedPayment?.id === method.id }"
                @click="selectPayment(method)"
              >
                <div class="payment-icon">{{ method.icon }}</div>
                <div class="payment-info">
                  <h3>{{ t(`checkout.payment.${method.name}`) }}</h3>
                  <p>{{ t(`checkout.payment.${method.name}Desc`) }}</p>
                </div>
                <div class="payment-check">
                  <svg v-if="selectedPayment?.id === method.id" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- 信用卡支付表单 -->
            <div v-if="selectedPayment?.id === 'credit'" class="credit-card-form">
              <div class="form-group">
                <label>{{ t('checkout.cardNumber') }} *</label>
                <input v-model="cardForm.number" type="text" placeholder="1234 5678 9012 3456" maxlength="19">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>{{ t('checkout.expiryDate') }} *</label>
                  <input v-model="cardForm.expiry" type="text" placeholder="MM/YY" maxlength="5">
                </div>
                <div class="form-group">
                  <label>{{ t('checkout.cvv') }} *</label>
                  <input v-model="cardForm.cvv" type="text" placeholder="123" maxlength="3">
                </div>
              </div>
              <div class="form-group">
                <label>{{ t('checkout.cardholderName') }} *</label>
                <input v-model="cardForm.name" type="text" :placeholder="t('checkout.enterCardholderName')">
              </div>
            </div>

            <div class="form-nav">
              <button @click="goToStep(2)" class="back-btn">{{ t('checkout.back') }}</button>
              <button @click="goToStep(4)" class="next-btn" :disabled="!selectedPayment || !isPaymentValid">
                {{ t('checkout.continue') }}
              </button>
            </div>
          </div>

          <!-- 步骤4：确认订单 -->
          <div v-show="currentStep === 4" class="form-section">
            <h2>{{ t('checkout.confirmOrder') }}</h2>
            
            <!-- 收货地址确认 -->
            <div class="confirm-section">
              <div class="section-header">
                <h3>{{ t('checkout.shippingAddress') }}</h3>
                <button @click="goToStep(1)" class="edit-link">{{ t('checkout.edit') }}</button>
              </div>
              <div class="address-summary">
                <div class="summary-row">
                  <strong>{{ selectedAddress?.name }}</strong>
                  <span>{{ selectedAddress?.phone }}</span>
                </div>
                <div class="summary-row">
                  {{ selectedAddress?.province }} {{ selectedAddress?.city }} {{ selectedAddress?.district }} {{ selectedAddress?.street }}
                </div>
              </div>
            </div>

            <!-- 配送方式确认 -->
            <div class="confirm-section">
              <div class="section-header">
                <h3>{{ t('checkout.shippingMethod') }}</h3>
                <button @click="goToStep(2)" class="edit-link">{{ t('checkout.edit') }}</button>
              </div>
              <div class="shipping-summary">
                <div class="summary-row">
                  <span>{{ selectedShipping?.icon }} {{ t(`checkout.shipping.${selectedShipping?.name}`) }}</span>
                  <span>{{ selectedShipping?.price === 0 ? t('cart.free') : `$${selectedShipping?.price.toFixed(2)}` }}</span>
                </div>
              </div>
            </div>

            <!-- 支付方式确认 -->
            <div class="confirm-section">
              <div class="section-header">
                <h3>{{ t('checkout.paymentMethod') }}</h3>
                <button @click="goToStep(3)" class="edit-link">{{ t('checkout.edit') }}</button>
              </div>
              <div class="payment-summary">
                <div class="summary-row">
                  <span>{{ selectedPayment?.icon }} {{ t(`checkout.payment.${selectedPayment?.name}`) }}</span>
                </div>
              </div>
            </div>

            <!-- 订单备注 -->
            <div class="confirm-section">
              <h3>{{ t('checkout.orderNotes') }}</h3>
              <textarea v-model="orderNotes" :placeholder="t('checkout.orderNotesPlaceholder')" rows="3"></textarea>
            </div>

            <div class="form-nav">
              <button @click="goToStep(3)" class="back-btn">{{ t('checkout.back') }}</button>
              <button @click="placeOrder" class="place-order-btn" :disabled="isProcessing">
                <span v-if="!isProcessing">{{ t('checkout.placeOrder') }}</span>
                <span v-else>{{ t('checkout.processing') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：订单摘要 -->
        <div class="order-summary">
          <h2>{{ t('checkout.orderSummary') }}</h2>

          <!-- 商品列表 -->
          <div class="summary-items">
            <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
              <img :src="item.image" :alt="item.name">
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <p class="item-specs">
                  <span v-if="item.selectedColor">{{ item.selectedColor }}</span>
                  <span v-if="item.selectedSize">{{ item.selectedSize }}</span>
                  <span>× {{ item.quantity }}</span>
                </p>
              </div>
              <div class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>

          <!-- 价格明细 -->
          <div class="summary-prices">
            <div class="price-row">
              <span>{{ t('cart.subtotal') }}</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="price-row">
              <span>{{ t('cart.shipping') }}</span>
              <span>{{ shippingFee === 0 ? t('cart.free') : `$${shippingFee.toFixed(2)}` }}</span>
            </div>
            <div class="price-row">
              <span>{{ t('checkout.tax') }}</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="price-row total">
              <span>{{ t('cart.total') }}</span>
              <span class="total-price">${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- 安全保障 -->
          <div class="security-info">
            <div class="security-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
              </svg>
              <span>{{ t('checkout.secureCheckout') }}</span>
            </div>
            <div class="security-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>{{ t('checkout.moneyBackGuarantee') }}</span>
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

// 当前步骤
const currentStep = ref(1)

// 收货地址相关
const selectedAddress = ref(null)
const showAddressForm = ref(false)
const savedAddresses = ref([
  {
    id: 1,
    name: 'Zhang San',
    phone: '138-0000-0000',
    province: 'Beijing',
    city: 'Beijing',
    district: 'Chaoyang District',
    street: 'No. 123 Wangjing Street',
    isDefault: true
  }
])

const addressForm = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  street: '',
  isDefault: false
})

const provinces = ['Beijing', 'Shanghai', 'Guangdong', 'Zhejiang', 'Jiangsu']
const cities = computed(() => {
  // 简化示例，实际应该根据省份动态获取
  return ['Beijing', 'Shanghai', 'Guangzhou', 'Hangzhou', 'Nanjing']
})
const districts = computed(() => {
  // 简化示例，实际应该根据城市动态获取
  return ['Chaoyang District', 'Haidian District', 'Xicheng District']
})

// 配送方式
const selectedShipping = ref(null)
const shippingMethods = [
  { id: 'standard', name: 'standard', icon: '📦', price: 5.99, estimatedDays: '5-7' },
  { id: 'express', name: 'express', icon: '🚀', price: 12.99, estimatedDays: '2-3' },
  { id: 'overnight', name: 'overnight', icon: '⚡', price: 24.99, estimatedDays: '1' }
]

// 支付方式
const selectedPayment = ref(null)
const paymentMethods = [
  { id: 'credit', name: 'creditCard', icon: '💳' },
  { id: 'paypal', name: 'paypal', icon: '🅿️' },
  { id: 'alipay', name: 'alipay', icon: '💰' },
  { id: 'wechat', name: 'wechatPay', icon: '💚' }
]

const cardForm = ref({
  number: '',
  expiry: '',
  cvv: '',
  name: ''
})

const isPaymentValid = computed(() => {
  if (selectedPayment.value?.id === 'credit') {
    return cardForm.value.number && cardForm.value.expiry && cardForm.value.cvv && cardForm.value.name
  }
  return true
})

// 订单备注
const orderNotes = ref('')

// 处理中状态
const isProcessing = ref(false)

// 价格计算
const subtotal = computed(() => {
  return cartStore.items.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const shippingFee = computed(() => {
  return selectedShipping.value?.price || 0
})

const tax = computed(() => {
  return subtotal.value * 0.1 // 10% 税率
})

const total = computed(() => {
  return subtotal.value + shippingFee.value + tax.value
})

// 地址操作
function selectAddress(addr) {
  selectedAddress.value = addr
}

function editAddress(addr) {
  addressForm.value = { ...addr }
  showAddressForm.value = true
}

function deleteAddress(id) {
  if (confirm(t('checkout.confirmDeleteAddress'))) {
    savedAddresses.value = savedAddresses.value.filter(addr => addr.id !== id)
    if (selectedAddress.value?.id === id) {
      selectedAddress.value = null
    }
  }
}

function saveAddress() {
  if (!addressForm.value.name || !addressForm.value.phone || !addressForm.value.street) {
    alert(t('checkout.fillRequired'))
    return
  }

  const newAddress = {
    id: Date.now(),
    ...addressForm.value
  }

  if (addressForm.value.id) {
    // 编辑现有地址
    const index = savedAddresses.value.findIndex(addr => addr.id === addressForm.value.id)
    if (index > -1) {
      savedAddresses.value[index] = newAddress
    }
  } else {
    // 添加新地址
    savedAddresses.value.push(newAddress)
  }

  if (newAddress.isDefault) {
    savedAddresses.value.forEach(addr => {
      if (addr.id !== newAddress.id) {
        addr.isDefault = false
      }
    })
  }

  selectedAddress.value = newAddress
  cancelAddressForm()
}

function cancelAddressForm() {
  showAddressForm.value = false
  addressForm.value = {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    street: '',
    isDefault: false
  }
}

// 配送方式操作
function selectShipping(method) {
  selectedShipping.value = method
}

// 支付方式操作
function selectPayment(method) {
  selectedPayment.value = method
}

// 步骤导航
function goToStep(step) {
  currentStep.value = step
  window.scrollTo(0, 0)
}

// 提交订单
async function placeOrder() {
  isProcessing.value = true

  // 模拟订单提交
  setTimeout(() => {
    isProcessing.value = false
    alert(t('checkout.orderSuccess'))
    cartStore.clearCart()
    router.push('/')
  }, 2000)
}

// 初始化：如果有默认地址，自动选中
if (savedAddresses.value.length > 0) {
  const defaultAddr = savedAddresses.value.find(addr => addr.isDefault)
  selectedAddress.value = defaultAddr || savedAddresses.value[0]
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.checkout-container {
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
  margin-bottom: 30px;
  font-weight: 700;
}

/* 步骤指示器 */
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  max-width: 800px;
  margin: 0 auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.step.completed .step-number {
  background: #48bb78;
  color: white;
}

.step-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 600;
}

.step.active .step-label {
  color: #667eea;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: 0 10px;
  align-self: flex-start;
  margin-top: 25px;
}

/* 主内容区 */
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
}

/* 表单区域 */
.checkout-form {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.form-section h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 25px;
  font-weight: 700;
}

/* 已保存的地址 */
.saved-addresses {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.address-card {
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.address-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.address-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.address-name {
  font-weight: 700;
  color: #2d3748;
  font-size: 1.1rem;
}

.phone {
  color: #718096;
  font-weight: 400;
  margin-left: 10px;
}

.default-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.address-detail {
  color: #718096;
  margin-bottom: 15px;
  line-height: 1.6;
}

.address-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #f7fafc;
  color: #667eea;
  border: 1px solid #e2e8f0;
}

.edit-btn:hover {
  background: #667eea;
  color: white;
}

.delete-btn {
  background: #fed7d7;
  color: #fc8181;
  border: 1px solid #feb2b2;
}

.delete-btn:hover {
  background: #fc8181;
  color: white;
}

/* 地址表单 */
.address-form {
  background: #f7fafc;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
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
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
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
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #cbd5e0;
}

.add-address-btn {
  width: 100%;
  background: white;
  color: #667eea;
  padding: 14px;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.add-address-btn svg {
  width: 20px;
  height: 20px;
}

.add-address-btn:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

/* 配送方式 */
.shipping-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.shipping-card {
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.shipping-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.shipping-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.shipping-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.shipping-icon {
  font-size: 2rem;
}

.shipping-info {
  flex: 1;
}

.shipping-info h3 {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 5px;
}

.shipping-info p {
  color: #718096;
  font-size: 0.9rem;
}

.shipping-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
}

.shipping-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  font-size: 0.9rem;
}

.shipping-time svg {
  width: 16px;
  height: 16px;
}

/* 支付方式 */
.payment-methods {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.payment-card {
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
}

.payment-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.payment-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.payment-icon {
  font-size: 2rem;
}

.payment-info {
  flex: 1;
}

.payment-info h3 {
  font-size: 1rem;
  color: #2d3748;
  margin-bottom: 4px;
}

.payment-info p {
  color: #718096;
  font-size: 0.85rem;
}

.payment-check {
  width: 24px;
  height: 24px;
}

.payment-check svg {
  width: 24px;
  height: 24px;
  color: #667eea;
}

.credit-card-form {
  background: #f7fafc;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
}

/* 确认订单 */
.confirm-section {
  background: #f7fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 700;
}

.edit-link {
  background: none;
  color: #667eea;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.edit-link:hover {
  background: rgba(102, 126, 234, 0.1);
}

.address-summary,
.shipping-summary,
.payment-summary {
  color: #4a5568;
  line-height: 1.8;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* 表单导航 */
.form-nav {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.back-btn {
  flex: 1;
  background: white;
  color: #718096;
  padding: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-btn:hover {
  border-color: #cbd5e0;
}

.next-btn {
  flex: 2;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.next-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.next-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.place-order-btn {
  flex: 2;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.place-order-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(72, 187, 120, 0.4);
}

.place-order-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.order-summary h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 20px;
  font-weight: 700;
}

.summary-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px;
}

.summary-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f7fafc;
}

.summary-item img {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 0.95rem;
  color: #2d3748;
  margin-bottom: 5px;
}

.item-specs {
  font-size: 0.85rem;
  color: #718096;
  display: flex;
  gap: 8px;
}

.item-price {
  font-weight: 700;
  color: #2d3748;
  font-size: 1rem;
}

.summary-prices {
  padding: 20px 0;
  border-top: 2px solid #f7fafc;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #4a5568;
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

.security-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f7fafc;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #718096;
  font-size: 0.9rem;
}

.security-item svg {
  width: 20px;
  height: 20px;
  color: #48bb78;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }

  .steps {
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 20px 10px;
  }

  .checkout-form {
    padding: 20px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .payment-methods {
    grid-template-columns: 1fr;
  }

  .form-nav {
    flex-direction: column;
  }

  .back-btn,
  .next-btn {
    flex: 1;
  }
}
</style>

