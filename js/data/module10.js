export const INIT_FS = {
    name: "home",
    type: "folder",
    children: [{
        name: "student",
        type: "folder",
        children: [
            {
                name: "projects",
                type: "folder",
                children: [
                    { name: "web",    type: "folder", children: [
                        { name: "index.html", type: "file", content: "<!DOCTYPE html>\n<html><body>Hello</body></html>" },
                        { name: "style.css",  type: "file", content: "body { font-family: sans-serif; }" },
                    ]},
                    { name: "scripts", type: "folder", children: [
                        { name: "deploy.sh", type: "file", content: "#!/bin/bash\necho Deploying..." },
                        { name: "build.py",  type: "file", content: "import os\nprint('Building...')" },
                    ]},
                ]
            },
            {
                name: "current",
                type: "folder",
                children: []
            },
        ]
    }]
};

export const INIT_PATH = ["student"];

export const LESSONS = [
    {
        id: "10-1",
        title: "Xem cấu trúc thư mục dự án",
        steps: [
            {
                type: "narrative",
                text: "Module 10 — <strong>Liên kết & Tiến trình nâng cao</strong>. Ta sẽ học: tạo symbolic link (<code>ln -s</code>), nhận diện kiểu file (<code>file</code>), xem tiến trình nâng cao (<code>top</code>, <code>killall</code>), và biến môi trường (<code>echo $VAR</code>).",
                highlight: "breadcrumb",
            },
            {
                type: "narrative",
                text: "Thư mục <code>student/</code> có folder <code>projects/</code> chứa code dự án, và folder <code>current/</code> trống. Hãy liệt kê.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls",
            hint: "ls",
            onSuccess: {
                highlight: "list",
                successNote: "Có hai thư mục: projects/ và current/. Chúng ta sẽ tạo symlink để 'current' trỏ vào dự án đang làm việc.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-2",
        title: "Giới thiệu lệnh file",
        steps: [
            {
                type: "narrative",
                text: "Lệnh <code>file</code> xác định kiểu thực sự của một file dựa trên nội dung và phần mở rộng — không phụ thuộc vào tên file. Hãy vào thư mục scripts để thử.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cd projects",
            hint: "cd projects",
            onSuccess: {
                highlight: "path",
                successNote: "Đã vào projects/. Tiếp theo ta dùng file để kiểm tra kiểu của các file trong đây.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-3",
        title: "file — nhận diện loại file",
        steps: [
            {
                type: "narrative",
                text: "<code>file deploy.sh</code> sẽ báo đây là shell script. <code>file build.py</code> sẽ nhận ra Python script. Thử trước với deploy.sh trong scripts/.",
                highlight: "file:scripts",
            },
        ],
        command: {
            expected: "cd scripts",
            hint: "cd scripts",
            onSuccess: {
                highlight: "path",
                successNote: "Đã vào projects/scripts/.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-4",
        title: "file nhận diện shell script",
        steps: [
            {
                type: "narrative",
                text: "Dùng <code>file</code> để xác định kiểu của <code>deploy.sh</code>. Linux nhận diện shell script dựa trên dòng đầu <code>#!/bin/bash</code> (shebang line).",
                highlight: "file:deploy.sh",
            },
        ],
        command: {
            expected: "file deploy.sh",
            hint: "file deploy.sh",
            onSuccess: {
                highlight: "file:deploy.sh",
                successNote: "deploy.sh: Bourne-Again shell script, ASCII text executable — nhận ra vì có #!/bin/bash!",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-5",
        title: "file nhận diện Python script",
        steps: [
            {
                type: "narrative",
                text: "Thử <code>file</code> với file Python. Lưu ý: <code>file</code> có thể nhận biết nhiều loại: text, binary, image, script, v.v.",
                highlight: "file:build.py",
            },
        ],
        command: {
            expected: "file build.py",
            hint: "file build.py",
            onSuccess: {
                highlight: "file:build.py",
                successNote: "build.py: Python script, ASCII text executable. file rất hữu ích khi gặp file không rõ kiểu.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-6",
        title: "Quay về home và học symbolic link",
        steps: [
            {
                type: "narrative",
                text: "<strong>Symbolic link</strong> (symlink) là lối tắt trỏ đến file hoặc folder khác. Giống như shortcut trên Windows nhưng trong Linux filesystem. Lệnh tạo: <code>ln -s target link_name</code>",
                highlight: "terminal-input",
            },
            {
                type: "narrative",
                text: "Ví dụ: <code>ln -s projects/web weblink</code> tạo <code>weblink</code> trỏ tới <code>projects/web</code>. Truy cập <code>weblink/</code> = truy cập <code>projects/web/</code>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cd ../..",
            hint: "cd ../..",
            onSuccess: {
                highlight: "path",
                successNote: "Đã về thư mục student/. Bây giờ ta sẽ tạo symlink.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-7",
        title: "ln -s — tạo symbolic link",
        steps: [
            {
                type: "narrative",
                text: "Tạo symlink <code>web_shortcut</code> trỏ tới thư mục <code>projects</code>. Sau khi tạo, ta có thể <code>cd web_shortcut</code> để vào projects nhanh hơn.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ln -s projects web_shortcut",
            hint: "ln -s projects web_shortcut",
            onSuccess: {
                highlight: "create",
                successNote: "web_shortcut -> projects đã tạo! Trong Explorer bạn thấy icon 🔗 — đây là symlink.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-8",
        title: "ls -l xem symlink",
        steps: [
            {
                type: "narrative",
                text: "<code>ls -l</code> hiển thị symlink với tiền tố <code>l</code> và mũi tên <code>-&gt;</code> chỉ đến target. Đây là cách nhận biết symlink trong terminal.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ls -l",
            hint: "ls -l",
            onSuccess: {
                highlight: "list",
                successNote: "Dòng web_shortcut bắt đầu bằng 'l' (link) và có '-> projects'. So sánh với folder 'current' bắt đầu bằng 'd'.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-9",
        title: "cd qua symlink",
        steps: [
            {
                type: "narrative",
                text: "Symlink hoạt động trong suốt — <code>cd web_shortcut</code> sẽ thực sự đưa bạn vào <code>projects/</code>. Thử xem!",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cd web_shortcut",
            hint: "cd web_shortcut",
            onSuccess: {
                highlight: "path",
                successNote: "Đã đi qua symlink vào projects/! Breadcrumb hiện đường dẫn thật. Symlink rất hữu ích khi cần đường dẫn ngắn hơn.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-10",
        title: "echo $USER — biến môi trường",
        steps: [
            {
                type: "narrative",
                text: "Biến môi trường lưu thông tin cấu hình hệ thống. <code>$USER</code> chứa tên user hiện tại, <code>$HOME</code> là thư mục home, <code>$PATH</code> là danh sách thư mục tìm lệnh.",
                highlight: "terminal-input",
            },
            {
                type: "narrative",
                text: "Lệnh <code>echo</code> kết hợp với biến môi trường: <code>echo $USER</code> in ra tên user. Dấu <code>$</code> trước tên biến báo cho shell biết đây là biến cần expand.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "echo $USER",
            hint: "echo $USER",
            onSuccess: {
                highlight: "idle",
                successNote: "In ra 'student' — tên user hiện tại. Biến môi trường được dùng rất nhiều trong shell script.",
            },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
    {
        id: "10-11",
        title: "echo $HOME và $PATH",
        steps: [
            {
                type: "narrative",
                text: "<code>$HOME</code> chứa đường dẫn thư mục home của user. Thử xem giá trị của nó.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "echo $HOME",
            hint: "echo $HOME",
            onSuccess: {
                highlight: "idle",
                successNote: "/home/student — đây là nơi user student 'sống'. Biến $HOME được dùng trong script như: cd $HOME, cp file $HOME/backup/",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-12",
        title: "Lệnh top — xem tiến trình nâng cao",
        steps: [
            {
                type: "narrative",
                text: "Lệnh <code>top</code> hiển thị thông tin tiến trình <em>kết hợp</em> với trạng thái CPU, RAM — đầy đủ hơn <code>ps aux</code>. Trên Linux thật, top cập nhật real-time; ở đây ta xem snapshot.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "top",
            hint: "top",
            onSuccess: {
                highlight: "idle",
                successNote: "top hiện load average, CPU%, MEM% cho từng process. Đây là lệnh đầu tiên chạy khi cần debug hiệu năng server.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
        initialProcesses: [
            { pid: 1, user: "root", cmd: "systemd" },
            { pid: 512, user: "root", cmd: "nginx: master process" },
            { pid: 513, user: "www-data", cmd: "nginx: worker process" },
            { pid: 1024, user: "student", cmd: "python3 app.py" },
            { pid: 1025, user: "student", cmd: "node server.js" },
        ],
    },
    {
        id: "10-13",
        title: "ps aux — xem tất cả tiến trình",
        steps: [
            {
                type: "narrative",
                text: "So sánh <code>top</code> và <code>ps aux</code>: cả hai đều hiện tất cả tiến trình, nhưng ps cho output tĩnh dễ xử lý bằng pipe hơn.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ps aux",
            hint: "ps aux",
            onSuccess: {
                highlight: "idle",
                successNote: "ps aux liệt kê đơn giản hơn top — phù hợp để kết hợp với grep: ps aux | grep nginx để lọc process cụ thể.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-14",
        title: "killall — dừng theo tên",
        steps: [
            {
                type: "narrative",
                text: "<code>killall</code> dừng tất cả tiến trình có tên khớp — không cần biết PID cụ thể. So với <code>kill PID</code>, <code>killall</code> tiện hơn khi nhiều process cùng tên (vd: nginx worker).",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "killall nginx",
            hint: "killall nginx",
            onSuccess: {
                highlight: "idle",
                successNote: "Cả nginx master lẫn nginx worker đều bị dừng trong một lệnh! kill cần từng PID, killall xử lý tất cả cùng lúc.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "10-15",
        title: "Kết hợp: file + ln -s để tổ chức dự án",
        steps: [
            {
                type: "narrative",
                text: "Bài cuối: kiểm tra kiểu file của symlink bằng <code>file</code>. Symlink cũng là một loại file đặc biệt trong Linux filesystem.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "file web_shortcut",
            hint: "file web_shortcut",
            onSuccess: {
                highlight: "file:web_shortcut",
                successNote: "web_shortcut: symbolic link to projects — file nhận ra đây là symlink! Bạn đã hoàn thành Module 10 và toàn bộ khoá học!",
            },
        },
        fsSnapshot: null,
        initialPath: ["student"],
    },
];