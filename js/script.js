
// ===============================
// NASA API CONFIG
// ===============================
const API_KEY = "r3AWGv4u8Gpz0Tk143BzQivGfVn7YfKIX82ibTcz";
const APOD_URL = "https://api.nasa.gov/planetary/apod";

// ===============================
// DOM ELEMENTS
// ===============================
// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesBtn = document.getElementById("get-images-btn");
const gallery = document.getElementById("gallery");
const loadingMessage = document.getElementById("loading-message");

// Modal elements
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalExplanation = document.getElementById("modal-explanation");
const modalVideoLink = document.getElementById("modal-video-link");

// Random fact element
const spaceFactEl = document.getElementById("space-fact");

// ===============================
// RANDOM SPACE FACTS
// ===============================
const spaceFacts = [
  "Did you know? One day on Venus is longer than one year on Venus.",
  "Did you know? Neutron stars can spin up to 600 times per second.",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? Jupiter has at least 95 moons.",
  "Did you know? The footprints on the Moon will stay for millions of years.",
];

function showRandomFact() {
  if (!spaceFactEl) return;
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  spaceFactEl.textContent = spaceFacts[randomIndex];
}

// ===============================
// LOADING MESSAGE HELPERS
// ===============================
function showLoading() {
  loadingMessage.style.display = "block";
  loadingMessage.textContent = "🔄 Loading space photos…";
}

function hideLoading() {
  loadingMessage.style.display = "none";
}

// ===============================
// FETCH APOD RANGE
// ===============================
async function fetchApodRange(startDate, endDate) {
  const url = `${APOD_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}&thumbs=true`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch APOD data");
  }

  return await response.json();
}

// ===============================
// RENDER GALLERY
// ===============================
function renderGallery(items) {
  gallery.innerHTML = "";

  // Sort newest → oldest
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("gallery-item");

    const isImage = item.media_type === "image";
    const imgSrc = isImage ? item.url : item.thumbnail_url || item.url;

    card.innerHTML = `
      <div class="gallery-image-wrapper">
        <img src="${imgSrc}" alt="${item.title}" class="gallery-image" />
      </div>
      <h3 class="gallery-title">${item.title}</h3>
      <p class="gallery-date">${item.date}</p>
    `;

    card.addEventListener("click", () => openModal(item));

    gallery.appendChild(card);
  });
}

// ===============================
// MODAL LOGIC
// ===============================
function openModal(item) {
  if (!modal || !modalTitle || !modalDate || !modalExplanation || !modalImage || !modalVideoLink) {
    return;
  }

  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;

  if (item.media_type === "image") {
    modalImage.src = item.hdurl || item.url;
    modalImage.style.display = "block";
    modalVideoLink.style.display = "none";
  } else {
    modalImage.style.display = "none";
    modalVideoLink.style.display = "inline-block";
    modalVideoLink.href = item.url;
    modalVideoLink.textContent = "Watch this APOD video";
  }

  modal.style.display = "block";
}

function closeModal() {
  if (!modal) return;
  modal.style.display = "none";
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

// ===============================
// BUTTON CLICK HANDLER
// ===============================
getImagesBtn.addEventListener("click", async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert("Please select both a start and end date.");
    return;
  }

  gallery.innerHTML = "";
  showLoading();

  try {
    const apodItems = await fetchApodRange(startDate, endDate);
    renderGallery(apodItems);
  } catch (error) {
    console.error(error);
    loadingMessage.textContent = "⚠️ Error loading images.";
  } finally {
    hideLoading();
  }
});

// ===============================
// INITIALIZE APP
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  showRandomFact();
});


// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);
