export const INIT_FS = {
    name: "home",
    type: "folder",
    children: [
        {
            name: "student",
            type: "folder",
            children: [
                {
                    name: "docs",
                    type: "folder",
                    children: [
                        { name: "welcome.txt", type: "file", content: "Chào mừng đến với Linux Trainer!" },
                        { name: "notes.md", type: "file", content: "# Notes\n- Học pwd\n- Học ls\n- Học cd" },
                    ],
                },
                {
                    name: "projects",
                    type: "folder",
                    children: [
                        { name: "roadmap.txt", type: "file", content: "Module 1: Navigation\nModule 2: File Ops\nModule 3: Text & Pipes" },
                    ],
                },
                { name: "avatar.png", type: "file", content: "" },
            ],
        },
    ],
};

export const INIT_PATH = ["student"];

export const LESSONS = [
    {
        id: "1-1",
        title: "Bạn đang đứng ở đâu?",
        steps: [
            {
                type: "narrative",
                text: "Khi mở terminal, Linux cần biết bạn đang ở thư mục nào. Đây gọi là <strong>current directory</strong> (thư mục làm việc hiện tại).",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Nhìn thanh <strong>breadcrumb</strong> phía trên — nó đang hiển thị vị trí hiện tại của bạn trong cây thư mục.",
                highlight: "breadcrumb",
            },
            {
                type: "narrative",
                text: "Lệnh <code>pwd</code> sẽ in ra đường dẫn đó vào terminal. Hãy thử gõ lệnh bên dưới.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "pwd",
            hint: "pwd = Print Working Directory",
            onSuccess: { highlight: "path", successNote: "pwd luôn cho bạn biết vị trí hiện tại trong cây thư mục." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "1-2",
        title: "Thư mục này có gì?",
        steps: [
            {
                type: "narrative",
                text: "Bạn biết mình đứng ở đâu rồi. Tiếp theo — xem thư mục hiện tại chứa những gì.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Explorer bên trên đang liệt kê các file và folder. Lệnh <code>ls</code> làm điều tương tự — nhưng trong terminal.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls",
            hint: "ls = list — liệt kê nội dung thư mục",
            onSuccess: { highlight: "list", successNote: "Bạn đã nối được hình minh hoạ và output terminal với nhau." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "1-3",
        title: "Đi vào thư mục docs",
        steps: [
            {
                type: "narrative",
                text: "Để làm việc với file bên trong <strong>docs</strong>, bạn cần 'bước vào' thư mục đó.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Explorer đang hiện folder <strong>docs</strong>. Lệnh <code>cd docs</code> sẽ di chuyển bạn vào đó — breadcrumb và Explorer sẽ cập nhật theo.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cd docs",
            hint: "cd = Change Directory",
            onSuccess: { highlight: "path", successNote: "cd đổi thư mục làm việc hiện tại." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "1-4",
        title: "Kiểm tra vị trí mới",
        steps: [
            {
                type: "narrative",
                text: "Sau khi <code>cd</code>, thư mục làm việc đã thay đổi. Breadcrumb phía trên đã cập nhật — nhưng terminal chưa in gì cả.",
                highlight: "breadcrumb",
            },
            {
                type: "narrative",
                text: "Dùng <code>pwd</code> để xác nhận vị trí mới. Kết quả phải kết thúc bằng <strong>/docs</strong>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "pwd",
            hint: "Kết quả phải kết thúc bằng /docs",
            onSuccess: { highlight: "path", successNote: "Bạn đang xác minh sự thay đổi của current directory." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "1-5",
        title: "Tạo file mới",
        steps: [
            {
                type: "narrative",
                text: "<code>touch</code> tạo một file rỗng mà không mở editor. Rất tiện khi bạn chỉ muốn tạo file placeholder.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Sau khi chạy, Explorer sẽ hiện file mới ngay lập tức với hiệu ứng pop-in.",
                highlight: "list",
            },
        ],
        command: {
            expected: "touch todo.txt",
            hint: "touch + tên file → tạo file rỗng",
            onSuccess: { highlight: "create", successNote: "File todo.txt đã xuất hiện trong docs." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "1-6",
        title: "Liệt kê để thấy file mới",
        steps: [
            {
                type: "narrative",
                text: "File mới vừa tạo — dùng <code>ls</code> để xác nhận nó thực sự có mặt trong thư mục.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls",
            hint: "List lại sau khi tạo file",
            onSuccess: { highlight: "list", successNote: "ls phản ánh trạng thái mới nhất của thư mục." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "1-7",
        title: "Tạo thư mục con",
        steps: [
            {
                type: "narrative",
                text: "<code>mkdir</code> tạo thư mục mới. Khác <code>touch</code> — mkdir tạo <strong>folder</strong>, không phải file.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Sau khi chạy, folder <strong>assets</strong> sẽ xuất hiện trong Explorer với icon 📁.",
                highlight: "list",
            },
        ],
        command: {
            expected: "mkdir assets",
            hint: "mkdir = make directory",
            onSuccess: { highlight: "create", successNote: "Bạn vừa tạo một thư mục mới bằng terminal." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "1-8",
        title: "Xem lại nội dung thư mục",
        steps: [
            {
                type: "narrative",
                text: "Bây giờ docs có cả <strong>assets</strong> (folder) lẫn <strong>todo.txt</strong> (file). Dùng ls để thấy cả hai.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls",
            hint: "List sau khi có folder mới",
            onSuccess: { highlight: "list", successNote: "Terminal và Explorer đang khớp hoàn toàn." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "1-9",
        title: "Đi vào thư mục assets",
        steps: [
            {
                type: "narrative",
                text: "<strong>assets</strong> vừa tạo đang rỗng. Hãy đi vào để tạo file bên trong.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cd assets",
            hint: "cd assets",
            onSuccess: { highlight: "path", successNote: "Bạn đã bước vào một thư mục con mới." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "1-10",
        title: "Tạo file trong assets",
        steps: [
            {
                type: "narrative",
                text: "Bây giờ bạn đang ở bên trong <strong>assets</strong>. Mọi file tạo ra sẽ nằm ở đây.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Tạo <strong>logo.png</strong> bằng touch — Explorer sẽ hiện file mới ngay trong assets.",
                highlight: "list",
            },
        ],
        command: {
            expected: "touch logo.png",
            hint: "touch logo.png",
            onSuccess: { highlight: "create", successNote: "assets không còn rỗng nữa." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs", "assets"],
    },
    {
        id: "1-11",
        title: "Xem file vừa tạo",
        steps: [
            {
                type: "narrative",
                text: "<code>ls</code> trong assets sẽ chỉ liệt kê các file <em>bên trong assets</em> — không phải toàn bộ project.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls",
            hint: "ls trong assets",
            onSuccess: { highlight: "list", successNote: "Bạn đang đọc cấu trúc thư mục bằng cả hình và lệnh." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs", "assets"],
    },
    {
        id: "1-12",
        title: "Quay lại thư mục cha",
        steps: [
            {
                type: "narrative",
                text: "<code>..</code> là ký hiệu đặc biệt đại diện cho thư mục cha. <code>cd ..</code> đưa bạn lên một cấp.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Từ <strong>assets</strong> → về <strong>docs</strong>. Breadcrumb sẽ thay đổi sau khi chạy lệnh.",
                highlight: "breadcrumb",
            },
        ],
        command: {
            expected: "cd ..",
            hint: ".. = thư mục cha",
            onSuccess: { highlight: "path", successNote: "cd .. giúp quay về thư mục cha." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs", "assets"],
    },
    {
        id: "1-13",
        title: "Xác nhận vị trí sau cd ..",
        steps: [
            {
                type: "narrative",
                text: "Breadcrumb đã về <strong>docs</strong> — nhưng hãy dùng <code>pwd</code> để xác minh bằng terminal.",
                highlight: "breadcrumb",
            },
        ],
        command: {
            expected: "pwd",
            hint: "Xác minh sau khi di chuyển",
            onSuccess: { highlight: "path", successNote: "Chính xác. Bạn đã quay về đúng nơi." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "1-14",
        title: "Xem tổng quan thư mục docs",
        steps: [
            {
                type: "narrative",
                text: "Từ <strong>docs</strong>, <code>ls</code> sẽ liệt kê cả <strong>assets</strong> (folder vừa tạo) lẫn <strong>todo.txt</strong>.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls",
            hint: "Phải có assets và todo.txt",
            onSuccess: { highlight: "list", successNote: "Bạn đã hiểu cách terminal phản ánh trạng thái thư mục." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "1-15",
        title: "Hoàn thành mini lab",
        steps: [
            {
                type: "narrative",
                text: "Bài cuối — chốt lại khái niệm <strong>current directory</strong>. Mọi lệnh bạn gõ đều chạy trong ngữ cảnh thư mục hiện tại.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Gõ <code>pwd</code> lần cuối để kết thúc module và xem đường dẫn đầy đủ.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "pwd",
            hint: "Kết thúc bằng kiểm tra current directory",
            onSuccess: { highlight: "path", successNote: "Xong! Bạn đã hoàn thành Module 1 — Navigation 🎉" },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
];
