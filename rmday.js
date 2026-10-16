const rmdayEventsImage = document.querySelector(".rmday-events-image");
const rmdayEventsCount = document.querySelector(".rmday-events-count");
const rmdayEventsTitle = document.querySelector(".rmday-events-caption h3");
const rmdayEventsPagination = document.querySelector(".rmday-events-pagination");

if (rmdayEventsImage && rmdayEventsCount && rmdayEventsTitle && rmdayEventsPagination) {
  const eventPages = Array.from({ length: 26 }, (_, index) => index + 6);
  const featuredIndex = 7;
  let activeEventIndex = featuredIndex;

  const eventImageUrl = (pageNumber) => {
    const page = String(pageNumber).padStart(4, "0");
    return `https://ieeereturningmothers.in/wp-content/uploads/2025/01/Returning-Mothers-Day-Activities_page-${page}-scaled.jpg`;
  };

  const showEvent = (index) => {
    activeEventIndex = (index + eventPages.length) % eventPages.length;
    const pageNumber = eventPages[activeEventIndex];
    rmdayEventsImage.src = eventImageUrl(pageNumber);
    rmdayEventsImage.alt = `Returning Mothers Day activity gallery page ${pageNumber}`;

    if (activeEventIndex === featuredIndex) {
      rmdayEventsCount.textContent = "Event # 4";
      rmdayEventsTitle.textContent = "Children's Perspective Skit or Play";
    } else {
      rmdayEventsCount.textContent = "Returning Mothers’ Day";
      rmdayEventsTitle.textContent = "Celebrating every career journey";
    }

    rmdayEventsPagination.querySelectorAll(".rmday-events-dot").forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", String(dotIndex === activeEventIndex));
    });
  };

  eventPages.forEach((pageNumber, index) => {
    const dot = document.createElement("button");
    dot.className = "rmday-events-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to event slide ${index + 1}`);
    dot.setAttribute("aria-current", String(index === activeEventIndex));
    dot.addEventListener("click", () => showEvent(index));
    rmdayEventsPagination.append(dot);
  });

  document.querySelectorAll("[data-rmday-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      showEvent(activeEventIndex + Number(button.dataset.rmdayDirection));
    });
  });
}

const celebrationCarousel = document.querySelector(".rmday-celebration-carousel");

if (celebrationCarousel) {
  const celebrationImages = celebrationCarousel.querySelectorAll(".rmday-celebration-image");
  const celebrationPrevious = celebrationCarousel.querySelector(".rmday-celebration-previous");
  const celebrationNext = celebrationCarousel.querySelector(".rmday-celebration-next");
  const celebrationPhotos = [
    "Copy of Copy of IMG-20260910-WA0021.jpg",
    "Copy of Copy of IMG-20260910-WA0025.jpg",
    "Copy of Copy of IMG-20260919-WA0116.jpg",
    "Copy of IMG_1558.JPG",
    "Copy of IMG_1560.JPG",
    "Copy of IMG_1607.JPG",
    "IMG-20260930-WA0030.jpg",
    "IMG_5685.JPG",
    "IMG_5692.JPG",
    "IMG_5900.JPG",
    "RM DAY 2026 - SJCE.JPG",
    "WhatsApp Image 2026-09-11 at 4.28.11 PM.jpeg",
    "WhatsApp Image 2026-09-12 at 11.41.20 AM.jpeg",
    "WhatsApp Image 2026-10-07 at 12.16.18 PM (3).jpeg",
    "WhatsApp Image 2026-10-11 at 7.12.22 PM (1).jpeg",
    "WhatsApp Image 2026-10-11 at 7.12.23 PM.jpeg",
    "img_1_1791534860209.jpg",
    "img_2_1791537562100.jpg",
    "img_3_1791535002038.jpg",
    "picture-34.jpg",
  ];

  if (celebrationImages.length === 2 && celebrationPrevious && celebrationNext) {
    const photosPerSlide = celebrationImages.length;
    const slideCount = Math.ceil(celebrationPhotos.length / photosPerSlide);
    let activeSlideIndex = 0;
    let requestedSlideIndex = 0;
    let rotationTimer;
    let requestId = 0;
    let isLoading = false;

    const scheduleRotation = () => {
      window.clearTimeout(rotationTimer);
      if (!document.hidden && !isLoading) {
        rotationTimer = window.setTimeout(() => showCelebrationSlide(requestedSlideIndex + 1), 4500);
      }
    };

    const showCelebrationSlide = async (index) => {
      requestedSlideIndex = (index + slideCount) % slideCount;
      const currentRequestId = ++requestId;
      const photoIndices = Array.from({ length: photosPerSlide }, (_, imageIndex) =>
        (requestedSlideIndex * photosPerSlide + imageIndex) % celebrationPhotos.length);
      const photoUrls = photoIndices.map((photoIndex) =>
        `Rmday/${encodeURIComponent(celebrationPhotos[photoIndex])}`);
      isLoading = true;
      window.clearTimeout(rotationTimer);

      try {
        await Promise.all(photoUrls.map(async (url) => {
          const preloadedImage = new Image();
          preloadedImage.src = url;
          await preloadedImage.decode();
        }));
      } catch (error) {
        if (currentRequestId === requestId) {
          isLoading = false;
          requestedSlideIndex = activeSlideIndex;
          console.error("Unable to load the next RMDay Celebration photo pair.", error);
          scheduleRotation();
        }
        return;
      }

      if (currentRequestId !== requestId) {
        return;
      }

      activeSlideIndex = requestedSlideIndex;
      celebrationImages.forEach((image, imageIndex) => {
        const photoIndex = photoIndices[imageIndex];
        image.src = photoUrls[imageIndex];
        image.alt = `RMDay Celebration photo ${photoIndex + 1} of ${celebrationPhotos.length}`;
      });
      isLoading = false;
      scheduleRotation();
    };

    celebrationPrevious.addEventListener("click", () => {
      showCelebrationSlide(requestedSlideIndex - 1);
    });
    celebrationNext.addEventListener("click", () => {
      showCelebrationSlide(requestedSlideIndex + 1);
    });
    document.addEventListener("visibilitychange", scheduleRotation);

    showCelebrationSlide(activeSlideIndex);
  }
}
