export const INIT_FS = {
    name: "home",
    type: "folder",
    children: [
        {
            name: "student",
            type: "folder",
            children: [
                {
                    name: "data",
                    type: "folder",
                    children: [
                        {
                            name: "fruits.txt",
                            type: "file",
                            content: "apple\nbanana\napple\ncherry\nbanana\napple",
                        },
                        {
                            name: "scores.txt",
                            type: "file",
                            content: "Alice 95\nBob 72\nCarol 88\nAlice 95\nDave 60",
                        },
                        {
                            name: "csv.txt",
                            type: "file",
                            content: "name:age:city\nAlice:25:Hanoi\nBob:30:HCMC\nCarol:22:Danang",
                        },
                    ],
                },
            ],
        },
    ],
};

export const INIT_PATH = ["student", "data"];

export const LESSONS = [
    {
        id: "4-1",
        title: "Đếm dòng với wc",
        steps: [
            {
                type: "narrative",
                text: "Module 4 dạy xử lý văn bản nâng cao. Lệnh đầu tiên: <code>wc</code> (word count) — đếm <strong>dòng, từ và byte</strong> trong file.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Explorer đang hiển thị <strong>fruits.txt</strong>. Dùng <code>wc fruits.txt</code> để xem thống kê.",
                highlight: "list",
            },
        ],
        command: {
            expected: "wc fruits.txt",
            hint: "wc + tên file → lines words chars filename",
            onSuccess: { highlight: "file:fruits.txt", successNote: "wc in ra: số dòng, số từ, số byte — 3 thống kê cùng lúc." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-2",
        title: "Chỉ đếm số dòng",
        steps: [
            {
                type: "narrative",
                text: "<code>wc -l</code> chỉ in số dòng — đơn giản hơn khi bạn chỉ cần 1 con số.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng <code>wc -l fruits.txt</code> để chỉ xem số dòng.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "wc -l fruits.txt",
            hint: "wc -l fruits.txt",
            onSuccess: { highlight: "file:fruits.txt", successNote: "6 dòng — nhanh hơn đếm tay và dùng được trong script." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-3",
        title: "wc trên file khác",
        steps: [
            {
                type: "narrative",
                text: "<code>wc</code> hoạt động trên bất kỳ file nào. Thử với <strong>scores.txt</strong> — file có nhiều từ trên mỗi dòng hơn.",
                highlight: "list",
            },
        ],
        command: {
            expected: "wc scores.txt",
            hint: "wc scores.txt",
            onSuccess: { highlight: "file:scores.txt", successNote: "5 dòng nhưng 10 từ — vì mỗi dòng có 2 từ. wc đếm chính xác theo khoảng trắng." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-4",
        title: "Sắp xếp với sort",
        steps: [
            {
                type: "narrative",
                text: "<code>sort</code> sắp xếp các dòng theo thứ tự alphabetical (A-Z). Output mới — file gốc không bị thay đổi.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "fruits.txt không theo thứ tự — dùng <code>sort fruits.txt</code> để sắp xếp lại.",
                highlight: "list",
            },
        ],
        command: {
            expected: "sort fruits.txt",
            hint: "sort + tên file → in ra các dòng đã sắp xếp",
            onSuccess: { highlight: "file:fruits.txt", successNote: "apple, banana, cherry — đã sắp xếp A-Z. File gốc vẫn giữ nguyên." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-5",
        title: "Sắp xếp ngược (Z-A)",
        steps: [
            {
                type: "narrative",
                text: "<code>sort -r</code> (reverse) đảo ngược thứ tự — từ Z-A thay vì A-Z.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng <code>sort -r fruits.txt</code> để xem thứ tự ngược lại.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "sort -r fruits.txt",
            hint: "sort -r fruits.txt",
            onSuccess: { highlight: "file:fruits.txt", successNote: "cherry đứng đầu — flag -r đảo ngược mọi thứ." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-6",
        title: "sort trên scores.txt",
        steps: [
            {
                type: "narrative",
                text: "<code>sort</code> sắp xếp theo ký tự đầu tiên của mỗi dòng — thường là tên khi làm việc với dữ liệu.",
                highlight: "list",
            },
        ],
        command: {
            expected: "sort scores.txt",
            hint: "sort scores.txt",
            onSuccess: { highlight: "file:scores.txt", successNote: "Alice, Bob, Carol, Dave — tên đã được sắp alphabetically. Chú ý: Alice xuất hiện 2 lần!" },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-7",
        title: "Loại bỏ dòng trùng với uniq",
        steps: [
            {
                type: "narrative",
                text: "<code>uniq</code> xóa các dòng trùng nhau <strong>liên tiếp</strong> (adjacent). Nếu file chưa được sort, các dòng trùng cách nhau sẽ KHÔNG bị xóa.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "fruits.txt có apple và banana trùng nhưng không liên tiếp — dùng <code>uniq fruits.txt</code> và xem điều gì xảy ra.",
                highlight: "list",
            },
        ],
        command: {
            expected: "uniq fruits.txt",
            hint: "uniq + tên file → bỏ dòng trùng liên tiếp",
            onSuccess: { highlight: "file:fruits.txt", successNote: "Vẫn còn trùng! apple và banana cách nhau nên uniq không xóa chúng — đây là hành vi đúng." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-8",
        title: "sort rồi uniq",
        steps: [
            {
                type: "narrative",
                text: "Để bỏ <strong>tất cả</strong> dòng trùng: sort trước (gom chúng lại liên tiếp) rồi mới uniq.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng pipe: <code>sort fruits.txt | uniq</code> — đây là pattern cực kỳ phổ biến trong Linux.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "sort fruits.txt | uniq",
            hint: "sort fruits.txt | uniq",
            onSuccess: { highlight: "file:fruits.txt", successNote: "Chỉ còn 3 loại trái cây duy nhất — sort|uniq là combo kinh điển." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-9",
        title: "Cắt cột với cut",
        steps: [
            {
                type: "narrative",
                text: "<code>cut</code> tách cột từ dữ liệu có delimiter. Flag <code>-d</code> chỉ delimiter, <code>-f</code> chỉ số cột cần lấy.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "csv.txt dùng <code>:</code> làm separator với 3 cột. Dùng <code>cut -d: -f1 csv.txt</code> để lấy cột 1 (tên).",
                highlight: "list",
            },
        ],
        command: {
            expected: "cut -d: -f1 csv.txt",
            hint: "cut -d: -f1 csv.txt — -d là delimiter, -f là field number",
            onSuccess: { highlight: "file:csv.txt", successNote: "Chỉ còn cột name — cut rất tiện với CSV hay config files." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-10",
        title: "Lấy cột 2",
        steps: [
            {
                type: "narrative",
                text: "Thay <code>-f1</code> thành <code>-f2</code> để lấy cột tiếp theo — delimiter vẫn là <code>:</code>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cut -d: -f2 csv.txt",
            hint: "cut -d: -f2 csv.txt",
            onSuccess: { highlight: "file:csv.txt", successNote: "Cột age: 25, 30, 22. Chỉ thay -f là đủ để chuyển cột." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-11",
        title: "Lấy cột 3",
        steps: [
            {
                type: "narrative",
                text: "Và cột thứ 3? Vẫn cùng pattern — chỉ đổi số <code>-f</code>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cut -d: -f3 csv.txt",
            hint: "cut -d: -f3 csv.txt",
            onSuccess: { highlight: "file:csv.txt", successNote: "Tên thành phố — 3 cột từ 1 file chỉ bằng cách thay đổi -f." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-12",
        title: "sort qua pipe",
        steps: [
            {
                type: "narrative",
                text: "<code>sort</code> cũng nhận stdin từ pipe. <code>cat file | sort</code> cho kết quả giống <code>sort file</code> nhưng pipe cho phép kết hợp với lệnh khác.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng pipe để cat fruits.txt rồi sort kết quả.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cat fruits.txt | sort",
            hint: "cat fruits.txt | sort",
            onSuccess: { highlight: "file:fruits.txt", successNote: "Kết quả giống sort trực tiếp — pipe cho phép bạn chuỗi bất kỳ lệnh nào." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-13",
        title: "Đếm dòng qua pipe",
        steps: [
            {
                type: "narrative",
                text: "<code>wc -l</code> cũng nhận stdin qua pipe — rất hữu ích để đếm kết quả của lệnh khác.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Dùng pipe để đếm số dòng trong fruits.txt bằng <code>cat | wc -l</code>.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "cat fruits.txt | wc -l",
            hint: "cat fruits.txt | wc -l",
            onSuccess: { highlight: "file:fruits.txt", successNote: "6 dòng — cat|wc -l thường dùng để đếm kết quả output của lệnh khác trong pipeline dài." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-14",
        title: "Đếm kết quả grep",
        steps: [
            {
                type: "narrative",
                text: "Kết hợp <code>grep</code> và <code>wc -l</code> để đếm số lần xuất hiện của một pattern — pattern cực kỳ phổ biến khi phân tích log.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Đếm xem \"apple\" xuất hiện bao nhiêu lần trong fruits.txt.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "grep apple fruits.txt | wc -l",
            hint: "grep apple fruits.txt | wc -l",
            onSuccess: { highlight: "file:fruits.txt", successNote: "3 lần — grep lọc dòng, wc -l đếm kết quả. Đây là cách nhanh nhất để đếm tần suất." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
    {
        id: "4-15",
        title: "Tổng kết — lọc dữ liệu trùng",
        steps: [
            {
                type: "narrative",
                text: "Bài cuối tổng kết. scores.txt có tên trùng — dùng <code>sort | uniq</code> để lấy danh sách người duy nhất.",
                highlight: null,
            },
            {
                type: "narrative",
                text: "Sort scores.txt rồi lọc trùng qua pipe.",
                highlight: "terminal-input",
            },
        ],
        command: {
            expected: "sort scores.txt | uniq",
            hint: "sort scores.txt | uniq",
            onSuccess: { highlight: "file:scores.txt", successNote: "Hoàn thành Module 4! wc, sort, uniq, cut — bộ công cụ phân tích text căn bản của Linux." },
        },
        fsSnapshot: null,
        initialPath: ["student", "data"],
    },
];
