document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".toggle-details");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("aria-controls");
      const details = document.getElementById(id);
      const card = btn.closest(".experience-card");
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      btn.setAttribute("aria-expanded", String(!isOpen));

      if (!isOpen) {
        details.hidden = false;
        card?.classList.add("is-open");
      } else {
        details.hidden = true;
        card?.classList.remove("is-open");
      }
    });
  });
});
