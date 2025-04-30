const express = require('express');
const router = express.Router();
const noteController = require('../../controllers/noteController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the note
 *         title:
 *           type: string
 *           description: The title of the note
 *         content:
 *           type: string
 *           description: The content of the note
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the note was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the note was last updated
 *       example:
 *         id: 1
 *         title: Meeting Notes
 *         content: Discuss project timeline
 *         createdAt: 2024-04-01T10:00:00Z
 *         updatedAt: 2024-04-01T11:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: The notes managing API
 */

/**
 * @swagger
 * /api/v1/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the note
 *               content:
 *                 type: string
 *                 description: The content of the note
 *             example:
 *               title: "Meeting Notes"
 *               content: "Discuss project timeline"
 *     responses:
 *       201:
 *         description: The created note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Title and content are required
 */
router.post('/', noteController.createNote);

/**
 * @swagger
 * /api/v1/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of all notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get('/', noteController.getAllNotes);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   get:
 *     summary: Get a note by id
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The note id
 *     responses:
 *       200:
 *         description: The note data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.get('/:id', noteController.getNoteById);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The note id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the note
 *               content:
 *                 type: string
 *                 description: The content of the note
 *             example:
 *               title: "Updated Meeting Notes"
 *               content: "Updated project timeline discussion"
 *     responses:
 *       200:
 *         description: The updated note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Title and content are required
 *       404:
 *         description: Note not found
 */
router.put('/:id', noteController.updateNote);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The note id
 *     responses:
 *       200:
 *         description: The deleted note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.delete('/:id', noteController.deleteNote);

module.exports = router; 