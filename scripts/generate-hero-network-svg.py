#!/usr/bin/env python3
"""Generate hero-network.svg — radial GenZrix service network illustration."""

import math
import re
from pathlib import Path

CX, CY = 800, 800
NETWORK_SCALE = 0.825  # ~17.5% tighter orbit (within 15–20% target)
CARD_R = round(468 * NETWORK_SCALE)
NODE_R = round(338 * NETWORK_SCALE)
SERVICE_CARD_INSET = 40  # radial inward shift (35–45px target) toward red orbit
SERVICE_CARD_R = CARD_R - SERVICE_CARD_INSET
RING_RADII = [round(r * NETWORK_SCALE) for r in [108, 168, 228, 288, 348, 408, 468, 528, 588]]
VIEWBOX_PAD = 12  # 10–15px breathing room around outermost artwork
VIEWBOX = "302 302 995 995"  # pinned — do not recompute when refining icon presentation

# Center branding layout (rebuilt — no accumulated wrapper scale)
LOGO_PATH_CENTER_X = 160
LOGO_PATH_MIN_Y = 96
LOGO_PATH_MAX_Y = 276
LOGO_MARK_INNER_TX = -70
LOGO_MARK_INNER_TY = -48
LOGO_MARK_BASE_SCALE = 0.38
LOGO_MARK_POLISH_SCALE = 1.09  # prior production polish
LOGO_MARK_SIMPLIFY_SCALE = 1.225  # +22.5% for logo-only center focal point
LOGO_MARK_SCALE = round(LOGO_MARK_BASE_SCALE * 1.18 * LOGO_MARK_POLISH_SCALE * LOGO_MARK_SIMPLIFY_SCALE, 4)
LOGO_MARK_CENTER_X = LOGO_PATH_CENTER_X * LOGO_MARK_SCALE + LOGO_MARK_INNER_TX
LOGO_MARK_CENTER_Y = ((LOGO_PATH_MIN_Y + LOGO_PATH_MAX_Y) / 2) * LOGO_MARK_SCALE + LOGO_MARK_INNER_TY
LOGO_MARK_X = -LOGO_MARK_CENTER_X
LOGO_MARK_Y = -LOGO_MARK_CENTER_Y  # logo mark hub centered on orbit (800, 800)
RING_OPACITY_MULT = 1.175  # +17.5% ring visibility
NODE_GLOW_RADIUS = 13  # outer glow radius (node core unchanged)
NODE_GLOW_OPACITY = 0.48  # +20% glow intensity
DOT_GRID_OPACITY = 0.046  # +15% halftone dot visibility
CENTER_AMBIENT_GLOW_RADIUS = 165

# Service card icon container
ICON_BOX_BASE = 1.11
ICON_BOX_COMPOSITION_SCALE = 1.08  # +8% icon container (composition pass)
ICON_BOX_SCALE = ICON_BOX_BASE * ICON_BOX_COMPOSITION_SCALE
ICON_BOX_HALF = 29 * ICON_BOX_SCALE
ICON_BOX_SIZE = ICON_BOX_HALF * 2
ICON_BOX_RX = 10 * ICON_BOX_SCALE
ICON_BOX_STROKE = 1.308

# Service card typography + group scale (composition pass)
SERVICE_CARD_SCALE = 1.175  # 117.5% proportional card groups
SERVICE_TITLE_SIZE = 13.625  # +9% from 12.5
SERVICE_DESC_SIZE = 11.235  # +7% from 10.5
SERVICE_DESC_DY = 15  # slightly increased line height
SERVICE_TITLE_Y_OFFSET = 50.14
SERVICE_DESC_Y_OFFSET = 68.48

# Per-card title/description nudge (icon position unchanged)
SERVICE_TEXT_OFFSET_X = {
    "web-mobile-app-development": 18,  # prevent left-edge clip on long title
}

ROOT = Path(__file__).resolve().parents[1]

# Approved center logo (public/gz-logo.svg — official GZ mark)
LOGO_SVG = ROOT / "public" / "gz-logo.svg"
LOGO_ID_PREFIX = "cl-"

# Approved reusable icon library (public/icons/services/)
ICONS_DIR = ROOT / "public" / "icons" / "services"
ICON_LIBRARY = {
    "website": "website.svg",
    "uiux": "uiux.svg",
    "branding": "branding.svg",
    "marketing": "marketing.svg",
    "media": "media.svg",
    "analytics": "analytics.svg",
    "mobile": "mobile.svg",
    "ecommerce": "ecommerce.svg",
}
ICON_FIT = ICON_BOX_SIZE * 0.86  # target artwork span inside the rounded square
ICON_STROKE_ROUND = 'stroke-linecap="round" stroke-linejoin="round"'

