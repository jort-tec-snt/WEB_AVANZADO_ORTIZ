(() => {
  'use strict';

  const getToken = () => sessionStorage.getItem('token');

  function redirectToLogin() {
    sessionStorage.removeItem('token');
    location.href = '/signIn';
  }

  function logout() {
    redirectToLogin();
  }

  function showMessage(message, success = false) {
    const element = document.getElementById('message');
    if (!element) return;
    element.setAttribute('role', 'status');
    element.className = `auth-message ${success ? 'green' : 'red'}-text text-darken-2`;
    element.textContent = message;
  }

  async function readResponse(response) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'No se pudo completar la solicitud');
    return data;
  }

  async function authFetch(url, options = {}) {
    const token = getToken();
    if (!token) {
      redirectToLogin();
      throw new Error('Inicia sesión para continuar');
    }
    const response = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` }
    });
    if (response.status === 401) {
      redirectToLogin();
      throw new Error('Tu sesión ha caducado. Inicia sesión nuevamente');
    }
    if (response.status === 403) {
      location.href = '/403';
      throw new Error('Acceso denegado');
    }
    return readResponse(response);
  }

  function formValues(form, fields) {
    return Object.fromEntries(fields.map(field => [field, form.elements.namedItem(field).value]));
  }

  function bindForm(id, submit) {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type="submit"]');
      if (button.disabled) return;
      button.disabled = true;
      showMessage('');
      try {
        await submit(form);
      } catch (error) {
        showMessage(error.message || 'Error de conexión. Inténtalo de nuevo');
      } finally {
        button.disabled = false;
      }
    });
  }

  bindForm('signInForm', async form => {
    const response = await fetch('/api/auth/signIn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues(form, ['email', 'password']))
    });
    const data = await readResponse(response);
    sessionStorage.setItem('token', data.token);
    const user = await authFetch('/api/users/me');
    location.href = user.roles.includes('admin') ? '/admin/dashboard' : '/user/dashboard';
  });

  bindForm('signUpForm', async form => {
    const response = await fetch('/api/auth/signUp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues(form, [
        'name', 'lastName', 'phoneNumber', 'birthdate', 'email', 'password'
      ]))
    });
    const data = await readResponse(response);
    showMessage(data.message || 'Cuenta creada. Redirigiendo al inicio de sesión…', true);
    form.reset();
    setTimeout(() => { location.href = '/signIn'; }, 1500);
  });

  document.querySelectorAll('[data-logout]').forEach(button => {
    button.addEventListener('click', logout);
  });

  const editableFields = ['name', 'lastName', 'phoneNumber', 'birthdate', 'url_profile', 'address'];

  function displayUser(user) {
    document.querySelectorAll('[data-user-field]').forEach(element => {
      const value = user[element.dataset.userField];
      element.textContent = Array.isArray(value) ? value.join(', ') : (value ?? '—');
    });
    const back = document.getElementById('dashboardLink');
    if (back) back.href = user.roles.includes('admin') ? '/admin/dashboard' : '/user/dashboard';
    const form = document.getElementById('profileForm');
    if (form) {
      editableFields.forEach(field => {
        const value = user[field] ?? '';
        form.elements.namedItem(field).value = field === 'birthdate' ? value.slice(0, 10) : value;
      });
      if (window.M) window.M.updateTextFields();
    }
  }

  bindForm('profileForm', async form => {
    const user = await authFetch('/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues(form, editableFields))
    });
    displayUser(user);
    showMessage('Perfil actualizado correctamente', true);
  });

  async function loadPage() {
    const page = document.querySelector('[data-auth-page]');
    if (!page) return;
    try {
      const user = await authFetch('/api/users/me');
      if (page.dataset.authPage === 'admin' && !user.roles.includes('admin')) {
        location.href = '/403';
        return;
      }
      displayUser(user);
      document.getElementById('protectedContent').hidden = false;
      if (page.dataset.authPage === 'admin') {
        const users = await authFetch('/api/users');
        const tbody = document.getElementById('usersTableBody');
        tbody.replaceChildren();
        users.forEach(account => {
          const row = document.createElement('tr');
          const values = [
            account.name, account.lastName, account.email, account.phoneNumber,
            account.age, account.roles.join(', '),
            account.createdAt ? new Date(account.createdAt).toLocaleDateString('es-PE') : '—'
          ];
          values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value ?? '—';
            row.appendChild(cell);
          });
          tbody.appendChild(row);
        });
        if (users.length === 0) showMessage('No hay usuarios registrados', true);
      }
    } catch (error) {
      showMessage(error.message || 'No se pudieron cargar los datos');
    } finally {
      document.getElementById('loadingMessage').hidden = true;
    }
  }

  loadPage();
})();
