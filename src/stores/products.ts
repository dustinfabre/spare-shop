import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { searchArticles } from '@/services/eed'
import type { EEDArticle } from '@/services/eed'

export const useProductsStore = defineStore('products', () => {
  const results = ref<EEDArticle[]>([])
  const query = ref('')
  const currentPage = ref(1)
  const totalHits = ref(0)
  const totalPages = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const hasResults = computed(() => results.value.length > 0)

  async function search(q: string, page = 1) {
    if (!q.trim()) {
      clearResults()
      return
    }

    loading.value = true
    error.value = null
    query.value = q
    currentPage.value = page

    try {
      const data = await searchArticles(q, page)
      results.value = data.treffer ? Object.values(data.treffer) : []
      totalHits.value = Number(data.gesamtanzahltreffer)
      totalPages.value = Number(data.anzahlseiten)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Search failed'
      results.value = []
    } finally {
      loading.value = false
    }
  }

  function clearResults() {
    results.value = []
    query.value = ''
    currentPage.value = 1
    totalHits.value = 0
    totalPages.value = 0
    error.value = null
  }

  return {
    results,
    query,
    currentPage,
    totalHits,
    totalPages,
    loading,
    error,
    hasResults,
    search,
    clearResults,
  }
})
