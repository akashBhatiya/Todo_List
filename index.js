const btn = document.getElementById("toggle");
const inputField = document.getElementById("inputField");

const dateField = document.getElementById("date");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var date = new Date();
var day = date.getDate();
var month = monthNames[date.getMonth()];
var year = date.getFullYear();

dateField.innerHTML = day + " " + month + ", " + year;

let btn_active = true;

btn.addEventListener("click", function () {
  if (btn_active) {
    inputField.style.display = "inline";
    btn.innerHTML = "Add Task";
    btn.style.width = "100px";
    inputField.focus();
    btn_active = !btn_active;
  } else {
    let text = inputField.value;
    if (!text) {
      btn.innerHTML = "Task Empty!!!";
      setTimeout(function () {
        btn.innerHTML = "Add Task";
      }, 1000);
      return;
    }

    const task = {
      text,
      id: Date.now().toString(),
      done: false
    };
    add(task);
    text = "";
    inputField.value = "";
  }
});

const storedJsonString = localStorage.getItem("tasksArrayByAkash");

let tasks = [];

const listContainer = document.getElementById("list-container");
const list = document.getElementById("list");

if (storedJsonString !== null) {
  tasks = JSON.parse(storedJsonString);
  renderList();
}

function addTaskToDom(task) {
  if (tasks.length === 0) {
    listContainer.style.display = "none";
  } else {
    listContainer.style.display = "inline";
  }
  const li = document.createElement("li");
  li.innerHTML = `
        <input type="checkbox"  data-id="${task.id}" class="c-checkbox" ${
    task.done ? "checked" : ""
  }>
        <label for="${task.id}">${task.text}</label>
        <i class="fa-solid fa-trash bin" data-id="${task.id}"></i>
    `;
  list.append(li);
}

function renderList() {
  list.innerHTML = "";

  const storedJsonString = localStorage.getItem("tasksArrayByAkash");
  tasks = JSON.parse(storedJsonString);

  for (let i = 0; i < tasks.length; i++) {
    addTaskToDom(tasks[i]);
  }
}

function toggleTask(taskId) {
  const temp = tasks.filter(function (task) {
    return task.id === taskId;
  });

  if (temp.length > 0) {
    const currentTask = temp[0];
    currentTask.done = !currentTask.done;
    const jsonString = JSON.stringify(tasks);
    localStorage.setItem("tasksArrayByAkash", jsonString);
    renderList();
  }
}

function add(task) {
  if (task) {
    tasks.push(task);

    const jsonString = JSON.stringify(tasks);
    localStorage.setItem("tasksArrayByAkash", jsonString);

    renderList();
    inputField.style.display = "none";
    btn.innerHTML = "Task Added! 😃";
    btn.style.width = "120px";
    setTimeout(function () {
      btn.innerHTML = "Add Task";
      btn.style.width = "100px";
    }, 1000);
    btn_active = !btn_active;
    btn.focus();
    return;
  }
}

function deleteTask(taskID) {
  const newTasks = tasks.filter(function (task) {
    return task.id !== taskID;
  });
  tasks = newTasks;
  const jsonString = JSON.stringify(tasks);
  localStorage.setItem("tasksArrayByAkash", jsonString);
  renderList();
}

function handleInput(e) {
  if (e.key === "Enter") {
    let text = e.target.value;

    if (!text) {
      btn.innerHTML = "Task Empty!!!";
      setTimeout(function () {
        btn.innerHTML = "Add Task";
      }, 1000);
      return;
    }

    const task = {
      text,
      id: Date.now().toString(),
      done: false
    };
    e.target.value = "";
    add(task);
    text = "";
  }
}

function handleClickListner(e) {
  const target = e.target;

  if (target.className === "fa-solid fa-trash bin") {
    const taskId = target.dataset.id;
    deleteTask(taskId);
    console.log("task deleted");
    return;
  } else if (target.className === "c-checkbox") {
    const taskId = target.dataset.id;
    toggleTask(taskId);
    console.log("task toggled");
    return;
  }
}

inputField.addEventListener("keyup", handleInput);
document.addEventListener("click", handleClickListner);
