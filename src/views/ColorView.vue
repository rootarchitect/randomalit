<script setup lang="ts">
import ColorGenerator from '../components/ColorGenerator.vue'
</script>

<template>
  <main>
    <ColorGenerator />
  </main>
</template>

<style scoped>
.color-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background-color: hsl(var(--card));
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: hsl(var(--foreground));
}

.description {
  color: hsl(var(--muted-foreground));
  margin-bottom: 2rem;
}

.color-display {
  height: 200px;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: background-color 0.3s ease;
  overflow: hidden;
}

.color-value {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.copy-button {
  background-color: transparent;
  border: 2px solid;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.copy-button.copied {
  background-color: rgba(255, 255, 255, 0.2);
}

.generate-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;
}

.generate-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.history-section {
  border-top: 1px solid hsl(var(--border));
  padding-top: 1.5rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.history-title {
  font-size: 1rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.toggle-icon {
  margin-right: 0.5rem;
  font-size: 0.75rem;
}

.clear-history-button {
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  background-color: transparent;
  color: hsl(var(--muted-foreground));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-history-button:hover {
  background-color: hsl(var(--muted));
}

.history-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.75rem;
}

.history-item {
  border-radius: var(--radius);
  overflow: hidden;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
  position: relative;
  cursor: pointer;
}

.history-item:hover {
  transform: translateY(-2px);
}

.color-code {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.copy-small-button {
  background-color: transparent;
  border: 1px solid;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius);
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-small-button.copied {
  background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 600px) {
  .color-container {
    padding: 1.5rem;
  }

  .color-display {
    height: 150px;
  }

  .color-value {
    font-size: 1.5rem;
  }

  .history-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
