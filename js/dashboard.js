import { requireAuth, renderNavUser } from './auth.js';
requireAuth();
renderNavUser(document.getElementById('app-nav'));

import { LESSONS as L1 } from './data/module1.js';
import { LESSONS as L2 } from './data/module2.js';
import { LESSONS as L3 } from './data/module3.js';
import { LESSONS as L4 } from './data/module4.js';
import { LESSONS as L5 } from './data/module5.js';
import { LESSONS as L6 } from './data/module6.js';
import { LESSONS as L7 } from './data/module7.js';
import { LESSONS as L8 } from './data/module8.js';
import { LESSONS as L9 } from './data/module9.js';
import { LESSONS as L10 } from './data/module10.js';
import { loadProgress, isModuleUnlocked } from './data/progress.js';

const MODULES = [
    { id: 1,  title: "Điều hướng",          cmds: "pwd · ls · cd",             desc: "Đọc đường dẫn, liệt kê file, di chuyển giữa các thư mục.",                   lessons: L1  },
    { id: 2,  title: "Thao tác File",        cmds: "touch · mkdir · rm · cp · mv · cat", desc: "Tạo, sao chép, di chuyển và xóa file và thư mục.",               lessons: L2  },
    { id: 3,  title: "Text & Pipes",         cmds: "grep · head · tail · | · >", desc: "Lọc nội dung, nối lệnh với pipe và redirect.",                             lessons: L3  },
    { id: 4,  title: "Xử lý Text",           cmds: "wc · sort · uniq · cut",    desc: "Đếm, sắp xếp, lọc trùng và cắt cột từ dữ liệu văn bản.",                   lessons: L4  },
    { id: 5,  title: "Tìm kiếm",             cmds: "find · which · whereis",    desc: "Tìm file theo tên và kiểu, xác định vị trí lệnh trong hệ thống.",           lessons: L5  },
    { id: 6,  title: "Phân quyền",           cmds: "ls -l · chmod · chown",     desc: "Đọc và thay đổi quyền truy cập file trong Linux.",                          lessons: L6  },
    { id: 7,  title: "Tiến trình",           cmds: "ps · kill",                 desc: "Xem danh sách tiến trình đang chạy và dừng chúng.",                         lessons: L7  },
    { id: 8,  title: "Chỉnh sửa Văn bản",   cmds: "sed · tr · tee",            desc: "Biến đổi văn bản, thay thế ký tự và lưu kết quả đồng thời.",                lessons: L8  },
    { id: 9,  title: "Thông tin Hệ thống",  cmds: "id · uptime · free · df · man", desc: "Đọc trạng thái hệ thống, tra cứu tài liệu lệnh ngay trong terminal.",   lessons: L9  },
    { id: 10, title: "Liên kết & Nâng cao", cmds: "ln -s · file · top · killall", desc: "Tạo symbolic link, nhận diện kiểu file, quản lý tiến trình nâng cao.",   lessons: L10 },
];

const LESSON_COUNTS = Object.fromEntries(MODULES.map(m => [m.id, m.lessons.length]));
const TOTAL_LESSONS = MODULES.reduce((s, m) => s + m.lessons.length, 0);

function render() {
    const progress = loadProgress();

    // Overall lesson count
    const doneLessons = MODULES.reduce((s, m) => {
        return s + (progress.modules[String(m.id)]?.completed?.length ?? 0);
    }, 0);
    const pct = TOTAL_LESSONS > 0 ? Math.round((doneLessons / TOTAL_LESSONS) * 100) : 0;

    document.getElementById('dash-overall-fill').style.width = pct + '%';
    document.getElementById('dash-stat').textContent =
        `${doneLessons} / ${TOTAL_LESSONS} bài học hoàn thành`;

    // Next 3: unlocked and not 100% done
    const nextModules = MODULES.filter(m => {
        const unlocked = isModuleUnlocked(m.id, LESSON_COUNTS);
        const done = progress.modules[String(m.id)]?.completed?.length ?? 0;
        return unlocked && done < LESSON_COUNTS[m.id];
    }).slice(0, 3);

    const displayModules = nextModules.length > 0 ? nextModules : MODULES.slice(0, 3);

    document.getElementById('dash-next-cards').innerHTML = displayModules.map(m => {
        const done = progress.modules[String(m.id)]?.completed?.length ?? 0;
        const total = LESSON_COUNTS[m.id];
        const cardPct = Math.round((done / total) * 100);
        return `
            <a class="dash-card" href="lesson.html?module=${m.id}">
                <div class="dash-card-badge">MODULE ${m.id}</div>
                <div class="dash-card-title">${m.title}</div>
                <div class="dash-card-cmds">${m.cmds}</div>
                <div class="dash-card-desc">${m.desc}</div>
                <div class="dash-card-progress">
                    <div class="dash-card-bar">
                        <div class="dash-card-fill" style="width:${cardPct}%"></div>
                    </div>
                    <span class="dash-card-stat">${done} / ${total}</span>
                </div>
                <div class="dash-card-action">Học ngay →</div>
            </a>`;
    }).join('');
}

render();