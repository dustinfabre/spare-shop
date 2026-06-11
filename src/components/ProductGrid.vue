<script setup lang="ts">
import { useProductsStore } from '@/stores/products'
import ProductCard from './ProductCard.vue'

const store = useProductsStore()

function goToPage(page: number) {
  store.search(store.query, page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- Loading skeletons -->
  <div v-if="store.loading" class="grid">
    <div v-for="n in 12" :key="n" class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-body">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line medium"></div>
      </div>
    </div>
  </div>

  <!-- Error -->
  <div v-else-if="store.error" class="state-message">
    <p class="state-title">Something went wrong</p>
    <p class="state-sub">{{ store.error }}</p>
  </div>

  <!-- Empty search state (query entered but no results) -->
  <div v-else-if="store.query && !store.hasResults" class="state-message">
    <p class="state-title">No results for "{{ store.query }}"</p>
    <p class="state-sub">Try a different keyword or check the spelling.</p>
  </div>

  <!-- Landing state (no query yet) -->
  <div v-else-if="!store.query" class="state-message">
    <p class="state-title">Search for spare parts</p>
    <p class="state-sub">
      Type a keyword above — article name, part number, or appliance brand.
    </p>
  </div>

  <!-- Results -->
  <template v-else>
    <p class="results-meta">
      {{ store.totalHits.toLocaleString() }} result{{ store.totalHits !== 1 ? 's' : '' }}
      for "{{ store.query }}"
    </p>

    <div class="grid">
      <ProductCard
        v-for="article in store.results"
        :key="article.artikelnummer"
        :article="article"
      />
    </div>

    <!-- Pagination -->
    <div v-if="store.totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="store.currentPage <= 1"
        @click="goToPage(store.currentPage - 1)"
      >
        Previous
      </button>
      <span class="page-info">Page {{ store.currentPage }} of {{ store.totalPages }}</span>
      <button
        class="page-btn"
        :disabled="store.currentPage >= store.totalPages"
        @click="goToPage(store.currentPage + 1)"
      >
        Next
      </button>
    </div>
  </template>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

/* ── Skeletons ── */
.skeleton-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.skeleton-image {
  height: 200px;
  background: #ebebeb;
  animation: pulse 1.4s ease-in-out infinite;
}

.skeleton-body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  border-radius: 3px;
  background: #ebebeb;
  animation: pulse 1.4s ease-in-out infinite;
  width: 100%;
}

.skeleton-line.short {
  width: 40%;
}

.skeleton-line.medium {
  width: 60%;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

/* ── State messages ── */
.state-message {
  padding: 64px 0;
  text-align: center;
}

.state-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px;
}

.state-sub {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

/* ── Results meta ── */
.results-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 16px;
}

/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-bottom: 32px;
}

.page-btn {
  height: 36px;
  padding: 0 18px;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 500;
  color: var(--accent);
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--accent);
  background: #f0f5ff;
}

.page-btn:disabled {
  color: var(--text-muted);
  cursor: default;
}

.page-info {
  font-size: 0.875rem;
  color: var(--text-muted);
}
</style>
