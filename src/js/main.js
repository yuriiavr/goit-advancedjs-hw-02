const sections = document.querySelectorAll(".section-link");
sections.forEach((el) => {
  el.style.width = "50%";
});

sections.forEach((item) => {
  item.addEventListener("mouseenter", (event) => {
    event.target.style.width = "70%";
    sections.forEach((el) => {
      if (el !== event.target) {
        el.style.width = "30%";
      }
    });
  });

  item.addEventListener("mouseleave", (event) => {
    sections.forEach((el) => {
      el.style.width = "50%";
    });
  });
});
