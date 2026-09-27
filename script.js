const filterButtons = document.querySelectorAll(".filter-button");
const productCards = document.querySelectorAll(".product-card");
const detailButtons = document.querySelectorAll(".view-details-button");
const productSearch = document.querySelector("#product-search");
const noProductsMessage = document.querySelector(".no-products-message");

const productDialog = document.querySelector(".product-dialog");
const dialogCloseButton = document.querySelector(".dialog-close-button");
const dialogImage = document.querySelector(".dialog-image");
const dialogCategory = document.querySelector(".dialog-category");
const dialogTitle = document.querySelector(".dialog-title");
const dialogPrice = document.querySelector(".dialog-price");
const dialogDescription = document.querySelector(".dialog-description");
const dialogSizeSelect = document.querySelector(".dialog-size-select");
const dialogColour = document.querySelector(".dialog-colour");

const addToBagButton = document.querySelector(".add-to-bag-button");
const bagFeedback = document.querySelector(".bag-feedback");

const menuToggle = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector(".main-nav");
const navigationLinks = document.querySelectorAll(".main-nav a");

const bagToggle = document.querySelector(".bag-toggle");
const bagDialog = document.querySelector(".bag-dialog");
const bagCloseButton = document.querySelector(".bag-close-button");
const bagCount = document.querySelector(".bag-count");
const bagItems = document.querySelector(".bag-items");
const bagEmptyMessage = document.querySelector(".bag-empty-message");
const bagSummary = document.querySelector(".bag-summary");
const bagSubtotal = document.querySelector(".bag-subtotal");
const fulfilmentOptions = document.querySelectorAll(
  'input[name="fulfilment"]'
);
const bagTotalPrice = document.querySelector(".bag-total-price");

let activeFilter = "all";
let selectedProductCard = null;
let selectedFulfilment = "delivery";

function updateProductVisibility() {
  const searchTerm = productSearch.value.trim().toLowerCase();
  let visibleProductCount = 0;

  productCards.forEach((productCard) => {
    const productCategory = productCard.dataset.category;
    const productText = productCard.textContent.toLowerCase();

    const matchesCategory =
      activeFilter === "all" || productCategory === activeFilter;

    const matchesSearch = productText.includes(searchTerm);
    const shouldShow = matchesCategory && matchesSearch;

    productCard.style.display = shouldShow ? "block" : "none";

    if (shouldShow) {
      visibleProductCount += 1;
    }
  });

  noProductsMessage.hidden = visibleProductCount > 0;
}

function formatNaira(amount) {
  return `${storeConfig.currencySymbol}${amount.toLocaleString("en-NG")}`;
}

function renderBag() {
  bagItems.replaceChildren();

  const itemCount = getBagItemCount();
  const subtotal = getBagSubtotal();

  bagCount.textContent = itemCount;
  bagEmptyMessage.hidden = itemCount > 0;
  bagSummary.hidden = itemCount === 0;
  bagSubtotal.textContent = formatNaira(subtotal);

  shoppingBag.forEach((bagItem) => {
    const bagItemElement = document.createElement("article");
    const bagImage = document.createElement("img");
    const bagItemDetails = document.createElement("div");
    const bagItemTitle = document.createElement("h3");
    const bagItemSize = document.createElement("p");
    const bagItemQuantity = document.createElement("p");
    const bagItemPrice = document.createElement("strong");

    bagItemElement.className = "bag-item";
    bagItemPrice.className = "bag-item-price";

    bagImage.src = bagItem.image;
    bagImage.alt = bagItem.name;
    bagItemTitle.textContent = bagItem.name;
    bagItemSize.textContent = `Size: ${bagItem.size}`;
    bagItemQuantity.textContent = `Quantity: ${bagItem.quantity}`;
    bagItemPrice.textContent = formatNaira(bagItem.price * bagItem.quantity);

    bagItemDetails.append(bagItemTitle, bagItemSize, bagItemQuantity);
    bagItemElement.append(bagImage, bagItemDetails, bagItemPrice);
    bagItems.append(bagItemElement);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");
    updateProductVisibility();
  });
});

productSearch.addEventListener("input", () => {
  updateProductVisibility();
});

