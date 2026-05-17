export function validate(cmd, lessons, lessonIdx) {
    if (lessonIdx >= lessons.length) return { passed: false, done: true };
    const lesson = lessons[lessonIdx];
    if (cmd !== lesson.expected) return { passed: false, done: false };
    return { passed: true };
}
