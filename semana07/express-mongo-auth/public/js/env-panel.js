(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const token = sessionStorage.getItem('token');

  async function checkHealth() {
    const chip = $('envHealth');
    const started = performance.now();
    try {
      const response = await fetch('/health');
      const data = await response.json();
      const ok = response.ok && data.ok;
      chip.textContent = ok ? 'En línea' : 'Con problemas';
      chip.classList.add(ok ? 'env-chip--ok' : 'env-chip--bad');
      $('envLatency').textContent = `${Math.round(performance.now() - started)} ms`;
    } catch {
      chip.textContent = 'Sin conexión';
      chip.classList.add('env-chip--bad');
    }
  }

  function showExpiry() {
    const note = $('envExpiry');
    let exp;
    try {
      exp = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp;
    } catch {
      return;
    }
    if (!exp) return;
    const tick = () => {
      const left = exp - Math.floor(Date.now() / 1000);
      note.textContent = left > 0
        ? `Expira en ${Math.floor(left / 60)} min ${left % 60} s`
        : 'Sesión expirada';
    };
    tick();
    setInterval(tick, 1000);
  }

  async function showRole() {
    try {
      const response = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) return;
      const { roles } = await response.json();
      $('envRole').textContent = roles.join(', ');
      document.querySelectorAll('#envAccess li').forEach(item => {
        const allowed = item.dataset.roles.split(',').some(role => roles.includes(role));
        item.classList.add(allowed ? 'env-access--yes' : 'env-access--no');
        const status = document.createElement('b');
        status.textContent = allowed ? '200 permitido' : '403 prohibido';
        item.appendChild(status);
      });
    } catch {
      /* el panel es informativo: si falla, el dashboard sigue funcionando */
    }
  }

  checkHealth();
  if (token) {
    showExpiry();
    showRole();
  }
})();
