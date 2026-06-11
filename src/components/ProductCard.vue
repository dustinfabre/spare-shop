<script setup lang="ts">
import type { EEDArticle } from '@/services/eed'

defineProps<{ article: EEDArticle }>()
</script>

<template>
  <RouterLink :to="{ path: `/product/${article.artikelnummer}`, state: { article } }" class="card">
    <div class="card-image">
      <img
        v-if="article.bild === 'J' && article.thumbnailurl"
        :src="article.thumbnailurl"
        :alt="article.artikelbezeichnung"
        loading="lazy"
      />
      <div v-else class="card-image-placeholder" aria-hidden="true"></div>
    </div>
    <div class="card-body">
      <p class="card-manufacturer">{{ article.artikelhersteller || 'Unknown brand' }}</p>
      <h3 class="card-name">{{ article.artikelbezeichnung }}</h3>
      <div class="card-footer">
        <span class="card-price">{{ article.ekpreis ? `€${article.ekpreis}` : '—' }}</span>
        <span :class="['card-stock', article.bestellbar === 'J' ? 'in-stock' : 'unavailable']">
          {{ article.bestellbar === 'J' ? 'In stock' : 'Not available' }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: box-shadow 0.15s, transform 0.15s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.11);
  transform: translateY(-1px);
}

.card-image {
  height: 200px;
  background: #f9f9f9;
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  background: #efefef;
}

.card-body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.card-manufacturer {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: var(--text);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
}

.card-price {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.card-stock {
  font-size: 0.75rem;
  font-weight: 500;
}

.in-stock {
  color: #2a7a2a;
}

.unavailable {
  color: var(--text-muted);
}
</style>
