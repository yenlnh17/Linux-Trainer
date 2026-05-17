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
                        {
                            name: "readme.txt",
                            type: "file",
                            content: "Chào mừng Module 2!\nHôm nay bạn học thao tác với file:\n- cat: đọc nội dung file\n- rm:  xóa file hoặc folder\n- cp:  sao chép file\n- mv:  đổi tên / di chuyển",
                        },
                        {
                            name: "notes.txt",
                            type: "file",
                            content: "Ghi chú học Linux:\n1. Mọi thứ đều là file\n2. Terminal rất mạnh\n3. Không có Recycle Bin — xóa là mất!",
                        },
                        {
                            name: "draft.txt",
                            type: "file",
                            content: "Bản nháp cũ — có thể xóa an toàn.",
                        },
                    ],
                },
            ],
        },
    ],
};

export const INIT_PATH = ["student", "docs"];

export const LESSONS = [
    {
        id: "2-1",
        title: "Đọc nội dung file",
        steps: [
            {
                type: "narrative",
                text: "Module 2 tập trung vào thao tác với file. Lệnh đầu tiên: <code>cat</code> — hiển thị nội dung một file ngay trong terminal.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Explorer đang hiển thị <strong>readme.txt</strong>. Dùng <code>cat readme.txt</code> để xem nội dung của nó.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cat readme.txt",
            hint: "cat + tên file → in nội dung ra terminal",
            onSuccess: { highlight: "file:readme.txt", successNote: "cat in ra từng dòng nội dung file — rất tiện để kiểm tra nhanh." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-2",
        title: "Đọc file thứ hai",
        steps: [
            {
                type: "narrative",
                text: "<code>cat</code> hoạt động với bất kỳ file văn bản nào. Thử đọc <strong>notes.txt</strong> để thấy nội dung khác.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cat notes.txt",
            hint: "cat notes.txt",
            onSuccess: { highlight: "file:notes.txt", successNote: "Bạn đã biết cách đọc file mà không cần mở editor." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-3",
        title: "Xóa file không cần thiết",
        steps: [
            {
                type: "narrative",
                text: "<code>rm</code> xóa file vĩnh viễn — không có thùng rác, không thể khôi phục. Hãy dùng cẩn thận.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "<strong>draft.txt</strong> là bản nháp cũ không cần nữa. Xóa nó bằng <code>rm draft.txt</code>.",
                highlight: "list",
            },
        ],
        command: {
            expected: "rm draft.txt",
            hint: "rm + tên file → xóa vĩnh viễn",
            onSuccess: { highlight: "delete", successNote: "draft.txt đã biến mất. rm không hỏi lại — hãy chắc chắn trước khi xóa." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-4",
        title: "Xác nhận đã xóa",
        steps: [
            {
                type: "narrative",
                text: "Sau khi xóa, Explorer đã cập nhật. Dùng <code>ls</code> để xác nhận <strong>draft.txt</strong> không còn trong danh sách.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls",
            hint: "ls để xem danh sách sau khi xóa",
            onSuccess: { highlight: "list", successNote: "Chỉ còn readme.txt và notes.txt — draft.txt đã bị xóa hoàn toàn." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-5",
        title: "Tạo file mới",
        steps: [
            {
                type: "narrative",
                text: "Bạn đã biết xóa — giờ tạo thêm. <code>touch</code> tạo file rỗng ngay lập tức.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Tạo <strong>report.txt</strong> — file này sẽ dùng trong các bài tiếp theo.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "touch report.txt",
            hint: "touch report.txt",
            onSuccess: { highlight: "create", successNote: "report.txt xuất hiện trong Explorer — file rỗng, sẵn sàng để dùng." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-6",
        title: "Sao chép file",
        steps: [
            {
                type: "narrative",
                text: "<code>cp nguồn đích</code> tạo bản sao của file. File gốc vẫn còn nguyên — bạn có hai bản.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Sao chép <strong>readme.txt</strong> thành <strong>backup.txt</strong> để lưu một bản dự phòng.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cp readme.txt backup.txt",
            hint: "cp nguồn đích — tạo bản sao trong cùng thư mục",
            onSuccess: { highlight: "create", successNote: "Cả readme.txt lẫn backup.txt đều có mặt — cp không xóa file gốc." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-7",
        title: "Xác nhận bản sao",
        steps: [
            {
                type: "narrative",
                text: "Dùng <code>ls</code> để xác nhận cả hai file cùng tồn tại — readme.txt (gốc) và backup.txt (bản sao).",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls",
            hint: "ls để thấy cả hai file",
            onSuccess: { highlight: "list", successNote: "cp tạo ra một bản độc lập — thay đổi một file không ảnh hưởng đến file kia." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-8",
        title: "Xác nhận nội dung được sao chép",
        steps: [
            {
                type: "narrative",
                text: "<code>cat</code> trên bản sao sẽ in ra nội dung giống hệt file gốc. Hãy kiểm tra <strong>backup.txt</strong>.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cat backup.txt",
            hint: "cat backup.txt — nội dung phải giống readme.txt",
            onSuccess: { highlight: "file:backup.txt", successNote: "Nội dung được sao chép đầy đủ. Bản sao hoàn toàn độc lập với file gốc." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-9",
        title: "Đổi tên file",
        steps: [
            {
                type: "narrative",
                text: "<code>mv</code> (move) dùng để <strong>đổi tên</strong> hoặc di chuyển file. Khi nguồn và đích cùng thư mục — đó là đổi tên.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Đổi tên <strong>backup.txt</strong> thành <strong>archive.txt</strong> — file di chuyển đến tên mới.",
                highlight: "list",
            },
        ],
        command: {
            expected: "mv backup.txt archive.txt",
            hint: "mv tên-cũ tên-mới → đổi tên file",
            onSuccess: { highlight: "move", successNote: "backup.txt biến mất, archive.txt xuất hiện — đó chính là cách mv đổi tên." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-10",
        title: "Xác nhận tên mới",
        steps: [
            {
                type: "narrative",
                text: "Sau <code>mv</code>, tên cũ không còn tồn tại. Dùng <code>ls</code> để thấy <strong>archive.txt</strong> thay thế <strong>backup.txt</strong>.",
                highlight: "list",
            },
        ],
        command: {
            expected: "ls",
            hint: "ls — phải thấy archive.txt, không thấy backup.txt",
            onSuccess: { highlight: "list", successNote: "mv đổi tên tại chỗ — không tạo bản sao, không để lại tên cũ." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-11",
        title: "Tạo thư mục trash",
        steps: [
            {
                type: "narrative",
                text: "Tiếp theo bạn sẽ học <code>rm -r</code> — xóa toàn bộ thư mục kể cả nội dung bên trong.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Trước tiên tạo thư mục <strong>trash</strong> để thực hành xóa folder.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "mkdir trash",
            hint: "mkdir trash",
            onSuccess: { highlight: "create", successNote: "Thư mục trash đã sẵn sàng để thêm file rồi xóa đi." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-12",
        title: "Vào thư mục trash",
        steps: [
            {
                type: "narrative",
                text: "Đi vào <strong>trash</strong> để tạo file bên trong — bạn sẽ xóa cả thư mục này sau.",
                highlight: "list",
            },
        ],
        command: {
            expected: "cd trash",
            hint: "cd trash",
            onSuccess: { highlight: "path", successNote: "Bạn đang ở bên trong trash — thư mục hiện đang rỗng." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
    {
        id: "2-13",
        title: "Tạo file rác",
        steps: [
            {
                type: "narrative",
                text: "Tạo một file bên trong <strong>trash</strong> — điều này sẽ giúp bài tiếp theo minh họa <code>rm -r</code> xóa cả folder lẫn nội dung.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "touch junk.txt",
            hint: "touch junk.txt — tạo file rác bên trong trash",
            onSuccess: { highlight: "create", successNote: "junk.txt nằm trong trash. Bây giờ trash không còn rỗng." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs", "trash"],
    },
    {
        id: "2-14",
        title: "Quay lại docs",
        steps: [
            {
                type: "narrative",
                text: "Để xóa <strong>trash</strong> từ thư mục cha, bạn cần ra khỏi nó trước. Dùng <code>cd ..</code>.",
                highlight: "breadcrumb",
            },
        ],
        command: {
            expected: "cd ..",
            hint: "cd .. — lên thư mục cha",
            onSuccess: { highlight: "path", successNote: "Bạn đang ở docs — bây giờ có thể xóa trash từ đây." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs", "trash"],
    },
    {
        id: "2-15",
        title: "Xóa thư mục và nội dung",
        steps: [
            {
                type: "narrative",
                text: "<code>rm -r</code> xóa đệ quy (recursive) — xóa folder kể cả mọi file bên trong. Không thể hoàn tác.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Xóa <strong>trash</strong> — cả folder lẫn <strong>junk.txt</strong> bên trong sẽ biến mất cùng lúc.",
                highlight: "list",
            },
        ],
        command: {
            expected: "rm -r trash",
            hint: "rm -r folder — xóa folder có nội dung",
            onSuccess: { highlight: "delete", successNote: "Xong! Bạn đã nắm cat, rm, cp, mv — bộ công cụ cơ bản để thao tác file trong Linux." },
        },
        fsSnapshot: null,
        initialPath: ["student", "docs"],
    },
];