detailButtons.forEach((detailButton) => {
  detailButton.addEventListener("click", () => {
    const productCard = detailButton.closest(".product-card");

    selectedProductCard = productCard;

    const productImage = productCard.querySelector("img");
    const productCategory = productCard.querySelector(".product-category");
    const productTitle = productCard.querySelector("h2");
    const productPrice = productCard.querySelector(".product-price");
    const availableSizes = productCard.dataset.sizes.split(", ");

    dialogImage.src = productImage.src;
    dialogImage.alt = productImage.alt;
    dialogCategory.textContent = productCategory.textContent;
    dialogTitle.textContent = productTitle.textContent;
    dialogPrice.textContent = productPrice.textContent;
    dialogDescription.textContent = productCard.dataset.description;
    dialogColour.textContent = productCard.dataset.colour;

    dialogSizeSelect.replaceChildren();

    availableSizes.forEach((size) => {
      const sizeOption = document.createElement("option");

      sizeOption.value = size;
      sizeOption.textContent = size;

      dialogSizeSelect.append(sizeOption);
    });

    bagFeedback.textContent = "";
    productDialog.showModal();
  });
});

dialogCloseButton.addEventListener("click", () => {
  productDialog.close();
});

addToBagButton.addEventListener("click", () => {
  if (!selectedProductCard) {
    return;
  }

  const productImage = selectedProductCard.querySelector("img");
  const productTitle = selectedProductCard.querySelector("h2");

  addItemToBag({
    id: selectedProductCard.dataset.productId,
    name: productTitle.textContent,
    price: Number(selectedProductCard.dataset.price),
    size: dialogSizeSelect.value,
    image: productImage.src
  });

  bagFeedback.textContent =
    "Added to your bag. Online ordering is not open yet.";

  renderBag();
});

menuToggle.addEventListener("click", () => {
  const isMenuOpen = mainNavigation.classList.toggle("is-open");

  menuToggle.classList.toggle("is-open", isMenuOpen);
  menuToggle.setAttribute("aria-expanded", isMenuOpen);
  menuToggle.setAttribute(
    "aria-label",
    isMenuOpen ? "Close navigation" : "Open navigation"
  );
});

navigationLinks.forEach((navigationLink) => {
  navigationLink.addEventListener("click", () => {
    mainNavigation.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

bagToggle.addEventListener("click", () => {
  renderBag();
  bagDialog.showModal();
});

bagCloseButton.addEventListener("click", () => {
  bagDialog.close();
});

function renderBag() {
  bagItems.replaceChildren();

  const itemCount = getBagItemCount();
  const subtotal = getBagSubtotal();
  const deliveryFee =
  selectedFulfilment === "delivery" ? storeConfig.deliveryFee : 0;

const total = subtotal + deliveryFee;

  bagCount.textContent = itemCount;
  bagEmptyMessage.hidden = itemCount > 0;
  bagSummary.hidden = itemCount === 0;
  bagSubtotal.textContent = formatNaira(subtotal);
  bagTotalPrice.textContent = formatNaira(total);

  shoppingBag.forEach((bagItem) => {
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

    bagImage.src = bagItem.image;
    bagImage.alt = bagItem.name;
    bagItemTitle.textContent = bagItem.name;
    bagItemSize.textContent = `Size: ${bagItem.size}`;
    decreaseButton.textContent = "−";
    decreaseButton.setAttribute("aria-label", `Decrease ${bagItem.name} quantity`);
    quantityLabel.textContent = bagItem.quantity;
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", `Increase ${bagItem.name} quantity`);
    removeButton.textContent = "Remove";
    bagItemPrice.textContent = formatNaira(bagItem.price * bagItem.quantity);

    decreaseButton.addEventListener("click", () => {
      changeBagItemQuantity(bagItem.id, bagItem.size, -1);
      renderBag();
    });

    increaseButton.addEventListener("click", () => {
      changeBagItemQuantity(bagItem.id, bagItem.size, 1);
      renderBag();
    });

    removeButton.addEventListener("click", () => {
      removeBagItem(bagItem.id, bagItem.size);
      renderBag();
    });

    quantityControls.append(decreaseButton, quantityLabel, increaseButton);
    bagItemDetails.append(
      bagItemTitle,
      bagItemSize,
      quantityControls,
      removeButton
    );
    bagItemElement.append(bagImage, bagItemDetails, bagItemPrice);
    bagItems.append(bagItemElement);
  });
}
fulfilmentOptions.forEach((fulfilmentOption) => {
  fulfilmentOption.addEventListener("change", () => {
    selectedFulfilment = fulfilmentOption.value;
    renderBag();
  });
});