/* ==========================================================
   Element references
   ========================================================== */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const pageIsShop = document.body.dataset.page === "shop";

const siteHeader = document.querySelector(".site-header");
const announcementBar = document.querySelector(".announcement-bar");
const announcementText = document.querySelector(".announcement-text");

const menuToggle = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector(".main-nav");
const navigationLinks = document.querySelectorAll(".main-nav a");

const siteSearchForm = document.querySelector(".header-search");
const siteSearchInput = document.querySelector("#site-search-input");
const siteSearchButton = document.querySelector(".site-search-button");
const searchWrap = document.querySelector(".header-search-wrap");
const searchPanel = document.querySelector(".search-panel");
const searchStatus = document.querySelector(".search-status");
const searchResults = document.querySelector(".search-results");
const searchViewAll = document.querySelector(".search-viewall");
const searchSummary = document.querySelector(".search-summary");
const searchSummaryText = document.querySelector(".search-summary-text");
const searchSummaryClear = document.querySelector(".search-summary-clear");

const shopEyebrow = document.querySelector(".shop-eyebrow");
const shopTitle = document.querySelector(".shop-title");
const catalogueToolbar = document.querySelector(".catalogue-toolbar");
const categoryFilters = document.querySelector(".category-filters");
const productGrid = document.querySelector(".product-grid");
const arrivalsGrid = document.querySelector(".arrivals-grid");
const productSort = document.querySelector("#product-sort");
const noProductsMessage = document.querySelector(".no-products-message");
const resetFiltersButton = document.querySelector(".reset-filters-button");
const shopMore = document.querySelector(".shop-more");
const shopAllButton = document.querySelector(".shop-all-button");

const productDialog = document.querySelector(".product-dialog");
const dialogCloseButton = document.querySelector(".dialog-close-button");
const dialogImage = document.querySelector(".dialog-image");
const dialogThumbnails = document.querySelector(".dialog-thumbnails");
const dialogCategory = document.querySelector(".dialog-category");
const dialogTitle = document.querySelector(".dialog-title");
const dialogPrice = document.querySelector(".dialog-price");
const dialogDescription = document.querySelector(".dialog-description");
const dialogSizeOptions = document.querySelector(".size-options");
const sizeGuide = document.querySelector(".size-guide");
const sizeGuideIntro = document.querySelector(".size-guide-intro");
const sizeGuideSteps = document.querySelector(".size-guide-steps");
const dialogColourName = document.querySelector(".dialog-colour-name");
const colourOptions = document.querySelector(".colour-options");
const variantStatus = document.querySelector(".variant-status");
const dialogPolicy = document.querySelector(".dialog-policy");
const addToBagButton = document.querySelector(".add-to-bag-button");
const viewBagButton = document.querySelector(".view-bag-button");
const bagFeedback = document.querySelector(".bag-feedback");
const bagAuthLink = document.querySelector(".bag-auth-link");

const bagToggle = document.querySelector(".bag-toggle");
const bagDialog = document.querySelector(".bag-dialog");
const bagCloseButton = document.querySelector(".bag-close-button");
const bagCount = document.querySelector(".bag-count");
const bagItems = document.querySelector(".bag-items");
const bagEmpty = document.querySelector(".bag-empty");
const bagEmptyMessage = document.querySelector(".bag-empty-message");
const bagSignInLink = document.querySelector(".bag-sign-in");
const bagError = document.querySelector(".bag-error");
const bagContinueButton = document.querySelector(".bag-continue-button");
const bagSummary = document.querySelector(".bag-summary");
const bagSubtotal = document.querySelector(".bag-subtotal");
const bagTotalPrice = document.querySelector(".bag-total-price");
const checkoutButton = document.querySelector(".checkout-button");
const fulfilmentOptions = document.querySelectorAll('input[name="fulfilment"]');

const checkoutDialog = document.querySelector(".checkout-dialog");
const checkoutCloseButton = document.querySelector(".checkout-close-button");
const checkoutFormView = document.querySelector(".checkout-form-view");
const checkoutSuccessView = document.querySelector(".checkout-success");
const checkoutForm = document.querySelector(".checkout-form");
const checkoutBackButton = document.querySelector(".checkout-back-button");
const deliveryFields = document.querySelector(".delivery-fields");
const areaSelect = document.querySelector("#checkout-area");
const cityInput = document.querySelector("#checkout-city");
const placeOrderButton = document.querySelector(".place-order-button");
const checkoutSummaryItems = document.querySelector(".checkout-summary-items");
const checkoutSubtotal = document.querySelector(".checkout-subtotal");
const checkoutFulfilmentLabel = document.querySelector(".checkout-fulfilment-label");
const checkoutDelivery = document.querySelector(".checkout-delivery");
const checkoutTotal = document.querySelector(".checkout-total");

const paymentError = document.querySelector(".payment-error");
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const emailOptionalLabel = document.querySelector("#checkout-email-optional");
const emailInput = document.querySelector("#checkout-email");

const successTitle = document.querySelector(".success-title");
const successMessage = document.querySelector(".success-message");
const successOrderNumber = document.querySelector(".success-order-number");
const successItems = document.querySelector(".success-items");
const successSubtotal = document.querySelector(".success-subtotal");
const successDelivery = document.querySelector(".success-delivery");
const successTotal = document.querySelector(".success-total");
const successFulfilment = document.querySelector(".success-fulfilment");
const successPayment = document.querySelector(".success-payment");
const successReferenceRow = document.querySelector(".success-reference-row");
const successReference = document.querySelector(".success-reference");
const successPhone = document.querySelector(".success-phone");
const successNext = document.querySelector(".success-next");
const successContinueButton = document.querySelector(".success-continue-button");

const footerContact = document.querySelector(".footer-contact");
const footerYear = document.querySelector(".footer-year");

/* ==========================================================
   State
   ========================================================== */

let productCards = [];
let activeFilter = "all";
let activeSort = "featured";
let showAll = false;
let selectedProduct = null;
let selectedVariant = null;
let activeQuery = "";
let selectedFulfilment = document.querySelector('input[name="fulfilment"]:checked').value;
let addedButtonTimeout = null;
let isPlacingOrder = false;
let bagActionPending = false;
let deliveryRates = [];

const DIALOG_CLOSE_DELAY = 180;
const FALLBACK_BEST_SELLER_COUNT = 6;

const PAYMENT_LABELS = {
  cod: "Pay on delivery / pickup",
  paystack: "Paid with Paystack"
};

const PHONE_PATTERN = /^(?:\+?234|0)[789][01]\d{8}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ==========================================================
   Helpers
   ========================================================== */

function formatNaira(amount) {
  return `${storeConfig.currencySymbol}${amount.toLocaleString("en-NG")}`;
}

function getItemKey(bagItem) {
  return `${bagItem.id}::${bagItem.size}::${bagItem.colour || ""}`;
}

function getCategoryLabel(categoryId) {
  const category = productCategories.find((item) => item.id === categoryId);
  return category ? category.label : categoryId;
}

function getOrderTotals() {
  const subtotal = getBagSubtotal();
  const state = areaSelect.value;
  const city = cityInput.value.trim().toLowerCase().replace(/\s+/g, " ");
  const rate = deliveryRates.find((item) => item.state === state && item.city_lga === city) ||
    deliveryRates.find((item) => item.state === state && item.city_lga === "");
  const deliveryFee = selectedFulfilment === "pickup" ? 0 : rate?.fee_naira ?? null;

  return { subtotal, deliveryFee, total: deliveryFee === null ? null : subtotal + deliveryFee };
}

