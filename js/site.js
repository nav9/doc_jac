/**
 * Small progressive enhancements for the static site. All content is already in
 * the HTML, so every feature here only improves interaction.
 */
(function () {
  "use strict";

  var root = document.documentElement.getAttribute("data-root");
  if (root === null) root = "./";
  var config = window.DOC_J_DATA || null;

  var nav = document.querySelector(".site-nav");
  var menu_toggle = nav ? nav.querySelector(".menu-toggle") : null;
  var menu = nav ? nav.querySelector("#main-menu") : null;

  function set_menu(open) {
    if (!menu_toggle || !menu) return;
    menu_toggle.setAttribute("aria-expanded", String(open));
    menu_toggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    menu.classList.toggle("is-open", open);
  }

  if (menu_toggle) {
    menu_toggle.addEventListener("click", function () {
      set_menu(menu_toggle.getAttribute("aria-expanded") !== "true");
    });
  }

  if (menu) {
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        set_menu(false);
      });
    });
  }

  document.addEventListener("click", function (event) {
    if (!nav || !menu) return;
    if (event.target instanceof Node && !nav.contains(event.target)) set_menu(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") set_menu(false);
  });

  /* Sticky nav: becomes shorter and drops the logo after a small scroll. */
  if (nav) {
    var update_nav = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 24);
    };
    update_nav();
    window.addEventListener("scroll", update_nav, { passive: true });
  }

  /* Fade sections in as they enter the viewport. The content is visible by
     default; the observer only adds the short entrance animation, so a throttled
     or unsupported observer can never leave the page blank. */
  var reveal_items = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var reveal_observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          reveal_observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px 60px 0px" },
    );
    reveal_items.forEach(function (item) {
      reveal_observer.observe(item);
    });
  }

  /* Galleries: arrow buttons, hidden when there is nothing to scroll. */
  document.querySelectorAll(".carousel-wrap").forEach(function (wrap) {
    var track = wrap.querySelector(".image-carousel");
    var prev = wrap.querySelector(".carousel-arrow.prev");
    var next = wrap.querySelector(".carousel-arrow.next");
    if (!track) return;

    var update_arrows = function () {
      var scrollable = track.scrollWidth > track.clientWidth + 4;
      if (prev) prev.hidden = !scrollable;
      if (next) next.hidden = !scrollable;
      wrap.classList.toggle("is-scrollable", scrollable);
    };

    var scroll_track = function (direction) {
      track.scrollBy({
        left: direction * track.clientWidth * 0.8,
        behavior: "smooth",
      });
    };

    if (prev) prev.addEventListener("click", function () { scroll_track(-1); });
    if (next) next.addEventListener("click", function () { scroll_track(1); });

    update_arrows();
    window.addEventListener("resize", update_arrows);
    track.addEventListener("scroll", update_arrows, { passive: true });
    window.addEventListener("load", update_arrows);
    window.addEventListener("gallery:refresh", update_arrows);
  });

  /* Runtime gallery refresh. Each service section reads its image list from
     window.DOC_J_DATA in js/configurable_data.js, so the list can be edited
     without a server or fetch request. The server-rendered images remain the
     fallback when JavaScript is unavailable. */
  function gallery_src(folder, file) {
    return root + "gallery/" + encodeURIComponent(folder) + "/" + encodeURIComponent(file);
  }

  function load_gallery_image(folder, file) {
    var src = gallery_src(folder, file);
    return new Promise(function (resolve) {
      var probe = new Image();
      probe.onload = function () {
        resolve({ src: src, width: probe.naturalWidth, height: probe.naturalHeight });
      };
      probe.onerror = function () {
        resolve(null);
      };
      probe.src = src;
    });
  }

  function render_gallery(row, images) {
    var track = row.querySelector(".image-carousel");
    if (!track) return;

    var title = row.getAttribute("data-gallery") || "Gallery";
    var fragment = document.createDocumentFragment();

    images.forEach(function (image, index) {
      var caption = title + " — image " + (index + 1) + " of " + images.length;
      var item = document.createElement("button");
      item.type = "button";
      item.className = "gallery-item";
      item.setAttribute("data-full", image.src);
      item.setAttribute("data-caption", caption);
      item.setAttribute("aria-label", "View " + caption + " full screen");

      var picture = document.createElement("img");
      picture.src = image.src;
      picture.width = image.width;
      picture.height = image.height;
      picture.alt = caption;
      picture.loading = "lazy";
      picture.decoding = "async";

      var zoom = document.createElement("span");
      zoom.className = "gallery-zoom";
      zoom.setAttribute("aria-hidden", "true");
      var icon = document.createElement("span");
      icon.className = "icon icon-plus icon-size-16";
      icon.setAttribute("aria-hidden", "true");
      zoom.appendChild(icon);

      item.appendChild(picture);
      item.appendChild(zoom);
      fragment.appendChild(item);
    });

    track.replaceChildren(fragment);
    track.scrollLeft = 0;
    window.dispatchEvent(new Event("gallery:refresh"));
  }

  function refresh_gallery(row) {
    var folder = row.getAttribute("data-folder");
    var track = row.querySelector(".image-carousel");
    if (!folder || !track) return;

    var services = config && Array.isArray(config.services) ? config.services : [];
    var service = null;
    services.forEach(function (entry) {
      if (entry && entry.folder === folder) service = entry;
    });
    if (!service || !Array.isArray(service.images)) return;

    var files = [];
    service.images.forEach(function (name) {
      if (typeof name !== "string") return;
      var file = name.trim().split("/").pop();
      if (!/\.jpe?g$/i.test(file) || files.indexOf(file) !== -1) return;
      files.push(file);
    });
    if (!files.length) return;

    var current = Array.prototype.map.call(
      track.querySelectorAll(".gallery-item"),
      function (item) {
        return (item.getAttribute("data-full") || "").split("/").pop();
      },
    );

    var unchanged =
      files.length === current.length &&
      files.every(function (file, index) {
        return file === current[index];
      });
    if (unchanged) return;

    Promise.all(
      files.map(function (file) {
        return load_gallery_image(folder, file);
      }),
    )
      .then(function (results) {
        var images = results.filter(Boolean);
        if (!images.length) return;
        render_gallery(row, images);
      })
      .catch(function () {
        /* Keep the static gallery if the configured images cannot be loaded. */
      });
  }

  document.querySelectorAll(".service-row[data-folder]").forEach(refresh_gallery);

  /* Lightbox for gallery images. */
  var lightbox = document.getElementById("lightbox");
  var lightbox_image = lightbox ? lightbox.querySelector("img") : null;
  var lightbox_caption = lightbox ? lightbox.querySelector(".lightbox-caption") : null;
  var close_button = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  var active_items = [];
  var active_index = 0;
  var last_trigger = null;

  function open_lightbox(index) {
    if (!lightbox || !lightbox_image || !lightbox_caption || !active_items.length) return;
    active_index = (index + active_items.length) % active_items.length;
    var item = active_items[active_index];
    var image = item.querySelector("img");
    lightbox_image.src = item.dataset.full || "";
    lightbox_image.alt = image ? image.alt : "";
    lightbox_caption.textContent = item.dataset.caption || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (close_button) close_button.focus();
  }

  function close_lightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lightbox_image) {
      lightbox_image.removeAttribute("src");
      lightbox_image.alt = "";
    }
    document.body.classList.remove("modal-open");
    if (last_trigger) last_trigger.focus();
  }

  if (lightbox) {
    /* Delegated so images added by the runtime gallery refresh also open. */
    document.addEventListener("click", function (event) {
      var target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      var item = target.closest(".gallery-item");
      if (!item) return;
      var row = item.closest(".service-row");
      active_items = row
        ? Array.prototype.slice.call(row.querySelectorAll(".gallery-item"))
        : [item];
      last_trigger = item;
      open_lightbox(active_items.indexOf(item));
    });

    if (close_button) close_button.addEventListener("click", close_lightbox);

    var prev_button = lightbox.querySelector(".lightbox-prev");
    var next_button = lightbox.querySelector(".lightbox-next");
    if (prev_button) {
      prev_button.addEventListener("click", function () {
        open_lightbox(active_index - 1);
      });
    }
    if (next_button) {
      next_button.addEventListener("click", function () {
        open_lightbox(active_index + 1);
      });
    }

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) close_lightbox();
    });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") close_lightbox();
      if (event.key === "ArrowLeft") open_lightbox(active_index - 1);
      if (event.key === "ArrowRight") open_lightbox(active_index + 1);
    });
  }

  /* Consultation locations are rendered from js/configurable_data.js. Keeping
     the data out of index.html means it can be edited after the build and works
     when the page is opened directly from disk (no fetch/CORS request). */
  function make_icon(name, size) {
    var icon = document.createElement("span");
    icon.className = "icon icon-" + name + " icon-size-" + size;
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }

  function coordinates_valid(latitude, longitude) {
    return (
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      isFinite(latitude) &&
      isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  function build_location_card(location) {
    var card = document.createElement("article");
    card.className = "location-card";
    if (location.id) card.setAttribute("id", String(location.id));

    var head = document.createElement("div");
    head.className = "location-card-head";

    var name = document.createElement("h3");
    name.textContent = location.name || "Consultation location";
    head.appendChild(name);

    var type = location.type === "clinic" ? "clinic" : "hospital";
    var badge_data = location.badge && typeof location.badge === "object" ? location.badge : {};
    var badge = document.createElement("span");
    badge.className = "type-badge type-" + type;
    badge.appendChild(make_icon(badge_data.icon === "clinic" ? "clinic" : "hospital", 13));
    var badge_label = document.createElement("span");
    badge_label.textContent =
      badge_data.label || (type === "hospital" ? "Hospital" : "Clinic");
    badge.appendChild(badge_label);
    head.appendChild(badge);
    card.appendChild(head);

    var address = document.createElement("p");
    address.className = "location-address";
    address.textContent = location.address || "";
    card.appendChild(address);

    var schedule_text = [location.consultationDays, location.consultationHours]
      .filter(function (value) {
        return typeof value === "string" && value.trim();
      })
      .join(" · ");
    if (schedule_text) {
      var schedule = document.createElement("p");
      schedule.className = "location-schedule";
      schedule.textContent = schedule_text;
      card.appendChild(schedule);
    }

    var has_coordinates = coordinates_valid(location.latitude, location.longitude);

    if (location.showMap !== false && has_coordinates) {
      var shell = document.createElement("div");
      shell.className = "map-shell";
      shell.setAttribute("data-map", "");

      var loading = document.createElement("div");
      loading.className = "map-loading";
      loading.setAttribute("aria-hidden", "true");
      loading.textContent = "Loading map…";

      var frame = document.createElement("iframe");
      frame.src =
        "https://www.google.com/maps?q=" +
        location.latitude +
        "," +
        location.longitude +
        "&output=embed";
      frame.title = "Google Map showing " + name.textContent;
      frame.loading = "lazy";
      frame.setAttribute("allowfullscreen", "");
      frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");

      var fallback = document.createElement("p");
      fallback.className = "map-fallback";
      fallback.hidden = true;
      fallback.textContent =
        "The embedded map may not be available. Use Get directions for the location.";

      shell.appendChild(loading);
      shell.appendChild(frame);
      shell.appendChild(fallback);
      card.appendChild(shell);
    } else {
      var unavailable = document.createElement("p");
      unavailable.className = "map-unavailable";
      unavailable.appendChild(make_icon("map-pin", 17));
      unavailable.appendChild(
        document.createTextNode(
          has_coordinates
            ? "The map is not shown for this location."
            : "Map coordinates are not available for this location.",
        ),
      );
      card.appendChild(unavailable);
    }

    if (has_coordinates) {
      var actions = document.createElement("div");
      actions.className = "location-actions";

      var directions = document.createElement("a");
      directions.className = "btn btn-outline btn-small";
      directions.href =
        "https://www.google.com/maps/dir/?api=1&destination=" +
        location.latitude +
        "," +
        location.longitude;
      directions.target = "_blank";
      directions.rel = "noopener noreferrer";
      directions.appendChild(make_icon("navigation", 16));
      directions.appendChild(document.createTextNode("Get directions"));
      actions.appendChild(directions);
      card.appendChild(actions);
    }

    return card;
  }

  function render_consultation_locations() {
    var mount = document.querySelector("[data-locations]");
    if (!mount) return;

    var consultation = config && config.consultation;
    var sections =
      consultation && Array.isArray(consultation.sections) ? consultation.sections : [];

    if (!sections.length) {
      mount.textContent =
        "Consultation locations are unavailable. Check js/configurable_data.js.";
      return;
    }

    var fragment = document.createDocumentFragment();
    sections.forEach(function (section) {
      var block = document.createElement("section");
      block.className = "location-subsection";

      var heading = document.createElement("h3");
      heading.className = "locations-subtitle";
      heading.textContent = section.title || "Locations";
      block.appendChild(heading);

      var grid = document.createElement("div");
      grid.className = "location-grid";
      (Array.isArray(section.locations) ? section.locations : []).forEach(function (location) {
        grid.appendChild(build_location_card(location));
      });
      block.appendChild(grid);
      fragment.appendChild(block);
    });

    mount.replaceChildren(fragment);
  }

  render_consultation_locations();

  /* Maps: hide the loading note on load, and offer a link after a timeout. */
  document.querySelectorAll("[data-map]").forEach(function (shell) {
    var frame = shell.querySelector("iframe");
    var fallback = shell.querySelector(".map-fallback");
    var mark_loaded = function () {
      shell.classList.add("is-loaded");
    };

    if (frame) frame.addEventListener("load", mark_loaded);

    var start_fallback_timer = function () {
      window.setTimeout(function () {
        if (shell.classList.contains("is-loaded")) return;
        mark_loaded();
        if (fallback) fallback.hidden = false;
      }, 8000);
    };

    /* Lazy iframes may not load until they are near the viewport, so only treat
       a missing load event as a problem once the map has been approached. */
    if ("IntersectionObserver" in window) {
      var map_observer = new IntersectionObserver(
        function (entries) {
          if (
            !entries.some(function (entry) {
              return entry.isIntersecting;
            })
          ) {
            return;
          }
          map_observer.disconnect();
          start_fallback_timer();
        },
        { rootMargin: "120px" },
      );
      map_observer.observe(shell);
    } else {
      start_fallback_timer();
    }
  });

  /* Copy DIGIPIN, with a fallback for browsers without the Clipboard API. */
  function fallback_copy(value) {
    var field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    field.remove();
    return copied;
  }

  document.querySelectorAll(".copy-btn").forEach(function (button) {
    var label = button.querySelector(".copy-label");
    if (!label) return;

    button.addEventListener("click", async function () {
      var value = button.dataset.copy || "";
      var original = label.textContent || "Copy";
      var copied = false;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(value);
          copied = true;
        } catch (error) {
          copied = fallback_copy(value);
        }
      } else {
        copied = fallback_copy(value);
      }

      label.textContent = copied ? "Copied" : "Copy failed";
      window.setTimeout(function () {
        label.textContent = original;
      }, 1800);
    });
  });
})();
