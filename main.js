// main.js - lightweight animations and helpers (no external JSON)
// Safe to reuse across pages.

(function () {
  "use strict";

  // Utilities
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // Set current year in footers
  const year = new Date().getFullYear();
  ["#year","#year2","#year3","#year4"].forEach(id => {
    const el = document.querySelector(id);
    if (el) el.textContent = year;
  });

  // Page fade-in/out for smooth navigation (only for same-site internal links)
  document.addEventListener("DOMContentLoaded", () => {
    // Remove any pre-applied transition class
    document.body.classList.remove("page-transition");

    // Attach to internal links to perform fade out
    $$( "a" ).forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;
      // Skip external and anchor links
      if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) return;

      link.addEventListener("click", e => {
        // allow ctrl/cmd click to open in new tab
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        document.body.classList.add("page-transition");
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    });
  });

  // Header shrink on scroll
  const header = document.querySelector(".site-header");
  const shrinkHeader = () => {
    if (!header) return;
    if (window.scrollY > 60) header.classList.add("shrink");
    else header.classList.remove("shrink");
  };
  window.addEventListener("scroll", shrinkHeader);
  window.addEventListener("load", shrinkHeader);

  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
      navToggle.classList.toggle("open");
    });
  }

  // Simple count up when scrolled into view
  const runCounters = () => {
    const counters = document.querySelectorAll(".stat-value");
    if (!counters.length) return;

    const onEntry = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.dataset.count && !el.dataset.animated) {
            const end = parseInt(el.dataset.count, 10) || 0;
            const duration = 1200;
            let start = 0;
            const step = Math.max(1, Math.round(end / (duration / 16)));
            const id = setInterval(() => {
              start += step;
              if (start >= end) {
                el.textContent = end;
                el.dataset.animated = "true";
                clearInterval(id);
              } else el.textContent = start;
            }, 16);
          }
        }
      });
    };

    const io = new IntersectionObserver(onEntry, { threshold: 0.6 });
    counters.forEach(c => io.observe(c));
  };

  // Reveal utility for elements with .reveal-animate
  const runRevealObserver = () => {
    const items = document.querySelectorAll(".reveal-animate");
    if (!items.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    items.forEach(i => obs.observe(i));
  };

  // Contact form: basic validation and UX
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const formStatus = document.getElementById("formStatus");
      formStatus.textContent = "";
      const data = new FormData(contactForm);
      const name = data.get("name") || "";
      const email = data.get("email") || "";
      const message = data.get("message") || "";

      if (!name.trim() || !email.trim() || !message.trim()) {
        formStatus.textContent = "Please fill all fields.";
        formStatus.style.color = "crimson";
        return;
      }

      // Example: send to a third-party endpoint here
      // For now just show a success UX
      formStatus.style.color = "";
      formStatus.textContent = "Sending...";
      setTimeout(() => {
        contactForm.reset();
        formStatus.style.color = "green";
        formStatus.textContent = "Message sent. We will contact you soon.";
      }, 700);
    });
  }

  // Trigger small SVG stroke animation on AOS events
  const initAosSvg = () => {
    document.addEventListener("aos:in", ({ detail }) => {
      // when AOS triggers, SVGs with .icon-draw should animate via CSS already
      // this listener is here if we want to trigger additional JS-based animation later
    });
  };

  // Init everything on load
  window.addEventListener("load", () => {
    runCounters();
    runRevealObserver();
    initAosSvg();
  });

})();
