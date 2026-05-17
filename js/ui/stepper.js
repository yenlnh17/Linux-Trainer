import { clone, pathString } from '../engine/fs.js';
import { execute } from '../engine/executor.js';
import { addLine, clearTerminal, renderPrompt } from './terminal.js';
import { setHL, renderExplorer } from './explorer.js';
import { renderRail } from './sidebar.js';
import { markLessonComplete } from '../data/progress.js';
import { showContentPanel } from './animate.js';

const state = {
    moduleId: null,
    lessons: [],
    lessonIdx: 0,  // actual progress pointer (only advances)
    viewIdx: 0,    // display pointer (can navigate freely within completed + current)
    stepIdx: 0,
    phase: "idle",   // "narrative" | "command" | "success" | "complete"
    fs: null,
    path: [],
    processes: [],
    showHint: false,
    lessonStartFs: null,
    lessonStartPath: [],
    // Practice mode: redo a completed lesson without affecting progress
    practiceMode: false,
    practiceStepIdx: 0,
    practicePhase: "narrative", // "narrative" | "command" | "done"
};

export function boot(moduleId, lessons, initFs, initPath, savedProgress) {
    state.moduleId = moduleId;
    state.lessons = lessons;

    if (savedProgress?.fsState) {
        state.fs = savedProgress.fsState;
        state.path = savedProgress.pathState ?? [...initPath];
        const done = new Set(savedProgress.completed);
        const idx = lessons.findIndex(l => !done.has(l.id));
        state.lessonIdx = idx < 0 ? lessons.length : idx;
    } else {
        state.fs = clone(initFs);
        state.path = [...initPath];
        state.lessonIdx = 0;
    }

    state.viewIdx = state.lessonIdx;
    state.stepIdx = 0;
    state.showHint = false;
    state.phase = state.lessonIdx < lessons.length ? "narrative" : "complete";
    state.processes = (lessons[state.lessonIdx]?.initialProcesses ?? []).map(p => ({ ...p }));
    state.lessonStartFs = clone(state.fs);
    state.lessonStartPath = [...state.path];
    state.practiceMode = false;

    clearTerminal();
    addLine("sys", "Chào mừng đến với Visual Linux Trainer!");
    addLine("sys", 'Gõ <span style="color:var(--cyan)">help</span> để xem danh sách lệnh.');

    _renderAll();
}

export function advanceStep() {
    if (state.practiceMode) {
        const lesson = state.lessons[state.viewIdx];
        if (!lesson) return;
        if (state.practiceStepIdx < lesson.steps.length - 1) {
            state.practiceStepIdx++;
            _applyStepHL(lesson.steps[state.practiceStepIdx].highlight);
            _renderSidebar();
        } else {
            state.practicePhase = "command";
            state.showHint = false;
            _applyStepHL("idle");
            _setInputEnabled(true);
            _renderSidebar();
        }
        return;
    }

    if (state.phase !== "narrative") return;
    const lesson = state.lessons[state.lessonIdx];
    if (state.stepIdx < lesson.steps.length - 1) {
        state.stepIdx++;
        _applyStepHL(lesson.steps[state.stepIdx].highlight);
        _renderSidebar();
    } else {
        state.phase = "command";
        state.showHint = false;
        _applyStepHL("idle");
        _setInputEnabled(true);
        _showNextBtn(false);
        _renderSidebar();
    }
}

export function toggleHint() {
    const phase = state.practiceMode ? state.practicePhase : state.phase;
    if (phase !== "command") return;
    state.showHint = !state.showHint;
    _renderSidebar();
}

