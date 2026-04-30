const mapView = document.querySelector(".map-view");
const bottomSheet = document.querySelector(".bottom-sheet");
const recommendSheet = document.querySelector("#recommend-sheet");
const recommendButton = document.querySelector("#recommend-button");
const recommendClose = document.querySelector("#recommend-close");
const markers = [...document.querySelectorAll(".map-marker")];
const incentiveFilter = document.querySelector("#incentive-filter");
const visibleCount = document.querySelector("#visible-count");
const navItems = [...document.querySelectorAll(".nav-item")];

const sheetFields = {
  name: document.querySelector("#sheet-name"),
  address: document.querySelector("#sheet-address"),
  capacity: document.querySelector("#sheet-capacity"),
  revenue: document.querySelector("#sheet-revenue"),
  incentive: document.querySelector("#sheet-incentive"),
  insight: document.querySelector("#sheet-insight"),
};

const showSheet = () => {
  bottomSheet.classList.remove("is-hidden");
};

const hideSheet = () => {
  bottomSheet.classList.add("is-hidden");
  markers.forEach((marker) => marker.classList.remove("selected"));
};

const showRecommendSheet = () => {
  hideSheet();
  recommendSheet.classList.remove("is-hidden");
};

const hideRecommendSheet = () => {
  recommendSheet.classList.add("is-hidden");
};

const updateSheet = (marker) => {
  sheetFields.name.textContent = marker.dataset.name;
  sheetFields.address.textContent = marker.dataset.address;
  sheetFields.capacity.textContent = marker.dataset.capacity;
  sheetFields.revenue.textContent = marker.dataset.revenue;
  sheetFields.incentive.textContent = marker.dataset.incentive;
  sheetFields.insight.textContent = marker.dataset.insight;
};

const selectMarker = (marker) => {
  hideRecommendSheet();
  markers.forEach((item) => item.classList.toggle("selected", item === marker));
  updateSheet(marker);
  showSheet();
};

const applyIncentiveFilter = () => {
  const minimumIncentive = Number(incentiveFilter.value);
  let count = 0;
  let selectedMarkerStillVisible = false;

  markers.forEach((marker) => {
    const isVisible = Number(marker.dataset.incentiveValue) >= minimumIncentive;
    marker.classList.toggle("is-hidden", !isVisible);

    if (isVisible) {
      count += 1;
    }

    if (isVisible && marker.classList.contains("selected")) {
      selectedMarkerStillVisible = true;
    }
  });

  visibleCount.textContent = `내 주변 영업 가능 건물 ${count}개`;

  if (!selectedMarkerStillVisible) {
    hideSheet();
  }
};

markers.forEach((marker) => {
  marker.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!marker.classList.contains("is-hidden")) {
      selectMarker(marker);
    }
  });
});

mapView.addEventListener("click", (event) => {
  const didTapControl = event.target.closest(".map-marker, .top-bar, .map-actions, .filter-rail");

  if (!didTapControl) {
    hideSheet();
    hideRecommendSheet();
  }
});

bottomSheet.addEventListener("click", (event) => {
  event.stopPropagation();
});

recommendSheet.addEventListener("click", (event) => {
  event.stopPropagation();
});

recommendButton.addEventListener("click", (event) => {
  event.stopPropagation();
  showRecommendSheet();
});

recommendClose.addEventListener("click", () => {
  hideRecommendSheet();
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((navItem) => {
      navItem.classList.toggle("active", navItem === item);
      if (navItem === item) {
        navItem.setAttribute("aria-current", "page");
      } else {
        navItem.removeAttribute("aria-current");
      }
    });
  });
});

incentiveFilter.addEventListener("input", applyIncentiveFilter);
applyIncentiveFilter();
