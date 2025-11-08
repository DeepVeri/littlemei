import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  const products = ref([
    {
      id: 1,
      name: 'Oversized Denim Jacket',
      price: 89.99,
      category: 'coats',
      description: 'Classic oversized denim jacket with vintage wash',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Black', 'Light Blue'],
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
      rating: 4.5,
      reviews: 128,
      isNew: true,
      isVerified: true
    },
    {
      id: 2,
      name: 'Cream Bomber Jacket',
      price: 79.99,
      category: 'coats',
      description: 'Soft cream bomber with ribbed cuffs',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Cream', 'Pink', 'Beige'],
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',
      rating: 4.8,
      reviews: 95,
      isNew: true
    },
    {
      id: 3,
      name: 'Tie-Dye Zip Hoodie',
      price: 65.99,
      category: 'tops',
      description: 'Vibrant tie-dye hoodie with full zip',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Multi', 'Pink Multi', 'Blue Multi'],
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
      rating: 4.6,
      reviews: 203,
      isNew: false
    },
    {
      id: 4,
      name: 'White Cropped Blazer',
      price: 95.99,
      category: 'coats',
      description: 'Tailored white blazer with cropped silhouette',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['White', 'Black', 'Beige'],
      image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=500&fit=crop',
      rating: 4.7,
      reviews: 167,
      isNew: false,
      isVerified: true
    },
    {
      id: 5,
      name: 'Black Puffer Coat',
      price: 129.99,
      category: 'coats',
      description: 'Warm black puffer coat for winter',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Burgundy'],
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop',
      rating: 4.9,
      reviews: 312,
      isNew: false,
      isVerified: true
    },
    {
      id: 6,
      name: 'Pink Faux Fur Coat',
      price: 149.99,
      category: 'coats',
      description: 'Luxurious pink faux fur statement coat',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Pink', 'White', 'Lavender'],
      image: 'https://images.unsplash.com/photo-1548624313-7d5c5ad36c52?w=400&h=500&fit=crop',
      rating: 4.8,
      reviews: 241,
      isNew: true,
      isVerified: true
    },
    {
      id: 7,
      name: 'Ribbed Knit Sweater',
      price: 55.99,
      category: 'knitwear',
      description: 'Cozy ribbed knit in soft yarn',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Beige', 'Black', 'Gray', 'Pink'],
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop',
      rating: 4.7,
      reviews: 189,
      isNew: false
    },
    {
      id: 8,
      name: 'Floral Midi Dress',
      price: 89.99,
      category: 'dresses',
      description: 'Romantic floral print midi dress',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Floral Blue', 'Floral Pink', 'Floral Yellow'],
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
      rating: 4.6,
      reviews: 276,
      isNew: true,
      isVerified: true
    }
  ])

  const categories = ref([
    { id: 'coats', name: 'COATS', count: 245 },
    { id: 'tops', name: 'TOPS', count: 389 },
    { id: 'knitwear', name: 'KNITWEAR', count: 156 },
    { id: 'dresses', name: 'DRESSES', count: 298 },
    { id: 'jeans', name: 'JEANS', count: 178 },
    { id: 'shoes', name: 'SHOES', count: 412 }
  ])

  const getProductsByCategory = computed(() => {
    return (categoryId) => {
      if (!categoryId || categoryId === 'all') {
        return products.value
      }
      if (categoryId === 'new') {
        return products.value.filter(p => p.isNew)
      }
      if (categoryId === 'verified') {
        return products.value.filter(p => p.isVerified)
      }
      return products.value.filter(p => p.category === categoryId)
    }
  })

  const getProductById = computed(() => {
    return (id) => products.value.find(p => p.id === parseInt(id))
  })

  const newProducts = computed(() => {
    return products.value.filter(p => p.isNew)
  })

  const verifiedProducts = computed(() => {
    return products.value.filter(p => p.isVerified)
  })

  return {
    products,
    categories,
    getProductsByCategory,
    getProductById,
    newProducts,
    verifiedProducts
  }
})

