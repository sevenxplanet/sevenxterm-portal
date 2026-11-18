"""Package only public website assets and published release links."""
import json
import os
import shutil
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
out = root / "dist"
out.mkdir(exist_ok=True)
for name in ["index.html", ".nojekyll"]:
    shutil.copy2(root / name, out / name)
for name in ["portal", "product-screenshots"]:
    shutil.copytree(root / name, out / name, dirs_exist_ok=True)
repo = os.environ["PUBLIC_REPOSITORY"]
releases = json.loads(subprocess.check_output([
    "gh", "api", f"repos/{repo}/releases?per_page=100"
], text=True))
release = next((r for r in releases if not r["draft"] and not r["prerelease"]), None)
manifest = {}
if release:
    version = release["tag_name"].removeprefix("v")
    specs = [
        ("windows", "windows-amd64-installer.exe", "Windows x64 安装程序"),
        ("windows", "windows-amd64.exe", "Windows x64 免安装版"),
        ("macos", "macos-arm64.dmg", "macOS Apple Silicon"),
        ("macos", "macos-amd64.dmg", "macOS Intel"),
        ("linux", "linux-amd64.tar.gz", "Linux x64"),
    ]
    assets = {a["name"]: a for a in release["assets"]}
    for platform, suffix, label in specs:
        name = f"SevenXterm-{version}-{suffix}"
        if name in assets:
            manifest.setdefault(platform, []).append({
                "label": f"{label} · {release['tag_name']}",
                "url": assets[name]["browser_download_url"],
            })
(out / "downloads.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Prepared Portal; download platforms:", ", ".join(manifest) or "none yet")
