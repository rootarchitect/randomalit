<script setup lang="ts">
import { ref } from 'vue'

// UUID generator component
const count = ref(1)
const generatedUuids = ref<string[]>([])
const isCopied = ref(false)
const copyingIndex = ref(-1)
const showHistory = ref(false)
const uuidHistory = ref<string[]>([])
const maxHistoryItems = 20

// Function to generate a version 4 (random) UUID
function generateUuidV4() {
  const uuids = []
  for (let i = 0; i < count.value; i++) {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
    uuids.push(uuid)
  }
  generatedUuids.value = uuids

  // Add to history (only first 5 if generating multiple)
  const historyItems = uuids.slice(0, 5)
  uuidHistory.value = [...historyItems, ...uuidHistory.value].slice(0, maxHistoryItems)
}

function generateUuid() {
  generateUuidV4()
}

function copyToClipboard(uuid: string, index: number = -1) {
  navigator.clipboard.writeText(uuid).then(() => {
    if (index >= 0) {
      copyingIndex.value = index
      setTimeout(() => {
        copyingIndex.value = -1
      }, 1500)
    } else {
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 1500)
    }
  })
}

function copyAllUuids() {
  if (generatedUuids.value.length === 0) return

  navigator.clipboard.writeText(generatedUuids.value.join('\n')).then(() => {
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 1500)
  })
}

function clearHistory() {
  uuidHistory.value = []
}

// Generate UUID on component mount
generateUuid()
</script>

<template>
  <div class="uuid-container">
    <h1 class="title">UUID Generator</h1>
    <p class="description">Generate Universally Unique Identifiers (UUIDs) quickly and easily.</p>

    <div class="controls">
      <div class="control-row">
        <div class="control-group">
          <label for="count">Number of UUIDs:</label>
          <input
            type="number"
            id="count"
            v-model.number="count"
            min="1"
            max="100"
            class="number-input"
          />
        </div>

        <button class="generate-button" @click="generateUuid">Generate UUIDs</button>
      </div>
    </div>

    <div class="uuid-list">
      <div v-if="generatedUuids.length > 1" class="copy-all-container">
        <button class="copy-all-button" :class="{ copied: isCopied }" @click="copyAllUuids()">
          {{ isCopied ? 'All Copied!' : 'Copy All UUIDs' }}
        </button>
      </div>
      <div v-for="(uuid, index) in generatedUuids" :key="index" class="uuid-item">
        <code class="uuid-code">{{ uuid }}</code>
        <button
          class="copy-button"
          :class="{ copied: copyingIndex === index }"
          @click="copyToClipboard(uuid, index)"
        >
          {{ copyingIndex === index ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <div class="history-section" v-if="uuidHistory.length > 0">
      <div class="history-header">
        <h3 @click="showHistory = !showHistory" class="history-title">
          <span class="toggle-icon">{{ showHistory ? '▼' : '►' }}</span>
          Recently Generated UUIDs
        </h3>
        <button v-if="showHistory" class="clear-history-button" @click="clearHistory">
          Clear History
        </button>
      </div>

      <div class="history-list" v-if="showHistory">
        <div v-for="(uuid, index) in uuidHistory" :key="`history-${index}`" class="history-item">
          <code class="uuid-code">{{ uuid }}</code>
          <button class="copy-button small" @click="copyToClipboard(uuid)">Copy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.uuid-container {
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

.controls {
  margin-bottom: 2rem;
}

.control-row {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.control-group label {
  font-weight: 500;
  color: hsl(var(--foreground));
  font-size: 0.875rem;
}

.number-input {
  padding: 0.625rem;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-size: 1rem;
  width: 100%;
  max-width: 100px;
}

.number-input:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px rgba(var(--primary), 0.25);
}

.generate-button {
  padding: 0.625rem 1.25rem;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 41px;
}

.generate-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.uuid-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.uuid-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: hsl(var(--muted));
  border-radius: var(--radius);
  padding: 0.75rem 1rem;
  border: 1px solid hsl(var(--border));
}

.uuid-code {
  font-family: monospace;
  font-size: 0.9rem;
  color: hsl(var(--foreground));
  overflow-wrap: break-word;
  word-break: break-all;
}

.copy-button {
  border: none;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  border-radius: var(--radius);
  margin-left: 1rem;
}

.copy-button:hover {
  opacity: 0.9;
}

.copy-button.copied {
  background-color: #10b981;
}

.copy-button.small {
  padding: 0.3rem 0.7rem;
  min-width: 60px;
  font-size: 0.75rem;
}

.copy-all-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.copy-all-button {
  border: none;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: var(--radius);
}

.copy-all-button:hover {
  opacity: 0.9;
}

.copy-all-button.copied {
  background-color: #10b981;
}

.history-section {
  margin-top: 2rem;
  border-top: 1px solid hsl(var(--border));
  padding-top: 1rem;
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: hsl(var(--muted));
  border-radius: var(--radius);
  padding: 0.5rem 0.75rem;
  border: 1px solid hsl(var(--border));
  font-size: 0.875rem;
}

@media (max-width: 600px) {
  .control-row {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .generate-button {
    width: 100%;
  }

  .uuid-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .copy-button {
    margin-left: 0;
    width: 100%;
  }

  .uuid-code {
    width: 100%;
  }
}
</style>
