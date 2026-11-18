for (const carousel of document.querySelectorAll("[data-carousel]")) {
  const slides = [...carousel.querySelectorAll(".slide")];
  const controls = carousel.querySelector(".slide-controls");
  const count = carousel.querySelector(".slide-count");
  const choices = [...carousel.querySelectorAll("[data-slide-index]")];
  let active = 0;

  function select(index, updateHash = false) {
    active = (index + slides.length) % slides.length;
    for (const [position, slide] of slides.entries())
      slide.hidden = position !== active;
    count.textContent = active + 1 + " / " + slides.length;
    for (const choice of choices) {
      choice.setAttribute(
        "aria-pressed",
        String(Number(choice.dataset.slideIndex) === active),
      );
    }
    const hash = slides[active].dataset.slideHash;
    if (updateHash && hash) {
      // Keep a selected Session shareable without jumping on each click.
      try {
        history.replaceState(null, "", "#" + hash);
      } catch {
        // Local-file previews can restrict history updates.
      }
    }
  }

  carousel.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") select(0, true);
    else if (event.key === "End") select(slides.length - 1, true);
    else select(active + (event.key === "ArrowLeft" ? -1 : 1), true);
    if (event.target.closest("[data-slide-index]")) choices[active]?.focus();
    else if (event.target.closest(".slide"))
      slides[active].querySelector("a")?.focus();
  });

  carousel
    .querySelector("[data-prev]")
    .addEventListener("click", () => select(active - 1, true));
  carousel
    .querySelector("[data-next]")
    .addEventListener("click", () => select(active + 1, true));
  for (const choice of choices) {
    choice.addEventListener("click", () =>
      select(Number(choice.dataset.slideIndex), true),
    );
  }
  if (slides.length > 1) controls.hidden = false;
  select(0);

  if (carousel.hasAttribute("data-hash-slides")) {
    function showLinkedSlide() {
      const hash = location.hash.slice(1);
      const index = slides.findIndex(
        (slide) =>
          slide.dataset.slideHash === hash ||
          slide.dataset.slideAliases?.split(" ").includes(hash),
      );
      if (index < 0) return;
      select(index);
      // A deep-linked slide may initially be hidden; select it before scrolling.
      requestAnimationFrame(() =>
        carousel.closest("section").scrollIntoView({ block: "start" }),
      );
    }
    window.addEventListener("hashchange", showLinkedSlide);
    showLinkedSlide();
  }
}
