const KEY = "vlt_progress_v1";

function defaultState() {
    return {
        version: 1,
        modules: {
            "1": { completed: [], current: "1-1", fsState: null, pathState: ["student"] },
            "2": { completed: [], current: "2-1", fsState: null, pathState: ["student"] },
            "3": { completed: [], current: "3-1", fsState: null, pathState: ["student"] },
        "4": { completed: [], current: "4-1", fsState: null, pathState: ["student", "data"] },
        "5": { completed: [], current: "5-1", fsState: null, pathState: ["student"] },
        "6": { completed: [], current: "6-1", fsState: null, pathState: ["student", "secure"] },
        "7": { completed: [], current: "7-1", fsState: null, pathState: ["student"] },
        "8": { completed: [], current: "8-1", fsState: null, pathState: ["student", "workshop"] },
        "9": { completed: [], current: "9-1", fsState: null, pathState: ["student"] },
        "10": { completed: [], current: "10-1", fsState: null, pathState: ["student"] },
        },
        lastActiveModule: "1",
    };
}

export function loadProgress() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return defaultState();
        const data = JSON.parse(raw);
        if (data.version !== 1) return defaultState();
        return data;
    } catch {
        return defaultState();
    }
}

export function saveProgress(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function markLessonComplete(moduleId, lessonId, fsState, pathState) {
    const data = loadProgress();
    const mod = data.modules[String(moduleId)];
    if (!mod) return;
    if (!mod.completed.includes(lessonId)) mod.completed.push(lessonId);
    mod.current = lessonId;
    mod.fsState = fsState;
    mod.pathState = pathState;
    data.lastActiveModule = String(moduleId);
    saveProgress(data);
}

export function getModuleProgress(moduleId) {
    return loadProgress().modules[String(moduleId)] ?? null;
}

// Module N unlocks when module N-1 is 100% complete (all lessons done)
export function isModuleUnlocked(moduleId, lessonCounts) {
    if (moduleId === 1) return true;
    const prev = getModuleProgress(moduleId - 1);
    if (!prev) return false;
    const total = lessonCounts[moduleId - 1] ?? 0;
    return prev.completed.length >= total;
}

export function resetProgress() {
    localStorage.removeItem(KEY);
}
