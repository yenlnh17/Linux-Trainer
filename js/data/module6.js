export const INIT_FS = {
    name: "home",
    type: "folder",
    children: [
        {
            name: "student",
            type: "folder",
            children: [
                {
                    name: "secure",
                    type: "folder",
                    children: [
                        {
                            name: "public.txt",
                            type: "file",
                            content: "Nội dung công khai",
                            perms: "rw-r--r--",
                            owner: "student",
                        },
                        {
                            name: "private.txt",
                            type: "file",
                            content: "Nội dung riêng tư",
                            perms: "rw-------",
                            owner: "student",
                        },
                        {
                            name: "script.sh",
                            type: "file",
                            content: "#!/bin/bash\necho Hello",
                            perms: "rw-r--r--",
                            owner: "student",
                        },
                        {
                            name: "shared",
                            type: "folder",
                            children: [
                                {
                                    name: "report.txt",
                                    type: "file",
                                    content: "Báo cáo hàng tháng",
                                    perms: "rw-rw-r--",
                                    owner: "student",
                                },
                            ],
                            perms: "rwxrwxr-x",
                            owner: "student",
                        },
                    ],
                    perms: "rwxr-xr-x",
                    owner: "student",
                },
            ],
        },
    ],
};

export const INIT_PATH = ["student", "secure"];

