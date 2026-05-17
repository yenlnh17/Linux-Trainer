export const INIT_FS = {
    name: "home",
    type: "folder",
    children: [{
        name: "student",
        type: "folder",
        children: [{
            name: "workshop",
            type: "folder",
            children: [
                { name: "names.txt",  type: "file", content: "alice\nbob\ncharlie\ndave" },
                { name: "upper.txt",  type: "file", content: "ALICE\nBOB\nCHARLIE\nDAVE" },
                { name: "data.csv",   type: "file", content: "name,age,city\nalice,25,hanoi\nbob,30,hcmc\ncarol,22,danang" },
                { name: "log.txt",    type: "file", content: "ERROR:disk_full\nINFO:started\nERROR:timeout\nINFO:backup_done" },
            ]
        }]
    }]
};

export const INIT_PATH = ["student", "workshop"];

export const LESSONS = [
    {
        id: "8-1",
        title: "Khám phá thư mục workshop",
        steps: [
            {
                type: "narrative",
                text: "Chào mừng đến Module 8 — <strong>Chỉnh sửa văn bản</strong>! Ở đây ta sẽ học ba lệnh mạnh: <code>tr</code>, <code>sed</code>, và <code>tee</code>.",
                highlight: "breadcrumb",
            },
            {
                type: "narrative",
                text: "Thư mục <code>workshop/</code> đã được chuẩn bị sẵn 4 file: danh sách tên, dữ liệu CSV, log hệ thống. Hãy liệt kê chúng trước.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls",
            hint: "Gõ ls để xem nội dung thư mục",
            onSuccess: {
                highlight: "list",
                successNote: "Có 4 file: names.txt, upper.txt, data.csv, log.txt — nguyên liệu cho toàn bộ module này.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-2",
        title: "Đọc file names.txt",
        steps: [
            {
                type: "narrative",
                text: "<code>names.txt</code> chứa danh sách tên người dùng viết thường. Đây là dữ liệu thô ta sẽ xử lý bằng <code>tr</code> và <code>sed</code>.",
                highlight: "file:names.txt",
            },
        ],
        command: {
            expected: "cat names.txt",
            hint: "cat names.txt",
            onSuccess: {
                highlight: "file:names.txt",
                successNote: "4 dòng: alice, bob, charlie, dave — tất cả viết thường.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-3",
        title: "Lệnh tr — chuyển chữ thường thành hoa",
        steps: [
            {
                type: "narrative",
                text: "Lệnh <code>tr</code> (<strong>tr</strong>anslate) thay thế từng ký tự theo bảng ánh xạ. Cú pháp: <code>tr 'set1' 'set2'</code> — mỗi ký tự trong set1 được đổi thành ký tự cùng vị trí trong set2.",
                highlight: "terminal-input",
            },
            {
                type: "narrative",
                text: "<code>a-z</code> là viết tắt của 26 chữ cái thường, <code>A-Z</code> là 26 chữ hoa. Vì <code>tr</code> đọc từ stdin, ta dùng pipe: <code>cat file | tr ...</code>",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cat names.txt | tr 'a-z' 'A-Z'",
            hint: "cat names.txt | tr 'a-z' 'A-Z'",
            onSuccess: {
                highlight: "file:names.txt",
                successNote: "ALICE, BOB, CHARLIE, DAVE — tất cả đã chuyển thành chữ hoa! File gốc không thay đổi.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-4",
        title: "tr ngược — chữ hoa về thường",
        steps: [
            {
                type: "narrative",
                text: "<code>upper.txt</code> chứa các tên viết hoa. Ta dùng <code>tr 'A-Z' 'a-z'</code> để chuyển ngược về chữ thường — cùng cú pháp, chỉ đổi thứ tự hai set.",
                highlight: "file:upper.txt",
            },
        ],
        command: {
            expected: "cat upper.txt | tr 'A-Z' 'a-z'",
            hint: "cat upper.txt | tr 'A-Z' 'a-z'",
            onSuccess: {
                highlight: "file:upper.txt",
                successNote: "ALICE → alice, BOB → bob, v.v. tr hoạt động hoàn toàn đối xứng.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-5",
        title: "Xem dữ liệu CSV",
        steps: [
            {
                type: "narrative",
                text: "<code>data.csv</code> lưu dữ liệu dạng bảng — các cột ngăn cách bởi dấu phẩy (Comma-Separated Values). Đây là định dạng rất phổ biến khi xử lý dữ liệu trên Linux.",
                highlight: "file:data.csv",
            },
        ],
        command: {
            expected: "cat data.csv",
            hint: "cat data.csv",
            onSuccess: {
                highlight: "file:data.csv",
                successNote: "Header: name,age,city và 3 dòng dữ liệu. Tiếp theo ta sẽ dùng tr để thay đổi định dạng.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-6",
        title: "tr thay ký tự — đổi dấu phẩy thành khoảng trắng",
        steps: [
            {
                type: "narrative",
                text: "<code>tr</code> không chỉ dùng cho chữ cái — bất kỳ ký tự nào cũng được. Ta thay dấu phẩy <code>,</code> bằng khoảng trắng để file CSV dễ đọc hơn trong terminal.",
                highlight: "file:data.csv",
            },
        ],
        command: {
            expected: "cat data.csv | tr ',' ' '",
            hint: "cat data.csv | tr ',' ' '",
            onSuccess: {
                highlight: "file:data.csv",
                successNote: "Dấu phẩy đã thay bằng dấu cách. File gốc không thay đổi — tr chỉ biến đổi luồng output.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-7",
        title: "tr -d — xóa ký tự",
        steps: [
            {
                type: "narrative",
                text: "Flag <code>-d</code> của <code>tr</code> là <strong>delete</strong> — xóa tất cả ký tự được liệt kê, không thay bằng gì cả. Cú pháp: <code>tr -d 'chars'</code>",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cat data.csv | tr -d ','",
            hint: "cat data.csv | tr -d ','",
            onSuccess: {
                highlight: "file:data.csv",
                successNote: "Toàn bộ dấu phẩy bị xóa — các cột dính liền nhau. Dùng khi cần tẩy ký tự thừa khỏi dữ liệu.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-8",
        title: "Xem file log hệ thống",
        steps: [
            {
                type: "narrative",
                text: "<code>log.txt</code> mô phỏng file nhật ký hệ thống — chứa các dòng <code>ERROR</code> và <code>INFO</code> xen kẽ. Đây là loại file cực phổ biến khi làm việc với Linux server.",
                highlight: "file:log.txt",
            },
        ],
        command: {
            expected: "cat log.txt",
            hint: "cat log.txt",
            onSuccess: {
                highlight: "file:log.txt",
                successNote: "4 dòng: ERROR và INFO xen kẽ. Tiếp theo ta dùng sed để biến đổi nội dung.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-9",
        title: "Giới thiệu sed — thay thế qua pipe",
        steps: [
            {
                type: "narrative",
                text: "Lệnh <code>sed</code> (<strong>s</strong>tream <strong>ed</strong>itor) là công cụ chỉnh sửa luồng văn bản. Cú pháp thay thế: <code>sed 's/cũ/mới/g'</code>",
                highlight: "terminal-input",
            },
            {
                type: "narrative",
                text: "Giải mã <code>s/cũ/mới/g</code>: <strong>s</strong> = substitute, <code>cũ</code> = pattern tìm kiếm, <code>mới</code> = chuỗi thay thế, <strong>g</strong> = global (thay tất cả lần xuất hiện trong dòng).",
                highlight: "terminal-input",
            },
            {
                type: "narrative",
                text: "Ta sẽ đánh dấu tất cả dòng ERROR bằng cách đổi <code>ERROR</code> thành <code>[ERROR]</code> để dễ nhận biết hơn.",
                highlight: "file:log.txt",
            },
        ],
        command: {
            expected: "cat log.txt | sed 's/ERROR/[ERROR]/g'",
            hint: "cat log.txt | sed 's/ERROR/[ERROR]/g'",
            onSuccess: {
                highlight: "file:log.txt",
                successNote: "Các dòng lỗi giờ có dạng [ERROR]:... — rõ ràng hơn nhiều khi đọc log dài!",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-10",
        title: "sed standalone — nhận file trực tiếp",
        steps: [
            {
                type: "narrative",
                text: "<code>sed</code> cũng nhận file làm đối số trực tiếp, không cần pipe từ <code>cat</code>. Cú pháp: <code>sed 's/cũ/mới/' file</code>",
                highlight: "terminal-input",
            },
            {
                type: "narrative",
                text: "<strong>Không có flag g</strong> = chỉ thay lần xuất hiện <em>đầu tiên</em> trong mỗi dòng. Thử đổi chữ thường <code>alice</code> thành <code>Alice</code> đúng chuẩn.",
                highlight: "file:names.txt",
            },
        ],
        command: {
            expected: "sed 's/alice/Alice/' names.txt",
            hint: "sed 's/alice/Alice/' names.txt",
            onSuccess: {
                highlight: "file:names.txt",
                successNote: "Dòng 'alice' đổi thành 'Alice'. File gốc không thay đổi — sed chỉ in ra stdout, không ghi đè.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-11",
        title: "sed với flag g — thay tất cả",
        steps: [
            {
                type: "narrative",
                text: "Flag <code>g</code> (global) thay thế <em>tất cả</em> lần xuất hiện trong mỗi dòng. Không có <code>g</code> = chỉ thay lần đầu. Thử chuẩn hoá tên thành phố trong data.csv.",
                highlight: "file:data.csv",
            },
        ],
        command: {
            expected: "sed 's/hcmc/HCMC/g' data.csv",
            hint: "sed 's/hcmc/HCMC/g' data.csv",
            onSuccess: {
                highlight: "file:data.csv",
                successNote: "Tất cả 'hcmc' đổi thành 'HCMC'. Với flag g, dù xuất hiện bao nhiêu lần trong 1 dòng cũng đều được thay.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-12",
        title: "sed đổi delimiter CSV",
        steps: [
            {
                type: "narrative",
                text: "Một ứng dụng thực tế: đổi delimiter của file CSV. Nhiều hệ thống châu Âu dùng dấu chấm phẩy <code>;</code> thay vì dấu phẩy. <code>sed</code> qua pipe có thể làm điều này.",
                highlight: "file:data.csv",
            },
        ],
        command: {
            expected: "cat data.csv | sed 's/,/;/g'",
            hint: "cat data.csv | sed 's/,/;/g'",
            onSuccess: {
                highlight: "file:data.csv",
                successNote: "CSV với dấu phẩy → CSV với dấu chấm phẩy. Đây là cách chuyển đổi định dạng rất phổ biến.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-13",
        title: "sed thay thế để chuẩn hoá log",
        steps: [
            {
                type: "narrative",
                text: "Ta cũng có thể dùng <code>sed</code> để chuẩn hoá mức độ nghiêm trọng trong log — đổi <code>ERROR</code> thành <code>WARNING</code> để phân loại lại.",
                highlight: "file:log.txt",
            },
        ],
        command: {
            expected: "sed 's/ERROR/WARNING/g' log.txt",
            hint: "sed 's/ERROR/WARNING/g' log.txt",
            onSuccess: {
                highlight: "file:log.txt",
                successNote: "Tất cả dòng ERROR đã thành WARNING. sed rất linh hoạt — pattern và replacement có thể là bất kỳ chuỗi nào.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-14",
        title: "Giới thiệu tee — ghi file và in ra terminal",
        steps: [
            {
                type: "narrative",
                text: "Lệnh <code>tee</code> lấy tên từ chữ T — nó chia luồng dữ liệu thành hai ngả: vừa <strong>in ra terminal</strong>, vừa <strong>ghi vào file</strong> cùng lúc.",
                highlight: "terminal-input",
            },
            {
                type: "narrative",
                text: "Cú pháp: <code>cmd | tee filename</code>. Khác với <code>&gt;</code> (chỉ ghi file, không in), <code>tee</code> làm cả hai. Rất hữu ích khi muốn lưu lại output đồng thời xem ngay.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cat names.txt | tee names_copy.txt",
            hint: "cat names.txt | tee names_copy.txt",
            onSuccess: {
                highlight: "create",
                successNote: "names_copy.txt đã được tạo với cùng nội dung của names.txt. Đồng thời terminal cũng in nội dung ra ngay!",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
    {
        id: "8-15",
        title: "tee để backup log",
        steps: [
            {
                type: "narrative",
                text: "<code>tee</code> rất hữu ích để sao lưu log trước khi xử lý. Ta backup <code>log.txt</code> ra một file mới, đồng thời vẫn xem được nội dung.",
                highlight: "file:log.txt",
            },
        ],
        command: {
            expected: "cat log.txt | tee log_backup.txt",
            hint: "cat log.txt | tee log_backup.txt",
            onSuccess: {
                highlight: "create",
                successNote: "log_backup.txt đã tạo xong! Kết hợp tee với sed hay tr để vừa biến đổi, vừa lưu kết quả là cách dùng phổ biến nhất.",
            },
        },
        fsSnapshot: null,
        initialPath: null,
    },
];