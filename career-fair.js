const careerSections = [...document.querySelectorAll(".career-fair-page main > section")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (careerSections.length && !prefersReducedMotion.matches) {
  document.body.classList.add("career-motion-ready");

  const pendingSections = new Set(careerSections);
  let sectionObserver;

  const revealSection = (section) => {
    if (!pendingSections.has(section)) return;

    section.classList.add("is-visible");
    pendingSections.delete(section);
    sectionObserver?.unobserve(section);

    if (pendingSections.size === 0) {
      window.removeEventListener("scroll", revealVisibleSections);
      window.removeEventListener("resize", revealVisibleSections);
    }
  };

  const revealVisibleSections = () => {
    pendingSections.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.92 && bounds.bottom > window.innerHeight * 0.08) {
        revealSection(section);
      }
    });
  };

  if ("IntersectionObserver" in window) {
    sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) revealSection(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    careerSections.forEach((section) => sectionObserver.observe(section));
    careerSections.forEach((section) => sectionObserver.observe(section));
    window.addEventListener("scroll", revealVisibleSections, { passive: true });
    window.addEventListener("resize", revealVisibleSections);
    revealVisibleSections();
  } else {
    careerSections.forEach(revealSection);
  }
}