function formatOrderTotal(totals) {
  return totals.total === null ? `${formatNaira(totals.subtotal)} + delivery` : formatNaira(totals.total);
}

// Circle colours for plain colour names, so simple products still get a circle
const COLOUR_HEX = {
  black: "#111111",
  white: "#f5f5f5",
  grey: "#8a8a8a",
  gray: "#8a8a8a",
  green: "#2f6b3f",
  blue: "#2f5d9e",
  brown: "#6b4a2f",
  beige: "#d9c7a3",
  orange: "#e8792b",
  silver: "#c0c0c0",
  red: "#b3261e",
  navy: "#1f2a44",
  cream: "#f0e6d2",
  pink: "#e58fa8",
  purple: "#6b4aa0",
  yellow: "#e8c73a",
  gold: "#c9a24a"
};

// A product either has a "colours" list (several choices, see products.js) or
// plain "colour"/"image"/"imageAlt" fields (one fixed colour). Either way this
// returns a list of at least one variant, with every field filled in.
function getProductVariants(product) {
  const source =
    Array.isArray(product.colours) && product.colours.length > 0
      ? product.colours
      : [{ name: product.colour, image: product.image, imageAlt: product.imageAlt }];

  return source.map((colour) => {
    const unavailableSizes = [
      ...(product.unavailableSizes || []),
      ...(colour.unavailableSizes || [])
    ];

    const hasNoSizeLeft = product.sizes.every((size) => unavailableSizes.includes(size));

    return {
      name: colour.name,
      hex: colour.hex || COLOUR_HEX[String(colour.name).trim().toLowerCase()] || null,
      image: colour.image || product.image,
      photos: Array.isArray(colour.photos) && colour.photos.length
        ? colour.photos : [colour.image || product.image],
      imageAlt: colour.imageAlt || `${colour.name} ${product.name}`,
      price: Number.isFinite(colour.price) ? colour.price : product.price,
      unavailableSizes,
      soldOut: Boolean(product.soldOut) || Boolean(colour.soldOut) || hasNoSizeLeft
    };
  });
}

function isSizeAvailable(variant, size) {
  return !variant.soldOut && !variant.unavailableSizes.includes(size);
}

// Fades to a new picture once it has loaded, so a swap never flashes empty
function swapImage(img, src, alt) {
  if (img.getAttribute("src") === src) {
    img.alt = alt;
    return;
  }

  img.dataset.pending = src;
  img.classList.add("is-swapping");

  const preload = new Image();

  preload.onload = preload.onerror = () => {
    if (img.dataset.pending !== src) {
      return;
    }

    img.src = src;
    img.alt = alt;
    img.classList.remove("is-swapping");
  };

  preload.src = src;
}

function getCardPriceText(variant, variants) {
  const price = formatNaira(variant.price);

  return variants.every((item) => item.soldOut) ? `${price} · Sold out` : price;
}

function reconcileShoppingBag() {
  for (let index = shoppingBag.length - 1; index >= 0; index -= 1) {
    const bagItem = shoppingBag[index];
    const product = products.find((item) => item.id === bagItem.id);

    if (!product) {
      shoppingBag.splice(index, 1);
      continue;
    }

    const variants = getProductVariants(product);
    const variant = variants.find((item) => item.name === bagItem.colour) ||
      (!bagItem.colour && variants.length === 1 ? variants[0] : null);

    if (
      !variant ||
      !product.sizes.includes(bagItem.size) ||
      !isSizeAvailable(variant, bagItem.size)
    ) {
      shoppingBag.splice(index, 1);
      continue;
    }

    if (
      bagItem.name !== product.name ||
      bagItem.price !== variant.price ||
      bagItem.image !== variant.image ||
      bagItem.colour !== variant.name
    ) {
      bagItem.name = product.name;
      bagItem.price = variant.price;
      bagItem.image = variant.image;
      bagItem.colour = variant.name;
    }
  }
}

const hasBestSellerFlags = products.some((product) => product.bestSeller);

// Products marked bestSeller: true in products.js appear on the front page.
// If none are marked, the first few show instead so the page is never empty.
function isBestSeller(product, index) {
  return hasBestSellerFlags
    ? Boolean(product.bestSeller)
    : index < FALLBACK_BEST_SELLER_COUNT;
}

/* ==========================================================
   Dialogs (animated open / close, backdrop click, Esc)
   ========================================================== */

function openDialog(dialog) {
  dialog.classList.remove("is-closing");
  dialog.showModal();
}

function closeDialog(dialog) {
  if (!dialog.open || dialog.classList.contains("is-closing")) {
    return;
  }

  if (prefersReducedMotion.matches) {
    dialog.close();
    return;
  }

  dialog.classList.add("is-closing");

  setTimeout(() => {
    dialog.classList.remove("is-closing");
    dialog.close();
  }, DIALOG_CLOSE_DELAY);
}

[productDialog, bagDialog, checkoutDialog].forEach((dialog) => {
  // Esc key: use the animated close instead of the instant one
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
});

// Clicking the dark backdrop closes these two. The checkout is excluded
// on purpose, so a stray click can't wipe a half-filled form.
[productDialog, bagDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog(dialog);
    }
  });
});

/* ==========================================================
   Store details from store-config.js
   ========================================================== */

function setUpStoreDetails() {
  const announcement = storeConfig.announcement;
  if (announcement) {
    announcementText.textContent = announcement;
    announcementBar.hidden = false;
  }
  if (storeConfig.demoMode && storeConfig.orderingEnabled) {
    const expiresAt = Date.parse(storeConfig.demoEndsAt || "");
    if (Number.isFinite(expiresAt) && expiresAt > Date.now()) {
      setTimeout(() => {
        updateCheckoutButton();
      }, expiresAt - Date.now() + 100);
    }
  }

  dialogPolicy.textContent = "Nationwide delivery · Fee calculated by state and city/LGA at checkout.";

  footerYear.textContent = new Date().getFullYear();

  function addFooterLink(label, url) {
    const link = document.createElement("a");

    link.href = url;
    link.textContent = label;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    footerContact.append(link);
  }

  if (storeConfig.whatsappNumber) {
    const whatsappLink = document.createElement("a");
    const icon = document.createElement("img");

    whatsappLink.href = `https://wa.me/${storeConfig.whatsappNumber}`;
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";
    whatsappLink.className = "footer-whatsapp-link";
    icon.src = "whatsapp.svg";
    icon.alt = "";
    whatsappLink.append(icon, document.createTextNode("WhatsApp"));
    footerContact.append(whatsappLink);
  }

  if (storeConfig.instagramHandle) {
    const handle = storeConfig.instagramHandle.replace("@", "");
    addFooterLink("Instagram", `https://instagram.com/${handle}`);
  }

  (storeConfig.deliveryStates || []).forEach((area) => {
    const option = document.createElement("option");

    option.value = area;
    option.textContent = area;
    areaSelect.append(option);
  });

  setDefaultPayment();
}

/* ==========================================================
   Products: built from products.js
   ========================================================== */

