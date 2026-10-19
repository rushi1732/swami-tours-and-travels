import os
import shutil
import zipfile

print("Packaging Netlify distribution for swamitoursandtravels.in...")

os.makedirs('dist', exist_ok=True)

# 1. Copy config files directly into dist
for cf in ['_redirects', '_headers', 'netlify.toml', 'CNAME']:
    if os.path.exists(cf):
        shutil.copyfile(cf, os.path.join('dist', cf))

for pf in ['sitemap.xml', 'robots.txt', 'favicon.ico', 'CNAME']:
    src = os.path.join('public', pf)
    dst = os.path.join('dist', pf)
    if os.path.exists(src):
        shutil.copyfile(src, dst)

# 2. Set readable permissions on all files in dist (0644 for files, 0755 for dirs)
for root, dirs, files in os.walk('dist'):
    for d in dirs:
        os.chmod(os.path.join(root, d), 0o755)
    for f in files:
        os.chmod(os.path.join(root, f), 0o644)

# 3. Clean any existing zips inside dist
for old_zip in ['swami-tours-netlify-ready.zip', 'swami-tours-website.zip']:
    p = os.path.join('dist', old_zip)
    if os.path.exists(p):
        os.remove(p)

# 4. Create the drag-and-drop ZIP with proper attributes
# index.html MUST be at root of the zip archive
zip_name = 'swami-tours-netlify-ready.zip'
with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('dist'):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, 'dist')
            arcname = rel_path.replace(os.path.sep, '/')
            zinfo = zipfile.ZipInfo.from_file(full_path, arcname)
            zinfo.external_attr = (0o100644 << 16)
            with open(full_path, 'rb') as fp:
                z.writestr(zinfo, fp.read())

shutil.copyfile(zip_name, os.path.join('dist', zip_name))
shutil.copyfile(zip_name, 'swami-tours-website.zip')
shutil.copyfile(zip_name, os.path.join('dist', 'swami-tours-website.zip'))

print("ZIP created successfully for swamitoursandtravels.in!")
