#!/usr/bin/env python3
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
svg_raw = (root / "public/illustrations/hero-network.svg").read_text(encoding="utf-8")
svg_raw = re.sub(r"<\?xml[^?]*\?>\s*", "", svg_raw)
svg_inline = svg_raw.replace(
    'viewBox="192 283 1216 1125"',
    'class="hero-network-svg" viewBox="192 283 1216 1125"',
    1,
).replace(
    'viewBox="0 0 1600 1600" width="1600" height="1600"',
    'class="hero-network-svg" viewBox="192 283 1216 1125"',
    1,
)

# Indent SVG lines for HTML readability
svg_lines = svg_inline.splitlines()
svg_indented = "\n".join("            " + line if line.strip() else line for line in svg_lines)

figure_block = f'''        <div class="hero-right">
          <figure class="hero-diagram" aria-label="GenZrix service network diagram">
{svg_indented}
          </figure>
        </div>'''

index_path = root / "index.html"
html = index_path.read_text(encoding="utf-8")

marker = "        </div>\n      </div>\n\n\n      <div class=\"scroll-indicator\""
replacement = f"        </div>\n{figure_block}\n      </div>\n\n      <div class=\"scroll-indicator\""

if marker not in html:
    marker = "        </div>\n      </div>\n\n      <div class=\"scroll-indicator\""
    replacement = f"        </div>\n{figure_block}\n      </div>\n\n      <div class=\"scroll-indicator\""

if marker not in html:
    raise SystemExit("Could not find hero-split closing marker in index.html")

html = html.replace(marker, replacement, 1)
index_path.write_text(html, encoding="utf-8")
print("Inserted hero-right with inline SVG")