SERVICES = [
    ("website-development", 0, "WEBSITE DEVELOPMENT", "Fast, responsive and SEO-friendly", "websites that convert.", "website"),
    ("ui-ux-design", 45, "UI/UX DESIGN", "Intuitive designs that elevate user", "experience and drive engagement.", "uiux"),
    ("creative-design-branding", 90, "CREATIVE DESIGN & BRANDING", "Brand identities that inspire trust", "and leave a lasting impression.", "branding"),
    ("digital-marketing", 135, "DIGITAL MARKETING", "Data-driven marketing strategies", "that boost visibility and growth.", "marketing"),
    ("media-event-solutions", 180, "MEDIA & EVENT SOLUTIONS", "Creative media and event experiences", "that engage and inspire.", "media"),
    ("data-analytics", 225, "DATA ANALYTICS", "Transform data into actionable insights", "that drive results.", "analytics"),
    ("web-mobile-app-development", 270, "WEB/MOBILE APP DEVELOPMENT", "Custom apps for web and mobile that", "deliver seamless performance.", "mobile"),
    ("e-commerce-solutions", 315, "E-COMMERCE SOLUTIONS", "Powerful online stores built to", "scale your business.", "ecommerce"),
]


def load_icon_svg(icon_key: str) -> tuple[str, float, float, float]:
    """Return inner SVG markup, viewBox center, and uniform scale for the icon box."""
    path = ICONS_DIR / ICON_LIBRARY[icon_key]
    raw = path.read_text(encoding="utf-8")
    viewbox_match = re.search(r'viewBox="([^"]+)"', raw)
    if not viewbox_match:
        raise ValueError(f"Missing viewBox in {path}")
    vx, vy, vw, vh = (float(part) for part in viewbox_match.group(1).split())
    cx = vx + vw / 2
    cy = vy + vh / 2
    scale = min(ICON_FIT / vw, ICON_FIT / vh)
    inner = re.sub(r"^[\s\S]*?<svg[^>]*>", "", raw, count=1)
    inner = re.sub(r"</svg>\s*$", "", inner).strip()
    return inner, cx, cy, scale


def fmt_num(value: float) -> str:
    text = f"{value:.3f}".rstrip("0").rstrip(".")
    return text or "0"


def render_icon(icon_key: str) -> str:
    inner, cx, cy, scale = load_icon_svg(icon_key)
    transform = (
        f'scale({fmt_num(scale)}) translate({fmt_num(-cx)},{fmt_num(-cy)})'
    )
    body = "\n".join(f"          {line}" for line in inner.splitlines() if line.strip())
    return f"""
        <g transform="{transform}">
{body}
        </g>""".rstrip()


def icon_group_attrs() -> str:
    return f'{ICON_STROKE_ROUND} filter="url(#icon-premium-contrast)" paint-order="stroke fill markers"'


def prefix_svg_ids(content: str, prefix: str) -> str:
    """Prefix every id= and url(#...) reference to avoid hero SVG collisions."""
    ids = set(re.findall(r'\bid="([^"]+)"', content))
    ids.update(re.findall(r"url\(#([^)]+)\)", content))
    for old_id in sorted(ids, key=len, reverse=True):
        new_id = prefix + old_id
        content = content.replace(f'id="{old_id}"', f'id="{new_id}"')
        content = content.replace(f"url(#{old_id})", f"url(#{new_id})")
    return content


def load_official_logo_mark() -> tuple[str, str]:
    """Load official gz-logo.svg defs + body with prefixed IDs."""
    raw = LOGO_SVG.read_text(encoding="utf-8")
    inner = re.sub(r"^[\s\S]*?<svg[^>]*>", "", raw, count=1)
    inner = re.sub(r"</svg>\s*$", "", inner).strip()
    inner = prefix_svg_ids(inner, LOGO_ID_PREFIX)
    defs_match = re.search(r"<defs>([\s\S]*?)</defs>", inner)
    if not defs_match:
        raise ValueError(f"Missing <defs> in {LOGO_SVG}")
    defs_body = defs_match.group(1).strip()
    body = re.sub(r"<defs>[\s\S]*?</defs>", "", inner).strip()
    return defs_body, body


def indent_logo_markup(body: str, spaces: int = 8) -> str:
    pad = " " * spaces
    return "\n".join(f"{pad}{line}" if line.strip() else line for line in body.splitlines())


