export const INIT_FS = {
    name: "home",
    type: "folder",
    children: [
        {
            name: "student",
            type: "folder",
            children: [
                {
                    name: "logs",
                    type: "folder",
                    children: [
                        {
                            name: "system.log",
                            type: "file",
                            content: "2024-01-01 INFO  Server started\n2024-01-01 INFO  Connected to database\n2024-01-02 ERROR Cannot read file\n2024-01-02 INFO  Retrying connection\n2024-01-03 ERROR Disk full\n2024-01-03 INFO  Cleanup started\n2024-01-04 INFO  Cleanup done\n2024-01-04 ERROR Permission denied\n2024-01-05 INFO  All systems OK",
                        },
                        {
                            name: "access.log",
                            type: "file",
                            content: "GET /index.html 200\nGET /about.html 200\nGET /missing.html 404\nPOST /login 200\nGET /admin 403\nGET /api/data 200\nDELETE /file 200\nGET /secret 401",
                        },
                    ],
                },
            ],
        },
    ],
};

export const INIT_PATH = ["student", "logs"];

export const LESSONS = [
    {
        id: "3-1",
        title: "Xem đầu file log",
        steps: [
            {
                type: "narrative",
                text: "Module 3 dạy bạn đọc và lọc văn bản — kỹ năng thiết yếu khi làm việc với log file. Lệnh đầu tiên: <code>head</code> — hiển thị N dòng đầu (mặc định 10).",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Explorer đang hiển thị <strong>system.log</strong>. Dùng <code>head system.log</code> để xem phần mở đầu của file.",
                highlight: "list",
            },
        ],
        command: {
            expected: "head system.log",
            hint: "head + tên file → xem dòng đầu",
            onSuccess: { highlight: "file:system.log", successNote: "head rất tiện khi kiểm tra nhanh định dạng hoặc header của file." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-2",
        title: "Xem cuối file log",
        steps: [
            {
                type: "narrative",
                text: "<code>tail</code> làm ngược lại — hiển thị N dòng cuối. Rất hữu ích để xem log mới nhất của hệ thống.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng <code>tail system.log</code> để xem các sự kiện gần nhất trong log.",
                highlight: "list",
            },
        ],
        command: {
            expected: "tail system.log",
            hint: "tail + tên file → xem dòng cuối",
            onSuccess: { highlight: "file:system.log", successNote: "tail thường dùng để theo dõi log đang chạy — bạn thấy dòng cuối nhất." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-3",
        title: "Giới hạn số dòng hiển thị",
        steps: [
            {
                type: "narrative",
                text: "Cả <code>head</code> và <code>tail</code> đều hỗ trợ flag <code>-n N</code> để chỉ định số dòng. Ví dụ: <code>head -n 3</code> chỉ lấy 3 dòng đầu.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Thử lấy <strong>3 dòng đầu</strong> của system.log — bạn sẽ thấy ít hơn nhiều so với lần trước.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "head -n 3 system.log",
            hint: "head -n 3 system.log",
            onSuccess: { highlight: "file:system.log", successNote: "Bạn có thể kiểm soát chính xác bao nhiêu dòng cần xem." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-4",
        title: "Tìm dòng lỗi với grep",
        steps: [
            {
                type: "narrative",
                text: "<code>grep</code> lọc và chỉ hiển thị những dòng <strong>chứa pattern</strong> bạn tìm — bỏ qua tất cả dòng còn lại.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "system.log có nhiều loại dòng. Dùng <code>grep ERROR system.log</code> để chỉ xem các dòng lỗi.",
                highlight: "list",
            },
        ],
        command: {
            expected: "grep ERROR system.log",
            hint: "grep PATTERN file — chỉ in dòng chứa PATTERN",
            onSuccess: { highlight: "file:system.log", successNote: "grep lọc signal khỏi noise — chỉ còn lại những dòng ERROR." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-5",
        title: "Lọc dòng thông tin",
        steps: [
            {
                type: "narrative",
                text: "<code>grep</code> hoạt động với bất kỳ chuỗi nào — không phải chỉ từ khóa đặc biệt. Thử tìm tất cả dòng <strong>INFO</strong>.",
                highlight: "list",
            },
        ],
        command: {
            expected: "grep INFO system.log",
            hint: "grep INFO system.log",
            onSuccess: { highlight: "file:system.log", successNote: "6 dòng INFO — nhiều hơn 3 dòng ERROR. grep giúp bạn thấy tỷ lệ ngay lập tức." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-6",
        title: "grep trên file access log",
        steps: [
            {
                type: "narrative",
                text: "<code>grep</code> hoạt động trên bất kỳ file nào. Hãy tìm các request trả về lỗi <strong>404</strong> trong access.log.",
                highlight: "list",
            },
        ],
        command: {
            expected: "grep 404 access.log",
            hint: "grep 404 access.log — tìm request lỗi 404",
            onSuccess: { highlight: "file:access.log", successNote: "Chỉ 1 request 404. grep với mã HTTP rất phổ biến trong debug web server." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-7",
        title: "Ghi text vào file mới",
        steps: [
            {
                type: "narrative",
                text: "<code>echo text &gt; file</code> ghi output của echo vào file — nếu file chưa tồn tại sẽ tạo mới, nếu tồn tại sẽ <strong>ghi đè</strong>.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Tạo file <strong>notes.txt</strong> với nội dung đầu tiên bằng redirect <code>&gt;</code>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "echo Linux pipes > notes.txt",
            hint: "echo Linux pipes > notes.txt",
            onSuccess: { highlight: "create", successNote: "notes.txt xuất hiện trong Explorer — được tạo và ghi bởi redirect >." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-8",
        title: "Xác nhận nội dung đã ghi",
        steps: [
            {
                type: "narrative",
                text: "Dùng <code>cat notes.txt</code> để xác nhận rằng nội dung đã được ghi đúng vào file.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cat notes.txt",
            hint: "cat notes.txt — xem nội dung vừa ghi",
            onSuccess: { highlight: "file:notes.txt", successNote: "Đúng rồi — \"Linux pipes\" là nội dung của notes.txt." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-9",
        title: "Thêm dòng vào file",
        steps: [
            {
                type: "narrative",
                text: "<code>&gt;&gt;</code> (append) thêm vào cuối file thay vì ghi đè. Đây là điểm khác biệt quan trọng với <code>&gt;</code>.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Thêm dòng thứ hai vào <strong>notes.txt</strong> — dòng đầu phải được giữ nguyên.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "echo Very powerful >> notes.txt",
            hint: "echo Very powerful >> notes.txt",
            onSuccess: { highlight: "file:notes.txt", successNote: ">> thêm dòng mới, không xóa dữ liệu cũ — khác hoàn toàn với >." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-10",
        title: "Xác nhận hai dòng",
        steps: [
            {
                type: "narrative",
                text: "Dùng <code>cat</code> để kiểm tra notes.txt — bây giờ file phải có <strong>hai dòng</strong>.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cat notes.txt",
            hint: "cat notes.txt — phải thấy 2 dòng",
            onSuccess: { highlight: "file:notes.txt", successNote: "Hai dòng đầy đủ. > tạo/ghi đè, >> thêm vào — hai toán tử quan trọng." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-11",
        title: "Kết hợp cat và grep qua pipe",
        steps: [
            {
                type: "narrative",
                text: "Pipe <code>|</code> kết nối hai lệnh: output của lệnh trái trở thành input của lệnh phải.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "<code>cat system.log | grep ERROR</code> đọc file rồi lọc dòng ERROR — kết quả giống <code>grep ERROR system.log</code> nhưng dùng pipe.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cat system.log | grep ERROR",
            hint: "cat file | grep PATTERN — output của cat đi qua grep",
            onSuccess: { highlight: "file:system.log", successNote: "Pipe nối lệnh như ống dẫn nước — output bên này là input bên kia." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-12",
        title: "Pipe trên access log",
        steps: [
            {
                type: "narrative",
                text: "Pipe hoạt động với bất kỳ file nào. Thử lọc request <strong>404</strong> từ access.log qua pipe.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cat access.log | grep 404",
            hint: "cat access.log | grep 404",
            onSuccess: { highlight: "file:access.log", successNote: "Pipe giúp bạn kết hợp các công cụ nhỏ thành pipeline mạnh mẽ." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-13",
        title: "Pipe cat qua head",
        steps: [
            {
                type: "narrative",
                text: "Bên phải pipe không chỉ là grep — <code>head</code> và <code>tail</code> cũng nhận được input qua pipe.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng pipe để lấy <strong>3 dòng đầu</strong> của system.log — output của cat đi qua head.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cat system.log | head -n 3",
            hint: "cat system.log | head -n 3",
            onSuccess: { highlight: "file:system.log", successNote: "head nhận stdin từ pipe, không cần tên file — đây là triết lý Unix: mỗi lệnh làm một việc tốt." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-14",
        title: "grep rồi lấy 2 dòng đầu",
        steps: [
            {
                type: "narrative",
                text: "Pipe có thể nối nhiều lệnh. <code>grep ERROR system.log | head -n 2</code> lọc ERROR trước, rồi chỉ lấy 2 kết quả đầu tiên.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Kết hợp grep + head — đây là pattern rất phổ biến khi xử lý log dài.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "grep ERROR system.log | head -n 2",
            hint: "grep ERROR system.log | head -n 2",
            onSuccess: { highlight: "file:system.log", successNote: "Hai lệnh kết hợp qua pipe — từng lệnh đơn giản, cùng nhau mạnh mẽ." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
    {
        id: "3-15",
        title: "Lọc request thành công",
        steps: [
            {
                type: "narrative",
                text: "Bài cuối — tổng kết pipe. Tìm tất cả request trả về <strong>200</strong> (thành công) trong access.log.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng pipe để đọc access.log và lọc ra các dòng có mã 200.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cat access.log | grep 200",
            hint: "cat access.log | grep 200",
            onSuccess: { highlight: "file:access.log", successNote: "Hoàn thành Module 3! Bạn đã nắm head, tail, grep, redirect > >>, và pipe | — bộ công cụ xử lý văn bản của Linux." },
        },
        fsSnapshot: null,
        initialPath: ["student", "logs"],
    },
];
