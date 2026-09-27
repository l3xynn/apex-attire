function loadShoppingBag() {
  try {
    const storedBag = localStorage.getItem("apex-attire-bag");

    if (!storedBag) {
      return [];
    }

    const parsedBag = JSON.parse(storedBag);

    return Array.isArray(parsedBag) ? parsedBag : [];
  } catch {
    return [];
  }
}

const shoppingBag = loadShoppingBag();

function saveShoppingBag() {
  localStorage.setItem("apex-attire-bag", JSON.stringify(shoppingBag));
}

function addItemToBag(product) {
  const matchingItem = shoppingBag.find((bagItem) => {
    return bagItem.id === product.id && bagItem.size === product.size;
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
    saveShoppingBag();
    return;
  }

  shoppingBag.push({
    ...product,
    quantity: 1
  });

  saveShoppingBag();
}

function changeBagItemQuantity(productId, productSize, quantityChange) {
  const matchingItem = shoppingBag.find((bagItem) => {
    return bagItem.id === productId && bagItem.size === productSize;
  });

  if (!matchingItem) {
    return;
  }

  matchingItem.quantity += quantityChange;

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