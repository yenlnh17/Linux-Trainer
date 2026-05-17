export const INIT_FS = {
    name: "home",
    type: "folder",
    children: [
        {
            name: "student",
            type: "folder",
            children: [
                { name: "server.py", type: "file", content: "# Web server\nwhile True:\n    serve()" },
                { name: "app.js",    type: "file", content: "// Node app\nconsole.log('Running')" },
            ],
        },
    ],
};

export const INIT_PATH = ["student"];

// Each lesson declares `initialProcesses` — stepper will load it into state.processes
export const LESSONS = [
    {
        id: "7-1",
        title: "Tiến trình là gì?",
        steps: [
            {
                type: "narrative",
                text: "Module 7 giới thiệu <strong>tiến trình (process)</strong> — mỗi chương trình đang chạy là một tiến trình với ID riêng (PID). Linux cho phép xem và quản lý chúng từ terminal.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "<code>ps</code> liệt kê các tiến trình đang chạy. Dùng <code>ps</code> để xem danh sách tiến trình của bạn.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ps",
            hint: "ps — process status",
            onSuccess: { highlight: null, successNote: "ps hiển thị PID, USER và CMD — mỗi dòng là một tiến trình đang chạy." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 1042, user: "student", cmd: "python server.py" },
            { pid: 1087, user: "student", cmd: "node app.js" },
        ],
    },
    {
        id: "7-2",
        title: "ps aux — xem tất cả tiến trình",
        steps: [
            {
                type: "narrative",
                text: "<code>ps aux</code> hiển thị <strong>tất cả tiến trình</strong> trên hệ thống — kể cả của root và các service.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng <code>ps aux</code> để xem toàn bộ danh sách tiến trình.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ps aux",
            hint: "ps aux — a=all users, u=user format, x=no terminal",
            onSuccess: { highlight: null, successNote: "ps aux cho thấy cả tiến trình của root — hữu ích khi debug service hoặc tìm process chiếm nhiều CPU." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1,    user: "root",    cmd: "init" },
            { pid: 245,  user: "root",    cmd: "nginx" },
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 1042, user: "student", cmd: "python server.py" },
            { pid: 1087, user: "student", cmd: "node app.js" },
        ],
    },
    {
        id: "7-3",
        title: "PID và lệnh kill",
        steps: [
            {
                type: "narrative",
                text: "<code>kill PID</code> gửi tín hiệu dừng đến tiến trình có PID đó. Mặc định gửi <strong>SIGTERM</strong> — yêu cầu dừng nhẹ nhàng.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Tiến trình <strong>node app.js</strong> có PID 1087. Dùng <code>kill 1087</code> để dừng nó.",
                highlight: "list",
            },
        ],
        command: {
            expected: "kill 1087",
            hint: "kill 1087 — gửi SIGTERM đến PID 1087",
            onSuccess: { highlight: null, successNote: "node app.js đã bị dừng — ps sẽ không còn hiện PID 1087 nữa." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 1042, user: "student", cmd: "python server.py" },
            { pid: 1087, user: "student", cmd: "node app.js" },
        ],
    },
    {
        id: "7-4",
        title: "Xác nhận sau kill",
        steps: [
            {
                type: "narrative",
                text: "Sau khi kill, dùng <code>ps</code> để xác nhận tiến trình đã biến mất.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ps",
            hint: "ps",
            onSuccess: { highlight: null, successNote: "PID 1087 không còn — tiến trình đã dừng thành công." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 1042, user: "student", cmd: "python server.py" },
        ],
    },
    {
        id: "7-5",
        title: "kill -9 — force kill",
        steps: [
            {
                type: "narrative",
                text: "<code>kill -9</code> gửi <strong>SIGKILL</strong> — buộc dừng ngay lập tức, không cho tiến trình dọn dẹp. Dùng khi tiến trình không phản hồi SIGTERM.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "<strong>python server.py</strong> có PID 1042. Dùng <code>kill -9 1042</code> để force kill.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "kill -9 1042",
            hint: "kill -9 1042 — SIGKILL, không thể bị bỏ qua",
            onSuccess: { highlight: null, successNote: "python server.py bị kill ngay lập tức — -9 là last resort khi tiến trình treo." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 1042, user: "student", cmd: "python server.py" },
            { pid: 1087, user: "student", cmd: "node app.js" },
        ],
    },
    {
        id: "7-6",
        title: "Xem lại sau force kill",
        steps: [
            {
                type: "narrative",
                text: "Xác nhận python server.py đã bị force kill bằng <code>ps</code>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ps",
            hint: "ps",
            onSuccess: { highlight: null, successNote: "python server.py không còn trong danh sách. -9 đảm bảo tiến trình dừng." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 1087, user: "student", cmd: "node app.js" },
        ],
    },
    {
        id: "7-7",
        title: "ps aux tìm process của root",
        steps: [
            {
                type: "narrative",
                text: "Trên server thật, nginx hoặc apache thường chạy dưới user root. <code>ps aux</code> hiển thị tất cả user.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng <code>ps aux</code> để thấy cả tiến trình của root.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ps aux",
            hint: "ps aux",
            onSuccess: { highlight: null, successNote: "nginx chạy dưới root — ps aux giúp bạn thấy toàn bộ hệ thống." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1,    user: "root",    cmd: "init" },
            { pid: 245,  user: "root",    cmd: "nginx" },
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 1042, user: "student", cmd: "python server.py" },
        ],
    },
    {
        id: "7-8",
        title: "Kill tiến trình nginx",
        steps: [
            {
                type: "narrative",
                text: "nginx đang chạy với PID 245. Dùng <code>kill 245</code> để dừng nó.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "kill 245",
            hint: "kill 245",
            onSuccess: { highlight: null, successNote: "nginx đã dừng — trong thực tế bạn cần sudo để kill tiến trình của root." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1,    user: "root",    cmd: "init" },
            { pid: 245,  user: "root",    cmd: "nginx" },
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 1042, user: "student", cmd: "python server.py" },
        ],
    },
    {
        id: "7-9",
        title: "Nhiều tiến trình cùng tên",
        steps: [
            {
                type: "narrative",
                text: "Đôi khi nhiều tiến trình chạy cùng tên (workers). Mỗi tiến trình có PID riêng — bạn phải kill từng PID cụ thể.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Có 2 worker đang chạy. Kill worker có PID <strong>2010</strong>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "kill 2010",
            hint: "kill 2010",
            onSuccess: { highlight: null, successNote: "Worker PID 2010 đã dừng — PID 2011 vẫn chạy. Mỗi PID là một instance riêng." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 2010, user: "student", cmd: "worker.py" },
            { pid: 2011, user: "student", cmd: "worker.py" },
        ],
    },
    {
        id: "7-10",
        title: "Kill worker còn lại",
        steps: [
            {
                type: "narrative",
                text: "Kill worker thứ hai (PID 2011) để dừng tất cả workers.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "kill 2011",
            hint: "kill 2011",
            onSuccess: { highlight: null, successNote: "Cả 2 worker đã dừng — phải kill từng PID vì chúng là tiến trình riêng biệt." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 2011, user: "student", cmd: "worker.py" },
        ],
    },
    {
        id: "7-11",
        title: "ps để xác nhận trạng thái",
        steps: [
            {
                type: "narrative",
                text: "Sau khi kill tất cả worker, kiểm tra lại bằng ps để đảm bảo hệ thống sạch.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ps",
            hint: "ps",
            onSuccess: { highlight: null, successNote: "Chỉ còn bash — các worker đã dừng hết. ps là lệnh kiểm tra nhanh trạng thái." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1001, user: "student", cmd: "bash" },
        ],
    },
    {
        id: "7-12",
        title: "kill -9 tiến trình treo",
        steps: [
            {
                type: "narrative",
                text: "Một tiến trình <strong>zombie.py</strong> đang treo — nó không phản hồi SIGTERM thông thường.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng <code>kill -9</code> để force kill zombie.py (PID 3001).",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "kill -9 3001",
            hint: "kill -9 3001",
            onSuccess: { highlight: null, successNote: "SIGKILL không thể bị bỏ qua bởi bất kỳ tiến trình nào — luôn dừng được." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 3001, user: "student", cmd: "zombie.py" },
        ],
    },
    {
        id: "7-13",
        title: "ps aux sau khi dọn dẹp",
        steps: [
            {
                type: "narrative",
                text: "Xem toàn bộ danh sách tiến trình sau khi dọn dẹp.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ps aux",
            hint: "ps aux",
            onSuccess: { highlight: null, successNote: "Hệ thống sạch — chỉ còn những tiến trình cần thiết." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1,    user: "root",    cmd: "init" },
            { pid: 1001, user: "student", cmd: "bash" },
        ],
    },
    {
        id: "7-14",
        title: "Kill tiến trình init — thử và học",
        steps: [
            {
                type: "narrative",
                text: "PID 1 là <strong>init</strong> — tiến trình đầu tiên và quan trọng nhất. Trên hệ thống thực, không nên kill nó. Nhưng trong môi trường mô phỏng này, hãy thử!",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng <code>kill 1</code> để xem điều gì xảy ra.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "kill 1",
            hint: "kill 1",
            onSuccess: { highlight: null, successNote: "init bị dừng trong mô phỏng — trên hệ thống thực, kill init sẽ crash toàn bộ OS!" },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1,    user: "root",    cmd: "init" },
            { pid: 1001, user: "student", cmd: "bash" },
        ],
    },
    {
        id: "7-15",
        title: "Tổng kết — ps và kill",
        steps: [
            {
                type: "narrative",
                text: "Bài cuối tổng kết. Server.py đang chạy và cần dừng.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng <code>ps</code> để tìm PID của python server.py, rồi kill nó.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ps",
            hint: "ps — xem PID trước khi kill",
            onSuccess: { highlight: null, successNote: "Hoàn thành Module 7! ps, ps aux, kill, kill -9 — bộ công cụ quản lý tiến trình Linux." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
        initialProcesses: [
            { pid: 1001, user: "student", cmd: "bash" },
            { pid: 1042, user: "student", cmd: "python server.py" },
        ],
    },
];