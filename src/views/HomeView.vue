<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import ProductGrid from '@/components/ProductGrid.vue'
import { useProductsStore } from '@/stores/products'

const TEST_ARTICLE_IDS = ['G928991', 'G652278', 'Q509827', 'D127993', 'G957410', 'M960292', 'H269984', 'G480', 'F189687', 'F334663']

const route = useRoute()
const store = useProductsStore()

// Trigger search whenever the URL query param changes (including on first load)
watch(
  () => route.query.q as string | undefined,
  (q) => {
    const page = route.query.page ? Number(route.query.page) : 1
    if (q) {
      store.search(q, page)
    } else {
      store.clearResults()
    }
  },
  { immediate: true },
)
</script>

<template>
  <AppHeader />

  <main class="main">
    <div class="container">
      <div class="search-section">
        <SearchBar />
      </div>
      <ProductGrid />

      <!-- Test articles — viewable product detail pages -->
      <div class="test-articles">
        <p class="test-articles-label">Viewable test articles</p>
        <div class="test-articles-grid">
          <RouterLink
            v-for="id in TEST_ARTICLE_IDS"
            :key="id"
            :to="`/product/${id}`"
            class="test-article-chip"
          >
            {{ id }}
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  min-height: calc(100vh - 56px);
  background: var(--bg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.search-section {
  margin-bottom: 28px;
  display: flex;
  align-items: center;
}

.test-articles {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.test-articles-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 0 0 12px;
}

.test-articles-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.test-article-chip {
  display: inline-block;
  padding: 5px 12px;
  font-size: 0.8rem;
  font-family: monospace;
  color: var(--accent);
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 4px;
  text-decoration: none;
}

.test-article-chip:hover {
  border-color: var(--accent);
  background: #f0f5ff;
}
</style>
.main {
  min-height: calc(100vh - 56px);
  background: var(--bg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.search-section {
  margin-bottom: 28px;
  display: flex;
  align-items: center;
}
</style>
