const Note = require('../models/Note');

describe('Note Model', () => {
    beforeEach(() => {
        // Reset the notes array and currentId before each test
        Note.notes = [];
        Note.currentId = 1;
    });

    describe('Tag Validation', () => {
        test('should create a note with valid tags', () => {
            const note = Note.create('Test Title', 'Test Content', ['tag1', 'tag2']);
            expect(note.tags).toEqual(['tag1', 'tag2']);
        });

        test('should sanitize and validate tags', () => {
            const note = Note.create('Test Title', 'Test Content', ['TAG-1', '  tag2  ', 'tag-3']);
            expect(note.tags).toEqual(['tag-1', 'tag2', 'tag-3']);
        });

        test('should remove duplicate tags', () => {
            const note = Note.create('Test Title', 'Test Content', ['tag1', 'tag1', 'TAG1']);
            expect(note.tags).toEqual(['tag1']);
        });

        test('should throw error for non-array tags', () => {
            expect(() => {
                Note.create('Test Title', 'Test Content', 'not-an-array');
            }).toThrow('Tags must be an array');
        });

        test('should throw error for non-string/non-number tags', () => {
            expect(() => {
                Note.create('Test Title', 'Test Content', [{}, []]);
            }).toThrow('Tags must be strings or numbers');
        });

        test('should throw error for empty tags after sanitization', () => {
            expect(() => {
                Note.create('Test Title', 'Test Content', ['   ', '']);
            }).toThrow('Tags cannot be empty after sanitization');
        });

        test('should throw error for tags longer than 50 characters', () => {
            expect(() => {
                Note.create('Test Title', 'Test Content', ['a'.repeat(51)]);
            }).toThrow('Tags cannot be longer than 50 characters');
        });
    });

    test('should create a new note', () => {
        const note = Note.create('Test Title', 'Test Content');
        expect(note).toHaveProperty('id', 1);
        expect(note).toHaveProperty('title', 'Test Title');
        expect(note).toHaveProperty('content', 'Test Content');
        expect(note).toHaveProperty('createdAt');
        expect(note).not.toHaveProperty('updatedAt'); // New note should not have updatedAt
    });

    test('should get all notes', () => {
        Note.create('Note 1', 'Content 1');
        Note.create('Note 2', 'Content 2');
        const notes = Note.getAll();
        expect(notes).toHaveLength(2);
        expect(notes[0].title).toBe('Note 1');
        expect(notes[1].title).toBe('Note 2');
    });

    test('should get note by id', () => {
        const createdNote = Note.create('Test Note', 'Test Content');
        const note = Note.getById(createdNote.id);
        expect(note).toEqual(createdNote);
    });

    test('should return null when getting non-existent note', () => {
        const note = Note.getById(999);
        expect(note).toBeNull();
    });

    describe('update note', () => {
        test('should update a note and add updatedAt timestamp', () => {
            const createdNote = Note.create('Original Title', 'Original Content');
            expect(createdNote).not.toHaveProperty('updatedAt');

            const updatedNote = Note.update(createdNote.id, 'New Title', 'New Content');
            expect(updatedNote.title).toBe('New Title');
            expect(updatedNote.content).toBe('New Content');
            expect(updatedNote).toHaveProperty('updatedAt');
            expect(new Date(updatedNote.updatedAt)).toBeInstanceOf(Date);
        });

        test('should preserve original createdAt when updating', () => {
            const createdNote = Note.create('Original Title', 'Original Content');
            const originalCreatedAt = createdNote.createdAt;

            const updatedNote = Note.update(createdNote.id, 'New Title', 'New Content');
            expect(updatedNote.createdAt).toBe(originalCreatedAt);
        });

        test('should update updatedAt timestamp on each update', async () => {
            const createdNote = Note.create('Original Title', 'Original Content');
            const firstUpdate = Note.update(createdNote.id, 'First Update', 'Content');
            
            // Wait a small amount of time to ensure timestamps are different
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const secondUpdate = Note.update(createdNote.id, 'Second Update', 'Content');
            expect(new Date(secondUpdate.updatedAt).getTime())
                .toBeGreaterThan(new Date(firstUpdate.updatedAt).getTime());
        });

        test('should return null when updating non-existent note', () => {
            const updatedNote = Note.update(999, 'New Title', 'New Content');
            expect(updatedNote).toBeNull();
        });

        test('should update tags with validation', () => {
            const createdNote = Note.create('Original Title', 'Original Content', ['tag1']);
            const updatedNote = Note.update(createdNote.id, 'New Title', 'New Content', ['TAG-2', 'tag-2']);
            expect(updatedNote.tags).toEqual(['tag-2']);
        });
    });

    test('should delete a note', () => {
        const createdNote = Note.create('Test Note', 'Test Content');
        const deletedNote = Note.delete(createdNote.id);
        expect(deletedNote).toEqual(createdNote);
        expect(Note.getAll()).toHaveLength(0);
    });

    test('should return null when deleting non-existent note', () => {
        const deletedNote = Note.delete(999);
        expect(deletedNote).toBeNull();
    });
}); 