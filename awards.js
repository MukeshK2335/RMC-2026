const awardSections = document.querySelectorAll("main > section");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const awardDialog = document.querySelector(".awards-category-dialog");
const awardDialogTitle = document.querySelector("#awards-dialog-title");
const awardDialogContent = document.querySelector(".awards-dialog-content");
const awardDialogClose = document.querySelector(".awards-dialog-close");

const awardDetails = {
  inclusive: {
    title: "Inclusive Workplace Champion",
    awardName: "The Inclusion Vanguard Spotlight Recognition",
    givenFor: "Outstanding policies, inclusive culture, and long-term support for returning mothers, recognizing organizations that set a benchmark in building a family-friendly and supportive workplace through initiatives like flexible work, parental leave, and returnship programs.",
    why: ["Recognizes long-term commitment to equity, including flexible work, parental leave, and returnship programs."],
    idealFor: ["Companies with outstanding HR policies and a proven track record."]
  },
  "peer-support": {
    title: "Peer Support Excellence Award",
    awardName: "Together We Rise Impact Recognition",
    givenFor: "Recognizing returning women who have gone above and beyond to support, mentor, or uplift other women navigating their own return-to-work journeys.",
    why: ["Honors the power of solidarity and peer support among returning women—those who turn their own comeback into a catalyst for others' success."],
    idealFor: ["Returning mothers who actively guide, mentor, or create opportunities for fellow returners in their community or workplace."]
  },
  leadership: {
    title: "Women in Leadership Excellence",
    awardName: "LeadHERship Impact Recognition",
    givenFor: "Honoring organizations with strong representation of women in leadership roles—executive, managerial, and board levels.",
    why: ["More women leaders mean more diversity, better collaboration, and inclusive decision-making."],
    idealFor: ["Organizations with a proven track record of executive diversity."]
  },
  empowerher: {
    title: "EmpowerHER Award (Skill Development & Upskilling)",
    awardName: "The EmpowerHER Spotlight Recognition",
    givenFor: "Outstanding skill-building opportunities provided to returning mothers, recognizing organizations that offered exceptional reskilling, upskilling, or training programs to support women restarting their careers.",
    why: ["Returning mothers often need upskilling to bridge the gap."],
    idealFor: ["Those offering workshops, certifications, or in-house training."]
  },
  awareness: {
    title: "Awareness Advocate",
    awardName: "Voice of Inclusion Impact Recognition",
    givenFor: "Best internal and external communication campaign promoting International Returning Mothers Programme.",
    why: ["Recognizes the commitment to equity, including advocacy for returning mothers inside and outside the organisation."],
    idealFor: ["Advocacy for returning mothers inside and outside the organisation."]
  }
};

function appendDialogList(title, items) {
  const heading = document.createElement("h3");
  heading.textContent = title;
  awardDialogContent.append(heading);

  const list = document.createElement("ul");
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.append(listItem);
  });
  awardDialogContent.append(list);
}

document.querySelectorAll(".awards-category-more").forEach((button) => {
  button.addEventListener("click", () => {
    const details = awardDetails[button.dataset.awardCategory];
    if (!details || !awardDialog || !awardDialogTitle || !awardDialogContent) {
      return;
    }

    awardDialogTitle.textContent = details.title;
    awardDialogContent.replaceChildren();

    const awardName = document.createElement("p");
    const awardNameLabel = document.createElement("strong");
    awardNameLabel.textContent = "Award Name: ";
    awardName.append(awardNameLabel, details.awardName);

    const givenFor = document.createElement("p");
    const givenForLabel = document.createElement("strong");
    givenForLabel.textContent = "Given For: ";
    givenFor.append(givenForLabel, details.givenFor);

    awardDialogContent.append(awardName, givenFor);
    appendDialogList("Why this matters", details.why);
    appendDialogList("Ideal for", details.idealFor);
    awardDialog.showModal();
  });
});

awardDialogClose?.addEventListener("click", () => awardDialog.close());

awardDialog?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    awardDialog.close();
  }
});

awardDialog?.addEventListener("click", (event) => {
  if (event.target === awardDialog) {
    awardDialog.close();
  }
});

if (reducedMotion || !("IntersectionObserver" in window)) {
  awardSections.forEach((section) => section.classList.add("is-visible"));
} else {
  document.documentElement.classList.add("awards-motion-ready");

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  awardSections.forEach((section) => sectionObserver.observe(section));
}
