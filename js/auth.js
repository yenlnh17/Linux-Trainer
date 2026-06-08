import { GOOGLE_CLIENT_ID as CLIENT_ID } from './config.js';

const USER_KEY = "vlt_user_v1";

export function getUser() {
    try {
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        const u = JSON.parse(raw);
        if (u.exp && Date.now() > u.exp) {
            localStorage.removeItem(USER_KEY);
            return null;
        }
        return u;
    } catch { return null; }
}

export function saveUser(name, email, picture, exp) {
    localStorage.setItem(USER_KEY, JSON.stringify({ name, email, picture, exp }));
}

export function signOut() {
    localStorage.removeItem(USER_KEY);
    window.location.href = "landing.html";
}

export function requireAuth() {
    if (!getUser()) {
        window.location.href = "landing.html";
    }
}

export function renderNavUser(navEl) {
    const user = getUser();
    const bottom = navEl?.querySelector('.nav-bottom');
    if (!bottom || !user) return;
    bottom.innerHTML = `
        <div class="nav-user">
            <img class="nav-avatar" src="${_esc(user.picture)}" alt=""
                 referrerpolicy="no-referrer" />
            <div class="nav-user-info">
                <span class="nav-user-name">${_esc(user.name)}</span>
                <span class="nav-user-email">${_esc(user.email)}</span>
            </div>
        </div>
        <button class="nav-logout" id="nav-logout-btn">
            <span class="nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
            </span>
            Đăng xuất
        </button>`;
    bottom.querySelector('#nav-logout-btn').addEventListener('click', signOut);
}

export function decodeJwt(token) {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(
        atob(b64).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    ));
}

function _esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}