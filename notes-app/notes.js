const fs = require('fs');

const fetchNotes = () => {
    try {
        const notesString = fs.readFileSync('notes-data.json');
        return JSON.parse(notesString);
    } catch (e) {
        return [];
    }
};

const saveNotes = (notes) => {
    fs.writeFileSync('notes-data.json', JSON.stringify(notes, null, '\t'));
};

const addNote = (title, body) => {
    const notes = fetchNotes();
    const note = {
        title,
        body
    };

    const noteExists = notes.some((note) => note.title === title);

    if (!noteExists) {
        notes.push(note);
        saveNotes(notes);
        return note;
    }

};

const remove = (title) => {
    const notes = fetchNotes();
    const newNotes = notes.filter((note) => note.title !== title);
    saveNotes(newNotes);

    return notes.length !== newNotes.length;
};

const getAll = () => {
    return fetchNotes();
};

const getNote = (title) => {
    const notes = fetchNotes();
    const matchingNotes = notes.filter((note) => note.title === title);
    return matchingNotes[0];
};

module.exports = {
    addNote,
    remove,
    getAll,
    getNote
};

