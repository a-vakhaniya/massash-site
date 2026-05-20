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
  if (!track) return;
  const cards = track.querySelectorAll('.review-card');
  const total = cards.length;
  let idx = 0;

  function isMobile() { return window.innerWidth <= 768; }

  function getCardWidth() {
    const wrap = track.parentElement;
    if (isMobile()) return wrap.offsetWidth;
    const gap = 20;
    return (wrap.offsetWidth - gap * 2) / 3;
  }

  function update() {
    const w = getCardWidth();
    if (isMobile()) {
      cards.forEach(c => { c.style.width = w + 'px'; c.style.flexBasis = w + 'px'; });
      track.style.transform = `translateX(-${idx * w}px)`;
    } else {
      cards.forEach(c => { c.style.width = ''; c.style.flexBasis = ''; });
      track.style.transform = `translateX(-${idx * (w + 20)}px)`;
    }
    updateDots();
  }

  const prevBtn = document.getElementById('rev-prev');
  const nextBtn = document.getElementById('rev-next');
  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (idx > 0) { idx--; update(); }
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const visible = isMobile() ? 1 : 3;
    if (idx < total - visible) { idx++; update(); }
  });

  window.addEventListener('resize', () => {
    const visible = isMobile() ? 1 : 3;
    idx = Math.min(idx, Math.max(0, total - visible));
    rebuildDots();
    update();
  });

  // Dots
  let dotsContainer = null;

  function rebuildDots() {
    if (!isMobile()) {
      if (dotsContainer) { dotsContainer.remove(); dotsContainer = null; }
      return;
    }
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'reviews-dots';
      track.parentElement.insertAdjacentElement('afterend', dotsContainer);
    }
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot' + (i === idx ? ' active' : '');
      dot.setAttribute('aria-label', 'Отзыв ' + (i + 1));
      (function(i) {
        dot.addEventListener('click', () => { idx = i; update(); });
      })(i);
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.reviews-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    if (!isMobile()) return;
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) < 40) return;
    if (delta > 0 && idx < total - 1) { idx++; update(); }
    else if (delta < 0 && idx > 0) { idx--; update(); }
  });

  rebuildDots();
  update();
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