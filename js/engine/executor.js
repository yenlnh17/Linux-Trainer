import { clone, getNode, listDir, pathString, removeNode, copyNode, moveNode, setFileContent, setNodeMeta, defaultPerms } from './fs.js';
import { validate } from './validator.js';
import { applyFilter } from './pipeline.js';

function esc(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function base_result(fs, path, overrides) {
    return {
        ok: true,
        newFs: fs,
        newPath: path,
        highlight: null,
        lastCreated: null,
        terminalLines: [],
        lessonPassed: false,
        sideEffect: null,
        ...overrides,
    };
}

export function execute(raw, fs, path, lessons, lessonIdx, processes) {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    const parts = trimmed.split(/\s+/).filter(Boolean);
    const cmd = parts[0] || "";
    const args = parts.slice(1);
    const cmdLine = { cls: "cmd", text: "<span>" + pathString(path) + " $</span> " + esc(trimmed) };

    function withLesson(res) {
        const v = validate(trimmed, lessons, lessonIdx);
        if (v.done) return res;
        if (!v.passed) {
            return {
                ...res,
                terminalLines: [
                    ...res.terminalLines,
                    { cls: "err", text: "Chưa đúng — xem hướng dẫn ở sidebar hoặc dùng hint." },
                ],
            };
        }
        return { ...res, lessonPassed: true };
    }

    // ── PIPE: cmd1 | cmd2 ────────────────────────────────────────────────
    const pipeIdx = trimmed.indexOf('|');
    if (pipeIdx >= 0) {
        const leftRaw  = trimmed.slice(0, pipeIdx).trim();
        const rightRaw = trimmed.slice(pipeIdx + 1).trim();
        const lp = leftRaw.split(/\s+/);
        const rp = rightRaw.split(/\s+/);

        let sourceLines = [];
        let sourceHL = null;

        if (lp[0] === "cat" && lp[1]) {
            const dir = getNode(fs, path);
            const file = dir?.children?.find(c => c.name === lp[1] && c.type === "file");
            if (!file) return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "cat: " + esc(lp[1]) + ": No such file" }],
            });
            sourceLines = (file.content ?? "").split('\n');
            sourceHL = "file:" + lp[1];
        } else if (lp[0] === "grep" && lp[1] && lp[2]) {
            const dir = getNode(fs, path);
            const file = dir?.children?.find(c => c.name === lp[2] && c.type === "file");
            if (!file) return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "grep: " + esc(lp[2]) + ": No such file" }],
            });
            sourceLines = (file.content ?? "").split('\n').filter(l => l.includes(lp[1]));
            sourceHL = "file:" + lp[2];
        } else if (lp[0] === "sort" && lp[1]) {
            const isReverse = lp[1] === "-r";
            const filename = isReverse ? lp[2] : lp[1];
            if (!filename) return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "sort: filename required" }],
            });
            const dir = getNode(fs, path);
            const file = dir?.children?.find(c => c.name === filename && c.type === "file");
            if (!file) return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "sort: " + esc(filename) + ": No such file" }],
            });
            sourceLines = (file.content ?? "").split('\n').sort();
            if (isReverse) sourceLines.reverse();
            sourceHL = "file:" + filename;
        } else if (lp[0] === "sed" && lp[1] && lp[2]) {
            const expr = lp[1].replace(/^['"]|['"]$/g, "");
            const filename = lp[2];
            const sedPipeM = /^s\/(.+?)\/(.*)\/([g]?)$/.exec(expr);
            if (!sedPipeM) return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "sed: invalid expression (use s/old/new/g)" }],
            });
            const [, pattern, replacement, flags] = sedPipeM;
            const dir = getNode(fs, path);
            const file = dir?.children?.find(c => c.name === filename && c.type === "file");
            if (!file) return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "sed: " + esc(filename) + ": No such file" }],
            });
            sourceLines = (file.content ?? "").split('\n').map(l =>
                flags === 'g' ? l.replaceAll(pattern, replacement) : l.replace(pattern, replacement)
            );
            sourceHL = "file:" + filename;
        } else {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "pipe: left side must be cat, grep, sort, or sed" }],
            });
        }

        if (rp[0] === "tee") {
            const teeFilename = rp[1];
            if (!teeFilename) return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "tee: filename required" }],
            });
            const newFs = setFileContent(fs, path, teeFilename, sourceLines.join('\n'));
            const outLines = sourceLines.map(l => ({ cls: "out", text: esc(l) }));
            return withLesson(base_result(newFs, path, {
                highlight: "create",
                lastCreated: teeFilename,
                terminalLines: [cmdLine, ...outLines],
            }));
        }

        const filtered = applyFilter(rp[0], rp.slice(1), sourceLines);
        const outLines = filtered.lines.map(l => ({ cls: "out", text: esc(l) }));
        return withLesson(base_result(fs, path, {
            highlight: sourceHL,
            terminalLines: [cmdLine, ...outLines],
        }));
    }

    // ── REDIRECT: echo text >> file  or  echo text > file ────────────────
    const appendM = /^(.+)>>(.+)$/.exec(trimmed);
    if (appendM) {
        const srcRaw = appendM[1].trim();
        const target = appendM[2].trim();
        const sp = srcRaw.split(/\s+/);
        if (sp[0] !== "echo") return base_result(fs, path, {
            ok: false,
            terminalLines: [cmdLine, { cls: "err", text: "redirect: chỉ hỗ trợ echo trong module này" }],
        });
        const text = sp.slice(1).join(" ");
        const dir = getNode(fs, path);
        const existing = dir?.children?.find(c => c.name === target && c.type === "file");
        const newContent = existing ? (existing.content ?? "") + "\n" + text : text;
        const newFs = setFileContent(fs, path, target, newContent);
        return withLesson(base_result(newFs, path, {
            highlight: "create",
            lastCreated: target,
            terminalLines: [cmdLine, { cls: "out", text: esc(target) + " (appended)" }],
        }));
    }
    const writeM = /^(.+?)>([^>].*)$/.exec(trimmed);
    if (writeM) {
        const srcRaw = writeM[1].trim();
        const target = writeM[2].trim();
        const sp = srcRaw.split(/\s+/);
        if (sp[0] !== "echo") return base_result(fs, path, {
            ok: false,
            terminalLines: [cmdLine, { cls: "err", text: "redirect: chỉ hỗ trợ echo trong module này" }],
        });
        const text = sp.slice(1).join(" ");
        const newFs = setFileContent(fs, path, target, text);
        return withLesson(base_result(newFs, path, {
            highlight: "create",
            lastCreated: target,
            terminalLines: [cmdLine, { cls: "out", text: esc(target) + " (written)" }],
        }));
    }

    if (cmd === "pwd") {
        return withLesson(base_result(fs, path, {
            highlight: "path",
            terminalLines: [cmdLine, { cls: "out", text: esc(pathString(path)) }],
        }));
    }

    if (cmd === "ls") {
        const node = getNode(fs, path);
        const items = listDir(node);
        if (args[0] === "-l") {
            const lines = items.map(i => {
                if (i.type === "symlink") {
                    return "lrwxrwxrwx&nbsp;&nbsp;" + esc(i.owner ?? "student") + "&nbsp;&nbsp;" + esc(i.name) + " -&gt; " + esc(i.target ?? "");
                }
                const perms = i.perms ?? defaultPerms(i.type);
                const type  = i.type === "folder" ? "d" : "-";
                const owner = i.owner ?? "student";
                return type + perms + "&nbsp;&nbsp;" + esc(owner) + "&nbsp;&nbsp;" + esc(i.name);
            });
            return withLesson(base_result(fs, path, {
                highlight: "list",
                terminalLines: [cmdLine, ...lines.map(l => ({ cls: "out", text: l }))],
            }));
        }
        return withLesson(base_result(fs, path, {
            highlight: "list",
            terminalLines: [cmdLine, {
                cls: "out",
                text: items.length ? items.map((i) => i.name).join("&nbsp;&nbsp;&nbsp;") : "(empty)",
            }],
        }));
    }

    if (cmd === "cd") {
        const tgt = args[0];
        if (!tgt) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: cd &lt;folder&gt;" }],
            });
        }
        if (tgt === "..") {
            if (path.length <= 1) {
                return base_result(fs, path, {
                    ok: false,
                    terminalLines: [cmdLine, { cls: "out", text: "Already at root workspace" }],
                });
            }
            return withLesson(base_result(fs, path.slice(0, -1), {
                highlight: "path",
                terminalLines: [cmdLine, { cls: "out", text: "↩ Moved to parent directory" }],
            }));
        }
        const target = getNode(fs, [...path, tgt]);
        if (!target) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "cd: " + esc(tgt) + ": No such directory" }],
            });
        }
        if (target.type === "symlink") {
            const symlinkDest = target.target;
            const resolved = [...path, symlinkDest];
            const resolvedNode = getNode(fs, resolved);
            if (!resolvedNode || resolvedNode.type !== "folder") {
                return base_result(fs, path, {
                    ok: false,
                    terminalLines: [cmdLine, { cls: "err", text: "cd: " + esc(tgt) + ": symlink target is not a directory" }],
                });
            }
            return withLesson(base_result(fs, resolved, {
                highlight: "path",
                terminalLines: [cmdLine, { cls: "out", text: "→ Followed symlink " + esc(tgt) + " → " + esc(symlinkDest) }],
            }));
        }
        if (target.type !== "folder") {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "cd: " + esc(tgt) + ": No such directory" }],
            });
        }
        return withLesson(base_result(fs, [...path, tgt], {
            highlight: "path",
            terminalLines: [cmdLine, { cls: "out", text: "→ Entered " + esc(tgt) }],
        }));
    }

    if (cmd === "touch") {
        const name = args[0];
        if (!name) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: touch &lt;file&gt;" }],
            });
        }
        const copy = clone(fs);
        const node = getNode(copy, path);
        if (!node || node.type !== "folder") {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "Not a directory" }],
            });
        }
        if (node.children.some((c) => c.name === name)) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: esc(name) + ": File already exists" }],
            });
        }
        node.children.push({ name, type: "file" });
        return withLesson(base_result(copy, path, {
            highlight: "create",
            lastCreated: name,
            terminalLines: [cmdLine, { cls: "out", text: "Created: " + esc(name) }],
        }));
    }

    if (cmd === "mkdir") {
        const name = args[0];
        if (!name) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: mkdir &lt;folder&gt;" }],
            });
        }
        const copy = clone(fs);
        const node = getNode(copy, path);
        if (!node || node.type !== "folder") {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "Not a directory" }],
            });
        }
        if (node.children.some((c) => c.name === name)) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: esc(name) + ": Folder already exists" }],
            });
        }
        node.children.push({ name, type: "folder", children: [] });
        return withLesson(base_result(copy, path, {
            highlight: "create",
            lastCreated: name,
            terminalLines: [cmdLine, { cls: "out", text: "Created folder: " + esc(name) }],
        }));
    }

    if (cmd === "cat") {
        const name = args[0];
        if (!name) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: cat &lt;file&gt;" }],
            });
        }
        const dirNode = getNode(fs, path);
        const fileNode = dirNode?.children?.find(c => c.name === name && c.type === "file");
        if (!fileNode) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "cat: " + esc(name) + ": No such file" }],
            });
        }
        const content = fileNode.content ?? "";
        return withLesson(base_result(fs, path, {
            highlight: "file:" + name,
            sideEffect: "showContent",
            sideEffectData: { filename: name, content },
            terminalLines: [cmdLine, { cls: "out", text: esc(content).replace(/\n/g, "<br>") || "(empty file)" }],
        }));
    }

    if (cmd === "rm") {
        const hasFlag = args[0] === "-r";
        const name = hasFlag ? args[1] : args[0];
        if (!name) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: rm &lt;file&gt;  |  rm -r &lt;folder&gt;" }],
            });
        }
        const rmDir = getNode(fs, path);
        const target = rmDir?.children?.find(c => c.name === name);
        if (!target) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "rm: " + esc(name) + ": No such file or directory" }],
            });
        }
        if (target.type === "folder" && !hasFlag) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "rm: " + esc(name) + ": Is a directory — dùng rm -r để xóa folder" }],
            });
        }
        const newFs = removeNode(fs, path, name);
        return withLesson(base_result(newFs, path, {
            highlight: "delete",
            terminalLines: [cmdLine, { cls: "out", text: "Đã xóa: " + esc(name) }],
        }));
    }

    if (cmd === "cp") {
        const src = args[0], dst = args[1];
        if (!src || !dst) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: cp &lt;nguồn&gt; &lt;đích&gt;" }],
            });
        }
        const cpDir = getNode(fs, path);
        if (!cpDir?.children?.find(c => c.name === src)) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "cp: " + esc(src) + ": No such file" }],
            });
        }
        if (cpDir.children.some(c => c.name === dst)) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "cp: " + esc(dst) + ": Đã tồn tại" }],
            });
        }
        const newFs = copyNode(fs, path, src, path, dst);
        return withLesson(base_result(newFs, path, {
            highlight: "create",
            lastCreated: dst,
            terminalLines: [cmdLine, { cls: "out", text: esc(src) + " → " + esc(dst) + " (đã sao chép)" }],
        }));
    }

    if (cmd === "mv") {
        const src = args[0], dst = args[1];
        if (!src || !dst) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: mv &lt;nguồn&gt; &lt;đích&gt;" }],
            });
        }
        const mvDir = getNode(fs, path);
        if (!mvDir?.children?.find(c => c.name === src)) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "mv: " + esc(src) + ": No such file or directory" }],
            });
        }
        if (mvDir.children.some(c => c.name === dst)) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "mv: " + esc(dst) + ": Đã tồn tại" }],
            });
        }
        const newFs = moveNode(fs, path, src, path, dst);
        return withLesson(base_result(newFs, path, {
            highlight: "move",
            lastCreated: dst,
            terminalLines: [cmdLine, { cls: "out", text: esc(src) + " → " + esc(dst) + " (đã đổi tên)" }],
        }));
    }

    if (cmd === "wc") {
        const hasL = args[0] === "-l";
        const filename = hasL ? args[1] : args[0];
        if (!filename) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: wc [-l] &lt;file&gt;" }],
            });
        }
        const wcDir = getNode(fs, path);
        const wcFile = wcDir?.children?.find(c => c.name === filename && c.type === "file");
        if (!wcFile) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "wc: " + esc(filename) + ": No such file" }],
            });
        }
        const wcContent = wcFile.content ?? "";
        const lineCount = wcContent.split('\n').length;
        if (hasL) {
            return withLesson(base_result(fs, path, {
                highlight: "file:" + filename,
                terminalLines: [cmdLine, { cls: "out", text: lineCount + " " + esc(filename) }],
            }));
        }
        const wordCount = wcContent.split(/\s+/).filter(Boolean).length;
        const charCount = wcContent.length;
        return withLesson(base_result(fs, path, {
            highlight: "file:" + filename,
            terminalLines: [cmdLine, { cls: "out", text: lineCount + " " + wordCount + " " + charCount + " " + esc(filename) }],
        }));
    }

    if (cmd === "sort") {
        const hasR = args[0] === "-r";
        const filename = hasR ? args[1] : args[0];
        if (!filename) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: sort [-r] &lt;file&gt;" }],
            });
        }
        const sortDir = getNode(fs, path);
        const sortFile = sortDir?.children?.find(c => c.name === filename && c.type === "file");
        if (!sortFile) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "sort: " + esc(filename) + ": No such file" }],
            });
        }
        const sortedLines = (sortFile.content ?? "").split('\n').sort();
        if (hasR) sortedLines.reverse();
        return withLesson(base_result(fs, path, {
            highlight: "file:" + filename,
            terminalLines: [cmdLine, ...sortedLines.map(l => ({ cls: "out", text: esc(l) }))],
        }));
    }

    if (cmd === "uniq") {
        const filename = args[0];
        if (!filename) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: uniq &lt;file&gt;" }],
            });
        }
        const uDir = getNode(fs, path);
        const uFile = uDir?.children?.find(c => c.name === filename && c.type === "file");
        if (!uFile) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "uniq: " + esc(filename) + ": No such file" }],
            });
        }
        const uLines = (uFile.content ?? "").split('\n');
        const unique = uLines.filter((l, i) => i === 0 || l !== uLines[i - 1]);
        return withLesson(base_result(fs, path, {
            highlight: "file:" + filename,
            terminalLines: [cmdLine, ...unique.map(l => ({ cls: "out", text: esc(l) }))],
        }));
    }

    if (cmd === "cut") {
        const delimArg = args.find(a => a.startsWith("-d"));
        const fieldArg = args.find(a => a.startsWith("-f"));
        const filename = args.find(a => !a.startsWith("-"));
        if (!delimArg || !fieldArg || !filename) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: cut -d&lt;delim&gt; -f&lt;field&gt; &lt;file&gt;" }],
            });
        }
        const delim = delimArg.slice(2);
        const fieldIdx = parseInt(fieldArg.slice(2)) - 1;
        if (!delim || isNaN(fieldIdx)) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "cut: invalid delimiter or field" }],
            });
        }
        const cutDir = getNode(fs, path);
        const cutFile = cutDir?.children?.find(c => c.name === filename && c.type === "file");
        if (!cutFile) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "cut: " + esc(filename) + ": No such file" }],
            });
        }
        const cutLines = (cutFile.content ?? "").split('\n').map(l => l.split(delim)[fieldIdx] ?? "");
        return withLesson(base_result(fs, path, {
            highlight: "file:" + filename,
            terminalLines: [cmdLine, ...cutLines.map(l => ({ cls: "out", text: esc(l) }))],
        }));
    }

    if (cmd === "sed") {
        const expr = (args[0] ?? "").replace(/^['"]|['"]$/g, "");
        const filename = args[1];
        if (!expr || !filename) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: sed 's/old/new/[g]' &lt;file&gt;" }],
            });
        }
        const sedM = /^s\/(.+?)\/(.*)\/([g]?)$/.exec(expr);
        if (!sedM) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "sed: biểu thức không hợp lệ (dùng s/old/new/g)" }],
            });
        }
        const [, pattern, replacement, flags] = sedM;
        const sedDir = getNode(fs, path);
        const sedFile = sedDir?.children?.find(c => c.name === filename && c.type === "file");
        if (!sedFile) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "sed: " + esc(filename) + ": No such file" }],
            });
        }
        const sedLines = (sedFile.content ?? "").split('\n').map(l =>
            flags === 'g' ? l.replaceAll(pattern, replacement) : l.replace(pattern, replacement)
        );
        return withLesson(base_result(fs, path, {
            highlight: "file:" + filename,
            terminalLines: [cmdLine, ...sedLines.map(l => ({ cls: "out", text: esc(l) }))],
        }));
    }

    if (cmd === "echo") {
        const ENV = { USER: "student", HOME: "/home/student", PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin", SHELL: "/bin/bash" };
        const text = args.map(a => a.replace(/\$(\w+)/g, (_, k) => ENV[k] ?? "$" + k)).join(" ");
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine, { cls: "out", text: esc(text) }],
        }));
    }

    if (cmd === "grep") {
        const pattern = args[0];
        const filename = args[1];
        if (!pattern || !filename) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: grep &lt;pattern&gt; &lt;file&gt;" }],
            });
        }
        const gDir = getNode(fs, path);
        const gFile = gDir?.children?.find(c => c.name === filename && c.type === "file");
        if (!gFile) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "grep: " + esc(filename) + ": No such file" }],
            });
        }
        const matched = (gFile.content ?? "").split('\n').filter(l => l.includes(pattern));
        const outLines = matched.length
            ? matched.map(l => ({ cls: "out", text: esc(l) }))
            : [{ cls: "out", text: "(no matches)" }];
        return withLesson(base_result(fs, path, {
            highlight: "file:" + filename,
            terminalLines: [cmdLine, ...outLines],
        }));
    }

    if (cmd === "head") {
        const hasN = args[0] === "-n";
        const n = hasN ? (parseInt(args[1]) || 10) : 10;
        const filename = hasN ? args[2] : args[0];
        if (!filename) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: head [-n N] &lt;file&gt;" }],
            });
        }
        const hDir = getNode(fs, path);
        const hFile = hDir?.children?.find(c => c.name === filename && c.type === "file");
        if (!hFile) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "head: " + esc(filename) + ": No such file" }],
            });
        }
        const lines = (hFile.content ?? "").split('\n').slice(0, n);
        return withLesson(base_result(fs, path, {
            highlight: "file:" + filename,
            terminalLines: [cmdLine, ...lines.map(l => ({ cls: "out", text: esc(l) }))],
        }));
    }

    if (cmd === "tail") {
        const hasN = args[0] === "-n";
        const n = hasN ? (parseInt(args[1]) || 10) : 10;
        const filename = hasN ? args[2] : args[0];
        if (!filename) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: tail [-n N] &lt;file&gt;" }],
            });
        }
        const tDir = getNode(fs, path);
        const tFile = tDir?.children?.find(c => c.name === filename && c.type === "file");
        if (!tFile) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "tail: " + esc(filename) + ": No such file" }],
            });
        }
        const lines = (tFile.content ?? "").split('\n').slice(-n);
        return withLesson(base_result(fs, path, {
            highlight: "file:" + filename,
            terminalLines: [cmdLine, ...lines.map(l => ({ cls: "out", text: esc(l) }))],
        }));
    }

    if (cmd === "chmod") {
        const modeArg = args[0];
        const target  = args[1];
        if (!modeArg || !target) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: chmod &lt;mode&gt; &lt;file&gt;" }],
            });
        }

        // Resolve target which may be relative path like shared/report.txt
        const targetParts = target.split("/");
        const targetName = targetParts[targetParts.length - 1];
        const targetPath = targetParts.length > 1 ? [...path, ...targetParts.slice(0, -1)] : path;

        const targetDir = getNode(fs, targetPath);
        const targetNode = targetDir?.children?.find(c => c.name === targetName);
        if (!targetNode) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "chmod: " + esc(target) + ": No such file or directory" }],
            });
        }

        const current = targetNode.perms ?? defaultPerms(targetNode.type);
        let newPerms = current;

        if (/^\d+$/.test(modeArg)) {
            // Octal mode: 755, 644, 600, 000
            const octalMap = { 0:"---", 1:"--x", 2:"-w-", 3:"-wx", 4:"r--", 5:"r-x", 6:"rw-", 7:"rwx" };
            const digits = modeArg.padStart(3, "0").slice(-3).split("").map(Number);
            newPerms = digits.map(d => octalMap[d] ?? "---").join("");
        } else {
            // Symbolic: +x, -x, g+w, o-r, u+w …
            const symM = /^([ugo]?)([+\-])([rwx]+)$/.exec(modeArg);
            if (symM) {
                const who = symM[1] || "u";
                const op  = symM[2];
                const bits = symM[3];
                const arr  = current.split("");
                const offsets = { u: [0,1,2], g: [3,4,5], o: [6,7,8] };
                const bitChar = { r:0, w:1, x:2 };
                for (const bit of bits) {
                    const relIdx = bitChar[bit];
                    if (relIdx == null) continue;
                    for (const base of (offsets[who] ?? [])) {
                        const pos = base + relIdx;
                        if (op === "+") arr[pos] = bit;
                        else arr[pos] = "-";
                    }
                }
                newPerms = arr.join("");
            }
        }

        const newFs = setNodeMeta(fs, targetPath, targetName, { perms: newPerms });
        return withLesson(base_result(newFs, path, {
            highlight: "file:" + targetName,
            terminalLines: [cmdLine, { cls: "out", text: esc(targetName) + ": " + esc(newPerms) }],
        }));
    }

    if (cmd === "chown") {
        const newOwner = args[0];
        const target   = args[1];
        if (!newOwner || !target) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: chown &lt;user&gt; &lt;file&gt;" }],
            });
        }
        const targetParts = target.split("/");
        const targetName  = targetParts[targetParts.length - 1];
        const targetPath  = targetParts.length > 1 ? [...path, ...targetParts.slice(0, -1)] : path;
        const targetDir   = getNode(fs, targetPath);
        if (!targetDir?.children?.find(c => c.name === targetName)) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "chown: " + esc(target) + ": No such file or directory" }],
            });
        }
        const newFs = setNodeMeta(fs, targetPath, targetName, { owner: newOwner });
        return withLesson(base_result(newFs, path, {
            highlight: "file:" + targetName,
            terminalLines: [cmdLine, { cls: "out", text: esc(targetName) + ": owner → " + esc(newOwner) }],
        }));
    }

    if (cmd === "find") {
        const searchRoot = args[0];
        const nameFlag = args.indexOf("-name");
        const typeFlag = args.indexOf("-type");
        const namePattern = nameFlag >= 0 ? args[nameFlag + 1] : null;
        const typeFilter  = typeFlag >= 0 ? args[typeFlag + 1] : null;

        if (!searchRoot) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: find &lt;path&gt; [-name pattern] [-type f|d]" }],
            });
        }

        const startNode = searchRoot === "." ? getNode(fs, path) : getNode(fs, [...path, searchRoot]);
        if (!startNode) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "find: " + esc(searchRoot) + ": No such file or directory" }],
            });
        }

        function globMatch(pattern, name) {
            if (!pattern || pattern === "*") return true;
            if (pattern.startsWith("*") && pattern.endsWith("*")) return name.includes(pattern.slice(1, -1));
            if (pattern.startsWith("*")) return name.endsWith(pattern.slice(1));
            if (pattern.endsWith("*")) return name.startsWith(pattern.slice(0, -1));
            return name === pattern;
        }

        function findInVFS(node, currentDisplayPath) {
            const results = [];
            if (!node.children) return results;
            for (const child of node.children) {
                const childPath = currentDisplayPath + "/" + child.name;
                const typeOk = !typeFilter || (typeFilter === "f" ? child.type === "file" : child.type === "folder");
                const nameOk = !namePattern || globMatch(namePattern, child.name);
                if (typeOk && nameOk) results.push(childPath);
                if (child.type === "folder") results.push(...findInVFS(child, childPath));
            }
            return results;
        }

        const displayBase = searchRoot === "." ? "." : searchRoot;
        const found = findInVFS(startNode, displayBase);
        const outLines = found.length
            ? found.map(p => ({ cls: "out", text: esc(p) }))
            : [{ cls: "out", text: "(no results)" }];
        return withLesson(base_result(fs, path, {
            highlight: "list",
            terminalLines: [cmdLine, ...outLines],
        }));
    }

    const WHICH_TABLE = {
        ls: "/bin/ls", cd: "/bin/cd", pwd: "/bin/pwd", cat: "/bin/cat",
        rm: "/bin/rm", cp: "/bin/cp", mv: "/bin/mv", mkdir: "/bin/mkdir",
        touch: "/usr/bin/touch", grep: "/usr/bin/grep", find: "/usr/bin/find",
        head: "/usr/bin/head", tail: "/usr/bin/tail", sort: "/usr/bin/sort",
        uniq: "/usr/bin/uniq", wc: "/usr/bin/wc", cut: "/usr/bin/cut",
        sed: "/usr/bin/sed", tr: "/usr/bin/tr", tee: "/usr/bin/tee",
        file: "/usr/bin/file", ln: "/bin/ln", top: "/usr/bin/top", killall: "/usr/bin/killall",
        python: "/usr/bin/python", python3: "/usr/bin/python3",
        node: "/usr/local/bin/node", bash: "/bin/bash",
    };

    if (cmd === "which") {
        const name = args[0];
        if (!name) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: which &lt;command&gt;" }],
            });
        }
        const loc = WHICH_TABLE[name];
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine, { cls: "out", text: loc ? esc(loc) : name + " not found" }],
        }));
    }

    if (cmd === "whereis") {
        const name = args[0];
        if (!name) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: whereis &lt;command&gt;" }],
            });
        }
        const bin = WHICH_TABLE[name];
        const parts2 = bin ? [bin, "/usr/share/man/man1/" + name + ".1"] : [];
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine, {
                cls: "out",
                text: parts2.length ? name + ": " + esc(parts2.join(" ")) : name + ": not found",
            }],
        }));
    }

    if (cmd === "ps") {
        const showAll = args[0] === "aux";
        const procs   = processes ?? [];
        const visible = showAll ? procs : procs.filter(p => p.user === "student");
        const header  = "PID&nbsp;&nbsp;&nbsp;USER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CMD";
        const rows    = visible.map(p => {
            const pid  = String(p.pid).padStart(5, " ").replace(/ /g, "&nbsp;");
            const user = p.user.padEnd(8, " ").replace(/ /g, "&nbsp;");
            return pid + "&nbsp;&nbsp;" + esc(user) + "&nbsp;&nbsp;" + esc(p.cmd);
        });
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine, { cls: "out", text: header }, ...rows.map(r => ({ cls: "out", text: r }))],
            newProcesses: procs,
        }));
    }

    if (cmd === "kill") {
        const isSigkill = args[0] === "-9";
        const pidStr    = isSigkill ? args[1] : args[0];
        const pid       = parseInt(pidStr);
        if (!pid) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: kill [-9] &lt;PID&gt;" }],
            });
        }
        const procs  = processes ?? [];
        const target = procs.find(p => p.pid === pid);
        if (!target) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "kill: (" + pid + ") - No such process" }],
            });
        }
        const newProcs  = procs.filter(p => p.pid !== pid);
        const signal    = isSigkill ? "SIGKILL" : "SIGTERM";
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine, { cls: "out", text: "[" + signal + "] " + esc(target.cmd) + " (PID " + pid + ") — terminated" }],
            newProcesses: newProcs,
        }));
    }

    if (cmd === "ln") {
        if (args[0] !== "-s") {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "ln: chỉ hỗ trợ ln -s (symbolic link)" }],
            });
        }
        const lnTarget = args[1];
        const lnName   = args[2];
        if (!lnTarget || !lnName) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: ln -s &lt;target&gt; &lt;link_name&gt;" }],
            });
        }
        const lnDir = getNode(fs, path);
        if (!lnDir?.children?.find(c => c.name === lnTarget)) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "ln: " + esc(lnTarget) + ": No such file or directory" }],
            });
        }
        if (lnDir.children.some(c => c.name === lnName)) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "ln: " + esc(lnName) + ": File exists" }],
            });
        }
        const lnCopy = clone(fs);
        const lnCopyDir = getNode(lnCopy, path);
        lnCopyDir.children.push({ name: lnName, type: "symlink", target: lnTarget });
        return withLesson(base_result(lnCopy, path, {
            highlight: "create",
            lastCreated: lnName,
            terminalLines: [cmdLine, { cls: "out", text: esc(lnName) + " -&gt; " + esc(lnTarget) + " (symlink created)" }],
        }));
    }

    if (cmd === "file") {
        const filename = args[0];
        if (!filename) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: file &lt;filename&gt;" }],
            });
        }
        const fileDir = getNode(fs, path);
        const fileNode = fileDir?.children?.find(c => c.name === filename);
        if (!fileNode) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "file: " + esc(filename) + ": No such file or directory" }],
            });
        }
        let fileDesc;
        if (fileNode.type === "folder") {
            fileDesc = "directory";
        } else if (fileNode.type === "symlink") {
            fileDesc = "symbolic link to " + (fileNode.target ?? "unknown");
        } else {
            const ext = filename.split('.').pop()?.toLowerCase();
            if (ext === "sh")   fileDesc = "Bourne-Again shell script, ASCII text executable";
            else if (ext === "py")  fileDesc = "Python script, ASCII text executable";
            else if (ext === "html") fileDesc = "HTML document, ASCII text";
            else if (ext === "css")  fileDesc = "ASCII text";
            else if (ext === "js")   fileDesc = "ASCII text";
            else if (ext === "csv")  fileDesc = "ASCII text, with very long lines (CSV data)";
            else fileDesc = "ASCII text";
        }
        return withLesson(base_result(fs, path, {
            highlight: "file:" + filename,
            terminalLines: [cmdLine, { cls: "out", text: esc(filename) + ": " + esc(fileDesc) }],
        }));
    }

    if (cmd === "top") {
        const procs = processes ?? [];
        const now = new Date().toTimeString().slice(0, 8);
        return withLesson(base_result(fs, path, {
            terminalLines: [
                cmdLine,
                { cls: "out", text: "top - " + esc(now) + " up 3 days, 7:42,  1 user,  load average: 0.12, 0.08, 0.05" },
                { cls: "out", text: "Tasks: " + procs.length + " total,   1 running, " + (procs.length - 1 > 0 ? procs.length - 1 : 0) + " sleeping" },
                { cls: "out", text: "%Cpu(s):  3.2 us,  1.1 sy,  0.0 ni, 95.3 id,  0.2 wa" },
                { cls: "out", text: "MiB Mem :   3904.0 total,   1392.0 free,   1218.0 used" },
                { cls: "out", text: "" },
                { cls: "out", text: "PID&nbsp;&nbsp;&nbsp;USER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%CPU&nbsp;&nbsp;%MEM&nbsp;&nbsp;COMMAND" },
                ...procs.map((p, i) => {
                    const pid  = String(p.pid).padStart(5, " ").replace(/ /g, "&nbsp;");
                    const user = p.user.padEnd(8, " ").replace(/ /g, "&nbsp;");
                    const cpu  = i === 0 ? " 0.3" : " 0.0";
                    return ({ cls: "out", text: pid + "&nbsp;&nbsp;" + esc(user) + "&nbsp;&nbsp;" + cpu + "&nbsp;&nbsp;0.5&nbsp;&nbsp;" + esc(p.cmd) });
                }),
            ],
            newProcesses: procs,
        }));
    }

    if (cmd === "killall") {
        const killName = args[0];
        if (!killName) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: killall &lt;name&gt;" }],
            });
        }
        const procs = processes ?? [];
        const targets = procs.filter(p => p.cmd.includes(killName));
        if (!targets.length) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "killall: " + esc(killName) + ": no process found" }],
            });
        }
        const newProcs = procs.filter(p => !p.cmd.includes(killName));
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine, ...targets.map(p => ({
                cls: "out",
                text: "[SIGTERM] " + esc(p.cmd) + " (PID " + p.pid + ") — terminated",
            }))],
            newProcesses: newProcs,
        }));
    }

    if (cmd === "id") {
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine, { cls: "out", text: "uid=1000(student) gid=1000(student) groups=1000(student),27(sudo)" }],
        }));
    }

    if (cmd === "uptime") {
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine, { cls: "out", text: "up 3 days, 7:42,  1 user,  load average: 0.12, 0.08, 0.05" }],
        }));
    }

    if (cmd === "free") {
        const human = args[0] === "-h";
        if (human) {
            return withLesson(base_result(fs, path, {
                terminalLines: [cmdLine,
                    { cls: "out", text: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;used&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free&nbsp;&nbsp;&nbsp;&nbsp;shared&nbsp;&nbsp;buff/cache&nbsp;&nbsp;available" },
                    { cls: "out", text: "Mem:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.8G&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.2G&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.4G&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;84M&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.2G&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.3G" },
                    { cls: "out", text: "Swap:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.0G&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0B&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.0G" },
                ],
            }));
        }
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine,
                { cls: "out", text: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;used&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free&nbsp;&nbsp;&nbsp;&nbsp;shared&nbsp;&nbsp;buff/cache&nbsp;&nbsp;available" },
                { cls: "out", text: "Mem:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3997440&nbsp;&nbsp;1261824&nbsp;&nbsp;1425920&nbsp;&nbsp;&nbsp;86016&nbsp;&nbsp;&nbsp;1309696&nbsp;&nbsp;&nbsp;2449408" },
                { cls: "out", text: "Swap:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2097148&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0&nbsp;&nbsp;2097148" },
            ],
        }));
    }

    if (cmd === "df") {
        const human = args[0] === "-h";
        if (human) {
            return withLesson(base_result(fs, path, {
                terminalLines: [cmdLine,
                    { cls: "out", text: "Filesystem&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Size&nbsp;&nbsp;Used&nbsp;&nbsp;Avail&nbsp;&nbsp;Use%&nbsp;&nbsp;Mounted on" },
                    { cls: "out", text: "/dev/sda1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20G&nbsp;&nbsp;8.1G&nbsp;&nbsp;&nbsp;11G&nbsp;&nbsp;&nbsp;43%&nbsp;&nbsp;/" },
                    { cls: "out", text: "tmpfs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.9G&nbsp;&nbsp;&nbsp;&nbsp;0B&nbsp;&nbsp;1.9G&nbsp;&nbsp;&nbsp;&nbsp;0%&nbsp;&nbsp;/dev/shm" },
                    { cls: "out", text: "/dev/sda2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;99G&nbsp;&nbsp;&nbsp;42G&nbsp;&nbsp;&nbsp;52G&nbsp;&nbsp;&nbsp;45%&nbsp;&nbsp;/home" },
                ],
            }));
        }
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine,
                { cls: "out", text: "Filesystem&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1K-blocks&nbsp;&nbsp;&nbsp;&nbsp;Used&nbsp;&nbsp;Available&nbsp;&nbsp;Use%&nbsp;&nbsp;Mounted on" },
                { cls: "out", text: "/dev/sda1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20511312&nbsp;&nbsp;8491264&nbsp;&nbsp;10958660&nbsp;&nbsp;&nbsp;43%&nbsp;&nbsp;/" },
                { cls: "out", text: "tmpfs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1998720&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0&nbsp;&nbsp;1998720&nbsp;&nbsp;&nbsp;&nbsp;0%&nbsp;&nbsp;/dev/shm" },
                { cls: "out", text: "/dev/sda2&nbsp;&nbsp;&nbsp;103811572&nbsp;43647892&nbsp;54876280&nbsp;&nbsp;&nbsp;45%&nbsp;&nbsp;/home" },
            ],
        }));
    }

    const MAN_PAGES = {
        pwd:    "pwd — print name of current/working directory\nUsage: pwd\nPrints the full filename of the current working directory.",
        ls:     "ls — list directory contents\nUsage: ls [OPTION] [FILE]\n  -l   use a long listing format\nList information about the FILEs (the current directory by default).",
        cd:     "cd — change the working directory\nUsage: cd [DIR]\nChange the current directory to DIR. If DIR is not supplied, the home directory is used.",
        cat:    "cat — concatenate files and print on the standard output\nUsage: cat [OPTION] [FILE]...\nConcatenate FILE(s) to standard output.",
        grep:   "grep — print lines that match patterns\nUsage: grep [OPTION] PATTERN [FILE]...\nSearch for PATTERN in each FILE. PATTERN is a string.",
        find:   "find — search for files in a directory hierarchy\nUsage: find [PATH] [EXPRESSION]\n  -name PATTERN   file name matches shell PATTERN\n  -type f|d       file is of type f(ile) or d(irectory)",
        chmod:  "chmod — change file mode bits\nUsage: chmod MODE FILE\nMODE can be octal (755) or symbolic (u+x, g-w, o+r).\nPermission bits: r=read, w=write, x=execute.",
        chown:  "chown — change file owner and group\nUsage: chown OWNER FILE\nChange the owner of FILE to OWNER.",
        ps:     "ps — report a snapshot of the current processes\nUsage: ps [OPTION]\n  (no option)  display processes for current user\n  aux          display all processes",
        kill:   "kill — send a signal to a process\nUsage: kill [-SIGNAL] PID\n  -9   SIGKILL — force kill immediately",
        sed:    "sed — stream editor for filtering and transforming text\nUsage: sed SCRIPT [FILE]\n  's/OLD/NEW/'   substitute first occurrence\n  's/OLD/NEW/g'  substitute all occurrences",
        tr:     "tr — translate or delete characters\nUsage: tr [OPTION] SET1 [SET2]\n  (no option)  translate SET1 chars to SET2\n  -d SET       delete SET chars from input",
        tee:    "tee — read from stdin and write to stdout and files\nUsage: tee [FILE]...\nCopy stdin to each FILE, and also to stdout.",
        wc:     "wc — print newline, word, and byte counts for each file\nUsage: wc [OPTION] [FILE]\n  -l   print the newline counts only",
        sort:   "sort — sort lines of text files\nUsage: sort [OPTION] [FILE]\n  -r   reverse the result of comparisons",
        uniq:   "uniq — report or omit repeated lines\nUsage: uniq [FILE]\nFilter adjacent matching lines from input.",
        cut:    "cut — remove sections from each line of files\nUsage: cut -d DELIM -f FIELD [FILE]\n  -d DELIM   use DELIM instead of TAB for field delimiter\n  -f FIELD   select only these fields (1-based)",
    };

    if (cmd === "man") {
        const name = args[0];
        if (!name) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: man &lt;command&gt;" }],
            });
        }
        const page = MAN_PAGES[name];
        if (!page) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "err", text: "No manual entry for " + esc(name) }],
            });
        }
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine, ...page.split('\n').map(l => ({ cls: "out", text: esc(l) }))],
        }));
    }

    if (cmd === "whatis") {
        const name = args[0];
        if (!name) {
            return base_result(fs, path, {
                ok: false,
                terminalLines: [cmdLine, { cls: "out", text: "usage: whatis &lt;command&gt;" }],
            });
        }
        const page = MAN_PAGES[name];
        const desc = page ? page.split('\n')[0] : null;
        return withLesson(base_result(fs, path, {
            terminalLines: [cmdLine, { cls: "out", text: desc ? esc(name) + " - " + esc(desc.split(' — ')[1] ?? desc) : esc(name) + ": nothing appropriate" }],
        }));
    }

    if (cmd === "clear") {
        return base_result(fs, path, { sideEffect: "clear" });
    }

    if (cmd === "help") {
        return base_result(fs, path, {
            terminalLines: [cmdLine, {
                cls: "out",
                text: "Available: pwd  ls  cd  touch  mkdir  cat  rm  rm -r  cp  mv  echo  grep  head  tail  wc  sort  uniq  cut  sed  tr  tee  find  which  whereis  ps  kill  top  killall  chmod  chown  ln -s  file  id  uptime  free  df  man  whatis  |  &gt;  &gt;&gt;  clear",
            }],
        });
    }

    return base_result(fs, path, {
        ok: false,
        terminalLines: [cmdLine, {
            cls: "err",
            text: "command not found: " + esc(cmd) + '&nbsp;&nbsp;<span style="color:var(--text3)">(type help for commands)</span>',
        }],
    });
}
