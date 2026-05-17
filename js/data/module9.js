export const INIT_FS = {
    name: "home",
    type: "folder",
    children: [{
        name: "student",
        type: "folder",
        children: [{
            name: "scripts",
            type: "folder",
            children: [
                { name: "backup.sh",  type: "file", content: "#!/bin/bash\ntar -czf backup.tar.gz /home/student\necho Done" },
                { name: "monitor.sh", type: "file", content: "#!/bin/bash\nfree -h\ndf -h\nuptime" },
            ]
        }]
    }]
};

export const INIT_PATH = ["student"];

export const LESSONS = [
    {
        id: "9-1",
        title: "Lệnh id — danh tính người dùng",
        steps: [
            {
                type: "narrative",
                text: "Module 9 tập trung vào <strong>thông tin hệ thống</strong> — các lệnh giúp bạn hiểu môi trường đang làm việc mà không cần nhớ thông tin thủ công.",
                highlight: "breadcrumb",
            },
            {
                type: "narrative",
                text: "Lệnh <code>id</code> hiển thị danh tính của người dùng hiện tại: <strong>uid</strong> (user ID), <strong>gid</strong> (group ID), và các nhóm mà user thuộc về.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "id",
            hint: "Gõ id rồi nhấn Enter",
            onSuccess: {
                highlight: "idle",
                successNote: "uid=1000(student) — user 'student' với ID 1000, thuộc nhóm sudo. Trên Linux, UID 0 là root (superuser).",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-2",
        title: "Lệnh uptime — hệ thống chạy bao lâu",
        steps: [
            {
                type: "narrative",
                text: "Lệnh <code>uptime</code> cho biết: hệ thống đã chạy bao lâu kể từ lần khởi động cuối, số user đang đăng nhập, và <strong>load average</strong> (tải trung bình trong 1/5/15 phút qua).",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "uptime",
            hint: "Gõ uptime rồi nhấn Enter",
            onSuccess: {
                highlight: "idle",
                successNote: "Load average: 0.12, 0.08, 0.05 — hệ thống đang rảnh. Load > số CPU cores = hệ thống đang quá tải.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-3",
        title: "Lệnh free — xem RAM đã dùng",
        steps: [
            {
                type: "narrative",
                text: "Lệnh <code>free</code> hiển thị lượng bộ nhớ RAM: total, used, free, và available (có thể cấp phát ngay). Mặc định đơn vị là kilobytes.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "free",
            hint: "Gõ free rồi nhấn Enter",
            onSuccess: {
                highlight: "idle",
                successNote: "Output dạng kilobytes — khó đọc. Bài sau ta dùng flag -h để hiển thị đơn vị thân thiện hơn.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-4",
        title: "free -h — đơn vị dễ đọc",
        steps: [
            {
                type: "narrative",
                text: "Flag <code>-h</code> (<strong>h</strong>uman-readable) tự động chọn đơn vị phù hợp: K, M, G. Đây là flag phổ biến cho nhiều lệnh Linux (df -h, ls -lh, du -h...).",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "free -h",
            hint: "free -h",
            onSuccess: {
                highlight: "idle",
                successNote: "3.8G total, 1.2G used, 2.3G available — rõ ràng hơn nhiều so với con số kilobytes. Luôn dùng -h khi xem thủ công.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-5",
        title: "Lệnh df — dung lượng đĩa",
        steps: [
            {
                type: "narrative",
                text: "Lệnh <code>df</code> (<strong>d</strong>isk <strong>f</strong>ree) hiển thị thông tin dung lượng của các phân vùng đĩa: tổng dung lượng, đã dùng, còn trống, và phần trăm sử dụng.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "df",
            hint: "Gõ df rồi nhấn Enter",
            onSuccess: {
                highlight: "idle",
                successNote: "Output dạng 1K-blocks. Giống free, nên dùng -h cho dễ đọc.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-6",
        title: "df -h — dung lượng đĩa dễ đọc",
        steps: [
            {
                type: "narrative",
                text: "Dùng <code>df -h</code> để xem dung lượng đĩa theo đơn vị G/M. Cột <strong>Use%</strong> quan trọng nhất — nếu > 90% thì đĩa sắp đầy và cần dọn dẹp.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "df -h",
            hint: "df -h",
            onSuccess: {
                highlight: "idle",
                successNote: "/dev/sda1: 43% — OK. /home: 45% — thoải mái. Khi Use% vượt 90%, đây là dấu hiệu cần xóa file hoặc mở rộng đĩa.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-7",
        title: "Lệnh whatis — mô tả ngắn lệnh",
        steps: [
            {
                type: "narrative",
                text: "Không nhớ lệnh làm gì? <code>whatis</code> trả về mô tả một dòng của bất kỳ lệnh nào. Nhanh hơn <code>man</code> khi chỉ cần xác nhận tên lệnh.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "whatis ls",
            hint: "whatis ls",
            onSuccess: {
                highlight: "idle",
                successNote: "ls — list directory contents. Một dòng, súc tích. Thử whatis với các lệnh khác như grep, chmod, ps!",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-8",
        title: "whatis cho các lệnh đã học",
        steps: [
            {
                type: "narrative",
                text: "Hãy dùng <code>whatis</code> để xem mô tả của lệnh <code>chmod</code> — lệnh quan trọng bạn đã học ở Module 6.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "whatis chmod",
            hint: "whatis chmod",
            onSuccess: {
                highlight: "idle",
                successNote: "chmod — change file mode bits. whatis là công cụ tự tra cứu nhanh khi quên tên lệnh hoặc muốn xác nhận.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-9",
        title: "Lệnh man — trang hướng dẫn đầy đủ",
        steps: [
            {
                type: "narrative",
                text: "Lệnh <code>man</code> (<strong>man</strong>ual) hiển thị tài liệu đầy đủ của một lệnh: mô tả, cú pháp, tất cả options, và ví dụ. Đây là cách học lệnh mới tự lập.",
                highlight: "terminal-input",
            },
            {
                type: "narrative",
                text: "Cú pháp: <code>man &lt;tên_lệnh&gt;</code>. Trên Linux thật, man mở trong pager (thoát bằng q). Ở đây ta xem toàn bộ nội dung trực tiếp.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "man ls",
            hint: "man ls",
            onSuccess: {
                highlight: "idle",
                successNote: "Trang manual của ls — đầy đủ options. Kỹ năng dùng man là dấu hiệu của một Linux user thực thụ.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-10",
        title: "man cho lệnh sed",
        steps: [
            {
                type: "narrative",
                text: "Hãy xem trang manual của <code>sed</code> để xem mô tả đầy đủ — đặc biệt phần flags và cú pháp biểu thức.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "man sed",
            hint: "man sed",
            onSuccess: {
                highlight: "idle",
                successNote: "man sed cho thấy sed hỗ trợ nhiều hơn chỉ s/old/new/g. Đây là nền tảng để tự mở rộng kiến thức.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-11",
        title: "Xem script sử dụng lệnh hệ thống",
        steps: [
            {
                type: "narrative",
                text: "Thư mục <code>scripts/</code> chứa 2 file shell script. Script <code>monitor.sh</code> kết hợp các lệnh hệ thống ta vừa học. Hãy xem nội dung.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cat scripts/monitor.sh",
            hint: "cat scripts/monitor.sh",
            onSuccess: {
                highlight: "file:monitor.sh",
                successNote: "Script gọi free -h, df -h, uptime theo thứ tự. Trên Linux thật, script này dùng để monitor hệ thống tự động.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "9-12",
        title: "Kết hợp: man tra cứu lệnh mới",
        steps: [
            {
                type: "narrative",
                text: "Thách thức cuối: dùng <code>man</code> để tra cứu lệnh <code>tr</code> mà bạn học ở Module 8. Kiểm tra xem trang manual mô tả <code>-d</code> flag như thế nào.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "man tr",
            hint: "man tr",
            onSuccess: {
                highlight: "idle",
                successNote: "Xuất sắc! man là người bạn đồng hành không thể thiếu khi làm việc với Linux. Bạn đã hoàn thành Module 9!",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
];