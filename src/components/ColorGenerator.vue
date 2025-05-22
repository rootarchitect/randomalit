<script setup lang="ts">
import { ref, computed } from 'vue'

// Color generator component
const colorHex = ref('#000000')
const colorHistory = ref<string[]>([])
const maxHistoryItems = 12
const isCopied = ref(false)
const copyingIndex = ref(-1)
const showHistory = ref(false)
const colorRange = ref('random') // Options: 'random', 'warm', 'cool', 'pastel', 'monochrome'

interface ColorRangeOption {
  id: string
  name: string
  description: string
}

const colorRangeOptions: ColorRangeOption[] = [
  { id: 'random', name: 'Full Random', description: 'Any color across the spectrum' },
  { id: 'warm', name: 'Warm Colors', description: 'Reds, oranges, yellows' },
  { id: 'cool', name: 'Cool Colors', description: 'Blues, greens, purples' },
  { id: 'pastel', name: 'Pastel Colors', description: 'Soft, light colors' },
  { id: 'monochrome', name: 'Monochrome', description: 'Variations of a single color' },
]

// HSL color values range
// Hue: 0-360
// Saturation: 0-100
// Lightness: 0-100

// Function to convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  // Ensure values are in proper range
  h = Math.max(0, Math.min(360, h))
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100

  // Convert HSL to RGB
  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h / 360 + 1 / 3)
    g = hue2rgb(p, q, h / 360)
    b = hue2rgb(p, q, h / 360 - 1 / 3)
  }

  // Convert RGB to Hex
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

// Function to generate a random hex color
function generateRandomColor() {
  switch (colorRange.value) {
    case 'warm':
      // Warm colors: red to yellow (0-60 degrees in HSL)
      return hslToHex(
        Math.floor(Math.random() * 60),
        70 + Math.floor(Math.random() * 30),
        50 + Math.floor(Math.random() * 20),
      )

    case 'cool':
      // Cool colors: blue, green, purple (180-300 degrees in HSL)
      return hslToHex(
        180 + Math.floor(Math.random() * 120),
        60 + Math.floor(Math.random() * 40),
        40 + Math.floor(Math.random() * 30),
      )

    case 'pastel':
      // Pastel colors: high lightness, lower saturation
      return hslToHex(
        Math.floor(Math.random() * 360),
        25 + Math.floor(Math.random() * 40),
        75 + Math.floor(Math.random() * 15),
      )

    case 'monochrome':
      // Monochrome: fixed hue, varying saturation and lightness
      const baseHue =
        colorHistory.value.length > 0 && colorHistory.value[0] !== '#000000'
          ? getHueFromHex(colorHistory.value[0])
          : Math.floor(Math.random() * 360)

      return hslToHex(
        baseHue,
        30 + Math.floor(Math.random() * 60),
        30 + Math.floor(Math.random() * 50),
      )

    case 'random':
    default:
      // Full random using direct hex generation
      const letters = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
  }
}

// Helper function to extract hue from a hex color (for monochrome mode)
function getHueFromHex(hexColor: string): number {
  // Remove the # if present
  const hex = hexColor.replace('#', '')

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0

  if (max === min) {
    return 0 // achromatic
  }

  const d = max - min

  if (max === r) {
    h = (g - b) / d + (g < b ? 6 : 0)
  } else if (max === g) {
    h = (b - r) / d + 2
  } else if (max === b) {
    h = (r - g) / d + 4
  }

  return Math.round(h * 60) % 360
}

// Function to get contrasting text color (black or white) based on background color
function getContrastColor(hexColor: string) {
  // Remove the # if present
  const hex = hexColor.replace('#', '')

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate luminance - perceived brightness
  // Formula from W3C accessibility guidelines
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black for bright colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

// Computed property for text color
const textColor = computed(() => {
  return getContrastColor(colorHex.value)
})

// Function to get RGB values from hex
function hexToRgb(hexColor: string) {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return { r, g, b }
}

// Function to get HSL values from hex
function hexToHsl(hexColor: string) {
  const { r, g, b } = hexToRgb(hexColor)

  const r1 = r / 255
  const g1 = g / 255
  const b1 = b / 255

  const max = Math.max(r1, g1, b1)
  const min = Math.min(r1, g1, b1)

  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    if (max === r1) {
      h = (g1 - b1) / d + (g1 < b1 ? 6 : 0)
    } else if (max === g1) {
      h = (b1 - r1) / d + 2
    } else if (max === b1) {
      h = (r1 - g1) / d + 4
    }

    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return { h, s, l }
}

// Computed properties for color values
const rgbValue = computed(() => {
  const { r, g, b } = hexToRgb(colorHex.value)
  return `rgb(${r}, ${g}, ${b})`
})

const hslValue = computed(() => {
  const { h, s, l } = hexToHsl(colorHex.value)
  return `hsl(${h}, ${s}%, ${l}%)`
})

// Generate a new random color
function generateColor() {
  const newColor = generateRandomColor()
  colorHex.value = newColor

  // Add to history
  colorHistory.value.unshift(newColor)

  // Limit history to maxHistoryItems
  if (colorHistory.value.length > maxHistoryItems) {
    colorHistory.value = colorHistory.value.slice(0, maxHistoryItems)
  }
}

// Copy color in various formats
function copyColorFormat(format: 'hex' | 'rgb' | 'hsl') {
  let valueToCopy = colorHex.value
  if (format === 'rgb') {
    valueToCopy = rgbValue.value
  } else if (format === 'hsl') {
    valueToCopy = hslValue.value
  }

  navigator.clipboard.writeText(valueToCopy).then(() => {
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 1500)
  })
}

