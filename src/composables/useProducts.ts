import { ref, computed } from 'vue'
import { getProducts, getCategories, type Product } from '../services/productService'

export function useProducts() {
  const products = ref<Product[]>([])
  const categories = ref<string[]>([])
  const selectedCategory = ref('all')
  const search = ref('')
  const loading = ref(true)

  const filteredProducts = computed(() => {
    let result = products.value

    if (selectedCategory.value !== 'all') {
      result = result.filter(p => p.category === selectedCategory.value)
    }

    if (search.value.trim()) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(search.value.toLowerCase())
      )
    }

    return result
  })

  async function loadProducts() {
    const [prods, cats] = await Promise.all([getProducts(), getCategories()])
    products.value = prods
    categories.value = cats
    loading.value = false
  }

  return {
    products,
    categories,
    selectedCategory,
    search,
    loading,
    filteredProducts,
    loadProducts
  }
}