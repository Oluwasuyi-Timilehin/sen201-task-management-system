const API_URL = "http://localhost:3000/tasks";

function fetchTasks() {
  fetch(API_URL)
    .then(res => res.json())
    .then(tasks => {
      const list = document.getElementById("taskList");
      list.innerHTML = "";

      tasks.forEach(task => {
        const li = document.createElement("li");

        li.className = task.status === "Completed" ? "completed" : "";

        li.innerHTML = `
          <span>
            <strong>${task.title}</strong> - ${task.description}
          </span>
          <div>
            <button onclick="completeTask(${task.id})">✔</button>
            <button onclick="deleteTask(${task.id})">❌</button>
          </div>
        `;

        list.appendChild(li);
      });
    });
}

function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description })
  }).then(() => {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    fetchTasks();
  });
}

function completeTask(id) {
  fetch(`${API_URL}/${id}`, {
    method: "PUT"
  }).then(fetchTasks);
}

function deleteTask(id) {
  fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  }).then(fetchTasks);
}

fetchTasks();
