<script setup lang="ts">
import PaletteGenerator from '../components/PaletteGenerator.vue'
</script>

<template>
  <main>
    <div class="page-container">
      <PaletteGenerator />
    </div>
  </main>
</template>

<style scoped>
.page-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem 0.5rem;
  }
}
</style>
