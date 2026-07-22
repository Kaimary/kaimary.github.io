---
layout: page
title: Publications
permalink: /publications/
description:
years: [2026,2025,2024,2023]
publication_categories:
  - label: All
    slug: all
  - label: Infrastructure
    slug: infra
  - label: Distributed Training
    slug: distributed-training
  - label: Database
    slug: db-systems
nav: true
nav_order: 4
---
<div class="publications">
<div class="publication-filters" aria-label="Publication categories">
  {%- for category in page.publication_categories %}
    <button class="publication-filter{% if forloop.first %} active{% endif %}" type="button" data-publication-filter="{{ category.slug }}">
      {{ category.label }}
    </button>
  {%- endfor %}
</div>

{%- for y in page.years %}
<!--   <h2 class="year">{{y}}</h2> -->
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const filters = Array.from(document.querySelectorAll(".publication-filter"));
    const yearLists = Array.from(document.querySelectorAll(".publications ol.bibliography"));

    function yearItems(list) {
      return Array.from(list.children).filter(function (node) {
        return node.tagName === "LI";
      });
    }

    function applyPublicationFilter(category) {
      yearLists.forEach(function (list) {
        let visibleCount = 0;
        yearItems(list).forEach(function (item) {
          const entry = item.querySelector(".publication-entry");
          const entryCategory = entry && entry.dataset.publicationCategory ? entry.dataset.publicationCategory : "uncategorized";
          const visible = category === "all" || entryCategory === category;
          item.hidden = !visible;
          if (visible) visibleCount += 1;
        });

        list.hidden = visibleCount === 0;
        const heading = list.previousElementSibling;
        if (heading && heading.classList.contains("bibliography")) {
          heading.hidden = visibleCount === 0;
        }
      });
    }

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        filters.forEach(function (filter) {
          filter.classList.remove("active");
        });
        button.classList.add("active");
        applyPublicationFilter(button.dataset.publicationFilter);
      });
    });

    const activeFilter = document.querySelector(".publication-filter.active");
    if (activeFilter) {
      applyPublicationFilter(activeFilter.dataset.publicationFilter);
    }
  });
</script>
