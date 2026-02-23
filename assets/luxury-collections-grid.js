(function () {
  const SELECTOR = '.lx-colgrid';

  function applyVisibility(section) {
    const grid = section.querySelector('.lx-colgrid__grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.lx-card'));
    const desktopVisible = parseInt(section.getAttribute('data-desktop-visible') || '12', 10);
    const mobileVisible = parseInt(section.getAttribute('data-mobile-visible') || '8', 10);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const limit = isMobile ? mobileVisible : desktopVisible;

    cards.forEach((card, idx) => {
      if (idx < limit) {
        card.removeAttribute('hidden');
        card.style.display = '';
      } else {
        card.setAttribute('hidden', 'hidden');
        card.style.display = 'none';
      }
    });
  }

  function initOne(section) {
    if (!section || section.dataset.lxInit === 'true') return;
    section.dataset.lxInit = 'true';

    const onResize = () => applyVisibility(section);
    applyVisibility(section);

    window.addEventListener('resize', onResize);

    // store cleanup handler
    section._lxCleanup = () => window.removeEventListener('resize', onResize);
  }

  function initAll(root = document) {
    root.querySelectorAll(SELECTOR).forEach(initOne);
  }

  // Normal load
  document.addEventListener('DOMContentLoaded', () => initAll());

  // Theme editor support
  document.addEventListener('shopify:section:load', (e) => {
    const container = document.querySelector(`[data-section-id="${e.detail.sectionId}"]`);
    if (container && container.classList.contains('lx-colgrid')) {
      // allow re-init
      container.dataset.lxInit = 'false';
      initOne(container);
      applyVisibility(container);
    } else {
      initAll();
    }
  });

  document.addEventListener('shopify:section:unload', (e) => {
    const container = document.querySelector(`[data-section-id="${e.detail.sectionId}"]`);
    if (container && container._lxCleanup) container._lxCleanup();
  });

})();