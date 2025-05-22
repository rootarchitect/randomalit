<template>
  <div class="about">
    <h1>About Randomalit</h1>
    <div class="about-content">
      <section class="about-section">
        <h2>What is Randomalit?</h2>
        <p>
          Randomalit is a collection of useful random generation tools designed to make common
          development and security tasks easier. Whether you need a secure password, a UUID, to
          encode/decode text to Base64, or just want to roll a virtual dice, Randomalit has you
          covered with simple, easy-to-use tools.
        </p>
      </section>

      <section class="about-section">
        <h2>Our Tools</h2>
        <ul class="tools-list">
          <li>
            <strong>Password Generator</strong> - Create strong, customizable passwords with options
            for length and character types.
          </li>
          <li><strong>UUID Generator</strong> - Generate random UUIDs.</li>
          <li>
            <strong>Dice Roller</strong> - Roll a virtual dice with customizable number of sides.
          </li>
          <li>
            <strong>Color Generator</strong> - Generate random colors in HEX, RGB, and HSL formats.
          </li>
          <li>
            <strong>Palette Generator</strong> - Create random color palettes for design
            inspiration.
          </li>
        </ul>
      </section>

      <section class="about-section">
        <h2>Privacy First</h2>
        <p>
          All of our tools run entirely in your browser. No data is ever sent to any server,
          ensuring your sensitive information stays private. The random generation is handled by
          your browser's cryptographically secure random number generator when available.
        </p>
      </section>

      <section class="about-section">
        <h2>Open Source</h2>
        <p>
          Randomalit is open source and built with Vue.js. Feel free to check out the code,
          contribute, or report issues on our GitHub repository.
        </p>
        <p>
          <a
            href="https://github.com/rootarchitect/randomalit"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>
        </p>
      </section>
    </div>
  </div>
</template>

<style>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: hsl(var(--card));
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: hsl(var(--foreground));
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-section {
  margin-bottom: 1rem;
}

.about-section h2 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: hsl(var(--foreground));
}

.about-section p {
  line-height: 1.6;
  color: hsl(var(--foreground));
  margin-bottom: 1rem;
}

.tools-list {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.tools-list li {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

a {
  color: hsl(var(--primary));
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
