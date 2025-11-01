let taskList = document.getElementById("taskList");
let taskInput = document.getElementById("taskInput");
let dueDateInput = document.getElementById("dueDateInput");
let searchInput = document.getElementById("searchInput");
let completedCount = document.getElementById("completedCount");

window.onload = function () {
  let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => {
    createTaskElement(task.text, task.completed, task.dueDate);
  });

  let theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }

  updateCompletedCount();
};

function addTask() {
  let text = taskInput.value.trim();
  let dueDate = dueDateInput.value;

  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  createTaskElement(text, false, dueDate);
  saveTasks();
  taskInput.value = "";
  dueDateInput.value = "";
}

function createTaskElement(text, completed, dueDate) {
  let li = document.createElement("li");

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.classList.add("task-checkbox");

  let textSpan = document.createElement("span");
  textSpan.className = "text";
  textSpan.textContent = text;

  let dueSpan = document.createElement("span");
  dueSpan.className = "due";
  dueSpan.textContent = dueDate ? `Due: ${dueDate}` : "";

  let editBtn = document.createElement("span");
  editBtn.textContent = "🖊️";
  editBtn.classList.add("edit-btn");

  editBtn.addEventListener("click", () => {
    let input = document.createElement("input");
    input.type = "text";
    input.value = textSpan.textContent;
    input.classList.add("edit-input");
    textSpan.replaceWith(input);
    input.focus();

    const saveEdit = () => {
      textSpan.textContent = input.value.trim() || text;
      input.replaceWith(textSpan);
      saveTasks();
    };

    input.addEventListener("blur", saveEdit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
  });

  let delBtn = document.createElement("span");
  delBtn.textContent = "❌";
  delBtn.classList.add("delete-btn");

  delBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    li.remove();
    saveTasks();
    updateCompletedCount();
  });

  checkbox.addEventListener("change", function () {
    li.classList.toggle("completed", checkbox.checked);
    reorderTasks();
    saveTasks();
    updateCompletedCount();
  });

  let leftDiv = document.createElement("div");
  leftDiv.appendChild(checkbox);
  leftDiv.appendChild(textSpan);
  if (dueDate) leftDiv.appendChild(dueSpan);

  let rightDiv = document.createElement("div");
  rightDiv.appendChild(editBtn);
  rightDiv.appendChild(delBtn);

  li.appendChild(leftDiv);
  li.appendChild(rightDiv);

  if (completed) {
    li.classList.add("completed");
  }

  if (completed) {
    taskList.appendChild(li);
  } else {
    taskList.prepend(li);
  }
}

function reorderTasks() {
  let tasks = Array.from(taskList.children);
  tasks.sort((a, b) => {
    const aDone = a.classList.contains("completed");
    const bDone = b.classList.contains("completed");
    return aDone - bDone;
  });

  taskList.innerHTML = "";
  tasks.forEach(t => taskList.appendChild(t));
}

function saveTasks() {
  let tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    let text = li.querySelector(".text").textContent;
    let due = li.querySelector(".due")?.textContent.replace("Due: ", "") || "";
    let completed = li.classList.contains("completed");
    tasks.push({ text, dueDate: due, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    taskList.innerHTML = "";
    localStorage.removeItem("tasks");
    updateCompletedCount();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function filterTasks() {
  let keyword = searchInput.value.toLowerCase();
  taskList.querySelectorAll("li").forEach(li => {
    let taskText = li.querySelector(".text").textContent.toLowerCase();
    li.style.display = taskText.includes(keyword) ? "flex" : "none";
  });
}

function updateCompletedCount() {
  let completed = taskList.querySelectorAll("li.completed").length;
  completedCount.textContent = `Completed: ${completed}`;
}
