// CSS handles fcIn, newItem, bounce, fadeIn animations.
// Functions below will be filled in Phase 7–8 for delete/move/content-panel effects.

export function animateDelete(name) {}

export function animateMove(srcName, dstPath) {}

export function showContentPanel(filename, content) {
    const panel = document.getElementById("content-panel");
    if (!panel) return;
    document.getElementById("content-filename").textContent = filename;
    document.getElementById("content-body").textContent = content;
    panel.style.display = "block";
}

export function hideContentPanel() {
    const panel = document.getElementById("content-panel");
    if (panel) panel.style.display = "none";
}
