document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const heroLogo = document.querySelector('.racing-banner-image');
  if (!header || !heroLogo) return;
  const update = () => header.classList.toggle('is-condensed', window.scrollY > heroLogo.offsetTop + heroLogo.offsetHeight);
  window.addEventListener('scroll', update, { passive: true });
  update();
});
