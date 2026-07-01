#!/usr/bin/env python3
"""Replace inlined hero-network SVG in index.html from public/illustrations/hero-network.svg."""

import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
svg_raw = (root / "public/illustrations/hero-network.svg").read_text(encoding="utf-8")
svg_raw = re.sub(r"<\?xml[^?]*\?\>\s*", "", svg_raw)
svg_inline = svg_raw.replace("<svg xmlns", '<svg class="hero-network-svg" xmlns', 1)

svg_lines = svg_inline.splitlines()
svg_indented = "\n".join("            " + line if line.strip() else line for line in svg_lines)

index_path = root / "index.html"
html = index_path.read_text(encoding="utf-8")

pattern = r'(<figure class="hero-diagram"[^>]*>\s*)<svg[^>]*class="hero-network-svg"[^>]*>[\s\S]*?</svg>'
replacement = rf"\1{svg_indented}"

new_html, count = re.subn(pattern, replacement, html, count=1)
if count != 1:
    raise SystemExit(f"Expected to replace 1 inlined SVG, replaced {count}")

index_path.write_text(new_html, encoding="utf-8")
print("Synced inlined hero-network SVG in index.html")
