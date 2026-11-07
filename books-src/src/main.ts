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

  const setStatus = (message: string) => {
    const el = document.getElementById("experience-status-text");
    if (el) el.textContent = message;
  };

  const showFallback = (reason: string) => {
    const reasonEl = document.getElementById("shelf-fallback-reason");
    if (reasonEl) reasonEl.textContent = reason;

    const list = document.getElementById("shelf-fallback-list");
    if (list && !list.childElementCount) {
      catalog.forEach((book, index) => {
        const item = document.createElement("li");
        item.className = "shelf-fallback__item";

        const number = document.createElement("span");
        number.className = "shelf-fallback__index";
        number.textContent = String(index + 1).padStart(2, "0");

        const link = document.createElement("a");
        link.className = "shelf-fallback__title-link";
        link.href = book.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = book.title;

        const author = document.createElement("span");
        author.className = "shelf-fallback__author";
        author.textContent = book.author;

        item.append(number, link, author);
        list.append(item);
      });
    }

    pressExperience.dataset.shelfState = "failed";
  };

  await document.fonts.ready;

  let engine: ShelfEngine | null = null;
  try {
    engine = new ShelfEngine(canvas, catalog, {
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
        setStatus(status);
      },
      onReady: () => {
        pressExperience.classList.add("is-ready");
        pressExperience.dataset.shelfState = "ready";
      },
    });
  } catch (error) {
    console.error("Shelf failed to start:", error);
    showFallback("This browser could not start WebGL, so the three-dimensional shelf is unavailable. The full catalogue is listed below.");
    return;
  }

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    showFallback("The graphics context was lost, usually because the GPU reset or ran out of memory. Reload the page to bring the shelf back.");
  });

  updateUI();

  document.getElementById("btn-prev")?.addEventListener("click", () => {
    engine?.browseBy(-1);
  });

  document.getElementById("btn-next")?.addEventListener("click", () => {
    engine?.browseBy(1);
  });

  document.getElementById("btn-inspect")?.addEventListener("click", () => {
    if (mode === "browse") {
      engine?.focusBook(activeIndex);
    }
  });

  document.getElementById("btn-back")?.addEventListener("click", () => {
    if (mode === "inspect") {
      engine?.returnToShelf();
    }
  });
});
