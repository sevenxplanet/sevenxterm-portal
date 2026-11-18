async function showDownloads() {
  try {
    const manifest = new URL("downloads.json", document.baseURI);
    const response = await fetch(manifest, { cache: "no-cache" });
    if (!response.ok) return;
    const packages = await response.json();
    for (const group of document.querySelectorAll("[data-downloads]")) {
      const entries = packages[group.dataset.downloads];
      if (!Array.isArray(entries)) continue;
      const links = [];
      for (const entry of entries) {
        if (typeof entry?.label !== "string" || typeof entry?.url !== "string")
          continue;
        const destination = new URL(entry.url, manifest);
        if (
          destination.origin !== manifest.origin &&
          destination.protocol !== "https:"
        )
          continue;
        const link = document.createElement("a");
        link.href = destination.href;
        if (destination.origin === manifest.origin) link.download = "";
        link.textContent = entry.label;
        links.push(link);
      }
      if (links.length) group.replaceChildren(...links);
    }
  } catch {
    // An unavailable manifest leaves the default status visible.
  }
}

void showDownloads();
