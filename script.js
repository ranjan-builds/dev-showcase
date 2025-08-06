let Projects = document.getElementById("projects");
let loader = document.getElementById("loader");
let loader2 = document.getElementById("loader2");
let projectNumbers = document.getElementById("projectNumbers");
let projectCounts = 0;

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwXCL8C87kYlZvXcmsZZYCnZvUeTw_whHSDn9ZJt-4TaAQ4h-RCDRraAkSnY_ZD94Xo/exec";

// Get data from sheet
async function fetchData() {
  try {
    const res = await fetch(SCRIPT_URL);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    InsertProjects(data);
    loader.style.display = "none";
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}
fetchData();

function InsertProjects(projectsData) {
  projectCounts = 0;
  projectsData.forEach((project) => {
    projectCounts++;
    projectNumbers.textContent = projectCounts;

    const techTags = project.Technology.split(",")
      .map(
        (tech) =>
          `<span class="px-2 py-1 bg-zinc-800 rounded-md text-xs">${tech.trim()}</span>`
      )
      .join("");

    const card = document.createElement("div");
    card.className =
      "project-card bg-zinc-900 rounded-xl p-6 transition duration-300 border border-zinc-700 pcard";
    card.innerHTML = `
      <div class="initials-bg w-16 h-16 rounded-full text-2xl mb-4 bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">
        ${project.Name[0]}
      </div>
      <h3 class="text-xl font-semibold mb-2">${project.Name}</h3>
      <p class="text-zinc-400 mb-4">${project.Description}</p>
      <div class="flex flex-wrap gap-2 mb-4">
        ${techTags}
      </div>
      <div class="flex space-x-3">
        <a href="https://ranjan-builds.github.io/${project.Repo}" target="_blank" class="text-purple-400 hover:text-purple-300 flex items-center">
          <i class="fas fa-external-link-alt mr-1"></i> Live
        </a>
        <a href="https://github.com/ranjan-builds/${project.Repo}" target="_blank" class="text-zinc-400 hover:text-zinc-300 flex items-center">
          <i class="fab fa-github mr-1"></i> Code
        </a>
      </div>
    `;
    Projects.appendChild(card);
  });

  // Add animation after cards are rendered
  const projectCards = document.querySelectorAll(".project-card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  projectCards.forEach((card) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(card);
  });
}

// Search functionality
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const desc = card.querySelector("p").textContent.toLowerCase();
    const tech = card.querySelector(".flex-wrap").textContent.toLowerCase();

    if (
      title.includes(searchTerm) ||
      desc.includes(searchTerm) ||
      tech.includes(searchTerm)
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// Add project modal
const addProjectBtn = document.getElementById("addProjectBtn");
const addProjectModal = document.getElementById("addProjectModal");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");
const projectForm = document.getElementById("projectForm");

addProjectBtn.addEventListener("click", () => {
  addProjectModal.classList.remove("hidden");
});

cancelProjectBtn.addEventListener("click", () => {
  addProjectModal.classList.add("hidden");
});

projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loader2.style.display = "flex";

  const name = document.getElementById("projectName").value.trim();
  const desc = document.getElementById("projectDesc").value.trim();
  const tech = document.getElementById("projectTech").value.trim();
  const repo = document.getElementById("projectRepo").value.trim();

  if (!name || !desc || !tech || !repo) {
    alert("All fields are required!");
    loader2.style.display = "none";
    return;
  }

  const formData = new FormData();
  formData.append("Name", name);
  formData.append("Description", desc);
  formData.append("Technology", tech);
  formData.append("Repo", repo);

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const result = await res.json();

    loader2.style.display = "none";
    projectForm.reset();
    cancelProjectBtn.click();   
    removeAllCards();
    loader.style.display = "flex";
    await fetchData();
  } catch (err) {
    console.error("Post Error:", err);
    loader2.style.display = "none";
  }
});

function removeAllCards() {
  document.querySelectorAll(".pcard").forEach((card) => card.remove());
}