export const LESSONS = [
    {
        id: "6-1",
        title: "Đọc quyền với ls -l",
        steps: [
            {
                type: "narrative",
                text: "Module 6 dạy hệ thống phân quyền Linux. Mỗi file có 3 loại quyền: <strong>r</strong> (read), <strong>w</strong> (write), <strong>x</strong> (execute) — cho owner, group và others.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "<code>ls -l</code> hiển thị quyền chi tiết. Cột đầu như <code>rw-r--r--</code> là quyền của owner, group, others.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls -l",
            hint: "ls -l — hiển thị quyền chi tiết",
            onSuccess: { highlight: "list", successNote: "Mỗi dòng: perms owner name. private.txt có rw------- — chỉ owner đọc/ghi được." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-2",
        title: "Đọc chuỗi quyền",
        steps: [
            {
                type: "narrative",
                text: "Chuỗi quyền gồm 9 ký tự chia 3 nhóm: <strong>owner</strong> (3 ký tự) · <strong>group</strong> (3) · <strong>others</strong> (3). Ví dụ <code>rwxr-xr-x</code>: owner có đủ 3 quyền, group và others chỉ có r và x.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Xem lại danh sách file để đọc quyền của <strong>script.sh</strong> — nó chưa có quyền thực thi (execute).",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls -l",
            hint: "ls -l",
            onSuccess: { highlight: "file:script.sh", successNote: "script.sh có rw-r--r-- — không có x nên chưa chạy được. chmod sẽ thay đổi điều này." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-3",
        title: "chmod cấp quyền thực thi",
        steps: [
            {
                type: "narrative",
                text: "<code>chmod +x file</code> thêm quyền <strong>execute</strong> cho owner. Dùng để cho phép chạy script.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Cấp quyền thực thi cho <strong>script.sh</strong> bằng <code>chmod +x</code>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "chmod +x script.sh",
            hint: "chmod +x script.sh",
            onSuccess: { highlight: "file:script.sh", successNote: "Quyền của script.sh giờ là rwxr--r-- — x đã xuất hiện ở owner." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-4",
        title: "Xác nhận quyền đã thay đổi",
        steps: [
            {
                type: "narrative",
                text: "Dùng <code>ls -l</code> để xác nhận quyền của script.sh sau khi chmod.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ls -l",
            hint: "ls -l",
            onSuccess: { highlight: "file:script.sh", successNote: "script.sh giờ có x — có thể chạy bằng ./script.sh trên hệ thống thực." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-5",
        title: "chmod thu hồi quyền thực thi",
        steps: [
            {
                type: "narrative",
                text: "<code>chmod -x file</code> thu hồi quyền thực thi. Dấu <code>-</code> bỏ quyền, dấu <code>+</code> thêm quyền.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Thu hồi quyền thực thi của script.sh.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "chmod -x script.sh",
            hint: "chmod -x script.sh",
            onSuccess: { highlight: "file:script.sh", successNote: "x bị xóa — script.sh trở về rw-r--r-- như ban đầu." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-6",
        title: "chmod octal 755",
        steps: [
            {
                type: "narrative",
                text: "Ngoài ký hiệu +/-x, bạn có thể dùng <strong>số octal</strong>: <code>7=rwx</code>, <code>5=r-x</code>, <code>4=r--</code>, <code>6=rw-</code>, <code>0=---</code>.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "<code>chmod 755 script.sh</code> đặt quyền <code>rwxr-xr-x</code> (owner đủ quyền, group và others chỉ r+x).",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "chmod 755 script.sh",
            hint: "chmod 755 script.sh — 7=rwx, 5=r-x, 5=r-x",
            onSuccess: { highlight: "file:script.sh", successNote: "rwxr-xr-x — dạng octal ngắn gọn hơn khi đặt nhiều bit cùng lúc." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-7",
        title: "chmod octal 600",
        steps: [
            {
                type: "narrative",
                text: "<code>600</code> (rw-------) là quyền phổ biến cho file nhạy cảm như SSH key — chỉ owner đọc/ghi, không ai khác.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Đặt quyền <code>600</code> cho <strong>private.txt</strong> để khóa chặt hơn.",
                highlight: "list",
            },
        ],
        command: {
            expected: "chmod 600 private.txt",
            hint: "chmod 600 private.txt — 6=rw-, 0=---, 0=---",
            onSuccess: { highlight: "file:private.txt", successNote: "rw------- — chỉ owner có quyền. Chuẩn bảo mật cho file chứa mật khẩu, key." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-8",
        title: "chmod octal 644",
        steps: [
            {
                type: "narrative",
                text: "<code>644</code> (rw-r--r--) là quyền mặc định cho file thông thường — owner ghi được, group và others chỉ đọc.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Đặt quyền <code>644</code> cho <strong>public.txt</strong>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "chmod 644 public.txt",
            hint: "chmod 644 public.txt",
            onSuccess: { highlight: "file:public.txt", successNote: "rw-r--r-- — đây là quyền mặc định khi tạo file mới trên hầu hết hệ thống." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-9",
        title: "Thêm quyền ghi cho group",
        steps: [
            {
                type: "narrative",
                text: "<code>chmod +w</code> thêm quyền ghi — nhưng cần chỉ định đối tượng: <code>g+w</code> (group), <code>o+w</code> (others), <code>u+w</code> (user/owner).",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Cho phép group ghi vào <strong>public.txt</strong> bằng <code>chmod g+w</code>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "chmod g+w public.txt",
            hint: "chmod g+w public.txt — g = group, +w = thêm write",
            onSuccess: { highlight: "file:public.txt", successNote: "rw-rw-r-- — group giờ có quyền ghi. g+w rất dùng trong môi trường cộng tác." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-10",
        title: "Bỏ quyền đọc cho others",
        steps: [
            {
                type: "narrative",
                text: "<code>o-r</code> bỏ quyền đọc của others — giới hạn ai có thể xem file.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "chmod o-r public.txt",
            hint: "chmod o-r public.txt — o = others, -r = bỏ read",
            onSuccess: { highlight: "file:public.txt", successNote: "rw-rw---- — others không đọc được nữa. u/g/o + +/- + r/w/x là cú pháp symbolic đầy đủ." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-11",
        title: "chown đổi chủ sở hữu",
        steps: [
            {
                type: "narrative",
                text: "<code>chown</code> thay đổi <strong>owner</strong> của file. Trên hệ thống thực cần quyền sudo. Cú pháp: <code>chown user file</code>.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Đổi owner của <strong>report.txt</strong> (trong shared/) thành <code>admin</code>.",
                highlight: "list",
            },
        ],
        command: {
            expected: "chown admin shared/report.txt",
            hint: "chown admin shared/report.txt",
            onSuccess: { highlight: "file:report.txt", successNote: "Owner thay đổi thành admin — chown thường dùng sau khi tạo file cho người khác." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-12",
        title: "Xem quyền sau chown",
        steps: [
            {
                type: "narrative",
                text: "Vào thư mục <strong>shared</strong> để xem quyền của report.txt sau khi đổi owner.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cd shared",
            hint: "cd shared",
            onSuccess: { highlight: "path", successNote: "Đã vào shared/ — ls -l sẽ hiển thị owner admin." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure"],
    },
    {
        id: "6-13",
        title: "ls -l trong shared",
        steps: [
            {
                type: "narrative",
                text: "Xem quyền chi tiết của report.txt với ls -l.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "ls -l",
            hint: "ls -l",
            onSuccess: { highlight: "file:report.txt", successNote: "Owner hiển thị là admin — chown đã thay đổi owner thành công." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure", "shared"],
    },
    {
        id: "6-14",
        title: "chmod 000 — không ai truy cập",
        steps: [
            {
                type: "narrative",
                text: "<code>chmod 000</code> (----------) bỏ tất cả quyền — không ai đọc, ghi hay chạy được file này. Hữu ích để khóa file tạm thời.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Đặt quyền 000 cho report.txt.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "chmod 000 report.txt",
            hint: "chmod 000 report.txt",
            onSuccess: { highlight: "file:report.txt", successNote: "---------- — không ai truy cập được. Đây là cách lock file hoàn toàn." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure", "shared"],
    },
    {
        id: "6-15",
        title: "Khôi phục quyền",
        steps: [
            {
                type: "narrative",
                text: "Bài cuối tổng kết. Khôi phục quyền <code>644</code> cho report.txt để nó dùng được bình thường trở lại.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "chmod 644 report.txt",
            hint: "chmod 644 report.txt",
            onSuccess: { highlight: "file:report.txt", successNote: "Hoàn thành Module 6! ls -l, chmod (octal và symbolic), chown — bộ công cụ quản lý quyền Linux." },
        },
        fsSnapshot: null,
        initialPath: ["student", "secure", "shared"],
    },
];