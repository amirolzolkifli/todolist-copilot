<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List App</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- SortableJS -->
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <!-- Custom CSS -->
    <style>
        .todo-container {
            max-height: 600px;
            overflow-y: auto;
        }
        .todo-item {
            cursor: move;
            transition: background-color 0.3s;
        }
        .todo-item:hover {
            background-color: #f8f9fa;
        }
        .todo-item.completed {
            background-color: #e9ecef;
            text-decoration: line-through;
        }
        .sortable-ghost {
            opacity: 0.4;
        }
    </style>
</head>
<body class="bg-light">
    <div class="container py-5">
        <h1 class="text-center mb-4">Todo List App</h1>
        
        <!-- Add Todo Form -->
        <div class="row justify-content-center mb-4">
            <div class="col-md-8">
                <form id="addTodoForm" class="input-group">
                    <input type="text" id="todoInput" class="form-control" placeholder="What needs to be done?" required>
                    <button class="btn btn-primary" type="submit">Add Task</button>
                </form>
            </div>
        </div>

        <!-- Filters and Actions -->
        <div class="row justify-content-center mb-3">
            <div class="col-md-8">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-primary active" data-filter="all">All</button>
                        <button type="button" class="btn btn-outline-primary" data-filter="active">Active</button>
                        <button type="button" class="btn btn-outline-primary" data-filter="completed">Completed</button>
                    </div>
                    <div class="btn-group">
                        <button id="checkAllBtn" class="btn btn-outline-success">Check All</button>
                        <button id="deleteCheckedBtn" class="btn btn-outline-danger">Delete Checked</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Todo List -->
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-body todo-container">
                        <ul id="todoList" class="list-group">
                            <!-- Todo items will be inserted here -->
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>