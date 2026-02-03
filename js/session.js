const SESSION_KEY = "TEACHER_ID";
const TIME_KEY = "LOGIN_TIME";
const MAX_TIME = 1000 * 60 * 60 * 8; // 8h

export function saveSession(id) {
  localStorage.setItem(SESSION_KEY, id);
  localStorage.setItem(TIME_KEY, Date.now());
}

export function checkSession() {
  const id = localStorage.getItem(SESSION_KEY);
  const t  = localStorage.getItem(TIME_KEY);
  if (!id || !t) return false;
  return Date.now() - Number(t) < MAX_TIME;
}