export function submitCommand(raw) {
    if (state.practiceMode) {
        if (state.practicePhase !== "command") return;
        const lesson = state.lessons[state.viewIdx];
        const result = execute(raw, state.fs, state.path, [{ expected: lesson.command.expected }], 0, state.processes);
        if (!result) return;
        if (result.sideEffect === "clear") { clearTerminal(); return; }
        result.terminalLines.forEach(l => addLine(l.cls, l.text));
        if (result.sideEffect === "showContent" && result.sideEffectData) {
            showContentPanel(result.sideEffectData.filename, result.sideEffectData.content);
        }
        state.fs = result.newFs;
        state.path = result.newPath;
        if (result.newProcesses !== undefined) state.processes = result.newProcesses;
        if (result.lessonPassed) {
            const hl = lesson.command.onSuccess.highlight || "idle";
            setHL(hl);
            renderExplorer(state.fs, state.path, hl, result.lastCreated);
            renderPrompt(pathString(state.path) + " $");
            state.practicePhase = "done";
            _setInputEnabled(false);
            _renderSidebar();
        } else {
            setHL(result.highlight || "idle");
            renderExplorer(state.fs, state.path, result.highlight || "idle", result.lastCreated);
            renderPrompt(pathString(state.path) + " $");
        }
        return;
    }

    if (state.phase !== "command") return;
    const lesson = state.lessons[state.lessonIdx];

    const result = execute(raw, state.fs, state.path, [{ expected: lesson.command.expected }], 0, state.processes);
    if (!result) return;

    if (result.sideEffect === "clear") {
        clearTerminal();
        return;
    }

    result.terminalLines.forEach(l => addLine(l.cls, l.text));

    if (result.sideEffect === "showContent" && result.sideEffectData) {
        showContentPanel(result.sideEffectData.filename, result.sideEffectData.content);
    }
    state.fs = result.newFs;
    state.path = result.newPath;
    if (result.newProcesses !== undefined) state.processes = result.newProcesses;

    if (result.lessonPassed) {
        const hl = lesson.command.onSuccess.highlight || "idle";
        setHL(hl);
        renderExplorer(state.fs, state.path, hl, result.lastCreated);
        renderPrompt(pathString(state.path) + " $");

        state.phase = "success";
        _setInputEnabled(false);
        _renderSidebar();
        markLessonComplete(state.moduleId, lesson.id, state.fs, state.path);

        setTimeout(() => {
            state.lessonIdx++;
            state.viewIdx = state.lessonIdx;
            if (state.lessonIdx < state.lessons.length) {
                const next = state.lessons[state.lessonIdx];
                if (next.initialPath) state.path = [...next.initialPath];
                if (next.initialProcesses) state.processes = next.initialProcesses.map(p => ({ ...p }));
                state.lessonStartFs = clone(state.fs);
                state.lessonStartPath = [...state.path];
                state.stepIdx = 0;
                state.showHint = false;
                state.phase = "narrative";
            } else {
                state.phase = "complete";
            }
            _renderAll();
        }, 2500);
    } else {
        setHL(result.highlight || "idle");
        renderExplorer(state.fs, state.path, result.highlight || "idle", result.lastCreated);
        renderPrompt(pathString(state.path) + " $");
    }
}

export function resetLesson() {
    clearTerminal();

    if (state.phase === "complete" || state.viewIdx < state.lessonIdx) {
        // When on the complete panel, viewIdx is out of bounds — practice the last lesson
        if (state.viewIdx >= state.lessons.length) {
            state.viewIdx = state.lessons.length - 1;
        }
        // Enter practice mode: redo the currently viewed lesson, progress untouched
        state.practiceMode = true;
        state.practiceStepIdx = 0;
        state.practicePhase = "narrative";
        state.showHint = false;
        const lesson = state.lessons[state.viewIdx];
        if (lesson?.steps[0]?.highlight) _applyStepHL(lesson.steps[0].highlight);
        _renderSidebar();
        _setInputEnabled(false);
        return;
    }

    // Standard reset for active lesson
    state.practiceMode = false;
    state.fs = clone(state.lessonStartFs);
    state.path = [...state.lessonStartPath];
    state.processes = (state.lessons[state.lessonIdx]?.initialProcesses ?? []).map(p => ({ ...p }));
    state.stepIdx = 0;
    state.showHint = false;
    state.phase = "narrative";
    state.viewIdx = state.lessonIdx;
    _renderAll();
}

export function navigateLesson(idx) {
    if (idx < 0 || idx > state.lessonIdx) return;
    state.viewIdx = idx;
    state.practiceMode = false;
    _renderAllView();
}

export function navigateBack() {
    if (state.viewIdx > 0) {
        state.viewIdx--;
        state.practiceMode = false;
        _renderAllView();
    }
}

export function navigateNext() {
    if (state.viewIdx < state.lessonIdx) {
        state.viewIdx++;
        state.practiceMode = false;
        _renderAllView();
    }
}

export function getPhase() {
    return state.phase;
}

// ── Internals ──────────────────────────────────────────────────────────────

function _renderAllView() {
    _renderSidebar();
    renderRail(state.lessons, state.lessonIdx, state.viewIdx);
    _renderNavBtns();
    const isReview = state.viewIdx < state.lessonIdx;
    if (isReview) {
        _setInputEnabled(false);
        _showNextBtn(false);
    } else {
        _setInputEnabled(state.phase === "command");
        _showNextBtn(state.phase === "narrative");
    }
}

