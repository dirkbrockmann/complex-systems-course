let count = 0;
export function nextMarginNoteNumber() {
    count += 1;
    return count;
}
export function resetMarginNoteCounter() {
    count = 0;
}
export function getMarginNoteCounter() {
    return count;
}

