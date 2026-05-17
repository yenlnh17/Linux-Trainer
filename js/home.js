import { requireAuth, renderNavUser } from './auth.js';
requireAuth();
renderNavUser(document.getElementById('app-nav'));

import { LESSONS as LESSONS1 } from './data/module1.js';
import { LESSONS as LESSONS2 } from './data/module2.js';
import { LESSONS as LESSONS3 } from './data/module3.js';
import { LESSONS as LESSONS4 } from './data/module4.js';
import { LESSONS as LESSONS5 } from './data/module5.js';
import { LESSONS as LESSONS6 } from './data/module6.js';
import { LESSONS as LESSONS7 } from './data/module7.js';
import { LESSONS as LESSONS8 } from './data/module8.js';
import { LESSONS as LESSONS9 } from './data/module9.js';
import { LESSONS as LESSONS10 } from './data/module10.js';
import { loadProgress, isModuleUnlocked } from './data/progress.js';

const MODULES = [
    {
        id: 1,
        badge: "MODULE 1",
        title: "Điều hướng",
        cmds: "pwd · ls · cd",
        desc: "Đọc đường dẫn, liệt kê file, di chuyển giữa các thư mục.",
        lessons: LESSONS1,
    },
    {
        id: 2,
        badge: "MODULE 2",
        title: "Thao tác File",
        cmds: "touch · mkdir · rm · cp · mv · cat",
        desc: "Tạo, sao chép, di chuyển và xóa file và thư mục.",
        lessons: LESSONS2,
    },
    {
        id: 3,
        badge: "MODULE 3",
        title: "Text & Pipes",
        cmds: "grep · head · tail · | · >",
        desc: "Lọc nội dung, nối lệnh với pipe và redirect.",
        lessons: LESSONS3,
    },
    {
        id: 4,
        badge: "MODULE 4",
        title: "Xử lý Text",
        cmds: "wc · sort · uniq · cut",
        desc: "Đếm, sắp xếp, lọc trùng và cắt cột từ dữ liệu văn bản.",
        lessons: LESSONS4,
    },
    {
        id: 5,
        badge: "MODULE 5",
        title: "Tìm kiếm",
        cmds: "find · which · whereis",
        desc: "Tìm file theo tên và kiểu, xác định vị trí lệnh trong hệ thống.",
        lessons: LESSONS5,
    },
    {
        id: 6,
        badge: "MODULE 6",
        title: "Phân quyền",
        cmds: "ls -l · chmod · chown",
        desc: "Đọc và thay đổi quyền truy cập file trong Linux.",
        lessons: LESSONS6,
    },
    {
        id: 7,
        badge: "MODULE 7",
        title: "Tiến trình",
        cmds: "ps · kill",
        desc: "Xem danh sách tiến trình đang chạy và dừng chúng.",
        lessons: LESSONS7,
    },
    {
        id: 8,
        badge: "MODULE 8",
        title: "Chỉnh sửa Văn bản",
        cmds: "sed · tr · tee",
        desc: "Biến đổi văn bản, thay thế ký tự và lưu kết quả đồng thời.",
        lessons: LESSONS8,
    },
    {
        id: 9,
        badge: "MODULE 9",
        title: "Thông tin Hệ thống",
        cmds: "id · uptime · free · df · man",
        desc: "Đọc trạng thái hệ thống, tra cứu tài liệu lệnh ngay trong terminal.",
        lessons: LESSONS9,
    },
    {
        id: 10,
        badge: "MODULE 10",
        title: "Liên kết & Nâng cao",
        cmds: "ln -s · file · top · killall",
        desc: "Tạo symbolic link, nhận diện kiểu file, quản lý tiến trình nâng cao.",
        lessons: LESSONS10,
    },
];

// Map moduleId → lesson count for unlock checks
const LESSON_COUNTS = Object.fromEntries(
    MODULES.map(m => [m.id, m.lessons?.length ?? m.totalLessons ?? 15])
);

function render() {
    const progress = loadProgress();
    const grid = document.getElementById("mod-grid");

    grid.innerHTML = MODULES.map(m => {
        const modProg = progress.modules[String(m.id)];
        const total = LESSON_COUNTS[m.id];
        const done = modProg?.completed?.length ?? 0;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const unlocked = isModuleUnlocked(m.id, LESSON_COUNTS);
        const canOpen = unlocked && m.lessons !== null;

        // Status line
        let statusText, statusCls;
        if (!unlocked) {
            statusText = `🔒 Hoàn thành Module ${m.id - 1} trước`;
            statusCls = "mod-status locked-status";
        } else if (!m.lessons) {
            statusText = "🚧 Sắp ra mắt";
            statusCls = "mod-status soon-status";
        } else if (done >= total) {
            statusText = "✓ Hoàn thành";
            statusCls = "mod-status done-status";
        } else if (done > 0) {
            statusText = `${done} / ${total} bài`;
            statusCls = "mod-status progress-status";
        } else {
            statusText = "MỞ KHÓA";
            statusCls = "mod-status open-status";
        }

        const inner = `
            <div class="mod-badge">${m.badge}</div>
            <div class="mod-title">${m.title}</div>
            <div class="mod-cmds">${m.cmds}</div>
            <div class="mod-desc">${m.desc}</div>
            <div class="mod-progress-bar">
                <div class="mod-progress-fill" style="width: ${pct}%"></div>
            </div>
            <div class="${statusCls}">${statusText}</div>`;

        if (canOpen) {
            return `<a class="mod-card" href="lesson.html?module=${m.id}">${inner}</a>`;
        }
        const extraCls = !unlocked ? " card-locked" : " card-soon";
        return `<div class="mod-card${extraCls}">${inner}</div>`;
    }).join("");
}

render();
