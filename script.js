/* ==========================================================
   Element references
   ========================================================== */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const siteHeader = document.querySelector(".site-header");
const announcementBar = document.querySelector(".announcement-bar");
const announcementText = document.querySelector(".announcement-text");

const menuToggle = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector(".main-nav");
const navigationLinks = document.querySelectorAll(".main-nav a");

const shopEyebrow = document.querySelector(".shop-eyebrow");
const shopTitle = document.querySelector(".shop-title");
const catalogueToolbar = document.querySelector(".catalogue-toolbar");
const categoryFilters = document.querySelector(".category-filters");
const productGrid = document.querySelector(".product-grid");
const productSearch = document.querySelector("#product-search");
const productSort = document.querySelector("#product-sort");
const resultsCount = document.querySelector(".results-count");
const noProductsMessage = document.querySelector(".no-products-message");
const resetFiltersButton = document.querySelector(".reset-filters-button");
const shopMore = document.querySelector(".shop-more");
const shopAllButton = document.querySelector(".shop-all-button");

const productDialog = document.querySelector(".product-dialog");
const dialogCloseButton = document.querySelector(".dialog-close-button");
const dialogImage = document.querySelector(".dialog-image");
const dialogCategory = document.querySelector(".dialog-category");
const dialogTitle = document.querySelector(".dialog-title");
const dialogPrice = document.querySelector(".dialog-price");
const dialogDescription = document.querySelector(".dialog-description");
const dialogSizeOptions = document.querySelector(".size-options");
const dialogColour = document.querySelector(".dialog-colour");
const dialogPolicy = document.querySelector(".dialog-policy");
const addToBagButton = document.querySelector(".add-to-bag-button");
const viewBagButton = document.querySelector(".view-bag-button");
const bagFeedback = document.querySelector(".bag-feedback");

const bagToggle = document.querySelector(".bag-toggle");
const bagDialog = document.querySelector(".bag-dialog");
const bagCloseButton = document.querySelector(".bag-close-button");
const bagCount = document.querySelector(".bag-count");
const bagItems = document.querySelector(".bag-items");
const bagEmpty = document.querySelector(".bag-empty");
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
const placeOrderButton = document.querySelector(".place-order-button");
const checkoutSummaryItems = document.querySelector(".checkout-summary-items");
const checkoutSubtotal = document.querySelector(".checkout-subtotal");
const checkoutFulfilmentLabel = document.querySelector(".checkout-fulfilment-label");
const checkoutDelivery = document.querySelector(".checkout-delivery");
const checkoutTotal = document.querySelector(".checkout-total");

const paystackOption = document.querySelector(".paystack-option");
const testCardNote = document.querySelector(".test-card-note");
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
let selectedFulfilment = document.querySelector('input[name="fulfilment"]:checked').value;
let addedButtonTimeout = null;
let isPlacingOrder = false;

const DIALOG_CLOSE_DELAY = 180;
const FALLBACK_BEST_SELLER_COUNT = 6;

const PAYMENT_LABELS = {
  paystack: "Paid online (Paystack)",
  cod: "Pay when you receive",
  transfer: "Bank transfer"
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
  return `${bagItem.id}::${bagItem.size}`;
}

function getCategoryLabel(categoryId) {
  const category = productCategories.find((item) => item.id === categoryId);
  return category ? category.label : categoryId;
}

function getOrderTotals() {
  const subtotal = getBagSubtotal();
  const deliveryFee = selectedFulfilment === "delivery" ? storeConfig.deliveryFee : 0;

  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
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
  if (storeConfig.announcement) {
    announcementText.textContent = storeConfig.announcement;
    announcementBar.hidden = false;
  }

  dialogPolicy.textContent =
    `${formatNaira(storeConfig.deliveryFee)} flat delivery within Lagos State · ` +
    `Exchanges within ${storeConfig.exchangeWindowDays} days of delivery.`;

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
    addFooterLink("WhatsApp", `https://wa.me/${storeConfig.whatsappNumber}`);
  }

  if (storeConfig.instagramHandle) {
    const handle = storeConfig.instagramHandle.replace("@", "");
    addFooterLink("Instagram", `https://instagram.com/${handle}`);
  }

  (storeConfig.deliveryAreas || []).forEach((area) => {
    const option = document.createElement("option");

    option.value = area;
    option.textContent = area;
    areaSelect.append(option);
  });

  if (isPaystackAvailable()) {
    paystackOption.hidden = false;
  }

  setDefaultPayment();
}

/* ==========================================================
   Products: built from products.js
   ========================================================== */

