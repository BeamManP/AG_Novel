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
  // Nav visibility: hide during intro only
  // ----------------------------
  const introSection = document.getElementById('intro');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === 'intro') {
        if (entry.isIntersecting) {
          nav.classList.add('nav-hidden');
        } else {
          nav.classList.remove('nav-hidden');
        }
      }
    });
  }, {
    threshold: 0.1
  });

  navObserver.observe(introSection);

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

  // ----------------------------
  // Grok: hidden character reveal
  // ----------------------------
  const grokBtn = document.getElementById('grok-btn');
  const grokSection = document.getElementById('grok');
  const grokTrigger = document.getElementById('grok-trigger');
  const creditName = document.getElementById('credit-name');

  if (grokBtn && grokSection) {
    grokBtn.addEventListener('click', () => {
      // Show the section
      grokSection.style.display = 'block';

      // Register with theme observer
      themeObserver.observe(grokSection);

      // Change credit in atogaki
      if (creditName) {
        creditName.textContent = '2026/3/8 触手大好き・ビームマンP';
      }

      // Add Grok to footer model list
      const creditModels = document.getElementById('credit-models');
      if (creditModels) {
        creditModels.textContent = '生成：Claude Opus 4.6 ／ Gemini 3.1 Pro ／ ChatGPT 5.4 ／ Grok 4.1 Fast';
      }

      // Hide trigger
      grokTrigger.style.display = 'none';

      // Scroll to Grok
      setTimeout(() => {
        const navHeight = nav.offsetHeight;
        const top = grokSection.offsetTop - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 100);
    });
  }
});