function createProductCard(product, index) {
  const variants = getProductVariants(product);
  let activeVariantIndex = Math.max(0, variants.findIndex((variant) => !variant.soldOut));
  const defaultVariant = variants[activeVariantIndex];

  const card = document.createElement("article");
  const image = document.createElement("img");
  const info = document.createElement("div");
  const category = document.createElement("p");
  const title = document.createElement("h2");
  const price = document.createElement("p");
  const detailsButton = document.createElement("button");
  const arrow = document.createElement("span");

  card.className = "product-card reveal";
  if (product.placeholder) card.classList.add("is-placeholder");
  card.dataset.productId = product.id;
  card.dataset.category = product.category;
  card.dataset.price = Math.min(...variants.map((variant) => variant.price));
  card.dataset.order = index;
  card.dataset.bestSeller = String(isBestSeller(product, index));

  // Stagger the scroll-reveal across each row of three
  card.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);

  image.src = defaultVariant.image;
  image.alt = defaultVariant.imageAlt || product.name;
  image.loading = "lazy";
  image.decoding = "async";

  info.className = "product-info";
  category.className = "product-category";
  category.textContent = getCategoryLabel(product.category);
  title.textContent = product.name;
  price.className = "product-price";
  price.textContent = getCardPriceText(defaultVariant, variants);
  if (product.placeholder) category.append(" · Preview");

  detailsButton.className = "view-details-button";
  detailsButton.type = "button";
  detailsButton.append("View details ");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  detailsButton.append(arrow);

  info.append(category, title, price);

  info.append(detailsButton);
  card.append(image, info);

  // Whole card is clickable; the button inside stays for keyboard users
  card.addEventListener("click", () => openProductDialog(product, activeVariantIndex));

  card.addEventListener("animationend", () => {
    card.classList.remove("filter-in");
  });

  return card;
}

function renderProducts() {
  productGrid.replaceChildren();

  productCards = products.map((product, index) => createProductCard(product, index));
  productGrid.append(...productCards);
}

function renderNewArrivals() {
  if (!arrivalsGrid) return;

  const newest = products.filter((product) => product.newArrival).slice(0, 8);
  arrivalsGrid.replaceChildren(...newest.map((product, index) => createProductCard(product, index)));
}

function renderCategoryFilters() {
  const filters = [{ id: "all", label: "All" }, ...productCategories];

  filters.forEach((filter) => {
    const button = document.createElement("button");

    button.className = "filter-button";
    button.type = "button";
    button.dataset.filter = filter.id;
    button.textContent = filter.label;
    button.setAttribute("aria-pressed", "false");

    categoryFilters.append(button);
  });

  setActiveFilter("all");
}

function setActiveFilter(filter) {
  activeFilter = filter;

  categoryFilters.querySelectorAll(".filter-button").forEach((filterButton) => {
    const isActive = filterButton.dataset.filter === filter;

    filterButton.classList.toggle("active", isActive);
    filterButton.setAttribute("aria-pressed", String(isActive));
  });
}

function replayCardAnimation(card) {
  if (prefersReducedMotion.matches) {
    return;
  }

  card.classList.add("is-visible");
  card.classList.remove("filter-in");
  void card.offsetWidth; // restart the animation
  card.classList.add("filter-in");
}

function sortProductCards() {
  const sortedCards = [...productCards].sort((cardA, cardB) => {
    if (activeSort === "price-low") {
      return Number(cardA.dataset.price) - Number(cardB.dataset.price);
    }

    if (activeSort === "price-high") {
      return Number(cardB.dataset.price) - Number(cardA.dataset.price);
    }

    return Number(cardA.dataset.order) - Number(cardB.dataset.order);
  });

  sortedCards.forEach((card) => productGrid.append(card));
}

function updateProductVisibility(shouldAnimate = false) {
  const matchingIds = activeQuery
    ? new Set(findMatches(activeQuery).map((match) => match.product.id))
    : null;
  let visibleProductCount = 0;

  productCards.forEach((productCard) => {
    const matchesCategory = activeFilter === "all"
      || productCard.dataset.category === activeFilter
      || (activeFilter === "accessories" && ["caps", "jewellery", "totes"].includes(productCard.dataset.category));

    const matchesSearch = !matchingIds || matchingIds.has(productCard.dataset.productId);

    // Front page: best sellers only.
    // "Shop all" view: everything, narrowed by search and category.
    const shouldShow = showAll
      ? matchesCategory && matchesSearch
      : productCard.dataset.bestSeller === "true";

    productCard.hidden = !shouldShow;

    if (shouldShow) {
      visibleProductCount += 1;

      if (shouldAnimate) {
        replayCardAnimation(productCard);
      }
    }
  });

  noProductsMessage.hidden = visibleProductCount > 0;

  // "Results for ..." line, shown only while a search is applied (no counts)
  searchSummary.hidden = !(showAll && activeQuery);
  searchSummaryText.textContent = `Results for “${activeQuery}”`;
}

// Switches between the front page (best sellers) and the full catalogue
function setShopView(shouldShowAll, { scroll = true, animate = true } = {}) {
  showAll = shouldShowAll;

  catalogueToolbar.hidden = !showAll;
  categoryFilters.hidden = !showAll;

  shopEyebrow.textContent = showAll ? "The full APEX mix" : "Bestsellers";
  shopTitle.textContent = showAll ? "Everything in rotation." : "The pieces you keep picking.";
  shopAllButton.textContent = "See the full collection";

  // If every product is a best seller there is nothing more to show
  shopMore.hidden = pageIsShop || productCards.every((card) => card.dataset.bestSeller === "true");

  if (!showAll) {
    // Leave the front page clean: clear any search, filter or sort
    activeQuery = "";
    siteSearchInput.value = "";
    closeSearchPanel();
    setActiveFilter("all");
    productSort.value = "featured";
    activeSort = "featured";
    sortProductCards();
  }

  updateProductVisibility(animate);

  if (scroll) {
    document.querySelector("#shop").scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  }
}

shopAllButton.addEventListener("click", () => {
  window.location.href = "shop.html";
});

document.querySelectorAll("[data-shop-category]").forEach((tile) => {
  tile.addEventListener("click", () => showCatalogue({
    category: tile.dataset.shopCategory,
    query: tile.dataset.shopQuery || ""
  }));
});

document.querySelector(".arrivals-view-all")?.addEventListener("click", () => showCatalogue());

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");

  if (!button) {
    return;
  }

  setActiveFilter(button.dataset.filter);
  updateProductVisibility(true);
});

productSort.addEventListener("change", () => {
  activeSort = productSort.value;
  sortProductCards();
  updateProductVisibility(true);
});

resetFiltersButton.addEventListener("click", () => {
  activeQuery = "";
  siteSearchInput.value = "";
  setActiveFilter("all");
  updateProductVisibility(true);
});

searchSummaryClear.addEventListener("click", () => {
  activeQuery = "";
  siteSearchInput.value = "";
  updateProductVisibility(true);
});

/* ==========================================================
   Search: one bar in the header, live suggestions in a drop-down
   ========================================================== */

const MAX_SUGGESTIONS = 6;

// Names, categories and colours only (not descriptions), so "shirt" doesn't
// match every product that mentions a shirt in its description
// Extra words people type that aren't in a product's name (per category).
// A product can add its own with  keywords: ["trainers", "kicks"]  in products.js
const CATEGORY_SEARCH_WORDS = {
  apparel: "clothing clothes tops",
  pants: "trousers bottoms",
  shorts: "shorts bottoms summer",
  shoes: "sneakers trainers footwear kicks",
  caps: "hat hats",
  jewellery: "jewelry accessories",
  totes: "bag bags"
};

const searchIndex = products.map((product) => ({
  product,
  name: product.name.toLowerCase(),
  text: [
    product.name,
    getCategoryLabel(product.category),
    CATEGORY_SEARCH_WORDS[product.category] || "",
    ...[].concat(product.keywords || []),
    ...getProductVariants(product).map((variant) => variant.name)
  ]
    .join(" ")
    .toLowerCase()
}));

// "hoodies" -> "hoodie", "sneakers" -> "sneaker": simple plural handling
function normaliseSearchTerm(term) {
  if (term.length > 3 && term.endsWith("ies")) {
    return term.slice(0, -1);
  }

  return term.length > 3 && term.endsWith("s") && !term.endsWith("ss")
    ? term.slice(0, -1)
    : term;
}