function createProductCard(product, index) {
  const card = document.createElement("article");
  const image = document.createElement("img");
  const info = document.createElement("div");
  const category = document.createElement("p");
  const title = document.createElement("h2");
  const price = document.createElement("p");
  const detailsButton = document.createElement("button");
  const arrow = document.createElement("span");

  card.className = "product-card reveal";
  card.dataset.productId = product.id;
  card.dataset.category = product.category;
  card.dataset.price = product.price;
  card.dataset.order = index;
  card.dataset.bestSeller = String(isBestSeller(product, index));
  card.dataset.searchText = [
    product.name,
    getCategoryLabel(product.category),
    product.description,
    product.colour
  ]
    .join(" ")
    .toLowerCase();

  // Stagger the scroll-reveal across each row of three
  card.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);

  image.src = product.image;
  image.alt = product.imageAlt || product.name;
  image.loading = "lazy";
  image.decoding = "async";

  info.className = "product-info";
  category.className = "product-category";
  category.textContent = getCategoryLabel(product.category);
  title.textContent = product.name;
  price.className = "product-price";
  price.textContent = formatNaira(product.price);

  detailsButton.className = "view-details-button";
  detailsButton.type = "button";
  detailsButton.append("View details ");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  detailsButton.append(arrow);

  info.append(category, title, price, detailsButton);
  card.append(image, info);

  // Whole card is clickable; the button inside stays for keyboard users
  card.addEventListener("click", () => openProductDialog(product));

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
  const searchTerm = productSearch.value.trim().toLowerCase();
  let visibleProductCount = 0;

  productCards.forEach((productCard) => {
    const matchesCategory =
      activeFilter === "all" || productCard.dataset.category === activeFilter;

    const matchesSearch = productCard.dataset.searchText.includes(searchTerm);

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
  resultsCount.hidden = !showAll;

  resultsCount.textContent =
    visibleProductCount === productCards.length
      ? `${productCards.length} products`
      : `Showing ${visibleProductCount} of ${productCards.length} products`;
}

// Switches between the front page (best sellers) and the full catalogue
function setShopView(shouldShowAll, { scroll = true, animate = true } = {}) {
  showAll = shouldShowAll;

  catalogueToolbar.hidden = !showAll;
  categoryFilters.hidden = !showAll;

  shopEyebrow.textContent = showAll ? "The full collection" : "Best sellers";
  shopTitle.textContent = showAll ? "All items" : "Customer favourites";
  shopAllButton.textContent = showAll
    ? "Back to best sellers"
    : `Shop all ${products.length} items`;

  // If every product is a best seller there is nothing more to show
  shopMore.hidden = productCards.every((card) => card.dataset.bestSeller === "true");

  if (!showAll) {
    // Leave the front page clean: clear any search, filter or sort
    productSearch.value = "";
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
  setShopView(!showAll);
});

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");

  if (!button) {
    return;
  }

  setActiveFilter(button.dataset.filter);
  updateProductVisibility(true);
});

productSearch.addEventListener("input", () => {
  updateProductVisibility();
});

productSort.addEventListener("change", () => {
  activeSort = productSort.value;
  sortProductCards();
  updateProductVisibility(true);
});

resetFiltersButton.addEventListener("click", () => {
  productSearch.value = "";
  setActiveFilter("all");
  updateProductVisibility(true);
});

/* ==========================================================
   Product dialog
   ========================================================== */

function resetAddToBagButton() {
  clearTimeout(addedButtonTimeout);
  addToBagButton.textContent = "Add to bag";
  addToBagButton.classList.remove("is-added");
}

