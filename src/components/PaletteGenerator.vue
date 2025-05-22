<script setup lang="ts">
import { ref } from 'vue'

// Palette generator component
const paletteColors = ref<string[]>(['#000000', '#000000', '#000000', '#000000', '#000000'])
const paletteHistory = ref<string[][]>([])
const maxHistoryItems = 8
const isCopied = ref(false)
const showHistory = ref(false)
const selectedPaletteType = ref('random') // 'random', 'monochromatic', 'analogous', 'complementary', 'triadic'
const exportFormat = ref('hex') // 'hex', 'rgb', 'hsl', 'css'

interface PaletteType {
  id: string
  name: string
  description: string
}

const paletteTypes: PaletteType[] = [
  { id: 'random', name: 'Random', description: 'Completely random colors' },
  { id: 'monochromatic', name: 'Monochromatic', description: 'Different shades of one color' },
  {
    id: 'analogous',
    name: 'Analogous',
    description: 'Colors that are next to each other on the color wheel',
  },
  {
    id: 'complementary',
    name: 'Complementary',
    description: 'Colors that are opposite to each other on the color wheel',
  },
  { id: 'triadic', name: 'Triadic', description: 'Three colors evenly spaced on the color wheel' },
]

// Function to generate a random hex color
function generateRandomHexColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Function to convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  // Ensure values are in proper range
  h = Math.max(0, Math.min(360, h)) % 360
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

// Function to get contrasting text color (black or white) based on background color
function getContrastColor(hexColor: string): string {
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

// Function to convert hex to HSL
function hexToHsl(hexColor: string): { h: number; s: number; l: number } {
  // Remove the # if present
  const hex = hexColor.replace('#', '')

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  let l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0)
    } else if (max === g) {
      h = (b - r) / d + 2
    } else if (max === b) {
      h = (r - g) / d + 4
    }

    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return { h, s, l }
}

// Function to convert hex to RGB
function hexToRgb(hexColor: string): { r: number; g: number; b: number } {
  // Remove the # if present
  const hex = hexColor.replace('#', '')

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return { r, g, b }
}

// Function to format RGB
function formatRgb(hexColor: string): string {
  const { r, g, b } = hexToRgb(hexColor)
  return `rgb(${r}, ${g}, ${b})`
}

// Function to format HSL
function formatHsl(hexColor: string): string {
  const { h, s, l } = hexToHsl(hexColor)
  return `hsl(${h}, ${s}%, ${l}%)`
}

// Function to get formatted color based on selected export format
function getFormattedColor(hexColor: string): string {
  switch (exportFormat.value) {
    case 'rgb':
      return formatRgb(hexColor)
    case 'hsl':
      return formatHsl(hexColor)
    case 'css':
      return `var(--color-${paletteColors.value.indexOf(hexColor) + 1})`
    case 'hex':
    default:
      return hexColor
  }
}

// Generate CSS Variables for the current palette
function generateCssVariables(): string {
  let css = ':root {\n'
  paletteColors.value.forEach((color, index) => {
    css += `  --color-${index + 1}: ${color};\n`
  })
  css += '}'
  return css
}

