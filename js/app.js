/**
 * AI Novel Comparison
 * - Intersection Observer でスクロール位置を検知し、テーマを自動切替
 * - ナビクリックでスムーズスクロール
 * - イントロ/アウトロ含む全セクション対応
 */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const sections = document.querySelectorAll('.novel-section');
  const navItems = document.querySelectorAll('.nav-item');
  const nav = document.querySelector('.llm-nav');

  // ----------------------------
  // Nav visibility: hide during intro & prologue
  // ----------------------------
  const introSection = document.getElementById('intro');
  const prologueSection = document.getElementById('prologue');
  let introVisible = true;
  let prologueVisible = true;

  function updateNavVisibility() {
    if (introVisible || prologueVisible) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
  }

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === 'intro') introVisible = entry.isIntersecting;
      if (entry.target.id === 'prologue') prologueVisible = entry.isIntersecting;
    });
    updateNavVisibility();
  }, {
    threshold: 0.1
  });

  navObserver.observe(introSection);
  if (prologueSection) navObserver.observe(prologueSection);

  // ----------------------------
  // Smooth scroll on nav click
  // ----------------------------
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        const navHeight = nav.offsetHeight;
        const top = target.offsetTop - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ----------------------------
  // Intersection Observer: theme switch on scroll
  // ----------------------------
  const themeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const llm = entry.target.dataset.llm;

        // テーマ切り替え
        body.dataset.theme = llm;

        // ナビのアクティブ状態更新（intro/outroではナビ非表示だが念のため）
        navItems.forEach(navItem => {
          navItem.classList.toggle('active', navItem.dataset.llm === llm);
        });
      }
    });
  }, {
    rootMargin: '-10% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => themeObserver.observe(section));
});
