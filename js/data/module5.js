export const INIT_FS = {
    name: "home",
    type: "folder",
    children: [
        {
            name: "student",
            type: "folder",
            children: [
                {
                    name: "projects",
                    type: "folder",
                    children: [
                        {
                            name: "web",
                            type: "folder",
                            children: [
                                { name: "index.html", type: "file", content: "<!DOCTYPE html>\n<html>\n<body>Hello</body>\n</html>" },
                                { name: "style.css", type: "file", content: "body { margin: 0; }" },
                            ],
                        },
                        {
                            name: "app",
                            type: "folder",
                            children: [
                                { name: "main.py", type: "file", content: "print('Hello World')" },
                                { name: "config.txt", type: "file", content: "host=localhost\nport=8080" },
                            ],
                        },
                    ],
                },
                {
                    name: "backup",
                    type: "folder",
                    children: [
                        { name: "old_notes.txt", type: "file", content: "Old notes from 2023" },
                        { name: "readme.txt", type: "file", content: "Backup folder — do not delete" },
                    ],
                },
            ],
        },
    ],
};

export const INIT_PATH = ["student"];

export const LESSONS = [
    {
        id: "5-1",
        title: "Giới thiệu lệnh find",
        steps: [
            {
                type: "narrative",
                text: "Module 5 dạy tìm kiếm file. Lệnh <code>find</code> duyệt toàn bộ cây thư mục để tìm file theo tên, loại hoặc tiêu chí khác.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Cú pháp: <code>find &lt;đường_dẫn&gt; -name &lt;tên&gt;</code>. Dấu <code>.</code> có nghĩa là thư mục hiện tại. Tìm tất cả file tên <strong>readme.txt</strong>.",
                highlight: "list",
            },
        ],
        command: {
            expected: "find . -name readme.txt",
            hint: "find . -name readme.txt — tìm trong thư mục hiện tại",
            onSuccess: { highlight: "list", successNote: "find tìm thấy readme.txt trong backup/ — dù bạn không biết nó ở đâu." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-2",
        title: "Tìm theo tên với wildcard",
        steps: [
            {
                type: "narrative",
                text: "<code>find</code> hỗ trợ wildcard <code>*</code> trong tên. <code>-name \"*.txt\"</code> tìm tất cả file có đuôi .txt.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Tìm tất cả file <strong>.txt</strong> trong thư mục hiện tại và tất cả thư mục con.",
                highlight: "list",
            },
        ],
        command: {
            expected: "find . -name *.txt",
            hint: "find . -name *.txt",
            onSuccess: { highlight: "list", successNote: "Tất cả file .txt được tìm thấy — find duyệt đệ quy qua mọi thư mục con." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-3",
        title: "Tìm file theo tên prefix",
        steps: [
            {
                type: "narrative",
                text: "Wildcard <code>*</code> cũng hoạt động ở đầu hoặc giữa tên. <code>config*</code> tìm mọi file bắt đầu bằng config.",
                highlight: "list",
            },
        ],
        command: {
            expected: "find . -name config*",
            hint: "find . -name config*",
            onSuccess: { highlight: "list", successNote: "config.txt tìm thấy trong projects/app/ — wildcard prefix giúp tìm file theo nhóm." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-4",
        title: "Tìm chỉ file (-type f)",
        steps: [
            {
                type: "narrative",
                text: "<code>-type f</code> chỉ trả về <strong>file</strong> (không bao gồm thư mục). <code>-type d</code> chỉ trả về thư mục.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Tìm tất cả <strong>file</strong> (không phải thư mục) trong cây hiện tại.",
                highlight: "list",
            },
        ],
        command: {
            expected: "find . -type f",
            hint: "find . -type f — f = file",
            onSuccess: { highlight: "list", successNote: "Chỉ file — không có tên thư mục. -type là cách lọc chính xác loại node." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-5",
        title: "Tìm chỉ thư mục (-type d)",
        steps: [
            {
                type: "narrative",
                text: "Giờ dùng <code>-type d</code> để chỉ tìm <strong>thư mục</strong>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "find . -type d",
            hint: "find . -type d — d = directory",
            onSuccess: { highlight: "list", successNote: "Chỉ thư mục — hữu ích khi bạn muốn liệt kê cấu trúc folder." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-6",
        title: "find trong thư mục con",
        steps: [
            {
                type: "narrative",
                text: "Bạn có thể giới hạn <code>find</code> chỉ tìm trong một thư mục cụ thể thay vì <code>.</code>.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Tìm tất cả file .txt chỉ trong thư mục <strong>backup</strong>.",
                highlight: "list",
            },
        ],
        command: {
            expected: "find backup -name *.txt",
            hint: "find backup -name *.txt",
            onSuccess: { highlight: "list", successNote: "Chỉ tìm trong backup/ — thu hẹp phạm vi tìm kiếm khi cần." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-7",
        title: "Tìm file Python",
        steps: [
            {
                type: "narrative",
                text: "Tìm tất cả file <strong>.py</strong> (Python) trong cây thư mục — rất hữu ích khi làm việc với project lớn.",
                highlight: "list",
            },
        ],
        command: {
            expected: "find . -name *.py",
            hint: "find . -name *.py",
            onSuccess: { highlight: "list", successNote: "main.py tìm thấy trong projects/app/ — find qua nhiều tầng thư mục mà không cần cd." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-8",
        title: "Lệnh which",
        steps: [
            {
                type: "narrative",
                text: "<code>which</code> cho biết <strong>đường dẫn tuyệt đối</strong> của một lệnh — lệnh đó nằm ở đâu trong hệ thống.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Thử <code>which ls</code> để xem ls nằm ở đâu.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "which ls",
            hint: "which ls",
            onSuccess: { highlight: null, successNote: "ls nằm ở /bin/ls — đây là nơi các lệnh cơ bản được lưu trữ." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-9",
        title: "which cho grep",
        steps: [
            {
                type: "narrative",
                text: "<code>which</code> hoạt động với bất kỳ lệnh nào trong hệ thống. Thử với <code>grep</code>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "which grep",
            hint: "which grep",
            onSuccess: { highlight: null, successNote: "/usr/bin/grep — thư mục /usr/bin chứa nhiều lệnh người dùng hơn /bin." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-10",
        title: "which python",
        steps: [
            {
                type: "narrative",
                text: "<code>which python</code> rất hay dùng để kiểm tra phiên bản Python nào đang được dùng mặc định.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "which python",
            hint: "which python",
            onSuccess: { highlight: null, successNote: "/usr/bin/python — biết đường dẫn giúp bạn gọi đúng phiên bản khi có nhiều Python." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-11",
        title: "Lệnh whereis",
        steps: [
            {
                type: "narrative",
                text: "<code>whereis</code> rộng hơn <code>which</code> — trả về đường dẫn binary, source code (nếu có) và trang manual.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng <code>whereis grep</code> để xem tất cả vị trí liên quan đến grep.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "whereis grep",
            hint: "whereis grep",
            onSuccess: { highlight: null, successNote: "whereis trả về binary + man page — hữu ích khi cần biết cả vị trí tài liệu." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-12",
        title: "whereis python",
        steps: [
            {
                type: "narrative",
                text: "<code>whereis python</code> thường trả về cả đường dẫn binary lẫn man page.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "whereis python",
            hint: "whereis python",
            onSuccess: { highlight: null, successNote: "/usr/bin/python và /usr/share/man — which chỉ cho binary, whereis cho nhiều hơn." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-13",
        title: "find kết hợp type và name",
        steps: [
            {
                type: "narrative",
                text: "Bạn có thể kết hợp <code>-type</code> và <code>-name</code> trong cùng một lệnh find.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Tìm tất cả <strong>file</strong> (không phải folder) có tên bắt đầu bằng <strong>old</strong>.",
                highlight: "list",
            },
        ],
        command: {
            expected: "find . -type f -name old*",
            hint: "find . -type f -name old*",
            onSuccess: { highlight: "list", successNote: "old_notes.txt — kết hợp -type f và -name giúp tìm chính xác hơn." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-14",
        title: "find file HTML",
        steps: [
            {
                type: "narrative",
                text: "Tìm file <strong>.html</strong> — rất thường dùng khi làm việc với dự án web.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "find . -name *.html",
            hint: "find . -name *.html",
            onSuccess: { highlight: "list", successNote: "index.html tìm thấy trong projects/web/ — find đi sâu qua mọi cấp thư mục." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "5-15",
        title: "Tổng kết — find toàn bộ file",
        steps: [
            {
                type: "narrative",
                text: "Bài cuối tổng kết. Dùng <code>find . -type f</code> để liệt kê <strong>tất cả file</strong> trong toàn bộ cây thư mục — một cách nhanh để kiểm tra project.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Liệt kê tất cả file trong cây thư mục hiện tại.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "find . -type f",
            hint: "find . -type f",
            onSuccess: { highlight: "list", successNote: "Hoàn thành Module 5! find, which, whereis — bộ công cụ tìm kiếm file và lệnh trong Linux." },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
];
