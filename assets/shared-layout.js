document.addEventListener('DOMContentLoaded', () => {
  const navbar = `
  <header class="minimal-header">
    <a href="/" class="brand-link">
      <div>
        <div class="brand-title">Coach Tejaswi</div>
        <div class="brand-sub">Quietwork • Reflections • Personal Growth</div>
      </div>
    </a>
    <nav class="minimal-nav">
      <a href="/">Home</a>
      <a href="/embracing-failure">Embracing Failure</a>
      <a href="/failure-letters.html">Failure Letters</a>
      <a href="/books">Books</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="https://coachtejaswi.substack.com/" target="_blank">Reflections</a>
    </nav>
  </header>`;

  const footer = `
  <footer>
    <div>© 2026 Tejaswi Khanna</div>
    <div>
      <a href="https://instagram.com/coachtejaswi" target="_blank">Instagram</a> • 
      <a href="https://www.linkedin.com/in/tejaswikhanna" target="_blank">LinkedIn</a>
    </div>
  </footer>`;

  const navbarContainer = document.getElementById('shared-navbar');
  const footerContainer = document.getElementById('shared-footer');

  if (navbarContainer) navbarContainer.innerHTML = navbar;
  if (footerContainer) footerContainer.innerHTML = footer;
});