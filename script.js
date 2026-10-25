(() => {
  const progress = document.querySelector('.scroll-progress');
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-picture img');
  const statement = document.querySelector('.statement');
  const steps = [...document.querySelectorAll('.field-step')];
  const images = [...document.querySelectorAll('.field-image')];
  const count = document.querySelector('.field-count');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activePhoto = 0;
  let ticking = false;

  function setPhoto(index) {
    if (index === activePhoto) return;
    activePhoto = index;
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
    images.forEach((image, i) => image.classList.toggle('active', i === index));
    if (count) count.textContent = `0${index + 1} / 03`;
  }

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? Math.min(100, window.scrollY / max * 100) : 0}%`;
    if (heroImage && hero && !reducedMotion.matches && window.innerWidth > 760) {
      const y = Math.min(hero.offsetHeight, window.scrollY);
      heroImage.style.transform = `scale(1.04) translateY(${-y * .025}px)`;
    } else if (heroImage) heroImage.style.transform = '';
    if (steps.length && window.innerWidth > 760) {
      const midpoint = window.innerHeight * .48;
      let nearest = 0, distance = Infinity;
      steps.forEach((step, i) => {
        const rect = step.getBoundingClientRect();
        const delta = Math.abs(rect.top + Math.min(rect.height, window.innerHeight * .5) / 2 - midpoint);
        if (delta < distance) { distance = delta; nearest = i; }
      });
      setPhoto(nearest);
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  reducedMotion.addEventListener?.('change', update);
  update();

  if (statement && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        statement.classList.add('is-active');
        observer.disconnect();
      }
    }, { threshold: .25 });
    observer.observe(statement);
  } else statement?.classList.add('is-active');
})();
