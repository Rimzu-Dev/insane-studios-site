const pages = [...document.querySelectorAll(".page")];
const navButtons = [...document.querySelectorAll(".nav-btn")];

const gameLabels = {
  fivem: "FiveM",
  "gtav-sp": "GTA V SP",
  fs19: "FS19",
  fs22: "FS22",
  fs25: "FS25",
  beamng: "BeamNG.drive",
};

const gameFilters = [
  { id: "all", label: "All Games" },
  { id: "fivem", label: "FiveM" },
  { id: "gtav-sp", label: "GTA V SP" },
  { id: "fs19", label: "FS19" },
  { id: "fs22", label: "FS22" },
  { id: "fs25", label: "FS25" },
  { id: "beamng", label: "BeamNG.drive" },
];

const mods = [
  {
    id: "single-cab-bravado-bison",
    name: "Single Cab Bravado Bison",
    games: ["gtav-sp", "fivem"],
    status: "available",
    tagline: "A single cab Bravado Bison conversion built for GTA V single player and FiveM.",
    description:
      "A single cab conversion of the Bravado Bison with a shortened frame, cleaned-up body lines, and handling set up to feel like a factory truck. Works in GTA V single player and on FiveM servers.",
    version: "1.0.0",
    updated: "Released",
    downloadUrl: "https://www.gta5-mods.com/vehicles/single-cab-bravado-bison",
    screenshots: 6,
  },
  {
    id: "qbcore-trucking-jobs",
    name: "QBCore Trucking Jobs (WIP)",
    games: ["fivem"],
    status: "available",
    tagline: "A QBCore trucking job system with routes, payouts, and trailer handling.",
    description:
      "A trucking job script for QBCore servers with delivery routes, payouts, and trailer handling. Released now, with more routes and polish still being added.",
    version: "0.8.0 (WIP)",
    updated: "Released",
    downloadUrl: "https://cdn.discordapp.com/attachments/1500051076089511966/1500407944615952394/trucking-jobs.zip?ex=6af8164a&is=6af6c4ca&hm=9f60b166fee6907e669b9d22225c09d9197791dcc79b9abf5167f1bee09b652e&",
    screenshots: 5,
  },
  {
    id: "computer-interface",
    name: "Computer Interface",
    games: ["fivem"],
    status: "preview",
    tagline: "A custom in-game computer interface for FiveM.",
    description:
      "A custom computer interface for FiveM, built to give players an in-game desktop for server features. Still in development and not available for download yet.",
    version: "In development",
    updated: "In progress",
    downloadUrl: "",
    screenshots: 4,
  },
  {
    id: "pj-trailer-pack",
    name: "PJ Trailer Pack",
    games: ["fivem"],
    status: "preview",
    tagline: "A trailer pack built for FiveM servers.",
    description:
      "A PJ trailer pack for FiveM, made to add more variety to trucking and hauling jobs. Still in development and not available for download yet.",
    version: "In development",
    updated: "In progress",
    downloadUrl: "",
    screenshots: 4,
  },
  {
    id: "loki-4thgen",
    name: "Loki 4thGen",
    games: ["beamng"],
    status: "preview",
    tagline: "A 4th generation vehicle build for BeamNG.drive.",
    description:
      "A 4th generation vehicle project for BeamNG.drive, built from the ground up with custom configuration and tuning. Still in development and not available for download yet.",
    version: "In development",
    updated: "In progress",
    downloadUrl: "",
    screenshots: 5,
  },
];

function parseHash() {
  const raw = location.hash.replace("#", "") || "home";
  if (raw.startsWith("mod-")) {
    const modId = raw.slice(4);
    if (mods.some((mod) => mod.id === modId)) {
      return { page: "mod", modId };
    }
  }
  return { page: document.getElementById("page-" + raw) ? raw : "home" };
}

function setActiveButton(id) {
  let activeId = id;
  if (id === "rally-horizons") activeId = "projects";
  if (id === "mod") activeId = "mods";
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === activeId);
  });
}

let currentPage = null;
let switching = false;
let pendingId = null;

function showPage(id, instant = false) {
  const next = document.getElementById("page-" + id);
  if (!next) return;

  if (next === currentPage) {
    setActiveButton(id);
    return;
  }

  if (switching) {
    pendingId = id;
    return;
  }

  const prev = currentPage;
  currentPage = next;
  setActiveButton(id);

  if (!prev || instant) {
    pages.forEach((page) => page.classList.remove("active", "leaving"));
    next.classList.add("active");
    return;
  }

  switching = true;
  prev.classList.remove("active");
  prev.classList.add("leaving");

  const onDone = () => {
    prev.removeEventListener("animationend", onDone);
    prev.classList.remove("leaving");
    next.classList.add("active");
    switching = false;

    if (pendingId) {
      const queued = pendingId;
      pendingId = null;
      showPage(queued);
    }
  };

  prev.addEventListener("animationend", onDone);
  setTimeout(() => {
    if (prev.classList.contains("leaving")) onDone();
  }, 400);
}

function handleRoute(instant = false) {
  const route = parseHash();
  if (route.page === "mod") renderModDetail(route.modId);
  showPage(route.page, instant);
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.page;
    if (location.hash === "#" + id) {
      showPage(id);
      return;
    }
    location.hash = id;
  });
});

const modGrid = document.getElementById("modGrid");
const modFilters = document.getElementById("modFilters");
let activeGame = "all";

