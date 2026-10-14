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
