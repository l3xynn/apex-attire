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
const dialogSizes = document.querySelector(".dialog-sizes");
const dialogColour = document.querySelector(".dialog-colour");

const menuToggle = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector(".main-nav");
const navigationLinks = document.querySelectorAll(".main-nav a");

let activeFilter = "all";

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
    const productImage = productCard.querySelector("img");
    const productCategory = productCard.querySelector(".product-category");
    const productTitle = productCard.querySelector("h2");
    const productPrice = productCard.querySelector(".product-price");

    dialogImage.src = productImage.src;
    dialogImage.alt = productImage.alt;
    dialogCategory.textContent = productCategory.textContent;
    dialogTitle.textContent = productTitle.textContent;
    dialogPrice.textContent = productPrice.textContent;
    dialogDescription.textContent = productCard.dataset.description;
    dialogSizes.textContent = productCard.dataset.sizes;
    dialogColour.textContent = productCard.dataset.colour;

    productDialog.showModal();
  });
});

dialogCloseButton.addEventListener("click", () => {
  productDialog.close();
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