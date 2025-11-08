import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const wishlist = ref([])

  const cartCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const wishlistCount = computed(() => wishlist.value.length)

  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  function addToCart(product) {
    // 检查是否已存在相同商品（包括颜色和尺寸）
    const existingItem = items.value.find(item => 
      item.id === product.id && 
      item.selectedColor === product.selectedColor && 
      item.selectedSize === product.selectedSize
    )
    
    if (existingItem) {
      existingItem.quantity += (product.quantity || 1)
    } else {
      items.value.push({ 
        ...product, 
        quantity: product.quantity || 1,
        // 确保有默认的stock值
        stock: product.stock || 99
      })
    }
  }

  function removeFromCart(productId, selectedColor, selectedSize) {
    const index = items.value.findIndex(item => {
      if (selectedColor && selectedSize) {
        return item.id === productId && 
               item.selectedColor === selectedColor && 
               item.selectedSize === selectedSize
      }
      return item.id === productId
    })
    
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId, quantity, selectedColor, selectedSize) {
    const item = items.value.find(item => {
      if (selectedColor && selectedSize) {
        return item.id === productId && 
               item.selectedColor === selectedColor && 
               item.selectedSize === selectedSize
      }
      return item.id === productId
    })
    
    if (item) {
      item.quantity = quantity
      if (quantity <= 0) {
        removeFromCart(productId, selectedColor, selectedSize)
      }
    }
  }

  function toggleWishlist(product) {
    const index = wishlist.value.findIndex(item => item.id === product.id)
    if (index > -1) {
      wishlist.value.splice(index, 1)
      return false
    } else {
      wishlist.value.push(product)
      return true
    }
  }

  function isInWishlist(productId) {
    return wishlist.value.some(item => item.id === productId)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    wishlist,
    cartCount,
    wishlistCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    isInWishlist,
    clearCart
  }
})

