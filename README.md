# Crucible project page

Project page for **Crucible: Counterfactual RLVR for Dexterous Manipulation Planners**.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then open `http://127.0.0.1:4173/`.

## Content

- `index.html`: paper title and framework figure caption.
- `assets/crucible-overview.png`: the paper's original framework figure.
- `assets/site.css`: responsive page styles.
- `content/media.json`: demo videos, primitive gallery, and static demo gallery. A section becomes visible when its array contains media.

The demo videos appear in the order Chess, Microwave, Piano. They are stacked vertically, centered at 80% of the content width, with each title and task description above its video. Task descriptions are transcribed from the opening frames. The MP4 files use fast-start metadata for progressive playback, with preview images under `assets/images/`.

The Primitive gallery tiles nine approved clips into a continuous 3 × 3 video wall. The wall plays muted loops while visible and includes a shared play/pause button. It starts paused for visitors who prefer reduced motion. Web copies are 960 × 540 H.264 videos under `assets/videos/primitives/`, with posters under `assets/images/primitives/`.

Add media files under `assets/` and populate the corresponding array. For example:

```json
{
  "type": "video",
  "title": "Demo title",
  "src": "assets/videos/demo.mp4",
  "poster": "assets/images/demo-poster.jpg",
  "caption": "A description of the demonstrated task."
}
```

For images, use `"type": "image"` and provide `alt` text. Supply `width` and `height` to reserve the media's original aspect ratio. Video captions can be supplied through a `captions` WebVTT file path with optional `language` and `captionLabel` fields. Keep only prepared, approved media in these arrays.

## Refresh the framework figure

Run `python3 scripts/sync_overview.py /path/to/iclr2027_conference.tex` to copy the figure referenced by `fig:teaser` and update its caption. The script checks the expected figure and updates only the overview asset and caption.

## Hosting

This is a static site. GitHub Pages publishes the root of the `codex/crucible-homepage` branch; `.nojekyll` preserves static-file serving.

## Design reference

The academic page structure is inspired by [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) and [Nerfies](https://nerfies.github.io/). The page implementation is original; the figure and caption come from the Crucible manuscript.

The paper heading uses [Manrope](https://fonts.google.com/specimen/Manrope), served from this repository under the [SIL Open Font License](assets/fonts/OFL-Manrope.txt).
