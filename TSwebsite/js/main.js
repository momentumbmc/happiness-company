/* ==========================================================================
   TradeSchool — main.js
   Behaviors: mobile nav overlay, sticky CTA bar, table scroll hints.
   No scroll-triggered animation, no parallax (§8).
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. Mobile nav overlay
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var navOverlay = document.getElementById("navOverlay");
  var navClose = document.getElementById("navClose");

  function openNav() {
    if (!navOverlay) return;
    navOverlay.classList.add("is-open");
    navOverlay.setAttribute("aria-hidden", "false");
    if (navToggle) navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    if (navClose) navClose.focus();
  }

  function closeNav() {
    if (!navOverlay) return;
    navOverlay.classList.remove("is-open");
    navOverlay.setAttribute("aria-hidden", "true");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    if (navToggle) navToggle.focus();
  }

  if (navToggle && navOverlay) {
    navToggle.addEventListener("click", function () {
      if (navOverlay.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (navClose) {
      navClose.addEventListener("click", closeNav);
    }

    navOverlay.addEventListener("click", function (e) {
      if (e.target.closest(".overlay-link")) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navOverlay.classList.contains("is-open")) {
        closeNav();
      }
    });
  }

  /* ------------------------------------------------------------------
     2. Sticky mobile CTA bar — appears after the hero scrolls past
     ------------------------------------------------------------------ */
  var stickyBar = document.getElementById("stickyCta");
  var hero = document.getElementById("hero");

  if (stickyBar && hero && "IntersectionObserver" in window) {
    var showBar = false;

    var heroObserver = new IntersectionObserver(
      function (entries) {
        showBar = !entries[0].isIntersecting;
        updateBar();
      },
      { threshold: 0 }
    );
    heroObserver.observe(hero);

    function updateBar() {
      stickyBar.classList.toggle("is-visible", showBar);
    }

    /* WCAG 2.2 2.4.11 — never let the bar obscure a focused element */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var el = document.activeElement;
      if (!el || !el.getBoundingClientRect) return;
      var rect = el.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 90) {
        stickyBar.classList.remove("is-visible");
      }
    });
  }

  /* ------------------------------------------------------------------
     3. "Scroll for more →" hints on horizontally scrollable tables
     ------------------------------------------------------------------ */
  var hints = document.querySelectorAll(".table-hint");
  var tables = document.querySelectorAll(".table-scroll");

  if (hints.length && tables.length) {
    tables.forEach(function (table) {
      var wrap = table.closest(".table-wrap");
      var hint = wrap ? wrap.parentElement.querySelector(".table-hint") : null;
      if (!hint) return;

      table.addEventListener("scroll", function () {
        if (table.scrollLeft > 8) {
          hint.classList.add("is-hidden");
        }
      });

      table.addEventListener("pointerdown", function () {
        hint.classList.add("is-hidden");
      });
    });
  }
})();