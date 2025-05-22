<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Default restaurants list
const defaultRestaurants = [
  'Burger King',
  'Pizza Hut',
  'Taco Bell',
  'McDonald\'s',
  'Subway',
  'Chipotle',
  'Olive Garden',
  'Outback Steakhouse',
  'The Cheesecake Factory',
  'Applebee\'s'
]

// Reactive states
const restaurants = ref<string[]>([])
const selectedRestaurant = ref<string | null>(null)
const isAnimating = ref(false)
const showCopied = ref(false)
const customRestaurantsText = ref('')
const editingMode = ref(false)

// Load restaurants from localStorage or use defaults
onMounted(() => {
  const savedRestaurants = localStorage.getItem('randomalit-restaurants')
  if (savedRestaurants) {
    restaurants.value = JSON.parse(savedRestaurants)
    // Update textarea with saved restaurants
    customRestaurantsText.value = restaurants.value.join('\n')
  } else {
    restaurants.value = [...defaultRestaurants]
    customRestaurantsText.value = defaultRestaurants.join('\n')
  }
})

// Pick a random restaurant
function pickRandomRestaurant() {
  if (isAnimating.value) return

  // If in editing mode, process the text first
  if (editingMode.value) {
    processCustomList()
  }

  // Make sure we have restaurants to pick from
  if (restaurants.value.length === 0) {
    alert('Please add at least one restaurant to the list')
    toggleEditMode()
    return
  }

  isAnimating.value = true

  // Animation effect - cycle through restaurants quickly
  let counter = 0
  const totalIterations = 20
  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * restaurants.value.length)
    selectedRestaurant.value = restaurants.value[randomIndex]

    counter++

    if (counter >= totalIterations) {
      clearInterval(interval)
      isAnimating.value = false
    }
  }, 100)
}

// Process the custom restaurants list from textarea
function processCustomList() {
  // Split text by new lines and filter out empty lines
  const newRestaurants = customRestaurantsText.value
    .split('\n')
    .map(item => item.trim())
    .filter(item => item.length > 0)

  // Update restaurants array
  restaurants.value = newRestaurants

  // Save to localStorage
  localStorage.setItem('randomalit-restaurants', JSON.stringify(restaurants.value))

  // Exit editing mode
  editingMode.value = false
}

// Toggle edit mode for restaurants list
function toggleEditMode() {
  // If currently in edit mode, we're saving the list
  if (editingMode.value) {
    processCustomList()
  } else {
    // Entering edit mode, update the textarea with current restaurants
    customRestaurantsText.value = restaurants.value.join('\n')
    editingMode.value = true
  }
}

// Reset to default restaurants
function resetToDefaults() {
  restaurants.value = [...defaultRestaurants]
  customRestaurantsText.value = defaultRestaurants.join('\n')
  localStorage.setItem('randomalit-restaurants', JSON.stringify(defaultRestaurants))
  editingMode.value = false
}

// Copy selected restaurant to clipboard
function copyToClipboard() {
  if (!selectedRestaurant.value) return

  navigator.clipboard.writeText(selectedRestaurant.value).then(() => {
    showCopied.value = true
    setTimeout(() => {
      showCopied.value = false
    }, 1500)
  })
}
</script>

<template>
  <main>
    <div class="restaurant-container">
      <h1 class="title">Random Restaurant Picker</h1>
      <p class="description">Let chance decide where you're going to eat today.</p>

      <div class="result-container">
        <div
          v-if="selectedRestaurant"
          class="restaurant-display"
          :class="{ 'is-animating': isAnimating }"
        >
          <h2 class="restaurant-name">{{ selectedRestaurant }}</h2>
          <button
            class="copy-button"
            @click="copyToClipboard"
            :class="{ 'copied': showCopied }"
          >
            {{ showCopied ? 'Copied!' : 'Copy Result' }}
          </button>
        </div>
        <div v-else class="empty-state">
          <p>Click the button to pick a restaurant</p>
        </div>
      </div>

      <button
        @click="pickRandomRestaurant"
        class="pick-button"
        :disabled="isAnimating"
      >
        {{ isAnimating ? 'Picking...' : 'Pick a Restaurant' }}
      </button>

      <div class="options-container">
        <div class="options-header">
          <h3 class="section-title">Restaurant Options</h3>
          <div class="action-buttons">
            <button @click="toggleEditMode" class="action-button edit-button">
              {{ editingMode ? 'Save List' : 'Edit List' }}
            </button>
            <button @click="resetToDefaults" class="action-button reset-button" v-if="editingMode">
              Reset to Defaults
            </button>
          </div>
        </div>

        <div v-if="editingMode" class="edit-mode">
          <p class="help-text">Enter one restaurant per line. Your list will be saved automatically when you pick a restaurant or click "Save List".</p>
          <textarea
            v-model="customRestaurantsText"
            class="restaurants-textarea"
            placeholder="Enter restaurant names, one per line"
            rows="10"
          ></textarea>
        </div>

        <div v-else class="restaurant-list">
          <div
            v-for="(restaurant, index) in restaurants"
            :key="index"
            class="restaurant-item"
          >
            {{ restaurant }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.restaurant-container {
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
  text-align: center;
}

.description {
  color: hsl(var(--muted-foreground));
  margin-bottom: 1.5rem;
  text-align: center;
}

.result-container {
  margin: 2rem 0;
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.restaurant-display {
  width: 100%;
  padding: 2rem;
  background-color: hsl(var(--muted));
  border-radius: var(--radius);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  border: 1px solid hsl(var(--border));
}

.restaurant-display.is-animating {
  transform: scale(1.02);
}

.restaurant-name {
  font-size: 2rem;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin: 0;
}

.empty-state {
  padding: 2rem;
  background-color: hsl(var(--muted));
  border-radius: var(--radius);
  width: 100%;
  text-align: center;
  color: hsl(var(--muted-foreground));
  border: 1px dashed hsl(var(--border));
}

.pick-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2rem;
}

.pick-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pick-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.copy-button {
  background-color: transparent;
  border: 2px solid hsl(var(--foreground));
  color: hsl(var(--foreground));
  padding: 0.4rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background-color: hsl(var(--foreground) / 0.1);
}

.copy-button.copied {
  background-color: #10b981;
  border-color: #10b981;
  color: white;
}

.options-container {
  background-color: hsl(var(--muted));
  border-radius: var(--radius);
  padding: 1.5rem;
  border: 1px solid hsl(var(--border));
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.edit-button {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.reset-button {
  background-color: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
}

.action-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0;
  color: hsl(var(--foreground));
}

.restaurant-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.help-text {
  font-size: 0.85rem;
  color: hsl(var(--muted-foreground));
  margin: 0 0 0.5rem 0;
}

.restaurants-textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 150px;
  transition: border-color 0.2s ease;
}

.restaurants-textarea:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px hsl(var(--primary) / 0.1);
}

.restaurant-item {
  background-color: hsl(var(--background));
  padding: 0.75rem;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.restaurant-item:hover {
  transform: translateY(-2px);
  border-color: hsl(var(--primary));
}

@media (max-width: 768px) {
  .restaurant-container {
    padding: 1.5rem;
  }

  .restaurant-name {
    font-size: 1.5rem;
  }

  .restaurant-list {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>