function _renderNavBtns() {
    const backBtn = document.getElementById("lesson-back-btn");
    const nextBtn = document.getElementById("lesson-next-btn");
    if (!backBtn || !nextBtn) return;
    backBtn.disabled = state.viewIdx === 0;
    nextBtn.disabled = state.viewIdx >= state.lessonIdx;
}

function _applyStepHL(token) {
    const hl = token === "terminal-input" ? "idle" : (token || "idle");
    setHL(hl);
    renderExplorer(state.fs, state.path, hl, null);
    renderPrompt(pathString(state.path) + " $");
    const bar = document.getElementById("input-bar");
    if (bar) bar.classList.toggle("pulse-input", token === "terminal-input");
}

function _renderAll() {
    const step = state.lessons[state.lessonIdx]?.steps[state.stepIdx];
    if (state.phase === "narrative" && step) {
        _applyStepHL(step.highlight);
    } else {
        setHL("idle");
        renderExplorer(state.fs, state.path, "idle", null);
        renderPrompt(pathString(state.path) + " $");
        const bar = document.getElementById("input-bar");
        if (bar) bar.classList.remove("pulse-input");
    }

    _renderProgress();
    _renderSidebar();
    renderRail(state.lessons, state.lessonIdx, state.viewIdx);
    _renderNavBtns();
    _setInputEnabled(state.phase === "command");
    _showNextBtn(state.phase === "narrative");
}

function _renderProgress() {
    const done = state.lessonIdx;
    const total = state.lessons.length;
    const pct = Math.round((Math.min(done, total) / total) * 100);
    document.getElementById("prog-pct").textContent =
        Math.min(done, total) + " / " + total;
    document.getElementById("prog-fill").style.width = pct + "%";
    document.getElementById("prog-steps").innerHTML = state.lessons
        .map((_, i) => {
            let cls = "prog-step";
            if (i < done) cls += " done";
            if (i === done && done < total) cls += " active";
            return `<div class="${cls}"></div>`;
        })
        .join("");
}

