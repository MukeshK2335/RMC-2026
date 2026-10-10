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

const animatedSections = [...document.querySelectorAll("main > section:not(.hero):not(.about-rmc)")];

if (!reducedMotion.matches && animatedSections.length) {
  const pendingSections = new Set(animatedSections);
  let sectionObserver;

  const revealSection = (section) => {
    section.classList.add("is-visible");
    pendingSections.delete(section);
    if (pendingSections.size === 0) {
      if (sectionObserver) sectionObserver.disconnect();
      window.removeEventListener("scroll", revealSectionsInView);
      window.removeEventListener("resize", revealSectionsInView);
    }
  };

  const revealSectionsInView = () => {
    pendingSections.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > window.innerHeight * 0.1) {
        revealSection(section);
      }
    });
  };

  animatedSections.forEach((section) => {
    section.classList.add("section-reveal");
  });
  if ("IntersectionObserver" in window) {
    sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) revealSection(entry.target);
      });
    }, { threshold: 0.05 });
    animatedSections.forEach((section) => sectionObserver.observe(section));
  }
  window.addEventListener("scroll", revealSectionsInView, { passive: true });
  window.addEventListener("resize", revealSectionsInView);
  revealSectionsInView();
}

const metricsSection = document.querySelector(".metrics-section");
const metricItems = [...document.querySelectorAll(".metric-item")];

