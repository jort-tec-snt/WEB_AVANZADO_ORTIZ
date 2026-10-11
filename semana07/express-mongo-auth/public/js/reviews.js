(() => {
  'use strict';

  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  const admin = grid.dataset.admin === 'true';
  const form = document.getElementById('reviewForm');
  const message = document.getElementById('reviewMessage');
  const MAX_SIDE = 800;

  function say(text, ok = false) {
    message.textContent = text;
    message.className = ok ? 'green-text' : 'red-text';
  }

  async function api(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    if (response.status === 401) {
      sessionStorage.removeItem('token');
      location.href = '/signIn';
    }
    if (response.status === 204) return null;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'No se pudo completar la solicitud');
    return data;
  }

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  // Reduce la imagen en el navegador para que quepa holgada en el límite de 1 MB.
  function toDataUrl(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(image.src);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      image.onerror = () => reject(new Error('No se pudo leer la imagen'));
      image.src = URL.createObjectURL(file);
    });
  }

  function card(review, index) {
    const article = el('article', 'reel-card');
    if (review.hasImage) {
      const img = el('img', 'reel-poster reel-poster--img');
      img.src = `/api/reviews/${review.id}/image?v=${encodeURIComponent(review.updatedAt)}`;
      img.alt = `Carátula de ${review.title}`;
      img.loading = 'lazy';
      const zoom = el('a', 'reel-zoom');
      zoom.href = `/api/reviews/${review.id}/image?v=${encodeURIComponent(review.updatedAt)}`;
      zoom.target = '_blank';
      zoom.rel = 'noopener';
      zoom.title = 'Ver carátula completa';
      zoom.appendChild(img);
      article.appendChild(zoom);
    } else {
      article.appendChild(el('div', 'reel-poster', String(index + 1).padStart(2, '0')));
    }
    article.appendChild(el('h6', '', review.title));
    const meta = [review.year, review.minutes ? `${review.minutes} min` : '', review.format].filter(Boolean).join(' · ');
    article.appendChild(el('p', 'reel-meta', meta));
    article.appendChild(el('p', 'reel-tags', review.tags));
    article.appendChild(el('span', 'reel-score', `Nota: ${review.score}/10`));

    const details = el('details');
    details.appendChild(el('summary', '', 'LEER // RESEÑA'));
    details.appendChild(el('p', '', review.text));
    article.appendChild(details);

    if (admin) {
      const actions = el('div', 'reel-actions');
      const edit = el('button', 'btn', 'Editar');
      edit.type = 'button';
      edit.addEventListener('click', () => startEdit(review));
      const remove = el('button', 'btn reel-danger', 'Eliminar');
      remove.type = 'button';
      remove.addEventListener('click', () => removeReview(review));
      actions.append(edit, remove);
      article.appendChild(actions);
    }
    return article;
  }

  // ---- Cartelera 3D: la carátula activa avanza como un fotograma ----
  const stage = document.getElementById('reelStage');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reel = { slides: [], data: [], active: 0, paused: false, hover: false, visible: true };

  function showCaption() {
    const review = reel.data[reel.active];
    document.getElementById('reelTitle').textContent = review.title;
    document.getElementById('reelMeta').textContent =
      [review.year, review.minutes ? `${review.minutes} min` : '', review.format, `Nota ${review.score}/10`].filter(Boolean).join(' · ');
    document.getElementById('reelTags').textContent = review.tags;
    const text = document.getElementById('reelText');
    text.textContent = review.text;
    text.classList.remove('is-open');
    document.getElementById('reelMore').textContent = 'Leer completa';
  }

  function layoutReel(flash) {
    const total = reel.slides.length;
    reel.slides.forEach((slide, i) => {
      let offset = i - reel.active;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;
      const distance = Math.abs(offset);
      slide.style.setProperty('--x', `${offset * 58}%`);
      slide.style.setProperty('--r', `${Math.sign(-offset) * (distance ? 44 : 0)}deg`);
      slide.style.setProperty('--z', `${-distance * 150}px`);
      slide.style.opacity = distance > 2 ? 0 : 1 - distance * 0.32;
      slide.style.zIndex = 10 - distance;
      slide.style.pointerEvents = distance > 2 ? 'none' : 'auto';
      slide.classList.toggle('is-active', offset === 0);
      slide.tabIndex = distance > 2 ? -1 : 0;
      if (offset === 0 && flash) {
        slide.classList.remove('flash');
        void slide.offsetWidth; // reinicia la barrida de luz
        slide.classList.add('flash');
      }
    });
  }

  function goTo(index) {
    const total = reel.slides.length;
    reel.active = (index + total) % total;
    layoutReel(true);
    showCaption();
  }

  function renderStage(reviews) {
    reel.data = reviews;
    reel.slides = reviews.map((review, index) => {
      const slide = el('button', 'reel-slide');
      slide.type = 'button';
      slide.setAttribute('aria-label', `Ver ${review.title}`);
      if (review.hasImage) {
        const img = el('img');
        img.src = `/api/reviews/${review.id}/image?v=${encodeURIComponent(review.updatedAt)}`;
        img.alt = '';
        slide.appendChild(img);
      } else {
        slide.appendChild(el('span', 'reel-slide-title', review.title));
      }
      slide.addEventListener('click', () => goTo(index));
      return slide;
    });
    document.getElementById('reelTrack').replaceChildren(...reel.slides);
    stage.hidden = reviews.length === 0;
    if (reviews.length) {
      reel.active = Math.min(reel.active, reviews.length - 1);
      layoutReel(false);
      showCaption();
    }
  }

  if (stage) {
    const viewport = document.getElementById('reelViewport');
    const pause = document.getElementById('reelPause');
    const caption = document.getElementById('reelCaption');

    document.getElementById('reelPrev').addEventListener('click', () => goTo(reel.active - 1));
    document.getElementById('reelNext').addEventListener('click', () => goTo(reel.active + 1));
    document.getElementById('reelMore').addEventListener('click', event => {
      const open = document.getElementById('reelText').classList.toggle('is-open');
      event.currentTarget.textContent = open ? 'Leer menos' : 'Leer completa';
    });
    pause.addEventListener('click', () => {
      reel.paused = !reel.paused;
      pause.textContent = reel.paused ? 'Reanudar' : 'Pausar';
      pause.setAttribute('aria-pressed', String(reel.paused));
      caption.setAttribute('aria-live', reel.paused ? 'polite' : 'off');
    });
    stage.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') goTo(reel.active - 1);
      if (event.key === 'ArrowRight') goTo(reel.active + 1);
    });

    // Inclinación con el mouse, solo sobre la activa y sin "reducir movimiento"
    viewport.addEventListener('pointermove', event => {
      reel.hover = true;
      if (reduced.matches) return;
      const box = viewport.getBoundingClientRect();
      const nx = (event.clientX - box.left) / box.width - 0.5;
      const ny = (event.clientY - box.top) / box.height - 0.5;
      stage.style.setProperty('--tx', `${(-ny * 8).toFixed(2)}deg`);
      stage.style.setProperty('--ty', `${(nx * 10).toFixed(2)}deg`);
    });
    viewport.addEventListener('pointerleave', () => {
      reel.hover = false;
      stage.style.setProperty('--tx', '0deg');
      stage.style.setProperty('--ty', '0deg');
    });

    // Deslizar para cambiar de película
    let startX = null;
    viewport.addEventListener('pointerdown', event => { startX = event.clientX; });
    viewport.addEventListener('pointerup', event => {
      if (startX !== null && Math.abs(event.clientX - startX) > 45) goTo(reel.active + (event.clientX < startX ? 1 : -1));
      startX = null;
    });

    // Autoavance lento: se detiene fuera de pantalla, en pestañas ocultas, al pasar el mouse o con "reducir movimiento"
    new IntersectionObserver(entries => { reel.visible = entries[0].isIntersecting; }).observe(stage);
    setInterval(() => {
      const idle = !reel.paused && !reel.hover && reel.visible && !document.hidden && !reduced.matches;
      if (idle && reel.slides.length > 1 && !stage.contains(document.activeElement)) goTo(reel.active + 1);
    }, 5500);
  }

  async function load() {
    try {
      const reviews = await api('/api/reviews');
      grid.replaceChildren(...reviews.map(card));
      if (stage) renderStage(reviews);
      if (reviews.length === 0) say('Aún no hay reseñas', true);
    } catch (error) {
      say(error.message);
    }
  }

  if (admin && form) {
    const title = document.getElementById('reviewFormTitle');
    const cancel = document.getElementById('cancelEdit');
    const removeRow = document.getElementById('removeImageRow');

    function resetForm() {
      form.reset();
      form.elements.id.value = '';
      title.textContent = 'Nueva reseña';
      cancel.hidden = true;
      removeRow.hidden = true;
    }

    window.startEdit = review => {
      form.reset();
      form.elements.id.value = review.id;
      ['title', 'year', 'minutes', 'format', 'tags', 'score', 'text'].forEach(name => {
        form.elements[name].value = review[name] ?? '';
      });
      title.textContent = `Editando: ${review.title}`;
      cancel.hidden = false;
      removeRow.hidden = !review.hasImage;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.removeReview = async review => {
      if (!confirm(`¿Eliminar la reseña de "${review.title}"?`)) return;
      try {
        await api(`/api/reviews/${review.id}`, { method: 'DELETE' });
        say('Reseña eliminada', true);
        await load();
      } catch (error) {
        say(error.message);
      }
    };

    cancel.addEventListener('click', resetForm);

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const id = data.id;
      const payload = {};
      ['title', 'year', 'minutes', 'format', 'tags', 'score', 'text'].forEach(name => {
        const numeric = ['year', 'minutes', 'score'].includes(name);
        if (!numeric || data[name] !== '') payload[name] = data[name];
      });
      try {
        const file = form.elements.image.files[0];
        if (file) payload.image = await toDataUrl(file);
        else if (form.elements.removeImage.checked) payload.image = null;
        await api(id ? `/api/reviews/${id}` : '/api/reviews', {
          method: id ? 'PUT' : 'POST',
          body: JSON.stringify(payload)
        });
        say(id ? 'Reseña actualizada' : 'Reseña creada', true);
        resetForm();
        await load();
      } catch (error) {
        say(error.message);
      }
    });
  }

  load();
})();
