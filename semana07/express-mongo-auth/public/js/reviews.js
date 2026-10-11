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
      article.appendChild(img);
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

  async function load() {
    try {
      const reviews = await api('/api/reviews');
      grid.replaceChildren(...reviews.map(card));
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
