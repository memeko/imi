const STORAGE_KEY = "imi-journey-visited-v1";
const TOTAL_STATIONS = 7;
const dialog = document.querySelector("#station-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeButton = dialog.querySelector(".dialog-close");
const visitedCount = document.querySelector("#visited-count");
const progressBar = document.querySelector("#progress-bar");

let visited = new Set();

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (Array.isArray(saved)) visited = new Set(saved);
} catch (_) {
  visited = new Set();
}

function updateProgress() {
  const count = [...visited].filter((id) => document.querySelector(`#content-${id}`)).length;
  visitedCount.textContent = String(count);
  progressBar.style.width = `${(count / TOTAL_STATIONS) * 100}%`;
  document.querySelectorAll("[data-station]").forEach((button) => {
    const isVisited = visited.has(button.dataset.station);
    button.classList.toggle("visited", isVisited);
    if (isVisited) button.setAttribute("aria-label", `${button.textContent.trim()} — посещено`);
  });
}

function rememberStation(id) {
  visited.add(id);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited])); } catch (_) {}
  updateProgress();
}

function openContent(id, countAsStation = true) {
  const template = document.querySelector(`#content-${id}`);
  if (!template) return;
  dialogContent.replaceChildren(template.content.cloneNode(true));
  if (countAsStation) rememberStation(id);
  dialog.showModal();

  const novelButton = dialogContent.querySelector("[data-scroll-novel]");
  if (novelButton) {
    novelButton.addEventListener("click", () => {
      dialog.close();
      document.querySelector("#visual-novel").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

document.querySelectorAll("[data-station]").forEach((button) => {
  button.addEventListener("click", () => openContent(button.dataset.station));
});

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => openContent(button.dataset.open, false));
});

closeButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector("#reset-route").addEventListener("click", () => {
  visited.clear();
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  updateProgress();
});

updateProgress();
