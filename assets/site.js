// Populate a section only when its media are ready to publish.
async function loadGalleries() {
  const response = await fetch("content/media.json", { cache: "no-cache" });
  if (!response.ok) throw new Error("Unable to load gallery content.");
  const galleries = await response.json();
  let visibleSections = 0;

  for (const id of ["demos", "rollouts", "primitives", "static-demos"]) {
    const items = galleries[id];
    if (!Array.isArray(items) || items.length === 0) continue;
    const grid = document.querySelector(`[data-gallery="${id}"]`);

    for (const [index, item] of items.entries()) {
      if (!item.src || !item.title || !["image", "video"].includes(item.type)) continue;
      if (id === "demos" && item.realWorld) {
        grid.append(createDemoComparison(item, index));
      } else {
        grid.append(createMediaCard(item, id));
      }
    }

    if (grid.childElementCount > 0) {
      document.getElementById(id).hidden = false;
      document.querySelector(`[data-section-link="${id}"]`).hidden = false;
      visibleSections += 1;
    }
  }

  document.querySelector(".section-nav").hidden = visibleSections === 0;
}

function createMediaCard(item, section, displayTitle = item.title) {
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
    media.loop = section === "rollouts";
    media.setAttribute("aria-label", item.playbackSpeed ? `${item.title}, ${item.playbackSpeed}× speed` : item.title);
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

  if (section === "rollouts") {
    card.append(media);
    return card;
  }
  const caption = document.createElement("figcaption");
  const title = document.createElement("strong");
  title.textContent = displayTitle;
  if (item.playbackSpeed) {
    const badge = document.createElement("span");
    badge.className = "playback-badge";
    badge.textContent = `${item.playbackSpeed}× speed`;
    title.append(" ", badge);
  }
  caption.append(title);
  if (item.caption) caption.append(document.createTextNode(item.caption));
  if (section === "demos" || section === "primitives") {
    card.append(caption, media);
  } else {
    card.append(media, caption);
  }
  return card;
}

function createDemoComparison(item, index) {
  const group = document.createElement("article");
  group.className = "demo-pair";
  const heading = document.createElement("header");
  heading.className = "demo-pair-heading";
  const title = document.createElement("h3");
  title.id = `demo-${index + 1}-title`;
  title.textContent = item.title;
  group.setAttribute("aria-labelledby", title.id);
  heading.append(title);
  if (item.caption) {
    const task = document.createElement("p");
    task.textContent = item.caption;
    heading.append(task);
  }
  const comparison = document.createElement("div");
  comparison.className = "demo-comparison";
  comparison.append(
    createMediaCard({ ...item, caption: "" }, "demos", "Simulation"),
    createMediaCard(item.realWorld, "demos", "Real-world")
  );
  group.append(heading, comparison);
  return group;
}

loadGalleries().catch((error) => console.warn(error.message));
