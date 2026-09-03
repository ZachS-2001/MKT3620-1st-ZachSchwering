/**
 * Site navigation — left to right, sticky to the top of every page.
 * Drop <script src="nav.js"></script> before </body> on any page that
 * has sections with id="person", id="work", and id="schooling" and it
 * will build, style, and highlight the nav automatically.
 */
(function () {
  var NAV_ITEMS = [
    { label: "Person",    href: "#person"    },
    { label: "Work",      href: "#work"      },
    { label: "Schooling", href: "#schooling" }
  ];

  function injectStyles() {
    var css = [
      ".site-nav {",
      "  position: sticky;",
      "  top: 0;",
      "  z-index: 100;",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 4px;",
      "  padding: 14px 28px;",
      "  background: rgba(246, 243, 236, 0.92);",
      "  backdrop-filter: blur(6px);",
      "  -webkit-backdrop-filter: blur(6px);",
      "  border-bottom: 1px solid rgba(27, 36, 48, 0.14);",
      "  font-family: 'Inter', -apple-system, sans-serif;",
      "}",
      ".site-nav a {",
      "  display: inline-block;",
      "  padding: 6px 12px;",
      "  font-size: 15px;",
      "  font-weight: 500;",
      "  color: #4B5563;",
      "  text-decoration: none;",
      "  border-radius: 3px;",
      "  transition: color 0.15s ease, background 0.15s ease;",
      "}",
      ".site-nav a:hover {",
      "  color: #1B2430;",
      "  background: rgba(156, 107, 46, 0.1);",
      "}",
      ".site-nav a.is-active {",
      "  color: #1B2430;",
      "  background: rgba(156, 107, 46, 0.14);",
      "}",
      ".site-nav a:focus-visible {",
      "  outline: 2px solid #35618F;",
      "  outline-offset: 2px;",
      "}"
    ].join("\n");

    var style = document.createElement("style");
    style.setAttribute("data-source", "nav.js");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildNav() {
    var nav = document.createElement("nav");
    nav.className = "site-nav";
    nav.setAttribute("aria-label", "Primary");

    NAV_ITEMS.forEach(function (item) {
      var link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;
      link.dataset.navTarget = item.href.slice(1);
      nav.appendChild(link);
    });

    document.body.insertBefore(nav, document.body.firstChild);
    return nav;
  }

  function wireActiveState(nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
    var sections = links
      .map(function (link) {
        return document.getElementById(link.dataset.navTarget);
      })
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.dataset.navTarget === entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function init() {
    injectStyles();
    var nav = buildNav();
    wireActiveState(nav);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
