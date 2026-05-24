// Initialize medium zoom.
$(document).ready(function () {
  $("[data-publication-full]").on("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    const $overlay = $("<div>", { class: "publication-zoom-overlay" });
    const $close = $("<button>", {
      class: "publication-zoom-close",
      type: "button",
      text: "×",
      "aria-label": "Close image preview",
    });
    const $image = $("<img>", {
      class: "publication-zoom-image",
      src: $(this).data("publication-full"),
      alt: $(this).attr("alt") || "",
    });

    $overlay.append($close, $image);
    $("body").append($overlay).addClass("publication-zoom-open");

    function closeOverlay() {
      $overlay.remove();
      $("body").removeClass("publication-zoom-open");
      $(document).off("keydown.publicationZoom");
    }

    $close.on("click", closeOverlay);
    $image.on("click", closeOverlay);
    $overlay.on("click", function (overlayEvent) {
      if (overlayEvent.target === $overlay[0]) closeOverlay();
    });
    $(document).on("keydown.publicationZoom", function (keyEvent) {
      if (keyEvent.key === "Escape") closeOverlay();
    });
  });

  if (typeof mediumZoom !== "undefined") {
    medium_zoom = mediumZoom("[data-zoomable]", {
      background: getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color") + "ee", // + 'ee' for trasparency.
    });
    return;
  }

  $("[data-zoomable]").on("click", function () {
    const $overlay = $("<div>", { class: "local-zoom-overlay" });
    const $image = $("<img>", {
      class: "local-zoom-image",
      src: $(this).attr("src"),
      alt: $(this).attr("alt") || "",
    });

    $overlay.append($image);
    $("body").append($overlay);
    $overlay.on("click", function () {
      $overlay.remove();
    });
  });
});
