const preview = document.querySelector("#image-preview");
const previewImage = preview.querySelector("img");
const title = preview.querySelector("h2");
const close = preview.querySelector("button");
let trigger;

for (const link of document.querySelectorAll("[data-capture]")) {
  link.addEventListener("click", (event) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !preview.showModal
    )
      return;
    event.preventDefault();
    trigger = link;
    const image = link.querySelector("img");
    title.textContent = image.alt;
    previewImage.alt = image.alt;
    previewImage.src = link.href;
    preview.showModal();
  });
}

close.addEventListener("click", () => preview.close());
preview.addEventListener("click", (event) => {
  if (event.target === preview) {
    const { left, top, right, bottom } = preview.getBoundingClientRect();
    if (
      event.clientX < left ||
      event.clientX > right ||
      event.clientY < top ||
      event.clientY > bottom
    )
      preview.close();
  }
});
preview.addEventListener("close", () => {
  previewImage.removeAttribute("src");
  trigger?.focus();
});
