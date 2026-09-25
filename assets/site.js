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
        media.controls = true;
        media.playsInline = true;
        media.preload = "metadata";
        media.setAttribute("aria-label", item.title);
        if (item.poster) media.poster = item.poster;
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
      grid.append(card);
    }

    if (grid.childElementCount > 0) {
      document.getElementById(id).hidden = false;
      document.querySelector(`[data-section-link="${id}"]`).hidden = false;
      visibleSections += 1;
    }
  }

  document.querySelector(".section-nav").hidden = visibleSections === 0;
}

loadGalleries().catch((error) => console.warn(error.message));