function findMatches(query) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(normaliseSearchTerm);

  if (terms.length === 0) {
    return [];
  }

  return searchIndex
    .map((entry, order) => {
      if (!terms.every((term) => entry.text.includes(term))) {
        return null;
      }

      // Matches in the product name rank above matches elsewhere
      const score = terms.reduce((total, term) => {
        return total + (entry.name.startsWith(term) ? 3 : entry.name.includes(term) ? 2 : 1);
      }, 0);

      return { product: entry.product, score, order };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.order - b.order);
}

function closeSearchPanel() {
  searchPanel.hidden = true;
}

function openSearchPanel() {
  searchPanel.hidden = false;
  renderSearchPanel();
}

function setSearchExpanded(expanded) {
  searchWrap.classList.toggle("is-expanded", expanded);
  siteSearchButton.setAttribute("aria-expanded", String(expanded));
  siteSearchButton.setAttribute("aria-label", expanded ? "Search products" : "Open search");
  if (expanded) {
    setMenuOpen(false);
    siteSearchInput.focus({ preventScroll: true });
  } else {
    closeSearchPanel();
  }
}

// Shows the full catalogue with a search and/or category applied
function showCatalogue({ query = "", category = "all" } = {}) {
  if (!pageIsShop) {
    const parameters = new URLSearchParams();
    if (query.trim()) parameters.set("q", query.trim());
    if (category !== "all") parameters.set("category", category);
    const queryString = parameters.toString();
    window.location.href = `shop.html${queryString ? `?${queryString}` : ""}`;
    return;
  }

  setSearchExpanded(false);

  activeQuery = query.trim();
  siteSearchInput.value = activeQuery;

  setShopView(true, { scroll: false, animate: false });
  setActiveFilter(category);
  updateProductVisibility(true);

  document.querySelector("#shop").scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth"
  });
}

function renderSearchPanel() {
  const query = siteSearchInput.value.trim();
  const matches = findMatches(query);

  searchResults.replaceChildren();
  searchViewAll.hidden = matches.length <= MAX_SUGGESTIONS;

  if (query === "") {
    searchStatus.textContent = "";
    return;
  }

  searchStatus.textContent =
    matches.length === 0 ? `Nothing for “${query}” yet. Try tops, trousers or shoes.` : "";

  matches.slice(0, MAX_SUGGESTIONS).forEach(({ product }) => {
    const variants = getProductVariants(product);
    const result = document.createElement("button");
    const image = document.createElement("img");
    const text = document.createElement("span");
    const name = document.createElement("span");
    const meta = document.createElement("span");
    const price = document.createElement("span");

    result.className = "search-result";
    result.type = "button";
    image.src = variants[0].image;
    image.alt = "";
    name.className = "search-result-name";
    name.textContent = product.name;
    meta.className = "search-result-meta";
    meta.textContent = getCategoryLabel(product.category);
    price.className = "search-result-price";
    price.textContent = formatNaira(Math.min(...variants.map((variant) => variant.price)));

    result.addEventListener("click", () => {
      closeSearchPanel();
      siteSearchInput.blur();
      openProductDialog(product);
    });

    text.append(name, meta);
    result.append(image, text, price);
    searchResults.append(result);
  });
}

// The panel opens on click / typing (not on focus, so it doesn't pop open
// again when a product window closes and focus returns to the search box)
siteSearchButton.addEventListener("click", (event) => {
  if (!searchWrap.classList.contains("is-expanded")) {
    event.preventDefault();
    setSearchExpanded(true);
  }
});
siteSearchInput.addEventListener("click", () => {
  if (siteSearchInput.value.trim()) openSearchPanel();
});
siteSearchInput.addEventListener("input", openSearchPanel);

siteSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = siteSearchInput.value.trim();

  if (!query) {
    siteSearchInput.focus();
    return;
  }

  siteSearchInput.blur();
  showCatalogue({ query });
});

searchViewAll.addEventListener("click", () => {
  showCatalogue({ query: siteSearchInput.value });
});

// Close when clicking elsewhere on the page, or tabbing out of the search
document.addEventListener("pointerdown", (event) => {
  if (!searchWrap.contains(event.target)) {
    setSearchExpanded(false);
  }
});

searchWrap.addEventListener("focusout", (event) => {
  if (event.relatedTarget && !searchWrap.contains(event.relatedTarget)) {
    setSearchExpanded(false);
  }
});

// Esc closes the panel; arrow keys move between the box and the suggestions
searchWrap.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && searchWrap.classList.contains("is-expanded")) {
    event.preventDefault(); // stops the browser clearing the search box
    event.stopPropagation();
    setSearchExpanded(false);
    siteSearchButton.focus();
    return;
  }

  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return;
  }

  if (searchPanel.hidden) {
    if (event.key === "ArrowDown") {
      openSearchPanel();
    }

    return;
  }

  const items = [
    siteSearchInput,
    ...searchPanel.querySelectorAll("button")
  ].filter((item) => item.offsetParent !== null);
  const position = items.indexOf(document.activeElement);

  if (position === -1) {
    return;
  }

  event.preventDefault();

  const next = event.key === "ArrowDown" ? position + 1 : position - 1;
  items[Math.max(0, Math.min(next, items.length - 1))].focus();
});

/* ==========================================================
   Product dialog
   ========================================================== */

function resetAddToBagButton() {
  clearTimeout(addedButtonTimeout);
  addToBagButton.textContent = selectedProduct?.placeholder
    ? "Details being updated"
    : addToBagButton.disabled ? "Sold out" : "Add to bag";
  addToBagButton.classList.remove("is-added");
}

function getSelectedSize() {
  const checkedSize = productDialog.querySelector('input[name="product-size"]:checked');

  return checkedSize ? checkedSize.value : "";
}

// Sizes that don't exist in the chosen colour are shown but can't be picked
function renderSizeOptions(product, variant, preferredSize) {
  const availableSizes = product.sizes.filter((size) => isSizeAvailable(variant, size));
  const chosenSize = availableSizes.includes(preferredSize) ? preferredSize : availableSizes[0];

  dialogSizeOptions.replaceChildren();

  product.sizes.forEach((size) => {
    const sizeChip = document.createElement("label");
    const sizeInput = document.createElement("input");
    const sizeText = document.createElement("span");
    const isAvailable = availableSizes.includes(size);

    sizeChip.className = "size-chip" + (isAvailable ? "" : " is-unavailable");
    sizeChip.title = isAvailable ? "" : `Unavailable in ${variant.name}`;
    sizeInput.type = "radio";
    sizeInput.name = "product-size";
    sizeInput.value = size;
    sizeInput.disabled = !isAvailable;
    sizeInput.checked = size === chosenSize;
    sizeText.textContent = size;

    sizeChip.append(sizeInput, sizeText);
    dialogSizeOptions.append(sizeChip);
  });

  return chosenSize || "";
}

function renderSizeGuide(product) {
  const guidance = {
    apparel: ["Measure around the fullest part of your chest.", "Compare shoulder width and body length with a top you own."],
    pants: ["Measure your waist where the trousers will sit.", "Compare hip width and inseam with trousers that fit you well."],
    shorts: ["Measure your waist where the shorts will sit.", "Compare hip width and outseam with shorts that fit you well."],
    shoes: ["Measure your foot from heel to longest toe while standing.", "Check both feet and use the longer measurement when comparing sizes."],
    caps: ["Measure around your head just above your eyebrows and ears.", "Compare that circumference with the cap’s adjustable range."]
  };
  const steps = guidance[product.category];
  sizeGuide.hidden = !steps || product.sizes.length < 2;
  sizeGuide.open = false;
  if (!steps || product.sizes.length < 2) return;

  sizeGuideIntro.textContent = `Choosing ${product.name}? Use these checks before selecting a size:`;
  sizeGuideSteps.replaceChildren(...steps.map((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    return item;
  }));
}

