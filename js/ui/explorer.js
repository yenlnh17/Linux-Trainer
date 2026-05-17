import { getNode, listDir } from '../engine/fs.js';

export function setHL(mode) {
    const st = document.getElementById("exp-status");
    const bc = document.getElementById("breadcrumb");
    const grid = document.getElementById("file-grid");
    st.className = "exp-status";
    bc.className = "breadcrumb";
    grid.className = "file-grid";
    if (mode === "path") {
        st.classList.add("st-path");
        st.textContent = "● path";
        bc.classList.add("hl-path");
    } else if (mode === "list") {
        st.classList.add("st-list");
        st.textContent = "● list";
        grid.classList.add("hl-list");
    } else if (mode === "create") {
        st.classList.add("st-create");
        st.textContent = "● created";
        grid.classList.add("hl-create");
    } else if (mode === "delete") {
        st.classList.add("st-delete");
        st.textContent = "● deleted";
    } else if (mode === "move") {
        st.classList.add("st-move");
        st.textContent = "● moved";
    } else if (mode?.startsWith("file:")) {
        st.classList.add("st-list");
        st.textContent = "● " + mode.slice(5);
    } else {
        st.classList.add("st-idle");
        st.textContent = "● idle";
    }
}

export function renderExplorer(fs, path, hlMode, lastCreated) {
    const segs = ["home", ...path];
    const bc = document.getElementById("breadcrumb");
    bc.className = "breadcrumb" + (hlMode === "path" ? " hl-path" : "");
    bc.innerHTML = segs
        .map((s, i) => {
            const isLast = i === segs.length - 1;
            return (
                (i > 0 ? '<span class="bc-slash">/</span>' : "") +
                '<span class="bc-seg' + (isLast ? " current" : "") + '">' +
                s + "</span>"
            );
        })
        .join("");

    const node = getNode(fs, path);
    const items = listDir(node);
    const grid = document.getElementById("file-grid");
    const prevClass = grid.className;
    grid.innerHTML = "";
    grid.className = prevClass;
    if (!items.length) {
        grid.innerHTML = '<div class="empty-dir">— empty directory —</div>';
        return;
    }
    items.forEach((item) => {
        const isNew = lastCreated && item.name === lastCreated;
        const card = document.createElement("div");
        card.className = "fc" + (isNew ? " is-new" : "");
        let iconType, icon, typeLabel;
        if (item.type === "folder") {
            iconType = "folder"; icon = "📁"; typeLabel = "folder";
        } else if (item.type === "symlink") {
            iconType = "symlink"; icon = "🔗"; typeLabel = "symlink";
        } else {
            iconType = "file"; icon = "📄"; typeLabel = "file";
        }
        const nameExtra = item.type === "symlink"
            ? ` <span style="color:var(--text3);font-size:11px">→ ${item.target}</span>`
            : "";
        card.innerHTML = `<div class="fc-icon ${iconType}">${icon}</div>
      <div>
        <div class="fc-name${isNew ? " is-new" : ""}">${item.name}${nameExtra}</div>
        <div class="fc-type">${typeLabel}</div>
      </div>`;
        grid.appendChild(card);
    });
}
