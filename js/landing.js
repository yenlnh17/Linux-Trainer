import { GOOGLE_CLIENT_ID as CLIENT_ID } from './config.js';
import { saveUser, decodeJwt, getUser } from './auth.js';

if (getUser()) window.location.href = "index.html";

// ── Typing animation ──────────────────────────────────────────────────────────
const SEQ = [
    { t: 'cmd', s: 'pwd' },
    { t: 'out', s: '/home/student' },
    { t: 'cmd', s: 'ls' },
    { t: 'out', s: 'documents/  photos/  notes.txt' },
    { t: 'cmd', s: 'cd documents' },
    { t: 'cmd', s: 'cat notes.txt' },
    { t: 'out', s: 'Học Linux mỗi ngày 10 phút!' },
    { t: 'cmd', s: 'grep "Linux" notes.txt' },
    { t: 'out', s: 'Học Linux mỗi ngày 10 phút!' },
    { t: 'cmd', s: 'ls -l' },
    { t: 'out', s: '-rw-r--r-- 1 student  notes.txt' },
];

let si = 0, ci = 0;

function typeTick() {
    const el = document.getElementById('hero-term-lines');
    if (!el) return;
    if (si >= SEQ.length) {
        setTimeout(() => { si = 0; ci = 0; el.innerHTML = ''; typeTick(); }, 2500);
        return;
    }
    const line = SEQ[si];
    if (ci === 0) {
        const row = document.createElement('div');
        row.className = 'ht-line ' + (line.t === 'cmd' ? 'ht-cmd' : 'ht-out');
        row.innerHTML = line.t === 'cmd'
            ? '<span class="ht-ps">$ </span><span class="ht-txt"></span>'
            : '<span class="ht-txt"></span>';
        el.appendChild(row);
        if (el.children.length > 10) el.removeChild(el.firstElementChild);
    }
    el.lastElementChild.querySelector('.ht-txt').textContent = line.s.slice(0, ci + 1);
    ci++;
    if (ci >= line.s.length) {
        ci = 0; si++;
        setTimeout(typeTick, line.t === 'cmd' ? 650 : 240);
    } else {
        setTimeout(typeTick, line.t === 'cmd' ? 72 : 16);
    }
}

// ── Module grid ───────────────────────────────────────────────────────────────
const MODS = [
    { n: 1,  icon: '🗺️',  title: 'Điều hướng',           cmds: 'pwd · ls · cd' },
    { n: 2,  icon: '📁',  title: 'Thao tác File',         cmds: 'touch · mkdir · rm · cp · mv' },
    { n: 3,  icon: '🔗',  title: 'Text & Pipes',          cmds: 'grep · head · tail · | · >' },
    { n: 4,  icon: '📊',  title: 'Xử lý Text',            cmds: 'wc · sort · uniq · cut' },
    { n: 5,  icon: '🔍',  title: 'Tìm kiếm',              cmds: 'find · which · whereis' },
    { n: 6,  icon: '🔐',  title: 'Phân quyền',            cmds: 'ls -l · chmod · chown' },
    { n: 7,  icon: '⚙️',  title: 'Tiến trình',            cmds: 'ps · kill · ps aux' },
    { n: 8,  icon: '✏️',  title: 'Chỉnh sửa Văn bản',    cmds: 'sed · tr · tee' },
    { n: 9,  icon: '📡',  title: 'Thông tin Hệ thống',   cmds: 'id · uptime · free · df · man' },
    { n: 10, icon: '🔗',  title: 'Liên kết & Nâng cao',  cmds: 'ln -s · file · top · killall' },
];

// ── GIS init ──────────────────────────────────────────────────────────────────
function initGis() {
    if (!window.google?.accounts?.id) return;
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback(res) {
            const p = decodeJwt(res.credential);
            saveUser(p.name, p.email, p.picture, p.exp * 1000);
            window.location.href = 'index.html';
        },
    });
    const renderBtn = (id, theme) => {
        const el = document.getElementById(id);
        if (el) google.accounts.id.renderButton(el, { size: 'large', locale: 'vi', text: 'signin_with', theme });
    };
    renderBtn('gsi-btn-nav',  'outline');
    renderBtn('gsi-btn-hero', 'outline');
    renderBtn('gsi-btn-cta',  'filled_black');
}

window._onGisLoad = initGis;
if (window.google?.accounts?.id) initGis();

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('lnd-mod-grid');
    if (grid) {
        grid.innerHTML = MODS.map(m => `
            <div class="lnd-mod-card">
                <div class="lnd-mod-num">MODULE ${m.n}</div>
                <div class="lnd-mod-icon">${m.icon}</div>
                <div class="lnd-mod-title">${m.title}</div>
                <div class="lnd-mod-cmds">${m.cmds}</div>
            </div>`).join('');
    }
    setTimeout(typeTick, 700);
});