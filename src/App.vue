<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'

const isDark = ref(false)
const mobileMenuOpen = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
}

function closeMobileMenu() {
  if (mobileMenuOpen.value) {
    mobileMenuOpen.value = false
    document.body.style.overflow = ''
  }
}

// Check system preference on load
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  isDark.value = true
  document.documentElement.classList.add('dark')
}
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDark }">
    <header class="sticky-header">
      <div class="nav-container">
        <div class="logo-container">
          <RouterLink to="/" @click="closeMobileMenu"><img class="logo"src="/apple-touch-icon.png" /> Randomalit</RouterLink>
        </div>
        <nav class="main-nav" :class="{ 'mobile-open': mobileMenuOpen }">
          <RouterLink to="/" class="nav-link" @click="closeMobileMenu">Home</RouterLink>
          <RouterLink to="/password" class="nav-link" @click="closeMobileMenu">Password</RouterLink>
          <RouterLink to="/uuid" class="nav-link" @click="closeMobileMenu">UUID</RouterLink>
          <RouterLink to="/dice" class="nav-link" @click="closeMobileMenu">Dice</RouterLink>
          <RouterLink to="/color" class="nav-link" @click="closeMobileMenu">Color</RouterLink>
          <RouterLink to="/palette" class="nav-link" @click="closeMobileMenu">Palette</RouterLink>
          <RouterLink to="/about" class="nav-link" @click="closeMobileMenu">About</RouterLink>
        </nav>

        <div class="controls">
          <a
            href="https://github.com/rootarchitect/randomalit"
            target="_blank"
            title="GitHub Repository"
            style="margin-top: 0.4rem"
          >
            <svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" class="github-icon">
              <path
                d="M12.466 0C5.582 0 0 5.611 0 12.547c0 5.548 3.567 10.255 8.519 11.912.619.125.845-.27.845-.602 0-.291-.02-1.288-.02-2.327-3.465.748-4.187-1.495-4.187-1.495-.557-1.454-1.382-1.828-1.382-1.828-1.134-.769.083-.769.083-.769 1.257.083 1.919 1.288 1.919 1.288 1.114 1.911 2.907 1.371 3.629 1.039.103-.81.433-1.371.784-1.683-2.763-.291-5.67-1.371-5.67-6.192 0-1.371.495-2.493 1.278-3.365-.124-.312-.557-1.6.124-3.324 0 0 1.052-.332 3.424 1.288 1-.29 2.042-.415 3.114-.415 1.052 0 2.124.146 3.114.415 2.372-1.62 3.424-1.288 3.424-1.288.681 1.724.247 3.012.124 3.324.804.872 1.278 1.994 1.278 3.365 0 4.82-2.907 5.88-5.691 6.192.454.395.845 1.142.845 2.327 0 1.683-.02 3.033-.02 3.449 0 .332.227.727.845.603 4.953-1.663 8.519-6.359 8.519-11.907C24.932 5.611 19.33 0 12.466 0z"
                fill="#fff"
              />
            </svg>
          </a>

          <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle theme">
            <svg
              v-if="isDark"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="sun-icon"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="moon-icon"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          <button
            @click="toggleMobileMenu"
            class="mobile-menu-toggle"
            aria-label="Toggle mobile menu"
          >
            <div class="burger-icon" :class="{ open: mobileMenuOpen }">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>
    </header>
    <div class="overlay" :class="{ visible: mobileMenuOpen }" @click="closeMobileMenu"></div>
    <main class="main-content" @click="closeMobileMenu">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <footer class="footer">
      <p>© {{ new Date().getFullYear() }} Randomalit</p>
    </footer>
    <div class="overlay" :class="{ visible: mobileMenuOpen }" @click="closeMobileMenu"></div>
  </div>
</template>

<style>

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}

:root.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
}

body {
  margin: 0;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s ease;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  width: 100%;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: hsl(var(--background));
  border-bottom: 1px solid hsl(var(--border));
  padding: 0.75rem 1.5rem;
  transition: background-color 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-container {
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

.logo-container a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: hsl(var(--foreground));
}

.logo {
  height: 30px;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.main-nav {
  display: none;
}

.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
  border-radius: var(--radius);
}

.nav-link:hover {
  color: hsl(var(--foreground));
}

.router-link-exact-active {
  color: hsl(var(--foreground));
}

.controls {
  display: flex;
  align-items: center;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsl(var(--foreground));
  border-radius: var(--radius);
  transition: background-color 0.2s ease;
}

.theme-toggle:hover {
  /* background-color: hsl(var(--muted)); */
}

.sun-icon,
.moon-icon {
  transition: transform 0.2s ease;
}

.theme-toggle:hover .sun-icon,
.theme-toggle:hover .moon-icon {
  transform: rotate(12deg);
}

.main-content {
  flex: 1;
  padding: 2rem 1.5rem;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.footer {
  padding: 1.5rem;
  border-top: 1px solid hsl(var(--border));
  text-align: center;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  width: 100%;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (min-width: 768px) {
  .main-nav {
    display: flex;
    gap: 0.5rem;
  }
}

@media (min-width: 1024px) {
  .main-content {
    padding: 2.5rem 2rem;
  }

  .nav-container {
    padding: 0 1rem;
  }
}

.mobile-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 1rem;
  display: none;
}

.burger-icon {
  width: 24px;
  height: 18px;
  position: relative;
  transition: all 0.3s ease;
}

.burger-icon span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background-color: hsl(var(--foreground));
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: all 0.25s ease-in-out;
}

.burger-icon span:nth-child(1) {
  top: 0px;
}

.burger-icon span:nth-child(2) {
  top: 8px;
}

.burger-icon span:nth-child(3) {
  top: 16px;
}

.burger-icon.open span:nth-child(1) {
  top: 8px;
  transform: rotate(135deg);
}

.burger-icon.open span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.burger-icon.open span:nth-child(3) {
  top: 8px;
  transform: rotate(-135deg);
}

@media (max-width: 767px) {
  .mobile-menu-toggle {
    display: flex;
  }

  .main-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: hsl(var(--background));
    padding: 6rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 40;
    gap: 1.5rem;
  }

  .main-nav.mobile-open {
    transform: translateX(0);
  }

  .nav-link {
    font-size: 1.125rem;
    padding: 0.75rem 1rem;
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.overlay.visible {
  opacity: 1;
  visibility: visible;
}
</style>
