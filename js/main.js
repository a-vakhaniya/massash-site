function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.btn-submit');

  const data = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    service: document.getElementById('service').value,
    message: document.getElementById('comment').value
  };

  btn.textContent = 'Отправляем...';
  btn.disabled = true;

  fetch('https://n8n.ezi.ru/webhook/massash-form', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  .then(() => {
    btn.textContent = 'Заявка отправлена ✓';
    btn.style.background = '#336859';
    form.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
  })
  .catch(() => {
    btn.textContent = 'Ошибка — попробуйте ещё раз';
    btn.disabled = false;
  });
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

// Review expand/collapse
function toggleReview(btn) {
  const text = btn.previousElementSibling;
  const isExpanded = text.style.webkitLineClamp === 'unset';
  text.style.webkitLineClamp = isExpanded ? '4' : 'unset';
  text.style.overflow = isExpanded ? 'hidden' : 'visible';
  btn.textContent = isExpanded ? 'Читать полностью →' : 'Свернуть ↑';
}

document.querySelectorAll('.review-text').forEach(function(el) {
  var btn = document.createElement('button');
  btn.textContent = 'Читать полностью →';
  btn.onclick = function() { toggleReview(this); };
  btn.style.cssText = 'font-size:0.8rem;color:#2d6a4f;cursor:pointer;background:none;border:none;padding:4px 0;display:block;margin-top:6px;';
  el.parentNode.insertBefore(btn, el.nextSibling);
});