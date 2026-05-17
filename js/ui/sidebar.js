export function renderSidebar(lessons, lessonIdx, showHint, lastSuccess) {
    const done = lessonIdx;
    const total = lessons.length;
    const pct = Math.round((done / total) * 100);
    document.getElementById("prog-pct").textContent = done + " / " + total;
    document.getElementById("prog-fill").style.width = pct + "%";

    const steps = document.getElementById("prog-steps");
    steps.innerHTML = lessons.map((_, i) => {
        let cls = "prog-step";
        if (i < done) cls += " done";
        if (i === done) cls += " active";
        return `<div class="${cls}"></div>`;
    }).join("");

    const body = document.getElementById("sb-body");
    if (done >= total) {
        body.innerHTML = `<div class="complete-panel">
      <div class="complete-icon">🎉</div>
      <div class="complete-title">Hoàn thành!</div>
      <div class="complete-body">Bạn đã xong ${total} bài.<br>Terminal + Explorer đã được đồng bộ hoàn toàn.</div>
    </div>`;
        return;
    }
    const lesson = lessons[done];
    const hintHtml = showHint ? `<div class="hint-box">${lesson.hint}</div>` : "";
    const successHtml = lastSuccess ? `<div class="success-note">${lastSuccess}</div>` : "";

    body.innerHTML = `
    <div class="lesson-chip active">
      <div class="lc-num">BÀI ${done + 1} / ${total}</div>
      <div class="lc-title">${lesson.title}</div>
      <div class="lc-instr">${lesson.instruction}</div>
    </div>
    <div class="before-note">${lesson.before}</div>
    <button class="hint-toggle" onclick="toggleHint()">${showHint ? "▲ Ẩn hint" : "▼ Hiện hint"}</button>
    ${hintHtml}
    ${successHtml}
  `;
}

export function renderRail(lessons, lessonIdx, viewIdx = lessonIdx) {
    const rail = document.getElementById("rail");
    rail.innerHTML = lessons.map((l, i) => {
        let cls = "rpill";
        if (i < lessonIdx) cls += " done";
        if (i === lessonIdx && lessonIdx < lessons.length) cls += " active";
        if (i <= lessonIdx) cls += " clickable";
        if (i === viewIdx && i !== lessonIdx) cls += " viewing";
        const onclick = i <= lessonIdx ? `onclick="navigateLesson(${i})"` : '';
        return `<div class="${cls}" ${onclick}>${i + 1}<div class="rtooltip">${l.title}</div></div>`;
    }).join("");
    setTimeout(() => {
        const rail = document.getElementById("rail");
        const target = rail.querySelector(".viewing") || rail.querySelector(".active");
        if (target) target.scrollIntoView({ behavior: "smooth", inline: "center" });
    }, 80);
}