// Selects a colour: picture, name, price, sizes and the button all follow it
function applyVariant(product, variant, { animate = true } = {}) {
  const previousSize = getSelectedSize();

  selectedVariant = variant;
  dialogColourName.textContent = variant.name;
  dialogPrice.textContent = formatNaira(variant.price);

  if (animate) {
    swapImage(dialogImage, variant.image, variant.imageAlt);
  } else {
    delete dialogImage.dataset.pending;
    dialogImage.classList.remove("is-swapping");
    dialogImage.src = variant.image;
    dialogImage.alt = variant.imageAlt;
  }

  dialogThumbnails.replaceChildren();
  dialogThumbnails.hidden = variant.photos.length < 2;
  variant.photos.forEach((photo, index) => {
    const button = document.createElement("button");
    const thumbnail = document.createElement("img");
    button.type = "button";
    button.className = "dialog-thumbnail";
    button.setAttribute("aria-label", `View photo ${index + 1} of ${variant.name}`);
    button.setAttribute("aria-pressed", String(index === 0));
    thumbnail.src = photo;
    thumbnail.alt = "";
    button.append(thumbnail);
    button.addEventListener("click", () => {
      swapImage(dialogImage, photo, `${variant.imageAlt}, photo ${index + 1}`);
      dialogThumbnails.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
    });
    dialogThumbnails.append(button);
  });

  const chosenSize = renderSizeOptions(product, variant, previousSize);

  addToBagButton.disabled = !chosenSize || product.placeholder;
  resetAddToBagButton();
  viewBagButton.hidden = true;
  bagFeedback.textContent = "";
  bagAuthLink.hidden = true;

  if (product.placeholder) {
    variantStatus.textContent = "This item is available. Photos, colours and pricing are being updated.";
  } else if (!chosenSize) {
    variantStatus.textContent = `${variant.name} is sold out.`;
  } else if (previousSize && previousSize !== chosenSize) {
    variantStatus.textContent =
      `Size ${previousSize} isn't available in ${variant.name}, so ${chosenSize} is selected.`;
  } else {
    variantStatus.textContent = "";
  }
}

function renderColourOptions(product, variants, selectedIndex) {
  // A single colour we can't draw (e.g. "Checkered") just shows its name
  const showCircles = variants.length > 1 || Boolean(variants[0].hex);

  colourOptions.replaceChildren();
  colourOptions.hidden = !showCircles;

  if (!showCircles) {
    return;
  }

  variants.forEach((variant, index) => {
    const swatch = document.createElement("label");
    const input = document.createElement("input");
    const dot = document.createElement("span");
    const label = variant.soldOut ? `${variant.name} (sold out)` : variant.name;

    swatch.className = "colour-swatch" + (variant.soldOut ? " is-unavailable" : "");
    swatch.title = label;
    input.type = "radio";
    input.name = "product-colour";
    input.value = variant.name;
    input.checked = index === selectedIndex;
    input.disabled = variant.soldOut && index !== selectedIndex;
    input.setAttribute("aria-label", label);
    dot.className = "colour-dot";
    dot.style.setProperty("--swatch-colour", variant.hex || "#cccccc");

    input.addEventListener("change", () => applyVariant(product, variant));

    swatch.append(input, dot);
    colourOptions.append(swatch);
  });
}

function openProductDialog(product, variantIndex = 0) {
  selectedProduct = product;

  const variants = getProductVariants(product);
  let startIndex = variants[variantIndex] && !variants[variantIndex].soldOut
    ? variantIndex
    : variants.findIndex((variant) => !variant.soldOut);

  if (startIndex === -1) {
    startIndex = 0;
  }

  dialogCategory.textContent = getCategoryLabel(product.category);
  dialogTitle.textContent = product.name;
  dialogDescription.textContent = product.description;

  dialogSizeOptions.replaceChildren();
  renderColourOptions(product, variants, startIndex);
  renderSizeGuide(product);
  applyVariant(product, variants[startIndex], { animate: false });

  openDialog(productDialog);
  productDialog.scrollTop = 0;
}

dialogCloseButton.addEventListener("click", () => {
  closeDialog(productDialog);
});

function bumpBagCount() {
  bagCount.classList.remove("is-bumping");
  void bagCount.offsetWidth;
  bagCount.classList.add("is-bumping");
}

addToBagButton.addEventListener("click", async () => {
  if (!selectedProduct || bagActionPending) {
    return;
  }

  const selectedSize = getSelectedSize();

  // Only a size that exists in the chosen colour can be added
  if (selectedProduct.placeholder || !selectedSize || !selectedVariant || !isSizeAvailable(selectedVariant, selectedSize)) {
    return;
  }

  if (getBagAccessState() !== "ready") {
    bagFeedback.textContent = getBagAccessState() === "signed-out"
      ? "Sign in to save this item to your bag."
      : getBagAccessState() === "loading" ? "Your account is loading. Please try again."
        : getBagAccessError();
    bagAuthLink.hidden = getBagAccessState() !== "signed-out";
    return;
  }

  bagActionPending = true;
  addToBagButton.disabled = true;
  bagAuthLink.hidden = true;
  try {
    const wasAdded = await addItemToBag({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedVariant.price,
      size: selectedSize,
      colour: selectedVariant.name,
      image: selectedVariant.image
    });
    renderBag();

    if (!wasAdded) {
      bagFeedback.textContent =
        `You already have the maximum of ${storeConfig.maxQuantityPerItem} of this item in your bag.`;
      return;
    }

    bumpBagCount();
    bagFeedback.textContent = "Added to your bag.";
    viewBagButton.hidden = false;
    addToBagButton.textContent = "Added ✓";
    addToBagButton.classList.add("is-added");
    clearTimeout(addedButtonTimeout);
    addedButtonTimeout = setTimeout(resetAddToBagButton, 1600);
  } catch (error) {
    bagFeedback.textContent = error.message || "Could not save this item. Please try again.";
  } finally {
    bagActionPending = false;
    addToBagButton.disabled = !selectedProduct || selectedProduct.placeholder ||
      !selectedVariant || !getSelectedSize() ||
      !isSizeAvailable(selectedVariant, getSelectedSize());
  }
});

viewBagButton.addEventListener("click", () => {
  productDialog.close();
  openBag();
});

/* ==========================================================
   Bag
   ========================================================== */

function openBag() {
  renderBag();
  openDialog(bagDialog);
}