// Export palette in selected format
function exportPalette() {
  let exportContent = ''

  if (exportFormat.value === 'css') {
    exportContent = generateCssVariables()
  } else {
    // For other formats, just list the colors
    exportContent = paletteColors.value.map((color) => getFormattedColor(color)).join('\n')
  }

  // Create a blob and download it
  const blob = new Blob([exportContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `palette-${new Date().toISOString().slice(0, 10)}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Generate random palette based on selected type
function generatePalette() {
  let newPalette: string[] = []

  switch (selectedPaletteType.value) {
    case 'monochromatic':
      // Generate base color
      const baseHue = Math.floor(Math.random() * 360)

      // Generate five variations with different lightness and saturation
      newPalette = [
        hslToHex(baseHue, 90, 30), // Dark, highly saturated
        hslToHex(baseHue, 70, 45),
        hslToHex(baseHue, 50, 60), // Middle tone
        hslToHex(baseHue, 40, 75),
        hslToHex(baseHue, 30, 90), // Light, less saturated
      ]
      break

    case 'analogous':
      // Generate base color
      const analogousBaseHue = Math.floor(Math.random() * 360)
      // Analogous colors are next to each other on the color wheel (typically +/- 30 degrees)
      newPalette = [
        hslToHex((analogousBaseHue - 40) % 360, 85, 60),
        hslToHex((analogousBaseHue - 20) % 360, 80, 55),
        hslToHex(analogousBaseHue, 75, 50), // Base color
        hslToHex((analogousBaseHue + 20) % 360, 80, 55),
        hslToHex((analogousBaseHue + 40) % 360, 85, 60),
      ]
      break

    case 'complementary':
      // Generate base color
      const compBaseHue = Math.floor(Math.random() * 360)
      // Complementary color is opposite on the color wheel (+180 degrees)
      const compColorHue = (compBaseHue + 180) % 360

      newPalette = [
        hslToHex(compBaseHue, 90, 35), // Dark version of base
        hslToHex(compBaseHue, 80, 55), // Base color
        hslToHex(compBaseHue, 50, 75), // Light version of base
        hslToHex(compColorHue, 80, 55), // Complementary color
        hslToHex(compColorHue, 50, 75), // Light version of complementary
      ]
      break

    case 'triadic':
      // Generate base color
      const triadicBaseHue = Math.floor(Math.random() * 360)
      // Triadic colors are evenly spaced on the color wheel (120 degrees apart)
      const triadicHue1 = (triadicBaseHue + 120) % 360
      const triadicHue2 = (triadicBaseHue + 240) % 360

      newPalette = [
        hslToHex(triadicBaseHue, 85, 40), // Base color darker
        hslToHex(triadicBaseHue, 75, 60), // Base color
        hslToHex(triadicHue1, 75, 60), // First triadic color
        hslToHex(triadicHue2, 75, 60), // Second triadic color
        hslToHex(triadicHue2, 70, 80), // Second triadic color lighter
      ]
      break

    case 'random':
    default:
      // Generate five random colors
      newPalette = Array.from({ length: 5 }, () => generateRandomHexColor())
      break
  }

  // Save current palette
  paletteColors.value = newPalette

  // Add to history
  paletteHistory.value.unshift([...newPalette])

  // Limit history
  if (paletteHistory.value.length > maxHistoryItems) {
    paletteHistory.value = paletteHistory.value.slice(0, maxHistoryItems)
  }
}

// Copy all colors to clipboard
function copyPalette() {
  const paletteText = paletteColors.value.join(', ')
  navigator.clipboard.writeText(paletteText).then(() => {
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 1500)
  })
}

// Copy a specific color
function copyColor(color: string) {
  navigator.clipboard.writeText(color).then(() => {
    // Could add individual copy indicators if needed
  })
}

// Apply a saved palette
function applyPalette(palette: string[]) {
  paletteColors.value = [...palette]
}

// Clear history
function clearHistory() {
  paletteHistory.value = []
}

// Generate initial palette
generatePalette()
</script>

<template>
  <div class="palette-container">
    <h1 class="title">Color Palette Generator</h1>
    <p class="description">Generate harmonious color palettes for your design projects.</p>

    <div class="palette-options">
      <div class="option-group">
        <label class="option-label">Palette Type:</label>
        <div class="palette-types">
          <div
            v-for="type in paletteTypes"
            :key="type.id"
            class="palette-type"
            :class="{ active: selectedPaletteType === type.id }"
            @click="selectedPaletteType = type.id"
          >
            <div class="type-name">{{ type.name }}</div>
            <div class="type-description">{{ type.description }}</div>
          </div>
        </div>
      </div>

      <div class="export-options">
        <label class="option-label">Export Format:</label>
        <div class="format-buttons">
          <button
            v-for="format in ['hex', 'rgb', 'hsl', 'css']"
            :key="format"
            class="format-button"
            :class="{ active: exportFormat === format }"
            @click="exportFormat = format"
          >
            {{ format.toUpperCase() }}
          </button>
        </div>
      </div>
    </div>

    <div class="palette-display">
      <div
        v-for="(color, index) in paletteColors"
        :key="index"
        class="color-column"
        :style="{ backgroundColor: color }"
      >
        <div class="color-info" :style="{ color: getContrastColor(color) }">
          <div class="color-hex">{{ color }}</div>
          <button
            class="copy-color-button"
            @click="copyColor(color)"
            :style="{ borderColor: getContrastColor(color), color: getContrastColor(color) }"
          >
            Copy
          </button>
        </div>
      </div>
    </div>

    <div class="palette-controls">
      <button class="generate-button" @click="generatePalette">Generate New Palette</button>
      <button class="copy-palette-button" @click="copyPalette" :class="{ copied: isCopied }">
        {{ isCopied ? 'Copied All Colors!' : 'Copy All Colors' }}
      </button>
      <button class="export-button" @click="exportPalette">Export Palette</button>
    </div>

    <div class="history-section" v-if="paletteHistory.length > 1">
      <div class="history-header">
        <h3 @click="showHistory = !showHistory" class="history-title">
          <span class="toggle-icon">{{ showHistory ? '▼' : '►' }}</span>
          Palette History
        </h3>
        <button v-if="showHistory" class="clear-history-button" @click="clearHistory">
          Clear History
        </button>
      </div>

      <div class="history-list" v-if="showHistory">
        <div
          v-for="(palette, index) in paletteHistory.slice(1)"
          :key="index"
          class="history-item"
          @click="applyPalette(palette)"
        >
          <div
            v-for="(color, colorIndex) in palette"
            :key="colorIndex"
            class="history-color"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.palette-container {
  max-width: 900px;
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

.palette-options {
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
  margin-bottom: 1rem;
}

.option-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: hsl(var(--foreground));
}

.palette-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.palette-type {
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.palette-type:hover {
  transform: translateY(-2px);
  border-color: hsl(var(--primary));
}

.palette-type.active {
  border-color: hsl(var(--primary));
  background-color: hsl(var(--primary) / 0.1);
  box-shadow: 0 0 0 1px hsl(var(--primary));
}

.type-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: hsl(var(--foreground));
}

.type-description {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
}

.palette-display {
  display: flex;
  height: 250px;
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.color-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
}

.color-column:hover {
  flex: 1.2;
}

.color-info {
  width: 100%;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.color-hex {
  font-family: monospace;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.copy-color-button {
  background-color: transparent;
  border: 1px solid;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-color-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.palette-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.generate-button,
.copy-palette-button,
.export-button {
  flex: 1;
  padding: 0.75rem 1rem;
  font-weight: 600;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.generate-button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.copy-palette-button {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.export-button {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.generate-button:hover,
.copy-palette-button:hover,
.export-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.copy-palette-button.copied {
  background-color: #10b981;
  color: white;
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
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.history-item {
  height: 50px;
  display: flex;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.history-color {
  flex: 1;
  height: 100%;
}

.export-format-select {
  padding: 0.5rem;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-format-select:hover {
  border-color: hsl(var(--primary));
}

.format-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.format-button {
  padding: 0.4rem 0.8rem;
  background-color: hsl(var(--muted));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-button.active {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-color: hsl(var(--primary));
}

.format-button:hover:not(.active) {
  border-color: hsl(var(--primary));
}

@media (max-width: 768px) {
  .palette-container {
    padding: 1.5rem;
  }

  .palette-display {
    height: 200px;
  }

  .palette-types {
    grid-template-columns: repeat(2, 1fr);
  }

  .palette-controls {
    flex-direction: column;
    gap: 0.75rem;
  }

  .color-hex {
    font-size: 0.8rem;
  }

  .history-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .format-buttons {
    justify-content: space-between;
  }

  .format-button {
    flex: 1;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .palette-display {
    height: 160px;
  }

  .color-info {
    padding: 0.5rem;
  }

  .color-hex {
    font-size: 0.7rem;
  }

  .copy-color-button {
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
  }
}
</style>
