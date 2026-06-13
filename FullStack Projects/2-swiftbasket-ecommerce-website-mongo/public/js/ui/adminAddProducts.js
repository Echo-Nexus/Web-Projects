
  lucide.createIcons();

  const html = document.documentElement;
  const btn = document.getElementById("themeToggle");

  btn.addEventListener("click", () => {
    html.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      html.classList.contains("dark") ? "dark" : "light"
    );
  });

  // load saved theme
  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("dark");
  }