<script setup lang="ts">
import DiceThrow from '../components/DiceThrow.vue'
</script>

<template>
  <div class="dice-view">
    <h1 class="title">Dice Roller</h1>
    <p class="description">Roll a virtual dice with customizable number of faces.</p>

    <DiceThrow />
  </div>
</template>

<style scoped>
.dice-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: hsl(var(--foreground));
  text-align: center;
}

.description {
  color: hsl(var(--muted-foreground));
  margin-bottom: 1.5rem;
  text-align: center;
}
</style>
