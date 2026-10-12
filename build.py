#!/usr/bin/env python3
"""Assemble a self-hostable static build in ./dist (GitHub Pages, Netlify, any static host).

  python3 build.py            # → dist/
  python3 build.py --base /   # (default) site served from the domain root

The Moda-hosted source keeps pages under pages/<route>/index.html and references a Moda-hosted icon;
this script flattens routes to the root, swaps the icon for the local one, links the static manifest,
enables the service worker and stamps the cache version with the build time.
"""
import os, re, shutil, sys, time
ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, 'dist')
BUILD = time.strftime('%Y%m%d%H%M%S')
shutil.rmtree(DIST, ignore_errors=True)
shutil.copytree(os.path.join(ROOT, 'pages'), DIST)
shutil.copytree(os.path.join(ROOT, 'assets'), os.path.join(DIST, 'assets'))
for f in ('manifest.webmanifest', 'sw.js'):
    shutil.copy(os.path.join(ROOT, 'pwa', f), os.path.join(DIST, f))
sw = os.path.join(DIST, 'sw.js'); open(sw, 'w').write(open(sw).read().replace('__BUILD__', BUILD))
icon_png = os.path.exists(os.path.join(DIST, 'assets', 'icon-512.png'))
for dirpath, _, files in os.walk(DIST):
    for f in files:
        if not f.endswith('.html'): continue
        p = os.path.join(dirpath, f); s = open(p, encoding='utf-8').read()
        s = re.sub(r'<link rel="(apple-touch-icon|icon)" href="[^"]*" />', lambda m: '<link rel="%s" href="%s" />' % (m.group(1), '/assets/icon-512.png' if icon_png else '/assets/icon.svg'), s)
        s = s.replace('<meta name="theme-color" content="#0c0e14" />', '<meta name="theme-color" content="#0c0e14" />\n<link rel="manifest" href="/manifest.webmanifest" />', 1)
        s = s.replace('<html lang="en">', '<html lang="en" data-sw="true">', 1)
        open(p, 'w', encoding='utf-8').write(s)
open(os.path.join(DIST, '.nojekyll'), 'w').close()
# Custom domain: put your domain in a file named CNAME at the repo root (see CNAME.example); it is copied into every build.
cname = os.path.join(ROOT, 'CNAME')
if os.path.exists(cname) and open(cname).read().strip():
    shutil.copy(cname, os.path.join(DIST, 'CNAME')); print('custom domain:', open(cname).read().strip())
open(os.path.join(DIST, '404.html'), 'w').write(open(os.path.join(DIST, 'index.html'), encoding='utf-8').read())
print('built dist/ (cache hrzz-v%s)%s' % (BUILD, '' if icon_png else ' — no assets/icon-512.png found, using icon.svg; add a PNG for best Android install results'))