def polar(angle_deg: float, radius: float) -> tuple[float, float]:
    rad = math.radians(angle_deg)
    return CX + radius * math.sin(rad), CY - radius * math.cos(rad)


def center_logo(logo_body: str) -> str:
    mark_x = CX + LOGO_MARK_X
    mark_y = CY + LOGO_MARK_Y
    indented = indent_logo_markup(logo_body)
    return f"""  <g id="center-logo">
    <g id="center-logo-mark" transform="translate({fmt_num(mark_x)},{fmt_num(mark_y)})">
      <g transform="translate({LOGO_MARK_INNER_TX},{LOGO_MARK_INNER_TY}) scale({LOGO_MARK_SCALE})">
{indented}
      </g>
    </g>
  </g>"""


def rings() -> str:
    lines = ['  <g id="background-rings">']
    for i, r in enumerate(RING_RADII):
        op = min(0.42, max(0.06, 0.28 - i * 0.025) * RING_OPACITY_MULT)
        dash = ' stroke-dasharray="3 7"' if i % 2 else ""
        lines.append(
            f'    <circle cx="{CX}" cy="{CY}" r="{r}" fill="none" stroke="rgba(255,48,73,{op:.3f})" stroke-width="1"{dash}/>'
        )
    lines.append("  </g>")
    return "\n".join(lines)


def background() -> str:
    vb_x, vb_y, vb_w, vb_h = (float(v) for v in VIEWBOX.split())
    return f"""  <g id="background">
    <rect x="{vb_x:.0f}" y="{vb_y:.0f}" width="{vb_w:.0f}" height="{vb_h:.0f}" fill="url(#dot-grid)"/>
    <circle id="center-ambient-glow-circle" cx="{CX}" cy="{CY}" r="{CENTER_AMBIENT_GLOW_RADIUS}" fill="url(#center-ambient-glow)"/>
  </g>"""


def nodes() -> str:
    lines = ["  <g id=\"red-nodes\">"]
    for i in range(8):
        angle = 22.5 + i * 45
        x, y = polar(angle, NODE_R)
        nid = i + 1
        lines += [
            f'    <g id="red-node-{nid}">',
            f'      <circle cx="{x:.2f}" cy="{y:.2f}" r="{NODE_GLOW_RADIUS}" fill="url(#node-glow)" opacity="{NODE_GLOW_OPACITY}"/>',
            f'      <circle cx="{x:.2f}" cy="{y:.2f}" r="4.8" fill="#FF3049"/>',
            f'      <circle cx="{x:.2f}" cy="{y:.2f}" r="2" fill="#FF8A97"/>',
            "    </g>",
        ]
    lines.append("  </g>")
    return "\n".join(lines)


def connector_circles() -> str:
    lines = ["  <g id=\"connector-circles\">"]
    for sid, angle, *_ in SERVICES:
        ix, iy = polar(angle, SERVICE_CARD_R)
        lines.append(
            f'    <circle id="connector-circle-{sid}" cx="{ix:.2f}" cy="{iy:.2f}" r="40" fill="none" stroke="rgba(255,48,73,0.1)" stroke-width="1"/>'
        )
    lines.append("  </g>")
    return "\n".join(lines)


def xml_safe(text: str) -> str:
    return text.replace("&", "&amp;")


def service_card(sid: str, angle: float, title: str, d1: str, d2: str, icon_key: str) -> str:
    ix, iy = polar(angle, SERVICE_CARD_R)
    tx = ix + SERVICE_TEXT_OFFSET_X.get(sid, 0)
    title = xml_safe(title)
    d1 = xml_safe(d1)
    d2 = xml_safe(d2)
    return f"""    <g id="service-card-{sid}" class="hero-service-card" transform="translate({ix:.2f},{iy:.2f}) scale({SERVICE_CARD_SCALE}) translate({-ix:.2f},{-iy:.2f})">
      <g id="service-card-icon-box-{sid}" transform="translate({ix:.2f},{iy:.2f})">
        <rect x="-{fmt_num(ICON_BOX_HALF)}" y="-{fmt_num(ICON_BOX_HALF)}" width="{fmt_num(ICON_BOX_SIZE)}" height="{fmt_num(ICON_BOX_SIZE)}" rx="{fmt_num(ICON_BOX_RX)}" fill="#0B1324" stroke="rgba(255,255,255,0.14)" stroke-width="{fmt_num(ICON_BOX_STROKE)}"/>
        <g id="service-icon-{sid}" class="service-icon" {icon_group_attrs()}>{render_icon(icon_key)}</g>
      </g>
      <text id="service-title-{sid}" x="{tx:.2f}" y="{iy + SERVICE_TITLE_Y_OFFSET:.2f}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="{SERVICE_TITLE_SIZE}" font-weight="800" letter-spacing="1" fill="#FFFFFF">{title}</text>
      <text id="service-desc-{sid}" x="{tx:.2f}" y="{iy + SERVICE_DESC_Y_OFFSET:.2f}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="{SERVICE_DESC_SIZE}" fill="rgba(255,255,255,0.56)">
        <tspan x="{tx:.2f}" dy="0">{d1}</tspan>
        <tspan x="{tx:.2f}" dy="{SERVICE_DESC_DY}">{d2}</tspan>
      </text>
    </g>"""