function _renderSidebar() {
    const body = document.getElementById("sb-body");
    const total = state.lessons.length;

    // Practice mode: interactive redo of a completed lesson
    if (state.practiceMode) {
        const lesson = state.lessons[state.viewIdx];
        if (!lesson) return;
        const num = state.viewIdx + 1;
        const dotsHtml = _makeDots(lesson.steps.length, state.practiceStepIdx,
            state.practicePhase === "done" ? "success" : state.practicePhase);

        if (state.practicePhase === "narrative") {
            const step = lesson.steps[state.practiceStepIdx];
            body.innerHTML = `
                <div class="lesson-chip active">
                    <div class="lc-num">BÀI ${num} / ${total} · Luyện tập</div>
                    <div class="lc-title">${lesson.title}</div>
                    ${dotsHtml}
                    <div class="narrative-box">${step.text}</div>
                </div>
                <button class="next-btn" onclick="advanceStep()">Tiếp theo →</button>`;
        } else if (state.practicePhase === "command") {
            const hintHtml = state.showHint
                ? `<div class="hint-box">${lesson.command.hint}</div>` : "";
            body.innerHTML = `
                <div class="lesson-chip active">
                    <div class="lc-num">BÀI ${num} / ${total} · Luyện tập</div>
                    <div class="lc-title">${lesson.title}</div>
                    ${dotsHtml}
                    <div class="lc-instr">Gõ <code>${lesson.command.expected}</code> rồi nhấn Enter.</div>
                </div>
                <button class="hint-toggle" onclick="toggleHint()">${state.showHint ? "▲ Ẩn hint" : "▼ Hiện hint"}</button>
                ${hintHtml}`;
        } else {
            body.innerHTML = `
                <div class="lesson-chip active">
                    <div class="lc-num">BÀI ${num} / ${total} · Luyện tập</div>
                    <div class="lc-title">${lesson.title}</div>
                    ${dotsHtml}
                </div>
                <div class="success-note">${lesson.command.onSuccess.successNote}</div>`;
        }
        return;
    }

    // Review mode: viewing a completed lesson (read-only)
    if (state.viewIdx < state.lessonIdx) {
        const lesson = state.lessons[state.viewIdx];
        const stepsHtml = lesson.steps.map(s =>
            `<div class="narrative-box">${s.text}</div>`
        ).join('');
        body.innerHTML = `
            <div class="lesson-chip">
                <div class="lc-num">BÀI ${state.viewIdx + 1} / ${total} · <span class="lc-done-badge">✓ Hoàn thành</span></div>
                <div class="lc-title">${lesson.title}</div>
            </div>
            ${stepsHtml}
            <div class="review-cmd-box">Đã gõ: <code>${lesson.command.expected}</code></div>
            <div class="success-note">${lesson.command.onSuccess.successNote}</div>`;
        return;
    }

    // Complete panel
    if (state.phase === "complete") {
        const nextModuleId = state.moduleId + 1;
        const hasNext = nextModuleId <= 10;
        const nextBtnHtml = hasNext ? `
            <a class="next-module-btn" href="lesson.html?module=${nextModuleId}">
                Module ${nextModuleId} →
            </a>` : `
            <a class="next-module-btn next-module-btn--home" href="index.html">
                ← Về trang chủ
            </a>`;
        body.innerHTML = `
            <div class="complete-panel">
                <div class="complete-icon">🎉</div>
                <div class="complete-title">Hoàn thành!</div>
                <div class="complete-body">Bạn đã xong ${total} bài.<br>Terminal + Explorer đã được đồng bộ hoàn toàn.</div>
            </div>
            ${nextBtnHtml}`;
        _setInputEnabled(false);
        _showNextBtn(false);
        return;
    }

    // Active lesson phases: narrative / command / success
    const done = state.lessonIdx;
    const lesson = state.lessons[done];
    const dotsHtml = _makeDots(lesson.steps.length);

    if (state.phase === "narrative") {
        const step = lesson.steps[state.stepIdx];
        body.innerHTML = `
            <div class="lesson-chip active">
                <div class="lc-num">BÀI ${done + 1} / ${total}</div>
                <div class="lc-title">${lesson.title}</div>
                ${dotsHtml}
                <div class="narrative-box">${step.text}</div>
            </div>
            <button class="next-btn" onclick="advanceStep()">Tiếp theo →</button>`;
    } else if (state.phase === "command") {
        const hintHtml = state.showHint
            ? `<div class="hint-box">${lesson.command.hint}</div>` : "";
        body.innerHTML = `
            <div class="lesson-chip active">
                <div class="lc-num">BÀI ${done + 1} / ${total}</div>
                <div class="lc-title">${lesson.title}</div>
                ${dotsHtml}
                <div class="lc-instr">Gõ <code>${lesson.command.expected}</code> rồi nhấn Enter.</div>
            </div>
            <button class="hint-toggle" onclick="toggleHint()">${state.showHint ? "▲ Ẩn hint" : "▼ Hiện hint"}</button>
            ${hintHtml}`;
    } else if (state.phase === "success") {
        body.innerHTML = `
            <div class="lesson-chip active">
                <div class="lc-num">BÀI ${done + 1} / ${total}</div>
                <div class="lc-title">${lesson.title}</div>
            </div>
            <div class="success-note">${lesson.command.onSuccess.successNote}</div>`;
    }
}

// Accepts explicit stepIdx/phase for practice mode reuse
function _makeDots(totalNarrative, stepIdx = state.stepIdx, phase = state.phase) {
    const dots = Array.from({ length: totalNarrative }, (_, i) => {
        let cls = "step-dot";
        if (phase === "narrative") {
            if (i < stepIdx) cls += " done";
            else if (i === stepIdx) cls += " active";
        } else {
            cls += " done";
        }
        return `<div class="${cls}"></div>`;
    });
    let cmdCls = "step-dot cmd-dot";
    if (phase === "command") cmdCls += " active";
    else if (phase === "success") cmdCls += " done";
    dots.push(`<div class="${cmdCls}"></div>`);
    return `<div class="step-dots">${dots.join("")}</div>`;
}

function _setInputEnabled(enabled) {
    const input = document.getElementById("cmd-input");
    if (!input) return;
    input.disabled = !enabled;
    input.placeholder = enabled ? "nhập lệnh rồi nhấn Enter…" : "xem hướng dẫn ở sidebar…";
    const bar = document.getElementById("input-bar");
    if (bar) bar.classList.toggle("disabled", !enabled);
}

function _showNextBtn(_show) {
    // Button is now rendered inline in _renderSidebar() for narrative phase
}