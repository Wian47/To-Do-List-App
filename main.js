
class TodoApp {
    constructor() {
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.filters = document.querySelectorAll('.filter-btn');
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        
        this.init();
    }

    init() {
        this.todoForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.filters.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter(btn));
        });
        this.renderTodos();
    }

    handleSubmit(e) {
        e.preventDefault();
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text,
            completed: false
        };

        this.todos.push(todo);
        this.saveTodos();
        this.renderTodos();
        this.todoInput.value = '';
    }

    handleFilter(btn) {
        this.filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderTodos(btn.dataset.filter);
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
        }
    }

    async deleteTodo(id) {
        const item = document.querySelector(`[data-id="${id}"]`);
        item.classList.add('deleting');
        
        await new Promise(resolve => setTimeout(resolve, 300));
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.renderTodos();
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    renderTodos(filter = 'all') {
        let filteredTodos = [...this.todos];
        
        if (filter === 'active') {
            filteredTodos = this.todos.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            filteredTodos = this.todos.filter(todo => todo.completed);
        }

        this.todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" 
                       ${todo.completed ? 'checked' : ''} 
                       onchange="todoApp.toggleTodo(${todo.id})">
                <span>${todo.text}</span>
                <button onclick="todoApp.deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');
    }
}

const todoApp = new TodoApp();