// Populate a section only when its media are ready to publish.
async function loadGalleries() {
  const response = await fetch("content/media.json", { cache: "no-cache" });
  if (!response.ok) throw new Error("Unable to load gallery content.");
  const galleries = await response.json();
  let visibleSections = 0;

  for (const id of ["demos", "primitives", "static-demos"]) {
    const items = galleries[id];
    if (!Array.isArray(items) || items.length === 0) continue;
    const grid = document.querySelector(`[data-gallery="${id}"]`);

    for (const item of items) {
      if (!item.src || !item.title || !["image", "video"].includes(item.type)) continue;
      const card = document.createElement("figure");
      card.className = "media-card";
      const media = document.createElement(item.type === "video" ? "video" : "img");
      media.src = item.src;
      if (Number.isFinite(item.width) && item.width > 0 && Number.isFinite(item.height) && item.height > 0) {
        media.width = item.width;
        media.height = item.height;
        media.style.aspectRatio = `${item.width} / ${item.height}`;
      }
      if (item.type === "video") {
        media.controls = id !== "primitives";
        media.playsInline = true;
        media.preload = "metadata";
        media.setAttribute("aria-label", item.title);
        if (item.poster) media.poster = item.poster;
        if (id === "primitives") {
          media.muted = true;
          media.defaultMuted = true;
          media.loop = true;
          media.preload = "none";
        }
        if (item.captions) {
          const track = document.createElement("track");
          track.kind = "captions";
          track.src = item.captions;
          track.srclang = item.language || "en";
          track.label = item.captionLabel || "English";
          media.append(track);
        }
      } else {
        media.alt = item.alt || item.caption || item.title;
        media.loading = "lazy";
        media.decoding = "async";
      }

      if (id === "primitives") {
        card.append(media);
      } else {
        const caption = document.createElement("figcaption");
        const title = document.createElement("strong");
        title.textContent = item.title;
        caption.append(title);
        if (item.caption) caption.append(document.createTextNode(item.caption));
        if (id === "demos") {
          card.append(caption, media);
        } else {
          card.append(media, caption);
        }
      }
      grid.append(card);
    }

    if (grid.childElementCount > 0) {
      document.getElementById(id).hidden = false;
      document.querySelector(`[data-section-link="${id}"]`).hidden = false;
      visibleSections += 1;
    }
  }

  document.querySelector(".section-nav").hidden = visibleSections === 0;
  setupPrimitiveWall();
}

function setupPrimitiveWall() {
  const wall = document.getElementById("primitive-wall");
  const videos = [...wall.querySelectorAll("video")];
  if (videos.length === 0) return;
  const toggle = document.querySelector(".wall-toggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let playbackEnabled = !reducedMotion.matches;
  let inView = false;

  function updatePlayback() {
    toggle.textContent = playbackEnabled ? "Pause videos" : "Play videos";
    for (const video of videos) {
      if (playbackEnabled && inView && !document.hidden) {
        video.play().catch((error) => {
          if (error.name === "NotAllowedError" && playbackEnabled) {
            playbackEnabled = false;
            updatePlayback();
          }
        });
      } else {
        video.pause();
      }
    }
  }

  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    playbackEnabled = !playbackEnabled;
    updatePlayback();
  });
  reducedMotion.addEventListener("change", () => {
    playbackEnabled = !reducedMotion.matches;
    updatePlayback();
  });
  document.addEventListener("visibilitychange", updatePlayback);
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updatePlayback();
  }, { threshold: 0 });
  observer.observe(wall);
  updatePlayback();
}

loadGalleries().catch((error) => console.warn(error.message));
