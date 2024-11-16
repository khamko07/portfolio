AOS.init({
  duration: 1000,
  once: true,
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Add form input sanitization
function sanitizeInput(input) {
  return input.replace(/[^\w. ]/gi, "");
}

// Modified form submission handler
document
  .querySelector(".contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = sanitizeInput(document.getElementById("name").value);
    const email = document.getElementById("email").value;
    const message = sanitizeInput(document.getElementById("message").value);

    // Add CSRF token
    const csrfToken = Math.random().toString(36).slice(2);
    sessionStorage.setItem("csrfToken", csrfToken);

    // Form validation
    if (!name || !email || !message) {
      alert("Please fill in all fields");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter a valid email address");
      return;
    }

    alert("Thank you for your message! I will get back to you soon.");
    this.reset();
  });

// Language switcher
const languageSelect = document.getElementById("language-select");
const translations = {
  en: {
    home: "Home",
    about: "About",
    portfolio: "Portfolio",
    education: "Education",
    futurePlans: "Future Plans",
    contact: "Contact",
  },
  vi: {
    home: "Trang chủ",
    about: "Giới thiệu",
    portfolio: "Dự án",
    education: "Học vấn",
    futurePlans: "Kế hoạch",
    contact: "Liên hệ",
  },
  lo: {
    home: "ໜ້າຫຼັກ",
    about: "ກ່ຽວກັບ",
    portfolio: "ຜົນງານ",
    education: "ການສຶກສາ",
    futurePlans: "ແຜນອະນາຄົດ",
    contact: "ຕິດຕໍ່",
  },
};

languageSelect.addEventListener("change", function () {
  const lang = this.value;
  document.documentElement.lang = lang;
  document.body.style.fontFamily =
    lang === "en"
      ? "'Fira Sans Condensed', sans-serif"
      : lang === "vi"
      ? "'Oswald', sans-serif"
      : "'Noto Sans Lao', sans-serif";

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const key = link.getAttribute("href").substring(1);
    link.textContent = translations[lang][key];
  });
});

// Lightbox for portfolio items
const portfolioItems = document.querySelectorAll(".portfolio-item");
portfolioItems.forEach((item) => {
  item.addEventListener("click", function () {
    const img = this.querySelector("img");
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    document.body.appendChild(lightbox);

    const lightboxImage = document.createElement("img");
    lightboxImage.src = img.src;
    lightbox.appendChild(lightboxImage);

    lightbox.addEventListener("click", (e) => {
      if (e.target !== e.currentTarget) return;
      lightbox.remove();
    });
  });
});

// Add lazy loading to images
document.querySelectorAll("img").forEach((img) => {
  img.loading = "lazy";
});

// Update external links
document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.setAttribute("rel", "noopener noreferrer");
});

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
});

// Hide menu on window resize
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    navLinks.style.display = "flex";
  } else {
    navLinks.style.display = "none";
  }
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}
