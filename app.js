import axios from "axios";

/* =========================
   CONFIG
========================= */
const API_BASE = "https://veff-2026-quotes.netlify.app/api/v1";
const LOCAL_API = "http://localhost:3000/api/v1";

/* =========================
   QUOTE FEATURE
========================= */

const loadQuote = async (category = "general") => {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");

  try {
    const response = await axios.get(`${API_BASE}/quotes`, {
      params: { category: category },
    });

    quoteText.textContent = `"${response.data.quote ?? response.data.text}"`;
    quoteAuthor.textContent = response.data.author;
  } catch (error) {
    console.error(error);
  }
};

const wireQuoteEvents = () => {
  const select = document.getElementById("quote-category-select");
  const button = document.getElementById("new-quote-btn");

  if (!select || !button) return;

  select.addEventListener("change", async () => {
    await loadQuote(select.value);
  });

  button.addEventListener("click", async () => {
    await loadQuote(select.value);
  });
};

/* =========================
   TASKS FEATURE
========================= */

const renderTasks = (tasks) => {
  const task_list = document.querySelector(".task-list");
  if (!task_list) return;

  task_list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.finished === 1;
    checkbox.addEventListener("change", async () => {
      await toggleTask(task.id, checkbox.checked ? 1 : 0);
    });

    const label = document.createElement("label");
    label.textContent = task.task;

    li.appendChild(checkbox);
    li.appendChild(label);
    task_list.appendChild(li);
  });
};

const loadTasks = async () => {
  try {
    const response = await axios.get(`${LOCAL_API}/tasks`);
    renderTasks(response.data);
  } catch (error) {
    console.error(error);
  }
};

const toggleTask = async (id, finished) => {
  try {
    await axios.patch(`${LOCAL_API}/tasks/${id}`, { finished });
  } catch (error) {
    console.error(error);
  }
};

const addTask = async (taskText) => {
  try {
    await axios.post(`${LOCAL_API}/tasks`, { task: taskText });
    await loadTasks();
  } catch (error) {
    console.error(error);
  }
};

const wireTaskEvents = () => {
  const button = document.getElementById("add-task-btn");
  const input = document.getElementById("new-task");

  if (!button || !input) return;

  button.addEventListener("click", async () => {
    const taskText = input.value.trim();
    if (!taskText) return;
    await addTask(taskText);
    input.value = "";
  });

  input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      const taskText = input.value.trim();
      if (!taskText) return;
      await addTask(taskText);
      input.value = "";
    }
  });
};

/* =========================
   NOTES FEATURE
========================= */

const loadNotes = async () => {
  try {
    const response = await axios.get(`${LOCAL_API}/notes`);
    const text_area = document.getElementById("notes-text");
    if (text_area) {
      text_area.value = response.data.notes;
    }
  } catch (error) {
    console.error(error);
  }
};

const wireNotesEvents = () => {
  const text_area = document.getElementById("notes-text");
  const saveb = document.getElementById("save-notes-btn");

  if (!text_area || !saveb) return;

  text_area.addEventListener("input", () => {
    saveb.disabled = false;
  });

  saveb.addEventListener("click", async () => {
    try {
      await axios.put(`${LOCAL_API}/notes`, { notes: text_area.value });
      saveb.disabled = true;
    } catch (error) {
      console.error(error);;
    }
  });
};

/* =========================
   INIT
========================= */

const init = async () => {
  wireQuoteEvents();
  wireTaskEvents();
  wireNotesEvents();

  const select = document.getElementById("quote-category-select");
  const category = select?.value || "general";

  await loadQuote(category);
  await loadTasks();
  await loadNotes();
};

/* =========================
   EXPORT (DO NOT REMOVE)
========================= */

export { init, loadQuote, wireQuoteEvents };

init();
