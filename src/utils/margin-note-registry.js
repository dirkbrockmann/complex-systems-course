// src/utils/margin-note-registry.js
let idToNumber = {};
let counter = 1;

export function getMarginNoteNumber(id) {
    if(!(id in idToNumber)) {
        idToNumber[id] = counter++;
    }
    return idToNumber[id];
}

export function resetMarginNoteRegistry() {
    idToNumber = {};
    counter = 1;
}