# Todo List Application

A dynamic, drag-and-drop enabled todo list application built with PHP, SQLite, and JavaScript.

This project was created 100% by VSCode + Copilot Free + Sonnet 3.5

## Features

- Create, read, update and delete todo items
- Drag and drop reordering of tasks
- Filter tasks by status (All/Active/Completed) 
- Batch operations:
  - Check/uncheck all tasks
  - Delete checked tasks
- Persistent storage using SQLite database
- Real-time status updates
- Responsive Bootstrap UI

## Technologies Used

- Backend:
  - PHP
  - SQLite
- Frontend:
  - HTML5
  - CSS3 
  - JavaScript
  - Bootstrap 5
  - SortableJS

## Installation

1. Clone the repository
2. Ensure you have PHP and SQLite installed
3. Place the files in your web server directory
4. Access through your web browser

## File Structure

- `index.php` - Main application HTML/UI
- `script.js` - Frontend JavaScript functionality  
- `api.php` - Backend REST API endpoints
- `config.php` - Database configuration
- `todo.sqlite` - SQLite database file

## API Endpoints

The application provides the following API endpoints:

- `GET /api.php?action=get` - Retrieve todo items
- `POST /api.php?action=add` - Create new todo
- `POST /api.php?action=update` - Update todo status
- `POST /api.php?action=updateAll` - Update all todos
- `POST /api.php?action=delete` - Delete todo(s)
- `POST /api.php?action=updatePositions` - Update todo positions

## License

MIT License
