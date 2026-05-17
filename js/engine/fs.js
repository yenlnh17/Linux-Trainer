export function clone(v) {
    return JSON.parse(JSON.stringify(v));
}

export function getNode(root, p) {
    let c = root;
    for (const s of p) {
        if (!c.children) return null;
        c = c.children.find((x) => x.name === s);
        if (!c) return null;
    }
    return c;
}

export function listDir(node) {
    if (!node?.children) return [];
    return [...node.children].sort((a, b) =>
        a.type !== b.type
            ? a.type === "folder" ? -1 : 1
            : a.name.localeCompare(b.name),
    );
}

export function pathString(path) {
    return "/" + ["home", ...path].join("/");
}

export function removeNode(fs, path, name) {
    const copy = clone(fs);
    const node = getNode(copy, path);
    if (node?.children) node.children = node.children.filter(c => c.name !== name);
    return copy;
}

export function copyNode(fs, srcPath, srcName, dstPath, dstName) {
    const copy = clone(fs);
    const srcDir = getNode(copy, srcPath);
    const srcNode = srcDir?.children?.find(c => c.name === srcName);
    if (!srcNode) return copy;
    const dstDir = getNode(copy, dstPath);
    if (!dstDir?.children) return copy;
    const newNode = clone(srcNode);
    newNode.name = dstName;
    dstDir.children.push(newNode);
    return copy;
}

export function moveNode(fs, srcPath, srcName, dstPath, dstName) {
    const copy = clone(fs);
    const srcDir = getNode(copy, srcPath);
    const idx = srcDir?.children?.findIndex(c => c.name === srcName);
    if (idx == null || idx < 0) return copy;
    const [node] = srcDir.children.splice(idx, 1);
    const dstDir = getNode(copy, dstPath);
    if (!dstDir?.children) return copy;
    node.name = dstName;
    dstDir.children.push(node);
    return copy;
}

export function getFileContent(fs, path, name) {
    const dir = getNode(fs, path);
    const file = dir?.children?.find(c => c.name === name && c.type === "file");
    return file?.content ?? null;
}

export function setFileContent(fs, path, name, content) {
    const copy = clone(fs);
    const dir = getNode(copy, path);
    if (!dir?.children) return copy;
    const file = dir.children.find(c => c.name === name && c.type === "file");
    if (file) {
        file.content = content;
    } else {
        dir.children.push({ name, type: "file", content });
    }
    return copy;
}

export function defaultPerms(type) {
    return type === "folder" ? "rwxr-xr-x" : "rw-r--r--";
}

export function setNodeMeta(fs, path, name, meta) {
    const copy = clone(fs);
    const dir = getNode(copy, path);
    const node = dir?.children?.find(c => c.name === name);
    if (node) Object.assign(node, meta);
    return copy;
}
