"""Copy the manuscript teaser and its caption to the static project page."""

from html import escape
from pathlib import Path
import re
import shutil
import struct
import sys


def braced_text(text, start):
    depth = 1
    for end in range(start, len(text)):
        if text[end] == "{" and (end == 0 or text[end - 1] != "\\"):
            depth += 1
        elif text[end] == "}" and (end == 0 or text[end - 1] != "\\"):
            depth -= 1
            if depth == 0:
                return text[start:end]
    raise ValueError("Unclosed LaTeX group")


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python3 scripts/sync_overview.py /path/to/manuscript.tex")
    manuscript = Path(sys.argv[1]).resolve()
    site = Path(__file__).resolve().parents[1]
    text = manuscript.read_text()
    figure = next(
        (block for block in re.findall(r"\\begin\{figure\*?\}.*?\\end\{figure\*?\}", text, re.S)
         if r"\label{fig:teaser}" in block),
        None,
    )
    if figure is None:
        raise SystemExit("The manuscript has no fig:teaser figure.")
    graphic = re.search(r"\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}", figure)
    caption_start = re.search(r"\\caption\{", figure)
    if graphic is None or caption_start is None:
        raise SystemExit("The teaser must include an image and caption.")
    source = manuscript.parent / graphic.group(1)
    caption = braced_text(figure, caption_start.end())
    caption = re.sub(r"\\method(?:\{\})?", "Crucible", caption)
    caption = re.sub(r"\\(?:rev|textbf|emph|textit)\{([^{}]*)\}", r"\1", caption)
    caption = caption.replace("---", "—").replace("--", "–").replace("~", " ")
    caption = " ".join(caption.split())
    if "\\" in caption or "{" in caption or "}" in caption:
        raise SystemExit("The caption contains unsupported LaTeX; review it before publishing.")
    if source.suffix.lower() != ".png":
        raise SystemExit("The overview asset must be a PNG.")
    header = source.read_bytes()[:24]
    if header[:8] != b"\x89PNG\r\n\x1a\n":
        raise SystemExit("The overview file is not a valid PNG.")
    width, height = struct.unpack(">II", header[16:24])
    lead, separator, panels = caption.partition(" (a) ")
    if not separator or " (b) " not in panels or " (c) " not in panels:
        raise SystemExit("The caption must describe panels (a), (b), and (c).")
    lead_html = escape(lead).replace("Crucible", '<strong class="caption-name">Crucible</strong>', 1)
    panels_html = re.sub(r"\(([abc])\)", r"<strong>(\1)</strong>", escape("(a) " + panels))
    markup = f'<figcaption id="overview-caption">\n          <p>{lead_html}</p>\n          <p>{panels_html}</p>\n        </figcaption>'
    page_path = site / "index.html"
    page = page_path.read_text()
    page, count = re.subn(r'<figcaption id="overview-caption">.*?</figcaption>', lambda _: markup, page, flags=re.S)
    if count != 1:
        raise SystemExit("Expected exactly one overview caption in index.html.")
    page, count = re.subn(r'(src="assets/crucible-overview\.png" width=")\d+(" height=")\d+', lambda m: f'{m[1]}{width}{m[2]}{height}', page)
    if count != 1:
        raise SystemExit("Expected exactly one overview image in index.html.")
    shutil.copy2(source, site / "assets/crucible-overview.png")
    page_path.write_text(page)
    print(f"Updated framework figure ({width} × {height}) and caption.")


if __name__ == "__main__":
    main()
