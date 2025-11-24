<template>
  <div class="ai-tryon-page">
    <div class="tryon-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>{{ t('aiTryOn.title') }}</h1>
        <p class="subtitle">{{ t('aiTryOn.subtitle') }}</p>
      </div>

      <!-- 功能介绍 -->
      <div class="features-banner">
        <div class="feature-item">
          <div class="feature-icon">📸</div>
          <h3>{{ t('aiTryOn.features.upload') }}</h3>
          <p>{{ t('aiTryOn.features.uploadDesc') }}</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">✨</div>
          <h3>{{ t('aiTryOn.features.ai') }}</h3>
          <p>{{ t('aiTryOn.features.aiDesc') }}</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💾</div>
          <h3>{{ t('aiTryOn.features.save') }}</h3>
          <p>{{ t('aiTryOn.features.saveDesc') }}</p>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="tryon-content">
        <!-- 左侧：上传和选择 -->
        <div class="upload-section">
          <div class="section-card">
            <h2>{{ t('aiTryOn.step1') }}</h2>
            
            <!-- 上传用户照片 -->
            <div class="upload-area" @click="triggerFileUpload">
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                @change="handleImageUpload"
                style="display: none"
              >
              
              <div v-if="!userPhoto" class="upload-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p>{{ t('aiTryOn.uploadPhoto') }}</p>
                <span>{{ t('aiTryOn.uploadTip') }}</span>
              </div>

              <div v-else class="uploaded-image">
                <img :src="userPhoto" alt="User Photo">
                <button @click.stop="removeUserPhoto" class="remove-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 照片要求提示 -->
            <div class="photo-tips">
              <h4>{{ t('aiTryOn.photoRequirements') }}</h4>
              <ul>
                <li>{{ t('aiTryOn.tip1') }}</li>
                <li>{{ t('aiTryOn.tip2') }}</li>
                <li>{{ t('aiTryOn.tip3') }}</li>
                <li>{{ t('aiTryOn.tip4') }}</li>
              </ul>
            </div>
          </div>

          <!-- 选择商品 -->
          <div class="section-card">
            <h2>{{ t('aiTryOn.step2') }}</h2>
            
            <div v-if="!selectedProduct" class="product-selector">
              <p>{{ t('aiTryOn.selectProductPrompt') }}</p>
              <button @click="showProductModal = true" class="select-product-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                {{ t('aiTryOn.browseProducts') }}
              </button>
            </div>

            <div v-else class="selected-product-card">
              <img :src="selectedProduct.image" :alt="selectedProduct.name">
              <div class="product-info">
                <h3>{{ selectedProduct.name }}</h3>
                <p class="product-price">${{ selectedProduct.price }}</p>
              </div>
              <button @click="changeProduct" class="change-btn">{{ t('aiTryOn.change') }}</button>
            </div>
          </div>

          <!-- 开始试穿按钮 -->
          <button 
            @click="startTryOn" 
            class="start-tryon-btn"
            :disabled="!userPhoto || !selectedProduct || isProcessing"
          >
            <span v-if="!isProcessing">{{ t('aiTryOn.startTryOn') }}</span>
            <span v-else>{{ t('aiTryOn.processing') }}</span>
          </button>
        </div>

        <!-- 右侧：试穿结果 -->
        <div class="result-section">
          <div class="section-card result-card">
            <h2>{{ t('aiTryOn.tryOnResult') }}</h2>
            
            <!-- 未开始试穿 -->
            <div v-if="!tryOnResult && !isProcessing" class="result-placeholder">
              <div class="placeholder-icon">🎨</div>
              <p>{{ t('aiTryOn.resultPlaceholder') }}</p>
            </div>

            <!-- 处理中 -->
            <div v-if="isProcessing" class="processing-state">
              <div class="loading-spinner"></div>
              <p>{{ t('aiTryOn.aiProcessing') }}</p>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
              <span class="progress-text">{{ progress }}%</span>
            </div>

            <!-- 试穿结果 -->
            <div v-if="tryOnResult && !isProcessing" class="result-display">
              <img :src="tryOnResult" alt="Try-on Result">
              
              <div class="result-actions">
                <button @click="downloadResult" class="action-btn download-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  {{ t('aiTryOn.download') }}
                </button>

                <button @click="saveToGallery" class="action-btn save-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  {{ t('aiTryOn.saveToGallery') }}
                </button>

                <button @click="shareResult" class="action-btn share-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  {{ t('aiTryOn.share') }}
                </button>

                <button @click="tryAgain" class="action-btn retry-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  {{ t('aiTryOn.tryAgain') }}
                </button>
              </div>
            </div>
          </div>

          <!-- 我的试穿照片库 -->
          <div v-if="savedPhotos.length > 0" class="section-card gallery-card">
            <h2>{{ t('aiTryOn.myGallery') }}</h2>
            <div class="photo-gallery">
              <div v-for="(photo, index) in savedPhotos" :key="index" class="gallery-item">
                <img :src="photo.image" :alt="`Try-on ${index + 1}`">
                <div class="gallery-overlay">
                  <button @click="viewPhoto(photo)" class="overlay-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button @click="deletePhoto(index)" class="overlay-btn delete">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
                <p class="gallery-date">{{ formatDate(photo.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品选择模态框 -->
      <Transition name="modal">
        <div v-if="showProductModal" class="modal-overlay" @click="showProductModal = false">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2>{{ t('aiTryOn.selectProduct') }}</h2>
              <button @click="showProductModal = false" class="close-modal">×</button>
            </div>
            <div class="products-grid">
              <div 
                v-for="product in availableProducts" 
                :key="product.id"
                class="product-card"
                @click="selectProduct(product)"
              >
                <img :src="product.image" :alt="product.name">
                <h4>{{ product.name }}</h4>
                <p class="price">${{ product.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
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
import { useProductsStore } from '../stores/products'

const router = useRouter()
const { t } = useI18n()
const productsStore = useProductsStore()

// 文件上传
const fileInput = ref(null)
const userPhoto = ref(null)

// 选择的商品
const selectedProduct = ref(null)
const showProductModal = ref(false)

// 试穿结果
const tryOnResult = ref(null)
const isProcessing = ref(false)
const progress = ref(0)

// 保存的照片
const savedPhotos = ref([])

// Toast提示
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 可用商品
const availableProducts = computed(() => {
  return productsStore.products.slice(0, 12)
})

// 触发文件上传
function triggerFileUpload() {
  fileInput.value.click()
}

// 处理图片上传
function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    showToastMessage(t('aiTryOn.invalidFileType'), 'error')
    return
  }

  // 验证文件大小（最大10MB）
  if (file.size > 10 * 1024 * 1024) {
    showToastMessage(t('aiTryOn.fileTooLarge'), 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    userPhoto.value = e.target.result
    showToastMessage(t('aiTryOn.photoUploaded'), 'success')
  }
  reader.readAsDataURL(file)
}

// 移除用户照片
function removeUserPhoto() {
  userPhoto.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 选择商品
function selectProduct(product) {
  selectedProduct.value = product
  showProductModal.value = false
  showToastMessage(t('aiTryOn.productSelected'), 'success')
}

// 更换商品
function changeProduct() {
  showProductModal.value = true
}

// 开始试穿
async function startTryOn() {
  if (!userPhoto.value || !selectedProduct.value) {
    showToastMessage(t('aiTryOn.completeSteps'), 'warning')
    return
  }

  isProcessing.value = true
  progress.value = 0

  // 模拟AI处理进度
  const interval = setInterval(() => {
    progress.value += 5
    if (progress.value >= 100) {
      clearInterval(interval)
      completeProcessing()
    }
  }, 200)
}

// 完成处理
function completeProcessing() {
  // 这里应该是实际的AI处理结果
  // 目前使用用户上传的照片作为模拟结果
  tryOnResult.value = userPhoto.value
  isProcessing.value = false
  showToastMessage(t('aiTryOn.tryOnComplete'), 'success')
}

// 下载结果
function downloadResult() {
  if (!tryOnResult.value) return

  const link = document.createElement('a')
  link.href = tryOnResult.value
  link.download = `tryon-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  showToastMessage(t('aiTryOn.downloadSuccess'), 'success')
}

// 保存到相册
function saveToGallery() {
  if (!tryOnResult.value) return

  savedPhotos.value.unshift({
    image: tryOnResult.value,
    product: selectedProduct.value,
    date: new Date().toISOString()
  })

  showToastMessage(t('aiTryOn.savedToGallery'), 'success')
}

// 分享结果
function shareResult() {
  showToastMessage(t('aiTryOn.shareFeatureComingSoon'), 'info')
}

// 重新试穿
function tryAgain() {
  tryOnResult.value = null
  progress.value = 0
}

// 查看照片
function viewPhoto(photo) {
  tryOnResult.value = photo.image
  selectedProduct.value = photo.product
}

// 删除照片
function deletePhoto(index) {
  if (confirm(t('aiTryOn.confirmDelete'))) {
    savedPhotos.value.splice(index, 1)
    showToastMessage(t('aiTryOn.photoDeleted'), 'success')
  }
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
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
.ai-tryon-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.tryon-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面标题 */
.page-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* 功能介绍 */
.features-banner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 50px;
}

.feature-item {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  color: white;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.feature-item h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.feature-item p {
  opacity: 0.9;
  line-height: 1.6;
}

/* 主内容区 */
.tryon-content {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 30px;
  align-items: start;
}

.section-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.section-card h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 20px;
  font-weight: 700;
}

/* 上传区域 */
.upload-area {
  border: 3px dashed #cbd5e0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f7fafc;
}

.upload-placeholder svg {
  width: 60px;
  height: 60px;
  color: #cbd5e0;
  margin-bottom: 20px;
}

.upload-placeholder p {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
}

.upload-placeholder span {
  color: #718096;
  font-size: 0.9rem;
}

.uploaded-image {
  position: relative;
  width: 100%;
}

.uploaded-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  background: rgba(252, 129, 129, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn svg {
  width: 20px;
  height: 20px;
  color: white;
}

.remove-btn:hover {
  background: #fc8181;
  transform: scale(1.1);
}

/* 照片要求 */
.photo-tips {
  margin-top: 20px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
}

.photo-tips h4 {
  color: #2d3748;
  margin-bottom: 15px;
  font-size: 1rem;
}

.photo-tips ul {
  list-style: none;
  padding: 0;
}

.photo-tips li {
  padding: 8px 0;
  color: #4a5568;
  font-size: 0.9rem;
  padding-left: 25px;
  position: relative;
}

.photo-tips li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #48bb78;
  font-weight: 700;
}

/* 商品选择器 */
.product-selector {
  text-align: center;
  padding: 40px;
}

.product-selector p {
  color: #718096;
  margin-bottom: 20px;
}

.select-product-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 32px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.select-product-btn svg {
  width: 20px;
  height: 20px;
}

.select-product-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.selected-product-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
}

.selected-product-card img {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  color: #2d3748;
  margin-bottom: 8px;
}

.product-price {
  color: #667eea;
  font-size: 1.3rem;
  font-weight: 700;
}

.change-btn {
  background: #f7fafc;
  color: #667eea;
  padding: 8px 20px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-btn:hover {
  border-color: #667eea;
  background: white;
}

/* 开始试穿按钮 */
.start-tryon-btn {
  width: 100%;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 18px;
  border-radius: 12px;
  border: none;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-tryon-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(72, 187, 120, 0.4);
}

.start-tryon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 结果区域 */
.result-card {
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.result-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.placeholder-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.result-placeholder p {
  color: #718096;
  font-size: 1.1rem;
}

/* 处理中状态 */
.processing-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 6px solid #f7fafc;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 30px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.processing-state p {
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 30px;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  max-width: 400px;
  height: 10px;
  background: #f7fafc;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
  border-radius: 10px;
}

.progress-text {
  color: #667eea;
  font-weight: 700;
  font-size: 1.1rem;
}

/* 结果显示 */
.result-display img {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 25px;
}

.result-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.action-btn {
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.download-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.save-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
}

.share-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
}

.retry-btn {
  background: #f7fafc;
  color: #718096;
  border: 2px solid #e2e8f0;
}

.retry-btn:hover {
  border-color: #cbd5e0;
}

/* 照片库 */
.gallery-card {
  max-height: 400px;
  overflow-y: auto;
}

.photo-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 3/4;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.overlay-btn svg {
  width: 20px;
  height: 20px;
  color: #2d3748;
}

.overlay-btn:hover {
  transform: scale(1.1);
}

.overlay-btn.delete {
  background: #fc8181;
}

.overlay-btn.delete svg {
  color: white;
}

.gallery-date {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 40px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.modal-header h2 {
  font-size: 1.8rem;
  color: #2d3748;
}

.close-modal {
  width: 40px;
  height: 40px;
  background: #f7fafc;
  border: none;
  border-radius: 50%;
  font-size: 2rem;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-modal:hover {
  background: #e2e8f0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.product-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.product-card h4 {
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 1rem;
}

.product-card .price {
  color: #667eea;
  font-weight: 700;
  font-size: 1.2rem;
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
  z-index: 2000;
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

.toast.info {
  border-left-color: #4299e1;
  color: #2c5282;
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

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .tryon-content {
    grid-template-columns: 1fr;
  }

  .features-banner {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .ai-tryon-page {
    padding: 20px 10px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .section-card {
    padding: 20px;
  }

  .uploaded-image img {
    height: 300px;
  }

  .result-actions {
    grid-template-columns: 1fr;
  }

  .photo-gallery {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-content {
    padding: 20px;
  }

  .toast {
    right: 15px;
    bottom: 15px;
    left: 15px;
  }
}
</style>

