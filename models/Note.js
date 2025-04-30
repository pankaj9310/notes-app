class Note {
    constructor() {
        this.notes = [];
        this.currentId = 1;
    }

    create(title, content, tags = []) {
        const note = {
            id: this.currentId++,
            title,
            content,
            tags,
            createdAt: new Date().toISOString()
        };
        this.notes.push(note);
        return note;
    }

    getAll() {
        return this.notes;
    }

    getById(id) {
        const note = this.notes.find(note => note.id === parseInt(id));
        return note || null;
    }

    update(id, title, content, tags = []) {
        const noteIndex = this.notes.findIndex(note => note.id === parseInt(id));
        if (noteIndex === -1) return null;

        this.notes[noteIndex] = {
            ...this.notes[noteIndex],
            title,
            content,
            tags,
            updatedAt: new Date().toISOString()
        };

        return this.notes[noteIndex];
    }

    delete(id) {
        const noteIndex = this.notes.findIndex(note => note.id === parseInt(id));
        if (noteIndex === -1) return null;

        const deletedNote = this.notes[noteIndex];
        this.notes = this.notes.filter(note => note.id !== parseInt(id));
        return deletedNote;
    }
}

// Create a singleton instance
const noteInstance = new Note();

// Export both the instance and the class for testing
module.exports = noteInstance;
module.exports.notes = noteInstance.notes;
module.exports.currentId = noteInstance.currentId; 