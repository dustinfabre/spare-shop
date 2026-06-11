<script setup lang="ts"></script>

<template>
  <RouterView />
</template>

<style>
/* ── Tokens ── */
:root {
  --bg: #f4f4f4;
  --surface: #ffffff;
  --text: #1a1a1a;
  --text-muted: #666666;
  --accent: #0057b8;
  --border: #e0e0e0;
}

/* ── Reset ── */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
}

button,
input {
  font-family: inherit;
}

img {
  display: block;
  max-width: 100%;
}
</style>