function renderModFilters() {
  if (!modFilters) return;
  modFilters.innerHTML = gameFilters
    .map(
      (filter) => `
        <button class="filter-btn${filter.id === activeGame ? " active" : ""}" type="button" data-game="${filter.id}" aria-pressed="${filter.id === activeGame}">
          ${filter.label}
        </button>`
    )
    .join("");
}

function renderMods() {
  if (!modGrid) return;
  const visible = mods.filter(
    (mod) => activeGame === "all" || mod.games.includes(activeGame)
  );

  if (!visible.length) {
    modGrid.innerHTML = '<p class="mod-empty">No mods for this game yet.</p>';
    return;
  }

  modGrid.innerHTML = visible
    .map((mod) => {
      const available = mod.status === "available";
      const tags = mod.games
        .map((game) => `<span class="game-tag">${gameLabels[game] || game}</span>`)
        .join("");

      return `
        <a class="project-card mod-card${available ? "" : " unavailable"}" href="#mod-${mod.id}">
          <div class="mod-card-top">
            <h3>${mod.name}</h3>
            <span class="mod-badge ${available ? "live" : "coming"}">${available ? "Released" : "Unreleased"}</span>
          </div>
          <div class="game-tags">${tags}</div>
          <p>${mod.tagline}</p>
        </a>`;
    })
    .join("");
}

if (modFilters && modGrid) {
  renderModFilters();
  renderMods();
  modFilters.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button || button.dataset.game === activeGame) return;
    activeGame = button.dataset.game;
    renderModFilters();
    renderMods();
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let galleryShots = [];
let shotIndex = 0;

function updateLightbox() {
  const shot = galleryShots[shotIndex];
  if (!shot) return;
  const img = shot.querySelector("img");
  lightboxImage.src = shot.dataset.full || img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = shot.dataset.caption || img.alt;
}

function openLightbox(shots, shot) {
  galleryShots = shots;
  shotIndex = Math.max(0, shots.indexOf(shot));
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function stepLightbox(direction) {
  if (!galleryShots.length) return;
  shotIndex = (shotIndex + direction + galleryShots.length) % galleryShots.length;
  updateLightbox();
}

function setupGallery(grid, toggleBtn) {
  if (!grid) return;
  const shots = [...grid.querySelectorAll(".shot")];
  const hasExtra = shots.some((shot) => shot.classList.contains("extra"));

  if (toggleBtn) {
    toggleBtn.hidden = !hasExtra;
    toggleBtn.textContent = `View all ${shots.length}`;
    toggleBtn.onclick = () => {
      const expanded = grid.classList.toggle("expanded");
      toggleBtn.textContent = expanded ? "Show less" : `View all ${shots.length}`;
    };
  }

  shots.forEach((shot) => {
    shot.addEventListener("click", () => openLightbox(shots, shot));
  });
}

if (lightbox) {
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  lightboxNext.addEventListener("click", () => stepLightbox(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
  });
}

const modHeroBg = document.getElementById("modHeroBg");
const modTitle = document.getElementById("modTitle");
const modTagline = document.getElementById("modTagline");
const modMeta = document.getElementById("modMeta");
const modActions = document.getElementById("modActions");
const modDescriptionText = document.getElementById("modDescriptionText");
const modShotGrid = document.getElementById("modShotGrid");
const modToggleShots = document.getElementById("modToggleShots");
const modScreenshotsSection = document.getElementById("modScreenshotsSection");

function buildModShots(mod) {
  return Array.from({ length: mod.screenshots || 0 }, (_, index) => {
    const number = index + 1;
    const extra = index >= 4 ? " extra" : "";
    const caption = `${mod.name} screenshot ${number}`;
    return `
      <button class="shot${extra}" type="button" data-caption="${caption}">
        <img src="assets/screenshot-placeholder.svg" alt="${caption}">
        <span class="shot-caption">Screenshot ${number}</span>
      </button>`;
  }).join("");
}

function renderModDetail(modId) {
  const mod = mods.find((item) => item.id === modId);
  if (!mod) return;

  const available = mod.status === "available";
  const games = mod.games.map((game) => gameLabels[game] || game).join(" / ");

  modTitle.textContent = mod.name;
  modTagline.textContent = mod.tagline;
  modHeroBg.src = "assets/main.webp";
  modHeroBg.alt = "";

  modMeta.innerHTML = `
    <div class="meta-item">
      <span class="meta-label">Game</span>
      <span class="meta-value">${games}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Version</span>
      <span class="meta-value">${mod.version}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Updated</span>
      <span class="meta-value">${mod.updated}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Status</span>
      <span class="meta-value ${available ? "status-available" : "status-unavailable"}">${available ? "Released" : "Unreleased"}</span>
    </div>`;

  if (available) {
    modActions.innerHTML = `<a class="download-btn" href="${mod.downloadUrl || "#"}" target="_blank" rel="noopener">Download Mod</a>`;
    const downloadLink = modActions.querySelector(".download-btn");
    if (downloadLink && downloadLink.getAttribute("href") === "#") {
      downloadLink.addEventListener("click", (event) => event.preventDefault());
      downloadLink.title = "Add this mod's download link in script.js";
    }
  } else {
    modActions.innerHTML = '<span class="download-btn disabled" aria-disabled="true">Not Available</span>';
  }

  modDescriptionText.textContent = mod.description;

  if (modScreenshotsSection) {
    modScreenshotsSection.hidden = !mod.screenshots;
  }
  modShotGrid.innerHTML = buildModShots(mod);
  setupGallery(modShotGrid, modToggleShots);
}

setupGallery(document.getElementById("shotGrid"), document.getElementById("toggleShots"));

window.addEventListener("hashchange", () => handleRoute());
handleRoute();
