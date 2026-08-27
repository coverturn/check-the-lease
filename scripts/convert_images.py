#!/usr/bin/env python3
"""Generate the .webp assets the frontend imports from the source JPEGs.

The optimised .webp files are build inputs but are kept out of version control;
run this once after cloning (requires Pillow: pip install Pillow).
"""
import os
from PIL import Image

ASSETS = os.path.join(os.path.dirname(__file__), "..", "frontend", "attached_assets")
USED = [
    "DTS_AWAY_Daniel_Faro_ID7514.jpg",
    "DTS_Chicago_to_LA_Alex_Tan_Photos_ID2713_1777779569749.jpg",
    "DTS_Chicago_to_LA_Alex_Tan_Photos_ID2720_1777779569750.jpg",
    "DTS_Chicago_to_LA_Alex_Tan_Photos_ID2721_1777779569757.jpg",
    "DTS_Chicago_to_LA_Alex_Tan_Photos_ID2722_1777779569758.jpg",
    "DTS_Chicago_to_LA_Alex_Tan_Photos_ID2723_1777779569759.jpg",
    "DTS_Home_Buyer_Mathew_Addington_Photos_ID1413_1777779569760.jpg",
    "DTS_Parenthood_Daniel_Faro_ID6899.jpg",
]

for name in USED:
    src = os.path.join(ASSETS, name)
    im = Image.open(src).convert("RGB")
    w, h = im.size
    if w > 1920:
        im = im.resize((1920, round(h * 1920 / w)), Image.LANCZOS)
    out = src[:-4] + ".webp"
    im.save(out, "WEBP", quality=78, method=6)
    print(f"{name} -> {os.path.basename(out)} ({os.path.getsize(out) // 1024} KB)")
