
        const taskForm = document.getElementById("taskForm");
        const taskInput = document.getElementById("taskInput");
        const taskList = document.getElementById("taskList");
        const taskCounter = document.getElementById("taskCounter");
        const clearCompletedButton = document.getElementById("clearCompleted");
        const filterButtons = document.querySelectorAll(".filter");

        let tasks = [];

        try {
            const savedTasks = JSON.parse(localStorage.getItem("myTasks"));
            if (Array.isArray(savedTasks)) {
                tasks = savedTasks.filter(task =>
                    task &&
                    typeof task.id === "string" &&
                    typeof task.text === "string" &&
                    typeof task.completed === "boolean"
                );
            }
        } catch (error) {
            tasks = [];
        }

        let currentFilter = "all";

        function saveTasks() {
            try {
                localStorage.setItem("myTasks", JSON.stringify(tasks));
            } catch (error) {
                alert(" He удалось сохранить задачи в браузере.");
            }
        }

        function renderTasks() {
            taskList.replaceChildren();

            const filteredTasks = tasks.filter(task => {
                if (currentFilter === "active") {
                    return !task.completed;
                }

                if (currentFilter === "completed") {
                    return task.completed;
                }

                return true;
            });

            if (filteredTasks.length === 0) {
                const emptyMessage = document.createElement("li");
                emptyMessage.className = "empty-message";

                if (currentFilter === "completed") {
                    emptyMessage.textContent = "Нет выполненных задач";
                } else if (currentFilter === "active") {
                    emptyMessage.textContent = "Все задачи выполнены! 🎉";
                } else {
                    emptyMessage.textContent = "Пока нет задач. Добавьте первую!";
                }

                taskList.appendChild(emptyMessage);
            }

            filteredTasks.forEach(task => {
                const li = document.createElement("li");
                li.className = "task";

                if (task.completed) {
                    li.classList.add("completed");
                }

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.completed;
                checkbox.setAttribute("aria-label", "Отметить задачу выполненной");

                checkbox.addEventListener("change", () => {
                    task.completed = checkbox.checked;
                    saveTasks();
                    renderTasks();
                });

                const text = document.createElement("span");
                text.className = "task-text";
                text.textContent = task.text;

                const deleteButton = document.createElement("button");
                deleteButton.className = "delete-button";
                deleteButton.textContent = "×";
                deleteButton.setAttribute("aria-label", "Удалить задачу");

                deleteButton.addEventListener("click", () => {
                    tasks = tasks.filter(item => item.id !== task.id);
                    saveTasks();
                    renderTasks();
                });

                li.append(checkbox, text, deleteButton);
                taskList.appendChild(li);
            });

            const remaining = tasks.filter(task => !task.completed).length;
            taskCounter.textContent = `Осталось задач: ${remaining}`;
        }

        taskForm.addEventListener("submit", event => {
            event.preventDefault();

            const text = taskInput.value.trim();

            if (!text) {
                taskInput.focus();
                return;
            }

            tasks.unshift({
                id: crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now().toString() + Math.random().toString(16).slice(2),
                text: text,
                completed: false
            });

            saveTasks();
            renderTasks();

            taskInput.value = "";
            taskInput.focus();
        });

        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                currentFilter = button.dataset.filter;

                filterButtons.forEach(item => {
                    item.classList.toggle("active", item === button);
                });

                renderTasks();
            });
        });

        clearCompletedButton.addEventListener("click", () => {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
        });

        renderTasks();
