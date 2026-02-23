(function () {
  function init(section) {
    if (!section) return;

    // Keep editor stable (no weird behavior)
    const animEnabled = section.getAttribute('data-anim') === 'true';
    if (!animEnabled) return;

    section.classList.add('is-anim');

    // Reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('is-visible');
      return;
    }

    // Theme editor: still allow preview (safe + stable)
    // (We are not doing parallax/scroll effects here.)
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add('is-visible');
          obs.disconnect();
        }
      });
    }, { threshold: 0.18 });

    obs.observe(section);
  }

  function boot() {
    document.querySelectorAll('.lx-editorial[data-section-id]').forEach(init);
  }

  document.addEventListener('DOMContentLoaded', boot);

  // Shopify editor live reload support
  document.addEventListener('shopify:section:load', function (e) {
    const root = e.target;
    if (!root) return;
    root.querySelectorAll('.lx-editorial[data-section-id]').forEach(init);
  });
})();