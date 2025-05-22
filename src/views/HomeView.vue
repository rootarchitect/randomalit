<script setup lang="ts">
// Home view for Randomalit
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero-title">Randomalit</h1>
      <p class="hero-subtitle">Simple random generation tools for developers and everyone</p>
      <div class="hero-cta">
        <RouterLink to="/password" class="cta-button primary">Generate Password</RouterLink>
        <RouterLink to="/dice" class="cta-button secondary">Roll a Dice</RouterLink>
      </div>
    </section>

    <section class="features">
      <div class="feature-grid">
        <div class="feature-card">
          <RouterLink to="/password" class="feature-link">
            <div class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
                ></path>
              </svg>
            </div>
            <h2>Password Generator</h2>
            <p>Create strong, secure passwords with customizable options</p>
          </RouterLink>
        </div>

        <div class="feature-card">
          <RouterLink to="/uuid" class="feature-link">
            <div class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"
                ></path>
              </svg>
            </div>
            <h2>UUID Generator</h2>
            <p>Generate version 4 UUIDs</p>
          </RouterLink>
        </div>

        <div class="feature-card">
          <RouterLink to="/dice" class="feature-link">
            <div class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M4 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm4 4h.01M12 7h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"
                ></path>
              </svg>
            </div>
            <h2>Dice Roller</h2>
            <p>Roll a virtual dice with customizable number of faces</p>
          </RouterLink>
        </div>

        <div class="feature-card">
          <RouterLink to="/color" class="feature-link">
            <div class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="13.5" cy="6.5" r="2.5"></circle>
                <circle cx="19" cy="13" r="2.5"></circle>
                <circle cx="6" cy="12" r="2.5"></circle>
                <circle cx="10" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <h2>Color Generator</h2>
            <p>Generate random HEX colors for your design projects</p>
          </RouterLink>
        </div>

        <div class="feature-card">
          <RouterLink to="/palette" class="feature-link">
            <div class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="6" height="6" rx="1"></rect>
                <rect x="15" y="3" width="6" height="6" rx="1"></rect>
                <rect x="3" y="15" width="6" height="6" rx="1"></rect>
                <rect x="15" y="15" width="6" height="6" rx="1"></rect>
              </svg>
            </div>
            <h2>Palette Generator</h2>
            <p>Create harmonious color palettes for your design projects</p>
          </RouterLink>
        </div>

        <div class="feature-card">
          <RouterLink to="/restaurant" class="feature-link">
            <div class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
                <line x1="6" y1="17" x2="18" y2="17"></line>
              </svg>
            </div>
            <h2>Restaurant Picker</h2>
            <p>Let chance decide where you're going to eat today</p>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="info-section">
      <div class="info-content">
        <h2>All Tools Run Locally</h2>
        <p>
          Randomalit tools run entirely in your browser. No data is sent to any server, ensuring
          your information remains private and secure.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1100px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(to right, hsl(var(--primary)), #6574e2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: hsl(var(--muted-foreground));
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.cta-button {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.cta-button.primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: none;
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cta-button.secondary {
  background-color: transparent;
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}

.cta-button.secondary:hover {
  background-color: hsl(var(--muted));
}

.features {
  padding: 1rem;
}

.feature-grid {
  display: grid;
  gap: 1rem;
}

.feature-card {
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: hsl(var(--card));
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: hsl(var(--primary));
}

.feature-link {
  display: block;
  padding: 2rem 1.5rem;
  text-decoration: none;
  color: hsl(var(--foreground));
  height: 100%;
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: hsl(var(--primary));
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

.feature-card:hover .icon {
  transform: scale(1.1);
}

.feature-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: hsl(var(--muted-foreground));
  font-size: 0.95rem;
  line-height: 1.5;
}

.info-section {
  margin: 3rem 0;
  padding: 2.5rem 1.5rem;
  background-color: hsl(var(--accent));
  border-radius: var(--radius);
  text-align: center;
}

.info-content {
  max-width: 700px;
  margin: 0 auto;
}

.info-section h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: hsl(var(--accent-foreground));
}

.info-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: hsl(var(--accent-foreground));
}

@media (min-width: 640px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero-title {
    font-size: 3.5rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
  }
}

@media (min-width: 1024px) {
  .feature-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .hero {
    padding: 5rem 1rem 4rem;
  }

  .hero-title {
    font-size: 4rem;
  }
}
</style>