function isOrderingOpen() {
  if (!storeConfig.orderingEnabled) return false;
  if (!storeConfig.demoMode) return true;
  const expiresAt = Date.parse(storeConfig.demoEndsAt || "");
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

function updateCheckoutButton() {
  checkoutButton.disabled = !isOrderingOpen() || getBagAccessState() !== "ready" ||
    shoppingBag.length === 0 || catalogueUnavailable;
  checkoutButton.textContent = isOrderingOpen()
    ? "Continue to checkout"
    : "Checkout unavailable";
  document.querySelector(".bag-save-note").textContent = isOrderingOpen()
    ? "Your picks are saved to your account. Delivery is calculated before payment."
    : "Your picks are saved to your account. Checkout is not available right now.";
}

function restoreBagFocus(bagItem, action) {
  const selector =
    `[data-item-key="${CSS.escape(getItemKey(bagItem))}"][data-action="${action}"]`;

  const target =
    bagItems.querySelector(selector) ||
    bagItems.querySelector(".bag-quantity-button, .bag-remove-button") ||
    bagCloseButton;

  target.focus();
}

async function changeQuantityAndRefocus(bagItem, change, action) {
  if (bagActionPending) return;
  bagActionPending = true;
  bagError.hidden = true;
  try {
    await changeBagItemQuantity(bagItem.id, bagItem.size, bagItem.colour, change);
    renderBag();
    restoreBagFocus(bagItem, action);
  } catch (error) {
    bagError.textContent = error.message || "Could not update your bag. Please try again.";
    bagError.hidden = false;
  } finally {
    bagActionPending = false;
  }
}

function renderBag() {
  bagItems.replaceChildren();

  if (catalogueUnavailable) {
    bagCount.textContent = "0";
    bagCount.dataset.count = "0";
    bagEmpty.hidden = false;
    bagSummary.hidden = true;
    bagSignInLink.hidden = true;
    bagError.hidden = true;
    bagEmptyMessage.textContent = "The collection is temporarily unavailable. Your saved items are safe; please try again shortly.";
    updateCheckoutButton();
    return;
  }

  const accessState = getBagAccessState();
  const itemCount = accessState === "ready" ? getBagItemCount() : 0;
  const totals = getOrderTotals();

  bagCount.textContent = itemCount;
  bagCount.dataset.count = itemCount;
  bagToggle.setAttribute(
    "aria-label",
    itemCount === 0
      ? "Open shopping bag"
      : `Open shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
  );

  bagEmpty.hidden = itemCount > 0;
  bagSummary.hidden = itemCount === 0;
  bagSignInLink.hidden = accessState !== "signed-out";
  bagEmptyMessage.textContent = accessState === "signed-out"
    ? "Sign in to see the items saved to your account."
    : accessState === "loading" ? "Loading your bag…"
      : accessState === "error" ? getBagAccessError()
        : "Nothing in your bag yet. Find a piece worth keeping.";
  if (accessState !== "ready") bagError.hidden = true;
  bagSubtotal.textContent = formatNaira(totals.subtotal);
  bagTotalPrice.textContent = formatOrderTotal(totals);

  updateCheckoutButton();

  if (accessState !== "ready") return;

  shoppingBag.forEach((bagItem) => {
    const itemKey = getItemKey(bagItem);

    const bagItemElement = document.createElement("article");
    const bagImage = document.createElement("img");
    const bagItemDetails = document.createElement("div");
    const bagItemTitle = document.createElement("h3");
    const bagItemMeta = document.createElement("p");
    const quantityControls = document.createElement("div");
    const decreaseButton = document.createElement("button");
    const quantityLabel = document.createElement("span");
    const increaseButton = document.createElement("button");
    const removeButton = document.createElement("button");
    const bagItemPrice = document.createElement("strong");

    bagItemElement.className = "bag-item";
    quantityControls.className = "bag-item-controls";
    decreaseButton.className = "bag-quantity-button";
    increaseButton.className = "bag-quantity-button";
    removeButton.className = "bag-remove-button";
    bagItemPrice.className = "bag-item-price";

    [decreaseButton, increaseButton, removeButton].forEach((button) => {
      button.type = "button";
      button.dataset.itemKey = itemKey;
    });

    decreaseButton.dataset.action = "decrease";
    increaseButton.dataset.action = "increase";
    removeButton.dataset.action = "remove";

    bagImage.src = bagItem.image;
    bagImage.alt = bagItem.name;
    bagItemTitle.textContent = bagItem.name;
    bagItemMeta.textContent = bagItem.colour
      ? `Colour: ${bagItem.colour} · Size: ${bagItem.size}`
      : `Size: ${bagItem.size}`;
    decreaseButton.textContent = "−";
    decreaseButton.setAttribute("aria-label", `Decrease ${bagItem.name} quantity`);
    quantityLabel.textContent = bagItem.quantity;
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", `Increase ${bagItem.name} quantity`);
    increaseButton.disabled = bagItem.quantity >= storeConfig.maxQuantityPerItem;
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${bagItem.name} from bag`);
    bagItemPrice.textContent = formatNaira(bagItem.price * bagItem.quantity);

    decreaseButton.addEventListener("click", () => {
      changeQuantityAndRefocus(bagItem, -1, "decrease");
    });

    increaseButton.addEventListener("click", () => {
      changeQuantityAndRefocus(bagItem, 1, "increase");
    });

    removeButton.addEventListener("click", async () => {
      if (bagActionPending) return;
      bagActionPending = true;
      bagError.hidden = true;
      try {
        await removeBagItem(bagItem.id, bagItem.size, bagItem.colour);
        renderBag();
        restoreBagFocus(bagItem, "remove");
      } catch (error) {
        bagError.textContent = error.message || "Could not remove this item. Please try again.";
        bagError.hidden = false;
      } finally {
        bagActionPending = false;
      }
    });

    quantityControls.append(decreaseButton, quantityLabel, increaseButton);
    bagItemDetails.append(bagItemTitle, bagItemMeta, quantityControls, removeButton);
    bagItemElement.append(bagImage, bagItemDetails, bagItemPrice);
    bagItems.append(bagItemElement);
  });
}

bagToggle.addEventListener("click", openBag);
checkoutButton.addEventListener("click", () => {
  if (!checkoutButton.disabled) {
    bagDialog.close();
    openCheckout();
  }
});

bagCloseButton.addEventListener("click", () => {
  closeDialog(bagDialog);
});

bagContinueButton.addEventListener("click", () => {
  closeDialog(bagDialog);
  document.querySelector("#shop").scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth"
  });
});

fulfilmentOptions.forEach((fulfilmentOption) => {
  fulfilmentOption.addEventListener("change", () => {
    selectedFulfilment = fulfilmentOption.value;
    renderBag();
    updatePaymentUI();
  });
});

window.addEventListener("bag-change", () => {
  if (!catalogueUnavailable && getBagAccessState() === "ready") {
    reconcileShoppingBag();
  }
  renderBag();
});

/* ==========================================================
   Checkout
   ========================================================== */

// Builds the list of items shown in the checkout summary and the confirmation
function renderOrderLines(container, items) {
  container.replaceChildren();

  items.forEach((item) => {
    const line = document.createElement("div");
    const thumb = document.createElement("div");
    const image = document.createElement("img");
    const quantityBadge = document.createElement("span");
    const details = document.createElement("div");
    const name = document.createElement("p");
    const meta = document.createElement("p");
    const price = document.createElement("strong");

    line.className = "summary-item";
    thumb.className = "summary-thumb";
    quantityBadge.className = "summary-qty";
    name.className = "summary-name";
    meta.className = "summary-meta";
    price.className = "summary-price";

    image.src = item.image;
    image.alt = "";
    quantityBadge.textContent = item.quantity;
    quantityBadge.setAttribute("aria-hidden", "true");
    name.textContent = item.name;
    meta.textContent = item.colour
      ? `${item.colour} · Size: ${item.size} · Qty: ${item.quantity}`
      : `Size: ${item.size} · Qty: ${item.quantity}`;
    price.textContent = formatNaira(item.price * item.quantity);

    thumb.append(image, quantityBadge);
    details.append(name, meta);
    line.append(thumb, details, price);
    container.append(line);
  });
}

function updatePlaceOrderLabel() {
  const total = formatOrderTotal(getOrderTotals());
  placeOrderButton.textContent = `${getSelectedPayment() === "paystack" ? "Pay with Paystack" : "Place order"} · ${total}`;
}

