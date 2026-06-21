/* login.js - validate credentials and redirect to dashboard */
(function () {
  // If already logged in, skip login
  if (localStorage.getItem(STORAGE_KEYS.AUTH)) {
    window.location.href = 'dashboard.html';
    return;
  }
  const form = document.getElementById('loginForm');
  const errEl = document.getElementById('loginError');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    errEl.classList.add('hidden');
    errEl.textContent = '';
    if (!username || !password) {
      errEl.textContent = 'Please enter username and password.';
      errEl.classList.remove('hidden');
      return;
    }
    // Demo credentials
    if (username === 'admin' && password === '12345') {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ username, ts: Date.now() }));
      showToast('Login successful');
      setTimeout(() => (window.location.href = 'dashboard.html'), 400);
    } else {
      errEl.textContent = 'Invalid username or password.';
      errEl.classList.remove('hidden');
    }
  });
})();

