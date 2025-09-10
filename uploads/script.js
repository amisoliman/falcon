// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Theme Toggle Functionality
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const icon = themeToggle.querySelector("i");

  // Check for saved theme preference, default to light mode if none exists
  const savedTheme = localStorage.getItem("theme") || "light-mode";
  body.className = savedTheme;
  updateThemeIcon(savedTheme === "dark-mode");

  // Theme toggle click handler
  themeToggle.addEventListener("click", function () {
    const isDarkMode = body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode", !isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark-mode" : "light-mode");
    updateThemeIcon(isDarkMode);
  });

  // Update theme icon
  function updateThemeIcon(isDarkMode) {
    icon.className = isDarkMode ? "fas fa-sun" : "fas fa-moon";
  }

  // Smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          navbarCollapse.classList.remove("show");
        }
      }
    });
  });

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
  const navLinks = document.querySelectorAll(".nav-link");

  function setActiveLink() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink);
  setActiveLink(); // Set initial active state
});
