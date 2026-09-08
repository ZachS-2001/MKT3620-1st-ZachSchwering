/**
 * nav.js
 * -----------------------------------------------------------------
 * Drop-in navigation builder shared by every page of the site.
 *
 * Usage: include this ONE file on every page, after markup like:
 *
 *   <header class="site-header">
 *     <div class="logo">Logo</div>
 *     <div class="info-graphic">...</div>
 *     <nav class="primary-nav" data-nav="primary"></nav>
 *     <nav class="secondary-nav" data-nav="secondary"></nav>
 *   </header>
 *
 *   <aside class="nav-rail" data-nav="rail"></aside>
 *
 *   <script src="nav.js"></script>
 *
 * Edit NAV_CONFIG below in this one file and every page picks up
 * the change automatically -- nothing else needs to be touched.
 * ------------------------------------------------------------- */

(function () {
  "use strict";

  /* -----------------------------------------------------------
     1. SITE-WIDE NAV CONFIG -- edit this, and only this, to add,
        remove, or reorder pages/sections.
     ----------------------------------------------------------- */
  var NAV_CONFIG = {
    primary: [
      { label: "Home", href: "index.html" },
      { label: "Person", href: "person.html" },
      { label: "Work", href: "work.html" },
      { label: "School", href: "school.html" }
    ],
    // Secondary nav can differ per top-level section. Key it by
    // the primary page's href; falls back to `default` if no
    // section-specific entry exists for the current page.
    secondary: {
      default: [
        { label: "Overview", href: "index.html" }
      ],
      "person.html": [
        { label: "Background", href: "person.html#background" },
        { label: "Strengths", href: "person.html#strengths" }
      ],
      "work.html": [
        { label: "McClure Engineering", href: "work.html#mcclure" },
        { label: "Customer Service", href: "work.html#customer-service" }
      ],
      "school.html": [
        { label: "Fort Dodge Senior High", href: "school.html#fdsh" },
        { label: "Iowa State University", href: "school.html#isu" }
      ]
    }
  };

  /* -----------------------------------------------------------
     2. Helpers
     ----------------------------------------------------------- */

  // Normalize a path down to its filename, e.g. "/site/about.html" -> "about.html"
  function currentFile() {
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf("/") + 1);
    return file === "" ? "index.html" : file;
  }

  function buildList(items, current) {
    var ul = document.createElement("ul");
    items.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      if (item.href === current) {
        a.setAttribute("aria-current", "page");
      }
      li.appendChild(a);
      ul.appendChild(li);
    });
    return ul;
  }

  function renderInto(selectorAttr, items, current) {
    var el = document.querySelector('[data-nav="' + selectorAttr + '"]');
    if (!el) return null;
    el.innerHTML = "";
    el.appendChild(buildList(items, current));
    return el;
  }

  /* -----------------------------------------------------------
     3. Mobile toggle -- one button per collapsible nav element
     ----------------------------------------------------------- */
  function addToggle(navEl, label) {
    if (!navEl) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-toggle";
    btn.textContent = label;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      var isOpen = navEl.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navEl.parentNode.insertBefore(btn, navEl);
  }

  /* -----------------------------------------------------------
     4. Init
     ----------------------------------------------------------- */
  function init() {
    var current = currentFile();

    // Header: primary nav
    var primaryEl = renderInto("primary", NAV_CONFIG.primary, current);

    // Header: secondary nav (section-specific, else default)
    var secondaryItems = NAV_CONFIG.secondary[current] || NAV_CONFIG.secondary.default;
    var secondaryEl = renderInto("secondary", secondaryItems, current);

    // Left rail duplicate (wireframe shows primary+secondary again
    // in the left column) -- only rendered if the containers exist
    renderInto("rail-primary", NAV_CONFIG.primary, current);
    renderInto("rail-secondary", secondaryItems, current);

    // Mobile toggles for the header bars
    addToggle(primaryEl, "Menu");
    addToggle(secondaryEl, "More");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
