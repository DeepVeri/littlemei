import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProductList from '../views/ProductList.vue'
import Outfits from '../views/Outfits.vue'

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
    path: '/category/:category',
    name: 'ProductList',
    component: ProductList
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

