const yargs = require('yargs');

const notes = require('./notes.js');

const titleOptions = {
    describe: 'Title of note',
    demand: true,
    alias: 't'
};

const bodyOptions = {
    describe: 'Body of note',
    demand: true,
    alias: 'b'
};

const argv = yargs
    .command('add', 'Add a new note', {
        title: titleOptions,
        body: bodyOptions
    })
    .command('list', 'List all notes')
    .command('read', 'read a note', {
        title: titleOptions
    }).command('remove', 'Remove a note', {
        title: titleOptions
    }).help().argv;

const command = argv._[0];
const noteTitle = argv.title;

if (command === 'add') {
    const note = notes.addNote(noteTitle, argv.body);
    const message = note ? `Note added with title ${note.title} and body ${note.body}` : `Note with title ${noteTitle} already exists`;
    console.log(message)

} else if (command === 'remove') {
    const removed = notes.remove(noteTitle);
    const message = removed ? `Note with title ${noteTitle} removed` : `Note with title ${noteTitle} doesn't exist`;
    console.log(message);

} else if (command === 'list') {
    const savedNotes = notes.getAll();
    console.log(`Printing ${savedNotes.length} note(s).\n`, JSON.stringify(savedNotes, null, '\t'))

} else if (command === 'read') {
    const note = notes.getNote(noteTitle);
    const message = note ? `Note found with title ${note.title} and body ${note.body}` : `Note with title ${noteTitle} doesn't exist`;
    console.log(message);

} else {
    console.log(`Command - ${command} not recognized`)
}