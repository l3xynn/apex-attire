const BAG_STORAGE_KEY = "apex-attire-bag";

const MAX_ITEM_QUANTITY =
  (typeof storeConfig !== "undefined" && storeConfig.maxQuantityPerItem) || 10;

function isValidBagItem(bagItem) {
  return (
    bagItem &&
    typeof bagItem.id === "string" &&
    typeof bagItem.size === "string" &&
    Number.isFinite(bagItem.price) &&
    Number.isInteger(bagItem.quantity) &&
    bagItem.quantity > 0
  );
}

function loadShoppingBag() {
  try {
    const storedBag = localStorage.getItem(BAG_STORAGE_KEY);

    if (!storedBag) {
      return [];
    }

    const parsedBag = JSON.parse(storedBag);

    return Array.isArray(parsedBag) ? parsedBag.filter(isValidBagItem) : [];
  } catch {
    return [];
  }
}

const shoppingBag = loadShoppingBag();

// Re-read the bag from storage (used when another tab changes it)
function refreshShoppingBag() {
  shoppingBag.splice(0, shoppingBag.length, ...loadShoppingBag());
}

function saveShoppingBag() {
  try {
    localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(shoppingBag));
  } catch {
    // Storage can be blocked (private mode, full storage). The bag still
    // works for this visit, it just won't be remembered.
  }
}

// Returns true if the item was added, false if the quantity limit was hit
function addItemToBag(product) {
  const matchingItem = shoppingBag.find((bagItem) => {
    return bagItem.id === product.id && bagItem.size === product.size;
  });

  if (matchingItem) {
    if (matchingItem.quantity >= MAX_ITEM_QUANTITY) {
      return false;
    }

    matchingItem.quantity += 1;
    saveShoppingBag();
    return true;
  }

  shoppingBag.push({
    ...product,
    quantity: 1
  });

  saveShoppingBag();
  return true;
}

function changeBagItemQuantity(productId, productSize, quantityChange) {
  const matchingItem = shoppingBag.find((bagItem) => {
    return bagItem.id === productId && bagItem.size === productSize;
  });

  if (!matchingItem) {
    return;
  }

  matchingItem.quantity = Math.min(
    matchingItem.quantity + quantityChange,
    MAX_ITEM_QUANTITY
  );

  if (matchingItem.quantity <= 0) {
    removeBagItem(productId, productSize);
    return;
  }

  saveShoppingBag();
}

function removeBagItem(productId, productSize) {
  const itemIndex = shoppingBag.findIndex((bagItem) => {
    return bagItem.id === productId && bagItem.size === productSize;
  });

  if (itemIndex === -1) {
    return;
  }

  shoppingBag.splice(itemIndex, 1);
  saveShoppingBag();
}

function clearShoppingBag() {
  shoppingBag.splice(0, shoppingBag.length);
  saveShoppingBag();
}

function getBagItemCount() {
  return shoppingBag.reduce((total, bagItem) => {
    return total + bagItem.quantity;
  }, 0);
}

function getBagSubtotal() {
  return shoppingBag.reduce((total, bagItem) => {
    return total + bagItem.price * bagItem.quantity;
  }, 0);
}