const mapView = document.querySelector(".map-view");
const appShell = document.querySelector(".app-shell");
const bottomSheet = document.querySelector(".bottom-sheet");
const recommendSheet = document.querySelector("#recommend-sheet");
const recommendButton = document.querySelector("#recommend-button");
const recommendClose = document.querySelector("#recommend-close");
const productDetailView = document.querySelector("#product-detail-view");
const detailBack = document.querySelector("#detail-back");
const detailOpen = document.querySelector("#detail-open");
const detailTabs = [...document.querySelectorAll(".detail-tab")];
const detailPanels = [...document.querySelectorAll(".detail-panel")];
const markers = [...document.querySelectorAll(".map-marker")];
const incentiveFilter = document.querySelector("#incentive-filter");
const navItems = [...document.querySelectorAll(".nav-item")];

const sheetFields = {
  name: document.querySelector("#sheet-name"),
  address: document.querySelector("#sheet-address"),
  capacity: document.querySelector("#sheet-capacity"),
  revenue: document.querySelector("#sheet-revenue"),
  incentive: document.querySelector("#sheet-incentive"),
  insight: document.querySelector("#sheet-insight"),
};

const setActiveNav = (activeLabel) => {
  navItems.forEach((navItem) => {
    const isActive = navItem.textContent.trim() === activeLabel;
    navItem.classList.toggle("active", isActive);

    if (isActive) {
      navItem.setAttribute("aria-current", "page");
    } else {
      navItem.removeAttribute("aria-current");
    }
  });
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
  productDetailView.classList.add("is-hidden");
  appShell.classList.remove("detail-mode");
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  recommendSheet.scrollTo({ top: 0, left: 0 });
  recommendSheet.classList.remove("is-hidden");
};

const hideRecommendSheet = () => {
  recommendSheet.classList.add("is-hidden");
};

const showDefaultMapSheet = () => {
  const defaultMarker = markers.find((marker) => !marker.classList.contains("is-hidden")) || markers[0];

  if (defaultMarker) {
    selectMarker(defaultMarker);
  }
};

const showProductDetail = () => {
  hideSheet();
  hideRecommendSheet();
  setActiveNav("상품");
  appShell.classList.add("detail-mode");
  productDetailView.classList.remove("is-hidden");
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  productDetailView.scrollTo({ top: 0, left: 0 });
  requestAnimationFrame(() => {
    productDetailView.scrollTo({ top: 0, left: 0 });
  });
  setTimeout(() => {
    productDetailView.scrollTo({ top: 0, left: 0 });
  }, 80);
};

const hideProductDetail = () => {
  productDetailView.classList.add("is-hidden");
  appShell.classList.remove("detail-mode");
  setActiveNav("물건");
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  appShell.scrollTop = 0;
  showDefaultMapSheet();
};

const switchDetailTab = (tabName) => {
  detailTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.detailTab === tabName);
  });

  detailPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === tabName);
  });
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
  showDefaultMapSheet();
});

detailOpen.addEventListener("click", showProductDetail);
detailBack.addEventListener("click", hideProductDetail);

detailTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchDetailTab(tab.dataset.detailTab);
  });
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const navLabel = item.textContent.trim();

    item.blur();

    if (navLabel === "물건") {
      hideRecommendSheet();
      hideProductDetail();
      return;
    }

    if (navLabel === "상품") {
      hideRecommendSheet();
      setTimeout(showProductDetail, 0);
      return;
    }

    hideRecommendSheet();
    setActiveNav(navLabel);
  });
});

incentiveFilter.addEventListener("input", applyIncentiveFilter);
applyIncentiveFilter();
