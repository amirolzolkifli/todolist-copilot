document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todoList');
    const addTodoForm = document.getElementById('addTodoForm');
    const todoInput = document.getElementById('todoInput');
    const checkAllBtn = document.getElementById('checkAllBtn');
    const deleteCheckedBtn = document.getElementById('deleteCheckedBtn');
    const filterButtons = document.querySelectorAll('[data-filter]');
    let currentFilter = 'all';
    let isAllChecked = false;

    // Initialize SortableJS
    const sortable = new Sortable(todoList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        handle: '.handle',
        onEnd: function() {
            const items = [...todoList.children];
            const positions = items.map((item, index) => ({
                id: item.dataset.id,
                position: index + 1
            }));
            
            fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=updatePositions&positions=${JSON.stringify(positions)}`
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    alert('Failed to save position. Please try again.');
                    loadTodos(); // Reload to original positions
                }
            })
            .catch(error => {
                alert('Failed to save position. Please try again.');
                loadTodos(); // Reload to original positions
            });
        }
    });

    // Load initial todos
    loadTodos();

    // Add new todo
    addTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = todoInput.value.trim();
        if (task) {
            fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=add&task=${encodeURIComponent(task)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    todoInput.value = '';
                    loadTodos();
                }
            });
        }
    });

    // Toggle todo status
    todoList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const li = e.target.closest('li');
            const id = li.dataset.id;
            const completed = e.target.checked ? 1 : 0;

            fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=update&id=${id}&completed=${completed}`
            })
            .then(response => response.json())
            .then(() => {
                li.classList.toggle('completed', completed);
            });
        }
    });

    // Check/Uncheck all todos
    checkAllBtn.addEventListener('click', () => {
        if (confirm(isAllChecked ? 'Mark all as incomplete?' : 'Mark all as complete?')) {
            const completed = !isAllChecked ? 1 : 0;
            fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=updateAll&completed=${completed}`
            })
            .then(response => response.json())
            .then(() => {
                loadTodos();
                isAllChecked = !isAllChecked;
                checkAllBtn.textContent = isAllChecked ? 'Uncheck All' : 'Check All';
            });
        }
    });

    // Delete checked todos
    deleteCheckedBtn.addEventListener('click', () => {
        const checkedItems = [...document.querySelectorAll('.todo-checkbox:checked')];
        if (checkedItems.length === 0) {
            alert('No items selected!');
            return;
        }

        if (confirm('Delete selected items?')) {
            const ids = checkedItems.map(checkbox => checkbox.closest('li').dataset.id);
            fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=delete&ids=${JSON.stringify(ids)}`
            })
            .then(response => response.json())
            .then(() => {
                loadTodos();
            });
        }
    });

    // Delete single todo
    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            const li = e.target.closest('li');
            const id = li.dataset.id;
            
            if (confirm('Delete this task?')) {
                fetch('api.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `action=delete&ids=${JSON.stringify([id])}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        loadTodos();
                    } else {
                        alert('Failed to delete task. Please try again.');
                    }
                })
                .catch(error => {
                    alert('Failed to delete task. Please try again.');
                });
            }
        }
    });

    // Filter todos
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentFilter = button.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadTodos();
        });
    });

    // Load todos from server
    function loadTodos() {
        fetch(`api.php?action=get&filter=${currentFilter}`)
            .then(response => response.json())
            .then(todos => {
                todoList.innerHTML = '';
                todos.forEach(todo => {
                    const li = document.createElement('li');
                    li.className = `list-group-item todo-item d-flex justify-content-between align-items-center ${todo.completed == 1 ? 'completed' : ''}`;
                    li.dataset.id = todo.id;
                    li.innerHTML = `
                        <div class="d-flex align-items-center">
                            <input type="checkbox" class="todo-checkbox form-check-input me-2" ${todo.completed == 1 ? 'checked' : ''}>
                            <span class="todo-text">${todo.task}</span>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-danger delete-btn me-2">×</button>
                            <div class="handle ms-2">⋮</div>
                        </div>
                    `;
                    todoList.appendChild(li);
                });
                
                // Update Check All button text
                const allTodos = document.querySelectorAll('.todo-checkbox');
                const checkedTodos = document.querySelectorAll('.todo-checkbox:checked');
                isAllChecked = allTodos.length > 0 && allTodos.length === checkedTodos.length;
                checkAllBtn.textContent = isAllChecked ? 'Uncheck All' : 'Check All';
            });
    }
});