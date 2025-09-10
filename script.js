// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Language Management
  let currentLanguage = localStorage.getItem("language") || "en";

  // Initialize language
  function initializeLanguage() {
    setLanguage(currentLanguage);
    updateLanguageDropdown();
  }

  // Set language function
  function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("language", lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update all translatable elements
    updateTranslations();
  }

  // Update translations
  function updateTranslations() {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-translate");
      const translation = getTranslation(key, currentLanguage);
      if (translation) {
        element.textContent = translation;
      }
    });
  }

  // Get translation by key
  function getTranslation(key, lang) {
    const keys = key.split(".");
    let value = translations[lang];

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return null;
      }
    }

    return value;
  }

  // Update language dropdown
  function updateLanguageDropdown() {
    const dropdownItems = document.querySelectorAll(".dropdown-item[data-lang]");
    dropdownItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("data-lang") === currentLanguage) {
        item.classList.add("active");
      }
    });
  }

  // Language dropdown event listeners
  const languageDropdownItems = document.querySelectorAll(".dropdown-item[data-lang]");
  languageDropdownItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const lang = this.getAttribute("data-lang");
      setLanguage(lang);
      updateLanguageDropdown();

      // Close mobile menu after language selection
      closeMobileMenu();
    });
  });

  // Initialize language on page load
  initializeLanguage();

  // Theme Toggle Functionality
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const icon = themeToggle.querySelector("i");

  // Check for saved theme preference, default to light mode if none exists
  let savedTheme = localStorage.getItem("theme") || "light-mode";

  // Override system dark mode preference on mobile
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // If system is in dark mode but user hasn't set a preference, start with light mode
    if (!localStorage.getItem("theme")) {
      savedTheme = "light-mode";
    }
  }

  body.className = savedTheme;
  updateThemeIcon(savedTheme === "dark-mode");

  // Theme toggle click handler
  themeToggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Remove both classes first
    body.classList.remove("dark-mode", "light-mode");

    // Toggle to the opposite theme
    const isCurrentlyDark = savedTheme === "dark-mode";
    const newTheme = isCurrentlyDark ? "light-mode" : "dark-mode";

    body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme === "dark-mode");

    // Update saved theme for next click
    savedTheme = newTheme;

    // Close mobile menu after theme toggle
    closeMobileMenu();
  });

  // Update theme icon
  function updateThemeIcon(isDarkMode) {
    if (icon) {
      icon.className = isDarkMode ? "fas fa-sun" : "fas fa-moon";
    }
  }

  // Smooth scrolling for all navigation links
  function handleNavClick(e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      // Close mobile menu first
      closeMobileMenu();

      // Check if we're on mobile
      const isMobile = window.innerWidth < 992;

      if (isMobile) {
        // On mobile: scroll to show h2 at top of viewport
        const container = target.querySelector(".container");
        if (container) {
          // Scroll to container with increased offset to ensure h2 is at top
          const containerPosition = container.offsetTop - 120; // Increased offset: 60px + 60px more
          window.scrollTo({
            top: containerPosition,
            behavior: "smooth",
          });
        } else {
          // Fallback: scroll to section with increased offset
          const targetPosition = target.offsetTop - 120;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      } else {
        // On desktop: account for fixed navbar
        const navbar = document.querySelector(".navbar");
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        // Calculate position with navbar offset
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }

      // Update URL hash without triggering scroll
      history.pushState(null, null, targetId);
    }
  }

  // Function to close mobile menu
  function closeMobileMenu() {
    const navbarCollapse = document.querySelector("#navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      // Try Bootstrap's method first
      if (window.bootstrap) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
          return;
        }
      }

      // Fallback: manually remove show class
      navbarCollapse.classList.remove("show");

      // Update toggler state
      const toggler = document.querySelector(".navbar-toggler");
      if (toggler) {
        toggler.setAttribute("aria-expanded", "false");
      }
    }
  }

  // Add click handlers to all navigation links
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });

  // Also handle navbar brand link
  const navbarBrand = document.querySelector('.navbar-brand[href^="#"]');
  if (navbarBrand) {
    navbarBrand.addEventListener("click", handleNavClick);
  }

  // Navbar scroll behavior
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.boxShadow = "none";
    }
  });

  // Initialize Bootstrap Carousel
  const carousel = document.querySelector("#heroCarousel");
  if (carousel) {
    new bootstrap.Carousel(carousel, {
      interval: 5000,
      wrap: true,
    });
  }

  // Scroll Animation
  const fadeElements = document.querySelectorAll(
    ".feature-card, .service-card, .step-card, .testimonial-card, .pricing-card, .service-list, section h2, section .lead"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  fadeElements.forEach((element) => {
    element.classList.add("fade-in");
    observer.observe(element);
  });

  // Active Nav Link
  const sections = document.querySelectorAll("section");
  const allNavLinks = document.querySelectorAll(".nav-link");

  function setActiveLink() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    allNavLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink);
  setActiveLink(); // Set initial active state
});