// Copy color to clipboard
function copyToClipboard(color: string, index: number = -1) {
  navigator.clipboard.writeText(color).then(() => {
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

// Clear history
function clearHistory() {
  colorHistory.value = []
}

// Generate initial color
generateColor()
</script>

<template>
  <div class="color-container">
    <h1 class="title">Random Color Generator</h1>
    <p class="description">Generate random HEX colors for your design projects.</p>

    <div class="color-display" :style="{ backgroundColor: colorHex }">
      <div class="color-value" :style="{ color: textColor }">
        {{ colorHex }}
      </div>
      <div class="color-formats" :style="{ color: textColor }">
        <div class="format-row">
          <span class="format-label">RGB:</span>
          <span class="format-value">{{ rgbValue }}</span>
          <button
            class="format-copy-button"
            @click="copyColorFormat('rgb')"
            :style="{ color: textColor, borderColor: textColor }"
          >
            Copy
          </button>
        </div>
        <div class="format-row">
          <span class="format-label">HSL:</span>
          <span class="format-value">{{ hslValue }}</span>
          <button
            class="format-copy-button"
            @click="copyColorFormat('hsl')"
            :style="{ color: textColor, borderColor: textColor }"
          >
            Copy
          </button>
        </div>
      </div>
      <button
        class="copy-button"
        :class="{ copied: isCopied }"
        @click="copyColorFormat('hex')"
        :style="{ color: textColor, borderColor: textColor }"
      >
        {{ isCopied ? 'Copied!' : 'Copy HEX' }}
      </button>
    </div>

    <button class="generate-button" @click="generateColor">Generate New Color</button>

    <div class="color-options">
      <div class="option-group">
        <label class="option-label">Color Range:</label>
        <div class="range-options">
          <div
            v-for="option in colorRangeOptions"
            :key="option.id"
            class="range-option"
            :class="{ active: colorRange === option.id }"
            @click="colorRange = option.id"
          >
            <div class="option-name">{{ option.name }}</div>
            <div class="option-description">{{ option.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="history-section" v-if="colorHistory.length > 1">
      <div class="history-header">
        <h3 @click="showHistory = !showHistory" class="history-title">
          <span class="toggle-icon">{{ showHistory ? '▼' : '►' }}</span>
          Color History
        </h3>
        <button v-if="showHistory" class="clear-history-button" @click="clearHistory">
          Clear History
        </button>
      </div>

      <div class="history-list" v-if="showHistory">
        <div
          v-for="(color, index) in colorHistory.slice(1)"
          :key="index"
          class="history-item"
          :style="{ backgroundColor: color }"
        >
          <div class="color-code" :style="{ color: getContrastColor(color) }">{{ color }}</div>
          <button
            class="copy-small-button"
            :class="{ copied: copyingIndex === index }"
            @click="copyToClipboard(color, index)"
            :style="{ color: getContrastColor(color), borderColor: getContrastColor(color) }"
          >
            {{ copyingIndex === index ? '✓' : 'Copy' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-container {
  max-width: 800px;
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
  height: 300px;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: background-color 0.3s ease;
  overflow: hidden;
  padding: 1rem;
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

.color-formats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 400px;
}

.format-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
}

.format-label {
  font-weight: 600;
  font-size: 0.9rem;
  width: 45px;
}

.format-value {
  flex: 1;
  font-family: monospace;
  font-size: 0.9rem;
}

.format-copy-button {
  background-color: transparent;
  border: 1px solid;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-copy-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.copy-button {
  background-color: transparent;
  border: 2px solid;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
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

.color-options {
  margin-bottom: 1.5rem;
  background-color: hsl(var(--muted));
  border-radius: var(--radius);
  padding: 1rem;
  border: 1px solid hsl(var(--border));
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: hsl(var(--foreground));
}

.range-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.range-option {
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.range-option:hover {
  transform: translateY(-2px);
  border-color: hsl(var(--primary));
}

.range-option.active {
  border-color: hsl(var(--primary));
  background-color: hsl(var(--primary) / 0.1);
  box-shadow: 0 0 0 1px hsl(var(--primary));
}

.option-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: hsl(var(--foreground));
}

.option-description {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
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
    height: 175px;
  }

  .color-value {
    font-size: 1.5rem;
  }

  .color-formats {
    max-width: 100%;
  }

  .format-row {
    flex-wrap: wrap;
  }

  .format-value {
    width: 100%;
    margin: 0.25rem 0;
  }

  .format-copy-button {
    margin-left: auto;
  }

  .history-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .range-options {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
