<script setup lang="ts">
import { ref } from 'vue'

const password = ref('')
const length = ref(16)
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(true)
const isCopied = ref(false)

function generatePassword() {
  let charset = ''
  if (includeLowercase.value) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (includeUppercase.value) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (includeNumbers.value) charset += '0123456789'
  if (includeSymbols.value) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (charset === '') {
    alert('Please select at least one character type')
    return
  }

  let result = ''
  for (let i = 0; i < length.value; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  password.value = result
}

function copyToClipboard() {
  navigator.clipboard.writeText(password.value).then(() => {
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  })
}

// Generate a password on component mount
generatePassword()
</script>

<template>
  <div class="password-container">
    <h1 class="title">Password Generator</h1>
    <p class="description">Generate secure, random passwords with customizable options.</p>

    <div class="result-container">
      <div class="password-display">
        <span class="password-text">{{ password }}</span>
      </div>

      <button class="copy-button" @click="copyToClipboard" :class="{ copied: isCopied }">
        {{ isCopied ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <div class="controls">
      <div class="control-group">
        <label for="length">Length:</label>
        <div class="range-container">
          <input
            type="range"
            id="length"
            v-model.number="length"
            min="8"
            max="64"
            @input="generatePassword"
          />
          <span class="range-value">{{ length }}</span>
        </div>
      </div>

      <div class="checkbox-container">
        <div class="checkbox-group">
          <input
            type="checkbox"
            id="uppercase"
            v-model="includeUppercase"
            @change="generatePassword"
          />
          <label for="uppercase">Uppercase (A-Z)</label>
        </div>

        <div class="checkbox-group">
          <input
            type="checkbox"
            id="lowercase"
            v-model="includeLowercase"
            @change="generatePassword"
          />
          <label for="lowercase">Lowercase (a-z)</label>
        </div>

        <div class="checkbox-group">
          <input type="checkbox" id="numbers" v-model="includeNumbers" @change="generatePassword" />
          <label for="numbers">Numbers (0-9)</label>
        </div>

        <div class="checkbox-group">
          <input type="checkbox" id="symbols" v-model="includeSymbols" @change="generatePassword" />
          <label for="symbols">Symbols (!@#$%)</label>
        </div>
      </div>

      <button class="generate-button" @click="generatePassword">Generate New Password</button>
    </div>
  </div>
</template>

<style scoped>
.password-container {
  max-width: 600px;
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

.result-container {
  display: flex;
  margin-bottom: 2rem;
  background-color: hsl(var(--muted));
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid hsl(var(--border));
}

.password-display {
  flex: 1;
  padding: 1rem;
  font-family: monospace;
  font-size: 1.125rem;
  overflow-wrap: break-word;
  word-break: break-all;
}

.password-text {
  color: hsl(var(--foreground));
}

.copy-button {
  border: none;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  opacity: 0.9;
}

.copy-button.copied {
  background-color: #10b981;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
  color: hsl(var(--foreground));
}

.range-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-container input {
  flex: 1;
  accent-color: hsl(var(--primary));
}

.range-value {
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
}

.checkbox-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input[type='checkbox'] {
  width: 1rem;
  height: 1rem;
  accent-color: hsl(var(--primary));
}

.generate-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.generate-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

@media (max-width: 600px) {
  .checkbox-container {
    grid-template-columns: 1fr;
  }
}
</style>
