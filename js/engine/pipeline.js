// Applies a filter command to an array of text lines (stdin from pipe).
// Used by the pipe handler in executor.js.
export function applyFilter(cmd, args, lines) {
    if (cmd === "grep") {
        const pattern = args[0];
        if (!pattern) return { ok: false, lines: ["grep: pattern required"] };
        const matched = lines.filter(l => l.includes(pattern));
        return { ok: true, lines: matched.length ? matched : ["(no matches)"] };
    }
    if (cmd === "head") {
        const n = args[0] === "-n" ? (parseInt(args[1]) || 10) : 10;
        return { ok: true, lines: lines.slice(0, n) };
    }
    if (cmd === "tail") {
        const n = args[0] === "-n" ? (parseInt(args[1]) || 10) : 10;
        return { ok: true, lines: lines.slice(-n) };
    }
    if (cmd === "sort") {
        const sorted = [...lines].sort();
        if (args[0] === "-r") sorted.reverse();
        return { ok: true, lines: sorted };
    }
    if (cmd === "uniq") {
        const unique = lines.filter((l, i) => i === 0 || l !== lines[i - 1]);
        return { ok: true, lines: unique };
    }
    if (cmd === "wc") {
        const countOnly = args[0] === "-l";
        const lineCount = lines.length;
        if (countOnly) return { ok: true, lines: [String(lineCount)] };
        const wordCount = lines.join(" ").split(/\s+/).filter(Boolean).length;
        const charCount = lines.join("\n").length;
        return { ok: true, lines: [`${lineCount} ${wordCount} ${charCount}`] };
    }
    if (cmd === "cut") {
        const delimArg = args.find(a => a.startsWith("-d"));
        const fieldArg = args.find(a => a.startsWith("-f"));
        const delim = delimArg ? delimArg.slice(2) : "\t";
        const fieldIdx = fieldArg ? parseInt(fieldArg.slice(2)) - 1 : 0;
        if (!delim || isNaN(fieldIdx)) return { ok: false, lines: ["cut: invalid arguments"] };
        const cut = lines.map(l => l.split(delim)[fieldIdx] ?? "");
        return { ok: true, lines: cut };
    }
    if (cmd === "tr") {
        const isDelete = args[0] === "-d";
        if (isDelete) {
            const chars = (args[1] ?? "").replace(/^['"]|['"]$/g, "");
            return { ok: true, lines: lines.map(l => l.split('').filter(c => !chars.includes(c)).join('')) };
        }
        const set1 = (args[0] ?? "").replace(/^['"]|['"]$/g, "");
        const set2 = (args[1] ?? "").replace(/^['"]|['"]$/g, "");
        function expandRange(s) {
            return s.replace(/(.)-(.)/g, (_, a, b) => {
                let r = '';
                for (let c = a.charCodeAt(0); c <= b.charCodeAt(0); c++) r += String.fromCharCode(c);
                return r;
            });
        }
        const from = expandRange(set1);
        const to   = expandRange(set2);
        return { ok: true, lines: lines.map(l =>
            l.split('').map(c => { const i = from.indexOf(c); return i >= 0 && i < to.length ? to[i] : c; }).join('')
        )};
    }
    if (cmd === "sed") {
        const expr = (args[0] ?? "").replace(/^['"]|['"]$/g, "");
        const m = /^s\/(.+?)\/(.*)\/([g]?)$/.exec(expr);
        if (!m) return { ok: false, lines: ["sed: biểu thức không hợp lệ"] };
        const [, pattern, replacement, flags] = m;
        return { ok: true, lines: lines.map(l =>
            flags === 'g' ? l.replaceAll(pattern, replacement) : l.replace(pattern, replacement)
        )};
    }
    return { ok: false, lines: [cmd + ": unknown filter command"] };
}
