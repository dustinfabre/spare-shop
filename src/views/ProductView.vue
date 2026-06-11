<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { getArticleDetail, getImageUrl } from '@/services/eed'
import type { EEDDetailResponse } from '@/services/eed'

const route = useRoute()
const router = useRouter()

const product = ref<EEDDetailResponse | null>(null)
const imageUrl = ref<string | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const id = route.params['id'] as string

  // Use article data passed from search results if available (avoids test mode restriction)
  const stateArticle = (history.state as Record<string, unknown>)?.article as EEDDetailResponse | undefined
  if (stateArticle) {
    product.value = stateArticle
    imageUrl.value = stateArticle.thumbnailurl ?? null
    loading.value = false
    return
  }

  try {
    const [detail, img] = await Promise.all([
      getArticleDetail(id),
      getImageUrl(id),
    ])
    product.value = detail
    imageUrl.value = img
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load product'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppHeader />

  <main class="main">
    <div class="container">
      <button class="back-btn" @click="router.back()">
        &larr; Back to results
      </button>

      <!-- Loading -->
      <div v-if="loading" class="detail-skeleton">
        <div class="skel-image"></div>
        <div class="skel-info">
          <div class="skel-line short"></div>
          <div class="skel-line long"></div>
          <div class="skel-line medium"></div>
          <div class="skel-line medium"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state-message">
        <p class="state-title">Could not load product</p>
        <p class="state-sub">{{ error }}</p>
      </div>

      <!-- Product detail -->
      <div v-else-if="product" class="detail">
        <div class="detail-image-wrap">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="product.artikelbezeichnung"
            class="detail-image"
          />
          <div v-else class="detail-image-placeholder" aria-hidden="true"></div>
        </div>

        <div class="detail-info">
          <p class="detail-brand">{{ product.artikelhersteller || 'Unknown brand' }}</p>
          <h1 class="detail-title">{{ product.artikelbezeichnung }}</h1>
          <p class="detail-artnr">Article no. {{ product.artikelnummer }}</p>

          <div class="detail-price-row">
            <span class="detail-price">
              {{ product.ekpreis ? `€${product.ekpreis}` : 'Price on request' }}
            </span>
            <span
              :class="['detail-stock', product.bestellbar === 'J' ? 'in-stock' : 'unavailable']"
            >
              {{ product.bestellbar === 'J' ? 'In stock' : 'Not available for order' }}
            </span>
          </div>

          <div v-if="product.vgruppenname" class="detail-section">
            <p class="detail-label">Category</p>
            <p class="detail-value">{{ product.vgruppenname }}</p>
          </div>

          <div v-if="product.artikeltext" class="detail-section">
            <p class="detail-label">Description</p>
            <p class="detail-value detail-text">{{ product.artikeltext }}</p>
          </div>

          <div v-if="product.technischedaten" class="detail-section">
            <p class="detail-label">Technical data</p>
            <p class="detail-value detail-text">{{ product.technischedaten }}</p>
          </div>
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
  display: inline-block;
}

.back-btn:hover {
  text-decoration: underline;
}

/* ── Detail layout ── */
.detail {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 40px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 32px;
}

@media (max-width: 720px) {
  .detail {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 20px;
  }
}

.detail-image-wrap {
  background: #f9f9f9;
  border: 1px solid var(--border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  overflow: hidden;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 16px;
}

.detail-image-placeholder {
  width: 100%;
  min-height: 300px;
  background: #efefef;
}

/* ── Info column ── */
.detail-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-brand {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.detail-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text);
  margin: 4px 0 0;
  line-height: 1.3;
}

.detail-artnr {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0 0 12px;
}

.detail-price-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}

.detail-price {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
}

.detail-stock {
  font-size: 0.85rem;
  font-weight: 500;
}

.in-stock {
  color: #2a7a2a;
}

.unavailable {
  color: var(--text-muted);
}

.detail-section {
  margin-top: 12px;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 0 0 4px;
}

.detail-value {
  font-size: 0.9rem;
  color: var(--text);
  margin: 0;
}

.detail-text {
  line-height: 1.6;
  white-space: pre-wrap;
}

/* ── Skeleton ── */
.detail-skeleton {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 40px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 32px;
}

.skel-image {
  min-height: 300px;
  background: #ebebeb;
  border-radius: 4px;
  animation: pulse 1.4s ease-in-out infinite;
}

.skel-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
}

.skel-line {
  height: 14px;
  border-radius: 3px;
  background: #ebebeb;
  animation: pulse 1.4s ease-in-out infinite;
}

.skel-line.short  { width: 30%; }
.skel-line.medium { width: 55%; }
.skel-line.long   { width: 80%; }

/* ── State ── */
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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}
</style>
