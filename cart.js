const BAG_STORAGE_KEY = "apex-attire-bag";
const MAX_ITEM_QUANTITY = storeConfig.maxQuantityPerItem || 10;
const shoppingBag = [];
const bagClient = window.supabase?.createClient(
  "https://fzepfojrtalfayimnsnp.supabase.co",
  "sb_publishable_h0Kp4nIXdZkDePlB2JToqA_Us6h6OGt"
);

let bagUserId = null;
let bagSessionUserId = null;
let bagAuthState = "loading";
let bagAuthError = "";
let bagLoadVersion = 0;

try {
  localStorage.removeItem(BAG_STORAGE_KEY);
} catch {
}

function notifyBagChanged() {
  window.dispatchEvent(new Event("bag-change"));
}

function getBagAccessState() {
  return bagAuthState;
}

function getBagAccessError() {
  return bagAuthError;
}

function isSameBagItem(bagItem, id, size, colour) {
  return bagItem.id === id && bagItem.size === size &&
    (bagItem.colour || "") === (colour || "");
}

async function loadShoppingBag(userId, version) {
  const { data, error } = await bagClient.from("saved_bag_items")
    .select("product_id, size, colour, quantity")
    .eq("user_id", userId);

  if (version !== bagLoadVersion) return;
  if (error) {
    bagAuthState = "error";
    bagAuthError = "Your saved bag could not load. Please try again later.";
    notifyBagChanged();
    return;
  }

  shoppingBag.splice(0, shoppingBag.length, ...(data || []).map((item) => ({
    id: item.product_id,
    size: item.size,
    colour: item.colour,
    quantity: item.quantity,
    name: "",
    image: "",
    price: 0
  })));
  bagUserId = userId;
  bagAuthState = "ready";
  bagAuthError = "";
  notifyBagChanged();
}

async function setBagSession(session) {
  const nextUserId = session?.user?.id || null;
  if (nextUserId === bagSessionUserId && (
    nextUserId ? bagAuthState === "loading" || bagAuthState === "ready"
      : bagAuthState === "signed-out"
  )) {
    return;
  }

  bagSessionUserId = nextUserId;
  const version = ++bagLoadVersion;
  bagUserId = null;
  shoppingBag.splice(0, shoppingBag.length);
  bagAuthState = nextUserId ? "loading" : "signed-out";
  bagAuthError = "";
  notifyBagChanged();

  if (!nextUserId) return;

  const { data, error } = await bagClient.auth.getUser();
  if (version !== bagLoadVersion) return;
  if (error || data?.user?.id !== nextUserId) {
    bagSessionUserId = null;
    bagAuthState = "signed-out";
    notifyBagChanged();
    return;
  }

  await loadShoppingBag(nextUserId, version);
}

async function refreshShoppingBag() {
  if (bagAuthState !== "ready" || !bagUserId) return;
  await loadShoppingBag(bagUserId, bagLoadVersion);
}

function requireBagAccount() {
  if (bagAuthState !== "ready" || !bagUserId) {
    throw new Error("Sign in to save items to your bag.");
  }
  return bagUserId;
}

async function addItemToBag(product) {
  const userId = requireBagAccount();
  const matchingItem = shoppingBag.find((item) =>
    isSameBagItem(item, product.id, product.size, product.colour)
  );
  if (matchingItem?.quantity >= MAX_ITEM_QUANTITY) return false;

  const quantity = (matchingItem?.quantity || 0) + 1;
  const { error } = await bagClient.from("saved_bag_items").upsert({
    user_id: userId,
    product_id: product.id,
    size: product.size,
    colour: product.colour || "",
    quantity,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id,product_id,size,colour" });

  if (error) throw error;
  if (bagUserId !== userId) return false;
  if (matchingItem) {
    matchingItem.quantity = quantity;
  } else {
    shoppingBag.push({ ...product, quantity });
  }
  return true;
}

async function changeBagItemQuantity(productId, productSize, productColour, quantityChange) {
  const userId = requireBagAccount();
  const matchingItem = shoppingBag.find((item) =>
    isSameBagItem(item, productId, productSize, productColour)
  );
  if (!matchingItem) return;

  const quantity = Math.min(matchingItem.quantity + quantityChange, MAX_ITEM_QUANTITY);
  if (quantity <= 0) {
    await removeBagItem(productId, productSize, productColour);
    return;
  }

  const { error } = await bagClient.from("saved_bag_items").update({
    quantity,
    updated_at: new Date().toISOString()
  }).eq("user_id", userId).eq("product_id", productId)
    .eq("size", productSize).eq("colour", productColour || "");

  if (error) throw error;
  if (bagUserId === userId) matchingItem.quantity = quantity;
}

async function removeBagItem(productId, productSize, productColour) {
  const userId = requireBagAccount();
  const { error } = await bagClient.from("saved_bag_items").delete()
    .eq("user_id", userId).eq("product_id", productId)
    .eq("size", productSize).eq("colour", productColour || "");

  if (error) throw error;
  if (bagUserId !== userId) return;
  const index = shoppingBag.findIndex((item) =>
    isSameBagItem(item, productId, productSize, productColour)
  );
  if (index !== -1) shoppingBag.splice(index, 1);
}

async function clearShoppingBag() {
  const userId = requireBagAccount();
  const { error } = await bagClient.from("saved_bag_items").delete().eq("user_id", userId);
  if (error) throw error;
  if (bagUserId === userId) shoppingBag.splice(0, shoppingBag.length);
}

function getBagItemCount() {
  return shoppingBag.reduce((total, item) => total + item.quantity, 0);
}

function getBagSubtotal() {
  return shoppingBag.reduce((total, item) => total + item.price * item.quantity, 0);
}

if (bagClient) {
  bagClient.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => setBagSession(session), 0);
  });
  window.addEventListener("focus", refreshShoppingBag);
} else {
  bagAuthState = "error";
  bagAuthError = "Account service could not load. Please check your connection and refresh.";
}
