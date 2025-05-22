<script setup lang="ts">
import { ref } from 'vue'

const numFaces = ref(6)
const currentValue = ref<string | number>('?') // Initial display, can be number or '?'
const isRolling = ref(false)
const rollHistory = ref<Array<{ value: number; faces: number }>>([]) // Store last roll results
const maxHistoryItems = 10 // Maximum number of history items to store

const getRandomFace = () => {
  if (numFaces.value < 2) return 1 // Should be validated before calling
  return Math.floor(Math.random() * numFaces.value) + 1
}

const throwDice = () => {
  if (isRolling.value) return

  if (numFaces.value < 2) {
    alert('Number of faces must be at least 2.')
    return
  }

  isRolling.value = true
  currentValue.value = '?' // Clear previous result and indicate rolling

  let rollCount = 0
  const totalAnimationRolls = 20 // Total number of visual number changes
  let currentInterval = 50 // Initial interval in ms for number changes

  const animateRoll = () => {
    currentValue.value = getRandomFace() // Display a random number
    rollCount++

    if (rollCount < totalAnimationRolls) {
      // Gradually increase the interval to slow down the animation
      if (rollCount > totalAnimationRolls * 0.5) {
        // Start slowing after 50% of rolls
        currentInterval += 15
      }
      if (rollCount > totalAnimationRolls * 0.75) {
        // Slow down more after 75% of rolls
        currentInterval += 25
      }
      setTimeout(animateRoll, currentInterval)
    } else {
      // The last "animated" roll is the final result
      // No need to call getRandomFace() again, the last one shown is the result.
      isRolling.value = false

      // Add result to history if it's a number (not the '?' placeholder)
      if (typeof currentValue.value === 'number') {
        rollHistory.value.unshift({
          value: currentValue.value,
          faces: numFaces.value,
        })

        // Limit history to maxHistoryItems
        if (rollHistory.value.length > maxHistoryItems) {
          rollHistory.value = rollHistory.value.slice(0, maxHistoryItems)
        }
      }
    }
  }

  // Start the animation sequence
  setTimeout(animateRoll, currentInterval)
}

const clearHistory = () => {
  rollHistory.value = []
}
</script>
<style scoped>
.dice-roller {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  background-color: hsl(var(--card));
  padding: 28px;
  border-radius: var(--radius);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  width: 340px;
  margin: 40px auto;
  box-sizing: border-box;
  border: 1px solid hsl(var(--border));
}

.controls {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 14px;
  width: 100%;
  justify-content: center;
}

.controls label {
  font-size: 0.95em;
  color: hsl(var(--foreground));
  font-weight: 500;
}

.controls input[type='number'] {
  width: 65px;
  padding: 10px 12px;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  text-align: center;
  font-size: 0.95em;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  transition: all 0.2s ease;
}

.controls input[type='number']:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px rgba(124, 136, 245, 0.25);
}

.controls button {
  padding: 10px 20px;
  font-size: 0.95em;
  font-weight: 600;
  color: hsl(var(--primary-foreground));
  background-color: hsl(var(--primary));
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.controls button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.controls button:disabled {
  background-color: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  cursor: not-allowed;
}

.dice-display {
  width: 110px;
  height: 110px;
  background-color: hsl(var(--muted));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.dice-value {
  font-size: 3.2em;
  font-weight: 700;
  color: hsl(var(--foreground));
  transition: transform 0.1s ease-out;
}

.dice-display.rolling .dice-value {
  animation: roll-value-effect 0.12s infinite ease-in-out;
}

@keyframes roll-value-effect {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 0.9;
  }
  25% {
    transform: scale(1.05) rotate(3deg);
    opacity: 1;
  }
  50% {
    transform: scale(1) rotate(0deg);
    opacity: 0.9;
  }
  75% {
    transform: scale(1.05) rotate(-3deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.9;
  }
}

/* History Section Styles */
.history-section {
  margin-top: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.history-title {
  font-size: 1.1em;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin-bottom: 12px;
  text-align: center;
}

.history-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.history-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: hsl(var(--muted));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 8px 4px;
  position: relative;
}

.roll-result {
  font-size: 1.2em;
  font-weight: 700;
  color: hsl(var(--foreground));
}

.roll-detail {
  font-size: 0.8em;
  color: hsl(var(--muted-foreground));
  margin-top: 2px;
}

.clear-history-button {
  padding: 8px 14px;
  font-size: 0.85em;
  color: hsl(var(--muted-foreground));
  background-color: transparent;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-history-button:hover {
  background-color: hsl(var(--muted));
  color: hsl(var(--foreground));
}

@media (max-width: 480px) {
  .history-list {
    grid-template-columns: repeat(3, 1fr);
  }

  .dice-roller {
    width: 100%;
    max-width: 340px;
  }
}
</style>

<template>
  <div class="dice-roller">
    <div class="controls">
      <label for="faces">Number of Faces:</label>
      <input type="number" id="faces" v-model.number="numFaces" min="2" :disabled="isRolling" />
      <button @click="throwDice" :disabled="isRolling">
        {{ isRolling ? 'Rolling...' : 'Throw Dice' }}
      </button>
    </div>
    <div class="dice-display" :class="{ rolling: isRolling }">
      <span class="dice-value">{{ currentValue }}</span>
    </div>

    <!-- Roll History Section -->
    <div class="history-section" v-if="rollHistory.length > 0">
      <h3 class="history-title">Roll History</h3>
      <div class="history-list">
        <div v-for="(roll, index) in rollHistory" :key="index" class="history-item">
          <div class="roll-result">{{ roll.value }}</div>
          <div class="roll-detail">d{{ roll.faces }}</div>
        </div>
      </div>
      <button @click="clearHistory" class="clear-history-button">Clear History</button>
    </div>
  </div>
</template>
