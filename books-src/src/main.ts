import "./globals.css";
import { catalog } from "./catalog";
import { ShelfEngine, type ShelfMode } from "./ShelfEngine";

document.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("shelf-canvas") as HTMLCanvasElement;
  const pressExperience = document.getElementById("press-experience") as HTMLElement;

  const volCount = document.getElementById("volume-count");
  if (volCount) volCount.textContent = `${catalog.length} VOLUMES`;

  let activeIndex = 0;
  let selectedIndex: number | null = null;
  let mode: ShelfMode = "browse";

  const updateUI = () => {
    const isFocused = mode !== "browse";

    if (isFocused) {
      pressExperience.classList.remove("is-browsing");
      pressExperience.classList.add("is-focused");
      document.getElementById("browse-caption")?.setAttribute("aria-hidden", "true");
      document.getElementById("focused-caption")?.removeAttribute("aria-hidden");
    } else {
      pressExperience.classList.remove("is-focused");
      pressExperience.classList.add("is-browsing");
      document.getElementById("browse-caption")?.removeAttribute("aria-hidden");
      document.getElementById("focused-caption")?.setAttribute("aria-hidden", "true");
    }

    const activeBook = catalog[activeIndex];
    if (activeBook) {
      const aIdx = document.getElementById("active-index");
      const aTitle = document.getElementById("active-title");
      if (aIdx) aIdx.textContent = String(activeIndex + 1).padStart(2, "0");
      if (aTitle) aTitle.textContent = activeBook.shortTitle;
    }

    const selectedBook = selectedIndex !== null ? catalog[selectedIndex] : null;
    if (selectedBook) {
      const fIdx = document.getElementById("focus-index");
      const fTitle = document.getElementById("focus-title");
      const fAuthor = document.getElementById("focus-author");
      const fQuote = document.getElementById("focus-quote");
      const fQuoteBy = document.getElementById("focus-quote-by");
      const fFormat = document.getElementById("focus-format");
      const fAvailability = document.getElementById("focus-availability");
      const fDescription = document.getElementById("focus-description");
      const fLink = document.getElementById("focus-link") as HTMLAnchorElement;

      if (fIdx) fIdx.textContent = String(selectedIndex! + 1).padStart(2, "0");
      if (fTitle) fTitle.textContent = selectedBook.title;
      if (fAuthor) fAuthor.textContent = selectedBook.author;
      if (fQuote) fQuote.textContent = `“${selectedBook.quote}”`;
      if (fQuoteBy) fQuoteBy.textContent = `— ${selectedBook.quoteBy}`;
      if (fFormat) fFormat.textContent = selectedBook.format;
      if (fAvailability) fAvailability.textContent = selectedBook.availability;
      if (fDescription) fDescription.textContent = selectedBook.description;

      if (fLink) {
        fLink.href = selectedBook.url;
        fLink.textContent = selectedBook.linkLabel || "View details";
      }
    }
  };

  await document.fonts.ready;

  const engine = new ShelfEngine(canvas, catalog, {
    onActiveIndex: (index) => {
      activeIndex = index;
      updateUI();
    },
    onMode: (nextMode, index) => {
      mode = nextMode;
      selectedIndex = index;
      updateUI();
    },
    onStatus: (status) => {
      console.log("Status:", status);
    },
    onReady: () => {
      pressExperience.classList.add("is-ready");
    },
  });

  document.getElementById("btn-prev")?.addEventListener("click", () => {
    engine.browseBy(-1);
  });

  updateUI();

  document.getElementById("btn-next")?.addEventListener("click", () => {
    engine.browseBy(1);
  });

  document.getElementById("btn-inspect")?.addEventListener("click", () => {
    if (mode === "browse") {
      engine.focusBook(activeIndex);
    }
  });

  document.getElementById("btn-back")?.addEventListener("click", () => {
    if (mode === "inspect") {
      engine.returnToShelf();
    }
  });
});
