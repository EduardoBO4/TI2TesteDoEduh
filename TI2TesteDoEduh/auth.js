const AUTH_KEY = 'profeed_user';

function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch(e) { return null; }
}

function setUser(data) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'login.html';
}

function requireAuth() {
  if (!getUser()) window.location.href = 'login.html';
}

function redirectIfAuth() {
  if (getUser()) window.location.href = 'index.html';
}
