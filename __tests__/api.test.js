const request = require('supertest');
const express = require('express');
const cors = require('cors');
const noteRoutes = require('../routes/v1/noteRoutes');
const Note = require('../models/Note');
const app = require('../app');

// Create a test app
const appTest = express();
appTest.use(cors());
appTest.use(express.json());

// Root route
appTest.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Notes API',
        version: '1.0.0',
        documentation: '/api-docs'
    });
});

appTest.use('/api/v1/notes', noteRoutes);

describe('Notes API v1', () => {
    beforeEach(() => {
        // Reset the notes array and currentId before each test
        Note.notes = [];
        Note.currentId = 1;
    });

    describe('API Version', () => {
        test('should return API version information', async () => {
            const response = await request(appTest).get('/');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('version', '1.0.0');
            expect(response.body).toHaveProperty('documentation', '/api-docs');
        });
    });

    describe('POST /api/v1/notes', () => {
        test('should create a new note without updatedAt', async () => {
            const response = await request(appTest)
                .post('/api/v1/notes')
                .send({
                    title: 'Test Note',
                    content: 'Test Content'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('title', 'Test Note');
            expect(response.body).toHaveProperty('content', 'Test Content');
            expect(response.body).toHaveProperty('createdAt');
            expect(response.body).not.toHaveProperty('updatedAt');
        });

        test('should return 400 when title is missing', async () => {
            const response = await request(appTest)
                .post('/api/v1/notes')
                .send({
                    content: 'Test Content'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Title and content are required');
        });

        test('should return 400 when content is missing', async () => {
            const response = await request(appTest)
                .post('/api/v1/notes')
                .send({
                    title: 'Test Note'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Title and content are required');
        });
    });

    describe('GET /api/v1/notes', () => {
        test('should get all notes', async () => {
            // Create some test notes
            Note.create('Note 1', 'Content 1');
            Note.create('Note 2', 'Content 2');

            const response = await request(appTest).get('/api/v1/notes');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].title).toBe('Note 1');
            expect(response.body[1].title).toBe('Note 2');
        });

        test('should return empty array when no notes exist', async () => {
            const response = await request(appTest).get('/api/v1/notes');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });
    });

    describe('GET /api/v1/notes/:id', () => {
        test('should get a specific note', async () => {
            const createdNote = Note.create('Test Note', 'Test Content');

            const response = await request(appTest).get(`/api/v1/notes/${createdNote.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(createdNote);
        });

        test('should return 404 for non-existent note', async () => {
            const response = await request(appTest).get('/api/v1/notes/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Note not found');
        });
    });

    describe('PUT /api/v1/notes/:id', () => {
        test('should update a note and include updatedAt', async () => {
            const createdNote = Note.create('Original Title', 'Original Content');
            expect(createdNote).not.toHaveProperty('updatedAt');

            const response = await request(appTest)
                .put(`/api/v1/notes/${createdNote.id}`)
                .send({
                    title: 'Updated Title',
                    content: 'Updated Content'
                });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Title');
            expect(response.body.content).toBe('Updated Content');
            expect(response.body).toHaveProperty('updatedAt');
            expect(new Date(response.body.updatedAt)).toBeInstanceOf(Date);
            expect(response.body.createdAt).toBe(createdNote.createdAt);
        });

        test('should update updatedAt timestamp on each update', async () => {
            const createdNote = Note.create('Original Title', 'Original Content');

            const firstResponse = await request(appTest)
                .put(`/api/v1/notes/${createdNote.id}`)
                .send({
                    title: 'First Update',
                    content: 'Content'
                });

            // Wait a small amount of time to ensure timestamps are different
            await new Promise(resolve => setTimeout(resolve, 10));

            const secondResponse = await request(appTest)
                .put(`/api/v1/notes/${createdNote.id}`)
                .send({
                    title: 'Second Update',
                    content: 'Content'
                });

            expect(new Date(secondResponse.body.updatedAt).getTime())
                .toBeGreaterThan(new Date(firstResponse.body.updatedAt).getTime());
        });

        test('should return 404 for non-existent note', async () => {
            const response = await request(appTest)
                .put('/api/v1/notes/999')
                .send({
                    title: 'Updated Title',
                    content: 'Updated Content'
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Note not found');
        });

        test('should return 400 when title is missing', async () => {
            const createdNote = Note.create('Test Note', 'Test Content');

            const response = await request(appTest)
                .put(`/api/v1/notes/${createdNote.id}`)
                .send({
                    content: 'Updated Content'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Title and content are required');
        });
    });

    describe('DELETE /api/v1/notes/:id', () => {
        test('should delete a note', async () => {
            const createdNote = Note.create('Test Note', 'Test Content');

            const response = await request(appTest).delete(`/api/v1/notes/${createdNote.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(createdNote);
            expect(Note.getAll()).toHaveLength(0);
        });

        test('should return 404 for non-existent note', async () => {
            const response = await request(appTest).delete('/api/v1/notes/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Note not found');
        });
    });
});

describe('Notes API', () => {
    beforeEach(() => {
        // Reset the notes array and currentId before each test
        Note.notes = [];
        Note.currentId = 1;
    });

    describe('POST /api/notes', () => {
        test('should create a new note', async () => {
            const response = await request(app)
                .post('/api/notes')
                .send({
                    title: 'Test Note',
                    content: 'Test Content',
                    tags: ['tag1', 'tag2']
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Test Note');
            expect(response.body.content).toBe('Test Content');
            expect(response.body.tags).toEqual(['tag1', 'tag2']);
        });

        test('should validate and sanitize tags', async () => {
            const response = await request(app)
                .post('/api/notes')
                .send({
                    title: 'Test Note',
                    content: 'Test Content',
                    tags: ['TAG-1', '  tag2  ', 'tag-3']
                });

            expect(response.status).toBe(201);
            expect(response.body.tags).toEqual(['tag-1', 'tag2', 'tag-3']);
        });

        test('should remove duplicate tags', async () => {
            const response = await request(app)
                .post('/api/notes')
                .send({
                    title: 'Test Note',
                    content: 'Test Content',
                    tags: ['tag1', 'tag1', 'TAG1']
                });

            expect(response.status).toBe(201);
            expect(response.body.tags).toEqual(['tag1']);
        });

        test('should return 400 for invalid tags', async () => {
            const response = await request(app)
                .post('/api/notes')
                .send({
                    title: 'Test Note',
                    content: 'Test Content',
                    tags: 'not-an-array'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/notes', () => {
        beforeEach(async () => {
            // Create some test notes with tags
            await request(app)
                .post('/api/notes')
                .send({
                    title: 'Note 1',
                    content: 'Content 1',
                    tags: ['tag1', 'tag2']
                });

            await request(app)
                .post('/api/notes')
                .send({
                    title: 'Note 2',
                    content: 'Content 2',
                    tags: ['tag2', 'tag3']
                });
        });

        test('should get all notes', async () => {
            const response = await request(app).get('/api/notes');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });

        test('should filter notes by tags', async () => {
            const response = await request(app)
                .get('/api/notes')
                .query({ tags: ['tag1'] });

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].title).toBe('Note 1');
        });

        test('should filter notes by multiple tags', async () => {
            const response = await request(app)
                .get('/api/notes')
                .query({ tags: ['tag2'] });

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });

        test('should return empty array for non-matching tags', async () => {
            const response = await request(app)
                .get('/api/notes')
                .query({ tags: ['nonexistent'] });

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });
    });

    describe('PUT /api/notes/:id', () => {
        let noteId;

        beforeEach(async () => {
            const response = await request(app)
                .post('/api/notes')
                .send({
                    title: 'Original Title',
                    content: 'Original Content',
                    tags: ['tag1']
                });
            noteId = response.body.id;
        });

        test('should update a note with tags', async () => {
            const response = await request(app)
                .put(`/api/notes/${noteId}`)
                .send({
                    title: 'Updated Title',
                    content: 'Updated Content',
                    tags: ['tag2', 'tag3']
                });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Title');
            expect(response.body.content).toBe('Updated Content');
            expect(response.body.tags).toEqual(['tag2', 'tag3']);
        });

        test('should validate and sanitize tags during update', async () => {
            const response = await request(app)
                .put(`/api/notes/${noteId}`)
                .send({
                    title: 'Updated Title',
                    content: 'Updated Content',
                    tags: ['TAG-2', '  tag3  ']
                });

            expect(response.status).toBe(200);
            expect(response.body.tags).toEqual(['tag-2', 'tag3']);
        });

        test('should return 400 for invalid tags during update', async () => {
            const response = await request(app)
                .put(`/api/notes/${noteId}`)
                .send({
                    title: 'Updated Title',
                    content: 'Updated Content',
                    tags: 'not-an-array'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
}); 