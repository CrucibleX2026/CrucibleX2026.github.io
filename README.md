# Crucible project page

Project page for **Crucible: Counterfactual RLVR for Dexterous Manipulation Planners**.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then open `http://127.0.0.1:4173/`.

## Content

- `index.html`: paper title and framework figure caption.
- `assets/crucible-overview.png`: the paper's original framework figure.
- `assets/site.css`: responsive page styles.
- `content/media.json`: demo videos, closed-loop rollouts, primitive gallery, and static demo gallery. A section becomes visible when its array contains media.

The demo tasks appear in the order Chess, Microwave, Piano, with a title and task description above each pair. Each row compares the simulation on the left with its real-world recording on the right; narrow screens stack the pair vertically. Real-world recordings are encoded at 2× speed, including audio, and carry a visible speed label. The `realWorld` object in each demo entry defines the paired video; `playbackSpeed` labels its encoded speed. The MP4 files use fast-start metadata for progressive playback, with preview images under `assets/images/`.

The closed-loop rollout video wall appears after the demos at the full content width. It preserves the uploaded 3840 × 2160 video and its 3 × 4 composition, with playback controls, looping, and a preview image.

The Primitive gallery presents nine approved clips as individually playable videos in a responsive grid, with each primitive name shown above its video. Web copies are 960 × 540 H.264 videos under `assets/videos/primitives/`, with posters under `assets/images/primitives/`.

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
