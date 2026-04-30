function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.btn-submit');
  btn.textContent = 'Заявка отправлена ✓';
  btn.style.background = '#336859';
  btn.disabled = true;
  form.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
}

// Reviews carousel
(function() {
  const track = document.getElementById('reviews-track');
  const cards = track.querySelectorAll('.review-card');
  let idx = 0;
  const visible = 3;
  const total = cards.length;

  function getCardWidth() {
    const wrap = track.parentElement;
    const gap = 20;
    return (wrap.offsetWidth - gap * (visible - 1)) / visible;
  }

  function update() {
    const w = getCardWidth();
    track.style.transform = `translateX(-${idx * (w + 20)}px)`;
  }

  document.getElementById('rev-prev').addEventListener('click', () => {
    if (idx > 0) { idx--; update(); }
  });
  document.getElementById('rev-next').addEventListener('click', () => {
    if (idx < total - visible) { idx++; update(); }
  });

  window.addEventListener('resize', update);
})();

// FAQ accordion
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wrap = item.querySelector('.faq-a-wrap');
  const isOpen = item.classList.contains('open');
  // close all
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-a-wrap').style.maxHeight = '0';
  });
  if (!isOpen) {
    item.classList.add('open');
    wrap.style.maxHeight = wrap.scrollHeight + 'px';
  }
}

// Active nav on scroll
const sections = document.querySelectorAll('section[id], section');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}