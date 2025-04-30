# Notes API

A RESTful API for managing notes, built with Node.js and Express.

## Features

- Create, read, update, and delete notes
- Input validation and sanitization
- Error handling middleware
- Security features (CORS, Helmet, Rate Limiting)
- Swagger API documentation
- Logging system

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd notes-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=development
PORT=3000
```

## Running the Application

Start the server:
```bash
npm start
```

The server will start at `http://localhost:3000`

## API Documentation

Swagger documentation is available at `http://localhost:3000/api-docs`

### API Endpoints

#### Notes

- `POST /api/v1/notes` - Create a new note
  - Required fields: title, content
  - Example request body:
    ```json
    {
      "title": "Meeting Notes",
      "content": "Discuss project timeline"
    }
    ```

- `GET /api/v1/notes` - Get all notes

- `GET /api/v1/notes/:id` - Get a specific note by ID

- `PUT /api/v1/notes/:id` - Update a note
  - Required fields: title, content
  - Example request body:
    ```json
    {
      "title": "Updated Meeting Notes",
      "content": "Updated project timeline discussion"
    }
    ```

- `DELETE /api/v1/notes/:id` - Delete a note

## Security Features

The application includes several security measures:

- CORS protection
- Helmet for security headers
- Rate limiting
- XSS protection
- Input validation and sanitization

## Error Handling

The API includes comprehensive error handling:

- 400 Bad Request - Invalid input
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server-side errors

## Development

### Project Structure

```
notes-app/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Data models
├── routes/         # API routes
├── utils/          # Utility functions
├── __tests__/      # Test files
├── .env           # Environment variables
├── server.js      # Application entry point
└── package.json   # Project dependencies
```

### Running Tests

```bash
npm test
```

## License

MIT 