function renderCheckoutSummary() {
  const totals = getOrderTotals();

  renderOrderLines(checkoutSummaryItems, shoppingBag);

  checkoutSubtotal.textContent = formatNaira(totals.subtotal);
  checkoutFulfilmentLabel.textContent =
    selectedFulfilment === "delivery" ? "Delivery" : "Pickup";
  checkoutDelivery.textContent = totals.deliveryFee === null
    ? "Quoted by location" : totals.deliveryFee > 0 ? formatNaira(totals.deliveryFee) : "Free";
  checkoutTotal.textContent = formatOrderTotal(totals);

  updatePlaceOrderLabel();
}

function showCheckoutView(view) {
  checkoutFormView.hidden = view !== "form";
  checkoutSuccessView.hidden = view !== "success";
}

/* ----- Validation ----- */

function getCheckoutInputs() {
  return Array.from(
    checkoutForm.querySelectorAll(
      ".form-field input, .form-field select, .form-field textarea"
    )
  );
}

function getFieldError(input) {
  const value = input.value.trim();
  const isDelivery = selectedFulfilment === "delivery";

  switch (input.name) {
    case "name":
      return value.length < 2 ? "Please enter your full name." : "";

    case "phone":
      return PHONE_PATTERN.test(value.replace(/[\s-]/g, ""))
        ? ""
        : "Enter a valid Nigerian phone number, e.g. 0801 234 5678.";

    case "email":
      return !value || EMAIL_PATTERN.test(value) ? "" : "Enter a valid email address.";

    case "area":
      return isDelivery && !value ? "Please choose your state." : "";

    case "city":
      return isDelivery && value.length < 2 ? "Please enter your city or LGA." : "";

    case "address":
      return isDelivery && value.length < 6
        ? "Please enter your full delivery address."
        : "";

    default:
      return "";
  }
}

function setFieldError(input, message) {
  const field = input.closest(".form-field");
  const errorElement = field.querySelector(".field-error");

  if (errorElement) {
    errorElement.textContent = message;
  }

  field.classList.toggle("has-error", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function clearCheckoutErrors() {
  getCheckoutInputs().forEach((input) => setFieldError(input, ""));
}

function validateCheckoutForm() {
  let firstInvalidInput = null;

  getCheckoutInputs().forEach((input) => {
    const message = getFieldError(input);

    setFieldError(input, message);

    if (message && !firstInvalidInput) {
      firstInvalidInput = input;
    }
  });

  if (firstInvalidInput) {
    firstInvalidInput.focus();
  }

  return !firstInvalidInput;
}

// Check a field once the person leaves it (only if they typed something)
checkoutForm.addEventListener("focusout", (event) => {
  const input = event.target;

  if (input.closest(".form-field") && input.value.trim() !== "") {
    setFieldError(input, getFieldError(input));
  }
});

// Once a field shows an error, clear it as soon as the value becomes valid
checkoutForm.addEventListener("input", (event) => {
  const input = event.target;
  const field = input.closest(".form-field");

  if (field && field.classList.contains("has-error")) {
    setFieldError(input, getFieldError(input));
  }
});

areaSelect.addEventListener("change", () => {
  renderCheckoutSummary();
  updatePaymentUI();
});
cityInput.addEventListener("input", renderCheckoutSummary);

function getSelectedPayment() {
  return checkoutForm.querySelector('input[name="payment"]:checked').value;
}

function setDefaultPayment() {
  checkoutForm.querySelector('input[name="payment"][value="paystack"]').checked = true;
}

function updatePaymentUI() {
  emailOptionalLabel.hidden = true;
  const codRadio = checkoutForm.querySelector('input[name="payment"][value="cod"]');
  codRadio.closest("label").hidden = Boolean(storeConfig.demoMode);
  codRadio.disabled = Boolean(storeConfig.demoMode) ||
    selectedFulfilment === "delivery" && areaSelect.value !== "Lagos";
  if (codRadio.disabled && codRadio.checked) setDefaultPayment();
  paymentError.hidden = true;

  // If the email box already shows an error, re-check it for the new method
  if (emailInput.closest(".form-field").classList.contains("has-error")) {
    setFieldError(emailInput, getFieldError(emailInput));
  }

  updatePlaceOrderLabel();
}

function showPaymentProblem(message) {
  paymentError.textContent = message;
  paymentError.hidden = false;

  isPlacingOrder = false;
  placeOrderButton.disabled = false;
  updatePlaceOrderLabel();
}

paymentRadios.forEach((paymentRadio) => {
  paymentRadio.addEventListener("change", updatePaymentUI);
});

/* ----- Opening, placing, confirming ----- */

async function openCheckout() {
  if (shoppingBag.length === 0) {
    return;
  }

  const { data, error } = await bagClient.auth.getUser();
  if (error || !data.user?.email) {
    bagError.textContent = "Sign in again before checking out.";
    bagError.hidden = false;
    openBag();
    return;
  }
  emailInput.value = data.user.email;
  checkoutDialog.querySelector(".checkout-demo-notice").hidden = !storeConfig.demoMode;

  clearCheckoutErrors();
  showCheckoutView("form");
  renderCheckoutSummary();
  updatePaymentUI();

  deliveryFields.hidden = selectedFulfilment !== "delivery";

  openDialog(checkoutDialog);
  checkoutDialog.scrollTop = 0;
}

function getNextStepsText(order) {
  if (storeConfig.demoMode) return "Test checkout complete. No money was collected and nothing will be shipped.";
  const phone = order.customer.phone;

  if (order.payment === "paystack") {
    return `Payment confirmed. We'll contact ${phone} with the next update about your order.`;
  }

  if (order.fulfilment === "pickup") {
    return `We'll call ${phone} to confirm your pickup time. You pay when you collect.`;
  }

  const deliveryTime = order.customer.area === "Lagos"
    ? storeConfig.lagosDeliveryTime : storeConfig.nationwideDeliveryTime;
  return `We'll call ${phone} to confirm your order. Delivery takes ${deliveryTime} after confirmation.`;
}

function renderSuccess(order) {
  const firstName = order.customer.name.split(" ")[0];

  successTitle.textContent = storeConfig.demoMode ? "Checkout preview complete" : "Order placed";
  successMessage.textContent = storeConfig.demoMode
    ? `Thanks, ${firstName}. This was a test order; nothing will be delivered.`
    : `Thanks, ${firstName}. Your order has been received.`;
  successOrderNumber.textContent = order.number;

  renderOrderLines(successItems, order.items);

  successSubtotal.textContent = formatNaira(order.totals.subtotal);
  successDelivery.textContent = order.totals.deliveryFee === null
    ? "Quoted by location" : order.totals.deliveryFee > 0 ? formatNaira(order.totals.deliveryFee) : "Free";
  successTotal.textContent = formatOrderTotal(order.totals);

  successFulfilment.textContent =
    order.fulfilment === "delivery" ? `Delivery · ${order.customer.city}, ${order.customer.area}` : "Pickup";
  successPayment.textContent = storeConfig.demoMode ? "Paystack test payment" : PAYMENT_LABELS[order.payment];
  successReferenceRow.hidden = !order.paymentReference;
  successReference.textContent = order.paymentReference || "";
  successPhone.textContent = order.customer.phone;
  successNext.textContent = getNextStepsText(order);
}

function buildOrderFromForm() {
  const formData = new FormData(checkoutForm);
  const getValue = (fieldName) => String(formData.get(fieldName) || "").trim();
  const isDelivery = selectedFulfilment === "delivery";

  return {
    action: "start",
    fulfilment: selectedFulfilment,
    payment: getValue("payment"),
    customer: {
      name: getValue("name"),
      phone: getValue("phone"),
      area: isDelivery ? getValue("area") : "",
      city: isDelivery ? getValue("city") : "",
      address: isDelivery ? getValue("address") : "",
      notes: getValue("notes")
    }
  };
}

function orderFromSaved(saved) {
  return {
    number: saved.order_number,
    items: saved.items,
    totals: {
      subtotal: saved.subtotal_naira,
      deliveryFee: saved.delivery_fee_naira,
      total: saved.total_naira
    },
    fulfilment: saved.fulfilment,
    payment: saved.payment_method,
    paymentReference: saved.paystack_reference,
    customer: {
      name: saved.customer_name,
      phone: saved.customer_phone,
      area: saved.delivery_state,
      city: saved.delivery_city
    }
  };
}

async function invokeCheckout(body) {
  const { data, error } = await bagClient.functions.invoke("checkout", { body });
  if (error) {
    let message = "Checkout is temporarily unavailable. Please try again.";
    try {
      const details = await error.context?.json();
      if (details?.error) message = details.error;
    } catch {
    }
    throw new Error(message);
  }
  return data;
}

async function finishOrder(order) {
  if (getBagAccessState() === "loading") {
    await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        window.removeEventListener("bag-change", onBagChange);
        resolve();
      }, 5000);
      function onBagChange() {
        if (getBagAccessState() === "loading") return;
        clearTimeout(timeout);
        window.removeEventListener("bag-change", onBagChange);
        resolve();
      }
      window.addEventListener("bag-change", onBagChange);
    });
  }
  try {
    for (const purchased of order.items) {
      const saved = shoppingBag.find((item) => isSameBagItem(item, purchased.id, purchased.size, purchased.colour));
      if (saved) {
        await changeBagItemQuantity(purchased.id, purchased.size, purchased.colour, -purchased.quantity);
      }
    }
  } catch (error) {
    console.warn("Order saved, but some purchased items could not be removed from the bag.", error);
  }
  renderBag();
  renderSuccess(order);
  showCheckoutView("success");

  checkoutForm.reset();
  clearCheckoutErrors();
  setDefaultPayment();
  updatePaymentUI();

  isPlacingOrder = false;
  placeOrderButton.disabled = false;

  checkoutDialog.scrollTop = 0;
  successTitle.focus();
}

