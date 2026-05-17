import { LESSONS as LESSONS1, INIT_FS as INIT_FS1, INIT_PATH as INIT_PATH1 } from './data/module1.js';
import { LESSONS as LESSONS2, INIT_FS as INIT_FS2, INIT_PATH as INIT_PATH2 } from './data/module2.js';
import { LESSONS as LESSONS3, INIT_FS as INIT_FS3, INIT_PATH as INIT_PATH3 } from './data/module3.js';
import { LESSONS as LESSONS4, INIT_FS as INIT_FS4, INIT_PATH as INIT_PATH4 } from './data/module4.js';
import { LESSONS as LESSONS5, INIT_FS as INIT_FS5, INIT_PATH as INIT_PATH5 } from './data/module5.js';
import { LESSONS as LESSONS6, INIT_FS as INIT_FS6, INIT_PATH as INIT_PATH6 } from './data/module6.js';
import { LESSONS as LESSONS7, INIT_FS as INIT_FS7, INIT_PATH as INIT_PATH7 } from './data/module7.js';
import { LESSONS as LESSONS8, INIT_FS as INIT_FS8, INIT_PATH as INIT_PATH8 } from './data/module8.js';
import { LESSONS as LESSONS9, INIT_FS as INIT_FS9, INIT_PATH as INIT_PATH9 } from './data/module9.js';
import { LESSONS as LESSONS10, INIT_FS as INIT_FS10, INIT_PATH as INIT_PATH10 } from './data/module10.js';
import { getModuleProgress } from './data/progress.js';
import { boot, advanceStep, toggleHint, submitCommand, resetLesson, navigateBack, navigateNext, navigateLesson } from './ui/stepper.js';
import { addLine } from './ui/terminal.js';
import { hideContentPanel } from './ui/animate.js';

const params = new URLSearchParams(window.location.search);
const moduleId = parseInt(params.get('module') ?? '1', 10);

const moduleData = {
    1: { lessons: LESSONS1, initFs: INIT_FS1, initPath: INIT_PATH1 },
    2: { lessons: LESSONS2, initFs: INIT_FS2, initPath: INIT_PATH2 },
    3: { lessons: LESSONS3, initFs: INIT_FS3, initPath: INIT_PATH3 },
    4: { lessons: LESSONS4, initFs: INIT_FS4, initPath: INIT_PATH4 },
    5: { lessons: LESSONS5, initFs: INIT_FS5, initPath: INIT_PATH5 },
    6: { lessons: LESSONS6, initFs: INIT_FS6, initPath: INIT_PATH6 },
    7: { lessons: LESSONS7, initFs: INIT_FS7, initPath: INIT_PATH7 },
    8: { lessons: LESSONS8, initFs: INIT_FS8, initPath: INIT_PATH8 },
    9: { lessons: LESSONS9, initFs: INIT_FS9, initPath: INIT_PATH9 },
    10: { lessons: LESSONS10, initFs: INIT_FS10, initPath: INIT_PATH10 },
};

const mod = moduleData[moduleId];
if (mod) {
    const saved = getModuleProgress(moduleId);
    boot(moduleId, mod.lessons, mod.initFs, mod.initPath, saved);
} else {
    document.body.textContent = "Module không tồn tại.";
}

document.getElementById("cmd-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const val = e.target.value;
        if (val.trim()) {
            submitCommand(val);
            e.target.value = "";
        }
    }
});

window.advanceStep = advanceStep;
window.toggleHint = toggleHint;
window.hideContentPanel = hideContentPanel;
window.navigateBack = navigateBack;
window.navigateNext = navigateNext;
window.navigateLesson = navigateLesson;
window.resetAll = () => {
    resetLesson();
    addLine("sys", "Đã reset bài học hiện tại.");
};
