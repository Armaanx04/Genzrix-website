from PIL import Image
from pathlib import Path

src = Path(
    r'C:\Users\Dell\.cursor\projects\c-Users-Dell-Genzrix-website\assets'
    r'\c__Users_Dell_AppData_Roaming_Cursor_User_workspaceStorage_4fd2d689843d1425b6020fa0c3d4ab96_images'
    r'_GenZrix_logo_white_bg-5179d08a-d1e2-4ba8-848e-03938a1464b6.png'
)
out = Path(r'c:\Users\Dell\Genzrix-website\public\genzrix-gz-nav.png')

img = Image.open(src).convert('RGBA')
w, h = img.size

top_region = img.crop((0, 0, w, int(h * 0.42)))
pixels = top_region.load()
tw, th = top_region.size

min_x, min_y = tw, th
max_x, max_y = 0, 0
for y in range(th):
    for x in range(tw):
        r, g, b, _a = pixels[x, y]
        if r < 245 or g < 245 or b < 245:
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

pad = 48
min_x = max(0, min_x - pad)
min_y = max(0, min_y - pad)
max_x = min(tw, max_x + pad)
max_y = min(th, max_y + pad)

symbol = top_region.crop((min_x, min_y, max_x, max_y))
symbol_pixels = symbol.load()
sw, sh = symbol.size
for y in range(sh):
    for x in range(sw):
        r, g, b, a = symbol_pixels[x, y]
        if r > 242 and g > 242 and b > 242:
            symbol_pixels[x, y] = (r, g, b, 0)

symbol.save(out, 'PNG')
print('Saved', out, symbol.size)