checkoutBackButton.addEventListener("click", () => {
  checkoutDialog.close();
  openBag();
});

checkoutCloseButton.addEventListener("click", () => {
  closeDialog(checkoutDialog);
});

successContinueButton.addEventListener("click", () => {
  closeDialog(checkoutDialog);
  document.querySelector("#shop").scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth"
  });
});

// After an order, go back to the form view for next time
checkoutDialog.addEventListener("close", () => {
  if (!checkoutSuccessView.hidden) {
    showCheckoutView("form");
  }
});

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isOrderingOpen()) {
    showPaymentProblem("Checkout is not available right now.");
    updateCheckoutButton();
    return;
  }
  if (isPlacingOrder || !validateCheckoutForm()) return;
  if (getOrderTotals().deliveryFee === null) {
    showPaymentProblem("Choose a location with a confirmed delivery fee before placing your order.");
    return;
  }
  isPlacingOrder = true;
  placeOrderButton.disabled = true;
  placeOrderButton.textContent = "Saving your order…";
  paymentError.hidden = true;
  try {
    const result = await invokeCheckout(buildOrderFromForm());
    if (result.status === "payment_required") {
      const paymentUrl = new URL(result.authorization_url);
      if (paymentUrl.protocol !== "https:" || paymentUrl.hostname !== "checkout.paystack.com") {
        throw new Error("The payment link is invalid. Please try again.");
      }
      window.location.assign(paymentUrl.href);
      return;
    }
    if (result.status !== "placed") throw new Error("Could not confirm this order.");
    const saved = await invokeCheckout({ action: "order", orderNumber: result.order_number });
    await finishOrder(orderFromSaved(saved.order));
  } catch (error) {
    showPaymentProblem(error.message || "Checkout failed. Please try again.");
  }
});

async function handlePaymentReturn() {
  const parameters = new URLSearchParams(window.location.search);
  const reference = parameters.get("reference");
  if (!reference || !/^APX-[a-f0-9]{24}$/.test(reference)) return;
  try {
    const result = await invokeCheckout({ action: "verify", reference });
    if (result.status === "payment_failed") {
      throw new Error("Payment was not completed. No order was marked paid. You can return to your bag and try again.");
    }
    if (result.status !== "paid") throw new Error("Payment is still processing. Refresh to check again; please do not place another order yet.");
    if (!checkoutDialog.open) openDialog(checkoutDialog);
    await finishOrder(orderFromSaved(result.order));
    parameters.delete("reference");
    parameters.delete("trxref");
    const remaining = parameters.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${remaining ? `?${remaining}` : ""}`);
  } catch (error) {
    if (!checkoutDialog.open) openDialog(checkoutDialog);
    showCheckoutView("form");
    showPaymentProblem(error.message || "Could not verify payment. Refresh to try again.");
    placeOrderButton.disabled = true;
  }
}

/* ==========================================================
   Navigation
   ========================================================== */

function setMenuOpen(isOpen) {
  mainNavigation.classList.toggle("is-open", isOpen);
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(!mainNavigation.classList.contains("is-open"));
});

navigationLinks.forEach((navigationLink) => {
  navigationLink.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
  }
});

document.addEventListener("click", (event) => {
  if (!siteHeader.contains(event.target)) {
    setMenuOpen(false);
  }
});

function updateHeaderState() {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  if (mainNavigation.classList.contains("is-open")) {
    setMenuOpen(false);
  }
}

window.addEventListener("scroll", updateHeaderState, { passive: true });

/* ==========================================================
   Scroll effects: reveal on scroll + highlight current section
   (runs after the product cards exist)
   ========================================================== */

function setUpScrollEffects() {
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  if ("IntersectionObserver" in window) {
    const sectionLinks = new Map();

    navigationLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href.startsWith("#")) return;
      const section = document.getElementById(href.slice(1));

      if (section) {
        sectionLinks.set(section, link);
      }
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          navigationLinks.forEach((link) => {
            link.classList.remove("is-active");
            link.removeAttribute("aria-current");
          });

          const activeLink = sectionLinks.get(entry.target);

          activeLink.classList.add("is-active");
          activeLink.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sectionLinks.forEach((_link, section) => sectionObserver.observe(section));
  }
}

/* ==========================================================
   Start up
   ========================================================== */

setUpStoreDetails();
handlePaymentReturn();
if (bagClient) {
  bagClient.from("delivery_rates").select("state, city_lga, fee_naira").then(({ data, error }) => {
    if (error) return;
    deliveryRates = data || [];
    renderBag();
    renderCheckoutSummary();
  });
}
if (!catalogueUnavailable) reconcileShoppingBag();
renderCategoryFilters();
renderProducts();
renderNewArrivals();
renderBag();
if (catalogueUnavailable) {
  noProductsMessage.textContent = "The collection is temporarily unavailable. Please try again shortly.";
}
setShopView(pageIsShop, { scroll: false, animate: false });
if (pageIsShop) {
  const parameters = new URLSearchParams(window.location.search);
  const category = parameters.get("category");
  activeQuery = (parameters.get("q") || "").trim();
  siteSearchInput.value = activeQuery;

  if (category === "accessories" || productCategories.some((item) => item.id === category)) {
    setActiveFilter(category);
  }

  updateProductVisibility(false);
}
updateHeaderState();

// Only hide-then-reveal content once everything above has worked
document.documentElement.classList.add("js-ready");
setUpScrollEffects();
