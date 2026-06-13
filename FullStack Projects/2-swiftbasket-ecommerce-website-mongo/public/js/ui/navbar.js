      // JavaScript Interactions
      // Menu Toggle Logic
      const menuButton = document.getElementById("menu-button");
      const menuDropdown = document.getElementById("menu-dropdown");

      menuButton.addEventListener("click", (e) => {
        e.stopPropagation();
        menuDropdown.classList.toggle("hidden");
      });

      document.addEventListener("click", () => {
        menuDropdown.classList.add("hidden");
      });

      // Dark Mode Toggle Switch & Local Storage State Management
      const themeToggleBtn = document.getElementById("theme-toggle");
      const sunIcon = document.getElementById("theme-toggle-sun");
      const moonIcon = document.getElementById("theme-toggle-moon");

      // Sync toggle icons to current theme on load
      if (document.documentElement.classList.contains("dark")) {
        sunIcon.classList.remove("hidden");
      } else {
        moonIcon.classList.remove("hidden");
      }

      themeToggleBtn.addEventListener("click", function () {
        sunIcon.classList.toggle("hidden");
        moonIcon.classList.toggle("hidden");

        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        }
      });