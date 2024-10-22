document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

taskForm.addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    taskInput.value = '';
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.classList.add(task.completed ? 'completed' : '');

    li.innerHTML = `
        <span>${task.text}</span>
        <div>
            <button class="delete" onclick="removeTask(${task.id})">Eliminar</button>
            <button onclick="toggleComplete(${task.id})">${task.completed ? 'Desmarcar' : 'Completar'}</button>
        </div>
    `;
    taskList.appendChild(li);
}

function removeTask(taskId) {
    document.querySelector(`[data-id='${taskId}']`).remove();
    removeTaskFromLocalStorage(taskId);
}

function toggleComplete(taskId) {
    const taskItem = document.querySelector(`[data-id='${taskId}']`);
    taskItem.classList.toggle('completed');
    
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskId) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTaskToDOM(task));
}
