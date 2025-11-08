import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProductList from '../views/ProductList.vue'
import Outfits from '../views/Outfits.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import Wishlist from '../views/Wishlist.vue'
import UserCenter from '../views/UserCenter.vue'
import AITryOn from '../views/AITryOn.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/outfits',
    name: 'Outfits',
    component: Outfits
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/category/:category',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: Wishlist
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: UserCenter
  },
  {
    path: '/ai-tryon',
    name: 'AITryOn',
    component: AITryOn
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 路由切换时滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（比如浏览器前进/后退），则返回保存的位置
    if (savedPosition) {
      return savedPosition
    } else {
      // 否则滚动到顶部
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router

