<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink to="/" class="brand">SpareParts Shop</RouterLink>
      <span class="tagline">Appliance spare parts &amp; accessories</span>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.brand:hover {
  text-decoration: underline;
}

.tagline {
  font-size: 0.8rem;
  color: var(--text-muted);
  border-left: 1px solid var(--border);
  padding-left: 16px;
}
</style>
