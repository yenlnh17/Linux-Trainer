export function addLine(cls, html) {
    const d = document.getElementById("term-output");
    const s = document.createElement("span");
    s.className = "tl tl-" + cls;
    s.innerHTML = html;
    d.appendChild(s);
    d.scrollTop = d.scrollHeight;
}

export function clearTerminal() {
    document.getElementById("term-output").innerHTML = "";
}

export function renderPrompt(promptStr) {
    document.getElementById("prompt-str").textContent = promptStr;
}