function openProductDialog(product) {
  selectedProduct = product;

  dialogImage.src = product.image;
  dialogImage.alt = product.imageAlt || product.name;
  dialogCategory.textContent = getCategoryLabel(product.category);
  dialogTitle.textContent = product.name;
  dialogPrice.textContent = formatNaira(product.price);
  dialogDescription.textContent = product.description;
  dialogColour.textContent = product.colour;

  dialogSizeOptions.replaceChildren();

  product.sizes.forEach((size, index) => {
    const sizeChip = document.createElement("label");
    const sizeInput = document.createElement("input");
    const sizeText = document.createElement("span");

    sizeChip.className = "size-chip";
    sizeInput.type = "radio";
    sizeInput.name = "product-size";
    sizeInput.value = size;
    sizeInput.checked = index === 0;
    sizeText.textContent = size;

    sizeChip.append(sizeInput, sizeText);
    dialogSizeOptions.append(sizeChip);
  });

  resetAddToBagButton();
  bagFeedback.textContent = "";
  viewBagButton.hidden = true;

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

addToBagButton.addEventListener("click", () => {
  if (!selectedProduct) {
    return;
  }

  const selectedSize = productDialog.querySelector('input[name="product-size"]:checked');

  if (!selectedSize) {
    return;
  }

  const wasAdded = addItemToBag({
    id: selectedProduct.id,
    name: selectedProduct.name,
    price: selectedProduct.price,
    size: selectedSize.value,
    image: selectedProduct.image
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

function updateCheckoutButton() {
  checkoutButton.disabled = !storeConfig.orderingEnabled;
  checkoutButton.textContent = storeConfig.orderingEnabled
    ? "Checkout"
    : "Online ordering opens soon";
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

function changeQuantityAndRefocus(bagItem, change, action) {
  changeBagItemQuantity(bagItem.id, bagItem.size, change);
  renderBag();
  restoreBagFocus(bagItem, action);
}

function renderBag() {
  bagItems.replaceChildren();

  const itemCount = getBagItemCount();
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
  bagSubtotal.textContent = formatNaira(totals.subtotal);
  bagTotalPrice.textContent = formatNaira(totals.total);

  updateCheckoutButton();

  shoppingBag.forEach((bagItem) => {
    const itemKey = getItemKey(bagItem);

    const bagItemElement = document.createElement("article");
    const bagImage = document.createElement("img");
    const bagItemDetails = document.createElement("div");
    const bagItemTitle = document.createElement("h3");
    const bagItemSize = document.createElement("p");
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
    bagItemSize.textContent = `Size: ${bagItem.size}`;
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

    removeButton.addEventListener("click", () => {
      removeBagItem(bagItem.id, bagItem.size);
      renderBag();
      restoreBagFocus(bagItem, "remove");
    });

    quantityControls.append(decreaseButton, quantityLabel, increaseButton);
    bagItemDetails.append(bagItemTitle, bagItemSize, quantityControls, removeButton);
    bagItemElement.append(bagImage, bagItemDetails, bagItemPrice);
    bagItems.append(bagItemElement);
  });
}

bagToggle.addEventListener("click", openBag);

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
  });
});

// Keep the bag in sync if the store is open in more than one tab
window.addEventListener("storage", (event) => {
  if (event.key === BAG_STORAGE_KEY) {
    refreshShoppingBag();
    renderBag();
  }
});

/* ==========================================================
   Checkout (demo)
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
    meta.textContent = `Size: ${item.size} · Qty: ${item.quantity}`;
    price.textContent = formatNaira(item.price * item.quantity);

    thumb.append(image, quantityBadge);
    details.append(name, meta);
    line.append(thumb, details, price);
    container.append(line);
  });
}

function updatePlaceOrderLabel() {
  const total = formatNaira(getOrderTotals().total);

  placeOrderButton.textContent =
    getSelectedPayment() === "paystack" ? `Pay ${total}` : `Place order · ${total}`;
}

function renderCheckoutSummary() {
  const totals = getOrderTotals();

  renderOrderLines(checkoutSummaryItems, shoppingBag);

  checkoutSubtotal.textContent = formatNaira(totals.subtotal);
  checkoutFulfilmentLabel.textContent =
    selectedFulfilment === "delivery" ? "Delivery" : "Pickup";
  checkoutDelivery.textContent =
    totals.deliveryFee > 0 ? formatNaira(totals.deliveryFee) : "Free";
  checkoutTotal.textContent = formatNaira(totals.total);

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
      if (!value) {
        return getSelectedPayment() === "paystack"
          ? "Paystack needs your email to take payment online."
          : "";
      }

      return EMAIL_PATTERN.test(value) ? "" : "Enter a valid email address.";

    case "area":
      return isDelivery && !value ? "Please choose your delivery area." : "";

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

/* ----- Paystack (online payment, test mode) ----- */

function isPaystackAvailable() {
  return Boolean(storeConfig.paystackPublicKey);
}

function getSelectedPayment() {
  return checkoutForm.querySelector('input[name="payment"]:checked').value;
}

function setDefaultPayment() {
  const defaultPayment = isPaystackAvailable() ? "paystack" : "cod";

  checkoutForm.querySelector(
    `input[name="payment"][value="${defaultPayment}"]`
  ).checked = true;
}

function updatePaymentUI() {
  const isPaystack = getSelectedPayment() === "paystack";

  testCardNote.hidden = !isPaystack;
  emailOptionalLabel.hidden = isPaystack;
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

function payWithPaystack(order) {
  if (typeof PaystackPop === "undefined") {
    showPaymentProblem(
      "The payment window could not load. Check your internet connection and try again."
    );
    return;
  }

  // The browser draws an open dialog above everything else, which would hide
  // Paystack's window. So the checkout closes while Paystack is open and comes
  // back afterwards. Everything typed into the form is kept.
  const resumeCheckout = () => {
    if (!checkoutDialog.open) {
      openDialog(checkoutDialog);
    }
  };

  checkoutDialog.close();

  try {
    const popup = new PaystackPop();

    popup.newTransaction({
      key: storeConfig.paystackPublicKey,
      email: order.customer.email,
      amount: order.totals.total * 100, // Paystack expects kobo, not naira
      currency: storeConfig.currency,
      metadata: {
        custom_fields: [
          { display_name: "Order number", variable_name: "order_number", value: order.number },
          { display_name: "Customer name", variable_name: "customer_name", value: order.customer.name },
          { display_name: "Phone", variable_name: "phone", value: order.customer.phone }
        ]
      },
      onSuccess: (transaction) => {
        order.paymentReference = transaction.reference;
        resumeCheckout();
        finishOrder(order);
      },
      onCancel: () => {
        resumeCheckout();
        showPaymentProblem(
          "Payment was cancelled and you have not been charged. You can try again when you're ready."
        );
      },
      onError: (error) => {
        resumeCheckout();
        showPaymentProblem(
          `Payment could not start: ${error && error.message ? error.message : "please try again."}`
        );
      }
    });
  } catch {
    resumeCheckout();
    showPaymentProblem("Something went wrong opening the payment window. Please try again.");
  }
}

paymentRadios.forEach((paymentRadio) => {
  paymentRadio.addEventListener("change", updatePaymentUI);
});

/* ----- Opening, placing, confirming ----- */

function openCheckout() {
  if (shoppingBag.length === 0) {
    return;
  }

  clearCheckoutErrors();
  showCheckoutView("form");
  renderCheckoutSummary();
  updatePaymentUI();

  deliveryFields.hidden = selectedFulfilment !== "delivery";

  openDialog(checkoutDialog);
  checkoutDialog.scrollTop = 0;
}

function generateOrderNumber() {
  const now = new Date();
  const datePart = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `APX-${datePart}-${randomPart}`;
}

function getNextStepsText(order) {
  const phone = order.customer.phone;

  if (order.payment === "paystack") {
    return order.fulfilment === "pickup"
      ? `Your payment was received. We'll call ${phone} to confirm your pickup time.`
      : `Your payment was received. We'll call ${phone} to confirm your order. Delivery takes ${storeConfig.deliveryTime}.`;
  }

  if (order.payment === "transfer") {
    return `We'll message ${phone} with our bank details. Your order is confirmed once payment is received.`;
  }

  if (order.fulfilment === "pickup") {
    return `We'll call ${phone} to confirm your pickup time. You pay when you collect.`;
  }

  return `We'll call ${phone} to confirm your order. Delivery takes ${storeConfig.deliveryTime}, and you pay when it arrives.`;
}

function renderSuccess(order) {
  const firstName = order.customer.name.split(" ")[0];

  successMessage.textContent = `Thanks, ${firstName}. Your order has been received.`;
  successOrderNumber.textContent = order.number;

  renderOrderLines(successItems, order.items);

  successSubtotal.textContent = formatNaira(order.totals.subtotal);
  successDelivery.textContent =
    order.totals.deliveryFee > 0 ? formatNaira(order.totals.deliveryFee) : "Free";
  successTotal.textContent = formatNaira(order.totals.total);

  successFulfilment.textContent =
    order.fulfilment === "delivery" ? `Delivery · ${order.customer.area}` : "Pickup";
  successPayment.textContent = PAYMENT_LABELS[order.payment];
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
    number: generateOrderNumber(),
    items: shoppingBag.map((bagItem) => ({ ...bagItem })),
    totals: getOrderTotals(),
    fulfilment: selectedFulfilment,
    payment: getValue("payment"),
    paymentReference: "",
    customer: {
      name: getValue("name"),
      phone: getValue("phone"),
      email: getValue("email"),
      area: isDelivery ? getValue("area") : "",
      address: isDelivery ? getValue("address") : "",
      notes: getValue("notes")
    },
    placedAt: new Date().toISOString()
  };
}

function finishOrder(order) {
  clearShoppingBag();
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

checkoutButton.addEventListener("click", () => {
  if (!storeConfig.orderingEnabled || shoppingBag.length === 0) {
    return;
  }

  bagDialog.close();
  openCheckout();
});

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

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isPlacingOrder || shoppingBag.length === 0) {
    return;
  }

  if (!validateCheckoutForm()) {
    return;
  }

  paymentError.hidden = true;
  isPlacingOrder = true;
  placeOrderButton.disabled = true;

  const order = buildOrderFromForm();

  if (order.payment === "paystack") {
    placeOrderButton.textContent = "Opening payment…";
    payWithPaystack(order);
    return;
  }

  placeOrderButton.textContent = "Placing order…";

  // Small pause so it feels like something is happening
  setTimeout(() => finishOrder(order), prefersReducedMotion.matches ? 0 : 1100);
});

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
      const section = document.getElementById(link.getAttribute("href").slice(1));

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
renderCategoryFilters();
renderProducts();
renderBag();
setShopView(false, { scroll: false, animate: false });
updateHeaderState();

// Only hide-then-reveal content once everything above has worked
document.documentElement.classList.add("js-ready");
setUpScrollEffects();