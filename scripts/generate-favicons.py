"""Generate favicon assets from public/gz-logo.svg."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SVG = ROOT / "public" / "gz-logo.svg"
OUT = ROOT / "public"
RENDER_SCALE = 4
PADDING_RATIO = 0.12


def render_logo() -> Image.Image:
    doc = fitz.open(str(SVG))
    page = doc[0]
    pix = page.get_pixmap(matrix=fitz.Matrix(RENDER_SCALE, RENDER_SCALE), alpha=True)
    doc.close()
    return Image.open(BytesIO(pix.tobytes("png"))).convert("RGBA")


def crop_with_padding(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        raise RuntimeError("Logo SVG rendered empty.")

    left, top, right, bottom = bbox
    width = right - left
    height = bottom - top
    pad_x = int(width * PADDING_RATIO)
    pad_y = int(height * PADDING_RATIO)

    left = max(0, left - pad_x)
    top = max(0, top - pad_y)
    right = min(img.width, right + pad_x)
    bottom = min(img.height, bottom + pad_y)
    return img.crop((left, top, right, bottom))


def fit_square(img: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    scale = min(size / img.width, size / img.height)
    target_w = max(1, int(img.width * scale))
    target_h = max(1, int(img.height * scale))
    resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    offset = ((size - target_w) // 2, (size - target_h) // 2)
    canvas.paste(resized, offset, resized)
    return canvas


def main() -> None:
    source = crop_with_padding(render_logo())

    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
    }

    icons: dict[int, Image.Image] = {}
    for filename, size in sizes.items():
        icon = fit_square(source, size)
        icon.save(OUT / filename, format="PNG", optimize=True)
        icons[size] = icon
        print(f"Wrote {filename}")

    icons[32].save(
        OUT / "favicon.ico",
        format="ICO",
        sizes=[(32, 32), (16, 16)],
        append_images=[icons[16]],
    )
    print("Wrote favicon.ico")


if __name__ == "__main__":
    main()