if (metricsSection && metricItems.length && !reducedMotion.matches) {
  let metricsStarted = false;
  let metricsObserver;

  const startMetrics = () => {
    if (metricsStarted) return;
    metricsStarted = true;
    if (metricsObserver) metricsObserver.disconnect();
    window.removeEventListener("scroll", checkMetricsVisibility);
    window.removeEventListener("resize", checkMetricsVisibility);

    metricItems.forEach((item) => {
      const value = item.querySelector(".metric-value");
      const target = Number(value.dataset.metricValue);
      const suffix = value.dataset.metricSuffix || "";
      const duration = 1200;
      item.classList.add("is-counting");

      const updateValue = (timestamp, startTime) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        value.textContent = `${Math.round(target * easedProgress)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame((nextTimestamp) => updateValue(nextTimestamp, startTime));
        } else {
          value.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame((timestamp) => updateValue(timestamp, timestamp));
    });
  };

  const checkMetricsVisibility = () => {
    const bounds = metricsSection.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > window.innerHeight * 0.1) {
      startMetrics();
    }
  };

  if ("IntersectionObserver" in window) {
    metricsObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) startMetrics();
    }, { threshold: 0.2 });
    metricsObserver.observe(metricsSection);
  }
  window.addEventListener("scroll", checkMetricsVisibility, { passive: true });
  window.addEventListener("resize", checkMetricsVisibility);
  checkMetricsVisibility();
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
const announcementCarousel = document.querySelector(".announcement-carousel");
const announcementDialog = document.querySelector(".announcement-dialog");
const announcementDialogImage = announcementDialog.querySelector(".announcement-dialog-image");
const announcementDialogTitle = announcementDialog.querySelector("#announcement-dialog-title");
const announcementDialogDescription = announcementDialog.querySelector(".announcement-dialog-description");
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

document.querySelectorAll("[data-announcement-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const slide = button.closest(".announcement-card");
    const image = slide.querySelector("img");
    announcementDialogImage.src = image.src;
    announcementDialogImage.alt = image.alt;
    announcementDialogTitle.textContent = slide.querySelector("h3").textContent;
    announcementDialogDescription.textContent = slide.querySelector(".announcement-card-copy > p:not(.eyebrow)").textContent;
    announcementDialog.showModal();
  });
});

announcementDialog.querySelector(".announcement-dialog-close").addEventListener("click", () => {
  announcementDialog.close();
});
announcementDialog.addEventListener("click", (event) => {
  if (event.target === announcementDialog) announcementDialog.close();
});

showAnnouncement(activeAnnouncement);

if (announcementCarousel && announcementSlides.length > 1 && !reducedMotion.matches) {
  window.setInterval(() => {
    const isPaused = announcementCarousel.matches(":hover, :focus-within");
    if (!isPaused && !announcementDialog.open && !document.hidden) {
      showAnnouncement(activeAnnouncement + 1);
    }
  }, 5_000);
}

const preEventCarousel = document.querySelector(".pre-event-carousel");
const preEventTrack = document.querySelector(".pre-event-carousel-track");
const preEventCards = [...document.querySelectorAll(".pre-event-card")];
const preEventSlideCount = document.querySelector(".pre-event-slide-count");
let activePreEvent = 0;

function getVisiblePreEventCount() {
  if (preEventCards.length < 2) return preEventCards.length;
  const step = preEventCards[1].offsetLeft - preEventCards[0].offsetLeft;
  return step > 0 ? Math.max(1, Math.round(preEventCarousel.clientWidth / step)) : 1;
}

function showPreEvent(index) {
  if (!preEventCards.length) return;
  const maxIndex = Math.max(0, preEventCards.length - getVisiblePreEventCount());
  activePreEvent = (index + maxIndex + 1) % (maxIndex + 1);
  preEventTrack.style.transform = `translateX(-${preEventCards[activePreEvent].offsetLeft - preEventCards[0].offsetLeft}px)`;
  const visibleCount = getVisiblePreEventCount();
  preEventCards.forEach((card, cardIndex) => {
    const isVisible = cardIndex >= activePreEvent && cardIndex < activePreEvent + visibleCount;
    card.setAttribute("aria-hidden", String(!isVisible));
    card.inert = !isVisible;
  });
  preEventSlideCount.textContent = `${String(activePreEvent + 1).padStart(2, "0")} / ${String(preEventCards.length).padStart(2, "0")}`;
}

document.querySelectorAll("[data-pre-event-direction]").forEach((button) => {
  button.addEventListener("click", () => {
    showPreEvent(activePreEvent + Number(button.dataset.preEventDirection));
  });
});

showPreEvent(activePreEvent);
window.addEventListener("resize", () => showPreEvent(activePreEvent));

if (preEventCarousel && preEventCards.length > 1 && !reducedMotion.matches) {
  window.setInterval(() => {
    if (!preEventCarousel.matches(":hover, :focus-within") && !document.hidden) {
      showPreEvent(activePreEvent + 1);
    }
  }, 5_000);
}

const testimonialCarousel = document.querySelector(".testimonial-carousel");
const testimonialTrack = document.querySelector(".testimonial-carousel-track");
const testimonialSlides = [...document.querySelectorAll(".testimonial-card")];
let activeTestimonial = 0;

function showTestimonial(index) {
  if (!testimonialSlides.length) return;
  const visibleCount = Math.min(2, testimonialSlides.length);
  const pageCount = Math.ceil(testimonialSlides.length / visibleCount);
  const page = ((Math.floor(index / visibleCount) % pageCount) + pageCount) % pageCount;
  activeTestimonial = page * visibleCount;
  testimonialTrack.style.transform = `translateX(-${testimonialSlides[activeTestimonial].offsetLeft - testimonialSlides[0].offsetLeft}px)`;
  testimonialSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex >= activeTestimonial && slideIndex < activeTestimonial + visibleCount;
    slide.setAttribute("aria-hidden", String(!isActive));
    slide.inert = !isActive;
  });
}

document.querySelectorAll("[data-testimonial-direction]").forEach((button) => {
  button.addEventListener("click", () => {
    showTestimonial(activeTestimonial + Number(button.dataset.testimonialDirection) * 2);
  });
});

showTestimonial(activeTestimonial);

if (testimonialCarousel && testimonialSlides.length > 1 && !reducedMotion.matches) {
  window.setInterval(() => {
    if (!testimonialCarousel.matches(":hover, :focus-within") && !document.hidden) {
      showTestimonial(activeTestimonial + 2);
    }
  }, 6_000);
}

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
