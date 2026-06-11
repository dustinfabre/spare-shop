<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'

const store = useProductsStore()
const router = useRouter()
const route = useRoute()

const inputValue = ref((route.query.q as string) ?? '')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  inputValue.value = val

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    router.replace({ query: val ? { q: val } : {} })
  }, 400)
}

function onSubmit() {
  if (debounceTimer) clearTimeout(debounceTimer)
  router.replace({ query: inputValue.value ? { q: inputValue.value } : {} })
}

// Keep input in sync if browser back/forward changes the URL
watch(
  () => route.query.q,
  (q) => {
    inputValue.value = (q as string) ?? ''
  },
)
</script>

<template>
  <form class="search-bar" role="search" @submit.prevent="onSubmit">
    <input
      type="search"
      class="search-input"
      placeholder="Search for parts, accessories, appliances..."
      :value="inputValue"
      autocomplete="off"
      spellcheck="false"
      @input="onInput"
    />
    <button type="submit" class="search-btn">Search</button>
  </form>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 0;
  width: 100%;
  max-width: 640px;
}

.search-input {
  flex: 1;
  height: 42px;
  padding: 0 14px;
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--text);
  background: #fff;
  border: 1px solid var(--border);
  border-right: none;
  border-radius: 4px 0 0 4px;
  outline: none;
  min-width: 0;
}

.search-input:focus {
  border-color: var(--accent);
}

/* Reset default webkit search cancel button styling */
.search-input::-webkit-search-decoration,
.search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

.search-btn {
  height: 42px;
  padding: 0 20px;
  font-size: 0.9rem;
  font-family: inherit;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  white-space: nowrap;
}

.search-btn:hover {
  background: #0049a0;
  border-color: #0049a0;
}
</style>