def compute_viewbox() -> str:
    """Tight crop around outermost visible artwork (viewBox only)."""
    xs: list[float] = []
    ys: list[float] = []

    def add(x: float, y: float) -> None:
        xs.append(x)
        ys.append(y)

    for r in RING_RADII:
        add(CX - r - 0.5, CY - r - 0.5)
        add(CX + r + 0.5, CY + r + 0.5)

    for _sid, angle, title, _d1, _d2, _icon in SERVICES:
        ix, iy = polar(angle, SERVICE_CARD_R)
        add(ix - 40, iy - 40)
        add(ix + 40, iy + 40)
        add(ix - ICON_BOX_HALF, iy - ICON_BOX_HALF)
        add(ix + ICON_BOX_HALF, iy + ICON_BOX_HALF)
        est_title_w = len(title) * 12.5 * 0.52
        add(ix - est_title_w / 2, iy + 46 - 12.5)
        add(ix + est_title_w / 2, iy + 64 + 14 * 2 + 2)

    for i in range(8):
        angle = 22.5 + i * 45
        nx, ny = polar(angle, NODE_R)
        add(nx - 11, ny - 11)
        add(nx + 11, ny + 11)

    add(CX - 112, CY - 112)
    add(CX + 112, CY + 112)

    min_x = min(xs) - VIEWBOX_PAD
    min_y = min(ys) - VIEWBOX_PAD
    width = max(xs) - min(xs) + VIEWBOX_PAD * 2
    height = max(ys) - min(ys) + VIEWBOX_PAD * 2
    return f"{min_x:.0f} {min_y:.0f} {width:.0f} {height:.0f}"


def main() -> None:
    cards = "\n".join(service_card(*s) for s in SERVICES)
    logo_defs, logo_body = load_official_logo_mark()
    viewbox = VIEWBOX
    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-labelledby="hero-network-title hero-network-desc">
  <title id="hero-network-title">GenZrix Service Network</title>
  <desc id="hero-network-desc">GenZrix hub-and-spoke diagram with eight connected digital service capabilities.</desc>

  <defs>
    <radialGradient id="bg-gradient" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#101A2E"/>
      <stop offset="58%" stop-color="#080F1C"/>
      <stop offset="100%" stop-color="#050912"/>
    </radialGradient>
    <pattern id="dot-grid" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="1.2" cy="1.2" r="0.9" fill="rgba(255,255,255,{DOT_GRID_OPACITY})"/>
    </pattern>
    <radialGradient id="center-ambient-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#101A2E" stop-opacity="0.07"/>
      <stop offset="52%" stop-color="#0B1324" stop-opacity="0.045"/>
      <stop offset="100%" stop-color="#0B1324" stop-opacity="0"/>
    </radialGradient>
{indent_logo_markup(logo_defs, 4)}
    <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF3049" stop-opacity="1"/>
      <stop offset="65%" stop-color="#FF3049" stop-opacity="0.144"/>
      <stop offset="100%" stop-color="#FF3049" stop-opacity="0"/>
    </radialGradient>
    <filter id="icon-premium-contrast" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="0.5" flood-color="#FFFFFF" flood-opacity="0.12"/>
    </filter>
  </defs>

  <g id="hero-network">
{background()}

{rings()}

{connector_circles()}

{nodes()}

{center_logo(logo_body)}

    <g id="orbit-particles" aria-hidden="true"></g>

    <g id="service-cards">
{cards}
    </g>
  </g>
</svg>
"""
    out = Path(__file__).resolve().parents[1] / "public" / "illustrations" / "hero-network.svg"
    out.write_text(svg, encoding="utf-8")
    print(f"Wrote {out} ({len(svg):,} bytes)")
    print(f"  CARD_R={CARD_R}, SERVICE_CARD_R={SERVICE_CARD_R}, NODE_R={NODE_R}, viewBox={viewbox}")


if __name__ == "__main__":
    main()
