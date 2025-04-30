const Note = require('../models/Note');

const noteController = {
    // Create a new note
    createNote: (req, res) => {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        
        const note = Note.create(title, content);
        res.status(201).json(note);
    },

    // Get all notes
    getAllNotes: (req, res) => {
        const notes = Note.getAll();
        res.json(notes);
    },

    // Get a specific note
    getNoteById: (req, res) => {
        const note = Note.getById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    },

    // Update a note
    updateNote: (req, res) => {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const updatedNote = Note.update(req.params.id, title, content);
        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json(updatedNote);
    },

    // Delete a note
    deleteNote: (req, res) => {
        const deletedNote = Note.delete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(deletedNote);
    }
};

module.exports = noteController; 