const countdownNodes = {
  days: document.querySelector('[data-countdown="days"]'),
  hours: document.querySelector('[data-countdown="hours"]'),
  minutes: document.querySelector('[data-countdown="minutes"]'),
  seconds: document.querySelector('[data-countdown="seconds"]'),
};
const eventStart = new Date("2026-11-13T09:00:00+05:30").getTime();
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const aboutSection = document.querySelector(".about-rmc");

if (aboutSection && !reducedMotion.matches) {
  let aboutObserver;
  const revealAboutSection = () => {
    const bounds = aboutSection.getBoundingClientRect();
    const isInView = bounds.top < window.innerHeight * 0.85 && bounds.bottom > window.innerHeight * 0.15;

    if (isInView) {
      aboutSection.classList.add("is-visible");
      if (aboutObserver) aboutObserver.disconnect();
      window.removeEventListener("scroll", revealAboutSection);
      window.removeEventListener("resize", revealAboutSection);
    }
  };

  aboutSection.classList.add("has-motion");
  if ("IntersectionObserver" in window) {
    aboutObserver = new IntersectionObserver(revealAboutSection, { threshold: 0.15 });
    aboutObserver.observe(aboutSection);
  }
  window.addEventListener("scroll", revealAboutSection, { passive: true });
  window.addEventListener("resize", revealAboutSection);
  revealAboutSection();
}

if (heroSlides.length > 1 && !reducedMotion.matches) {
  let activeSlide = 0;

  window.setInterval(() => {
    heroSlides[activeSlide].classList.remove("is-active");
    activeSlide = (activeSlide + 1) % heroSlides.length;
    heroSlides[activeSlide].classList.add("is-active");
  }, 6_000);
}

const latestUpdates = [
  "Session on Building Business",
  "Returning Mothers’ Day · Ideathon & Pitchfest · Awards",
  "13–14 November 2026 · NMIT, Bengaluru",
];
const latestUpdateMessage = document.querySelector(".latest-update-message");
let activeUpdate = 0;

document.querySelectorAll("[data-update-direction]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = Number(button.dataset.updateDirection);
    activeUpdate = (activeUpdate + direction + latestUpdates.length) % latestUpdates.length;
    latestUpdateMessage.textContent = latestUpdates[activeUpdate];
  });
});

const announcementTrack = document.querySelector(".announcement-carousel-track");
const announcementSlides = [...document.querySelectorAll(".announcement-card")];
const announcementSlideCount = document.querySelector(".announcement-slide-count");
let activeAnnouncement = 0;

function showAnnouncement(index) {
  activeAnnouncement = (index + announcementSlides.length) % announcementSlides.length;
  announcementTrack.style.transform = `translateX(-${activeAnnouncement * 100}%)`;
  announcementSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeAnnouncement;
    slide.setAttribute("aria-hidden", String(!isActive));
    slide.inert = !isActive;
  });
  announcementSlideCount.textContent = `${String(activeAnnouncement + 1).padStart(2, "0")} / ${String(announcementSlides.length).padStart(2, "0")}`;
}

document.querySelectorAll("[data-announcement-direction]").forEach((button) => {
  button.addEventListener("click", () => {
    showAnnouncement(activeAnnouncement + Number(button.dataset.announcementDirection));
  });
});

showAnnouncement(activeAnnouncement);

function updateCountdown() {
  const remaining = Math.max(0, eventStart - Date.now());
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);

  countdownNodes.days.textContent = String(days).padStart(2, "0");
  countdownNodes.hours.textContent = String(hours).padStart(2, "0");
  countdownNodes.minutes.textContent = String(minutes).padStart(2, "0");
  countdownNodes.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1_000);
