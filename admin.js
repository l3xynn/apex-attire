const adminSupabaseUrl = "https://fzepfojrtalfayimnsnp.supabase.co";
const adminSupabasePublishableKey = "sb_publishable_h0Kp4nIXdZkDePlB2JToqA_Us6h6OGt";

const gate = document.querySelector(".admin-gate");
const dashboard = document.querySelector(".admin-dashboard");
const emailDisplay = document.querySelector(".admin-email");
const signOutButton = document.querySelector(".admin-sign-out");
const productForm = document.querySelector(".admin-product-form");
const productList = document.querySelector(".admin-product-list");
const productSearchInput = document.querySelector(".admin-product-search");
const productStatus = document.querySelector(".admin-status");
const colourList = document.querySelector(".admin-colour-list");
const categoryForm = document.querySelector(".admin-category-form");
const categoryList = document.querySelector(".admin-category-list");
const categoryStatus = document.querySelector(".admin-category-status");
const analyticsStatus = document.querySelector(".admin-analytics-status");
const ordersList = document.querySelector(".admin-orders-list");
const ordersStatus = document.querySelector(".admin-orders-status");
const ordersFilter = document.querySelector(".admin-orders-filter select");
const deliveryForm = document.querySelector(".admin-delivery-form");
const deliveryList = document.querySelector(".admin-delivery-list");
const deliveryStatus = document.querySelector(".admin-delivery-status");
const colourFiles = new WeakMap();
const mobileDashboard = window.matchMedia("(max-width: 700px)");
const originalProducts = new Map(products.map((product) => [product.id, product]));
const originalCategories = new Map(productCategories.map((category) => [category.id, category]));
let currentProducts = new Map(originalProducts);
let currentCategories = new Map(originalCategories);
let archivedProducts = new Map();
let editingProductId = null;
let client = null;
let accessCheck = 0;
let deliveryRates = [];
let editingDeliveryRateId = null;

storeConfig.deliveryStates.forEach((state) => {
  const option = document.createElement("option");
  option.value = state;
  option.textContent = state;
  deliveryForm.elements.state.append(option);
});

function setDeliveryStatus(message, isError = false) {
  deliveryStatus.textContent = message;
  deliveryStatus.classList.toggle("is-error", isError);
  deliveryStatus.hidden = !message;
}

function renderDeliveryRates() {
  deliveryList.replaceChildren();
  deliveryRates.forEach((rate) => {
    const row = document.createElement("div");
    const label = document.createElement("strong");
    const actions = document.createElement("div");
    row.className = "admin-list-row admin-delivery-row";
    label.textContent = `${rate.state}${rate.city_lga ? ` / ${rate.city_lga}` : " / State-wide"} — ₦${rate.fee_naira.toLocaleString("en-NG")}`;
    actions.className = "admin-row-actions";
    actions.append(makeButton("Edit", () => {
      editingDeliveryRateId = rate.id;
      deliveryForm.elements.state.value = rate.state;
      deliveryForm.elements.city.value = rate.city_lga;
      deliveryForm.elements.fee.value = rate.fee_naira;
      deliveryForm.querySelector('button[type="submit"]').textContent = "Update rate";
      deliveryForm.scrollIntoView({ block: "center", behavior: "smooth" });
    }), makeButton("Remove", async () => {
      if (!window.confirm(`Remove the delivery rate for ${rate.state}${rate.city_lga ? ` / ${rate.city_lga}` : ""}?`)) return;
      const { error } = await client.from("delivery_rates").delete().eq("id", rate.id);
      if (error) return setDeliveryStatus(error.message, true);
      if (editingDeliveryRateId === rate.id) resetDeliveryForm();
      await loadDeliveryRates();
      setDeliveryStatus("Rate removed.");
    }));
    row.append(label, actions);
    deliveryList.append(row);
  });
  if (!deliveryRates.length) deliveryList.textContent = "No rates yet. Add a state-wide rate to start.";
}

function resetDeliveryForm() {
  deliveryForm.reset();
  editingDeliveryRateId = null;
  deliveryForm.querySelector('button[type="submit"]').textContent = "Save rate";
}

async function loadDeliveryRates() {
  const { data, error } = await client.from("delivery_rates")
    .select("id, state, city_lga, fee_naira").order("state").order("city_lga");
  if (error) throw error;
  deliveryRates = data || [];
  renderDeliveryRates();
}

async function saveDeliveryRate(event) {
  event.preventDefault();
  const state = deliveryForm.elements.state.value;
  const city_lga = deliveryForm.elements.city.value.trim().toLowerCase().replace(/\s+/g, " ");
  const fee_naira = Number(deliveryForm.elements.fee.value);
  if (!storeConfig.deliveryStates.includes(state) || !Number.isSafeInteger(fee_naira) || fee_naira < 0) {
    return setDeliveryStatus("Choose a state and enter a valid whole-naira fee.", true);
  }
  const duplicate = deliveryRates.find((rate) => rate.state === state && rate.city_lga === city_lga && rate.id !== editingDeliveryRateId);
  if (duplicate) return setDeliveryStatus("This location already has a rate. Edit its existing row instead.", true);
  const button = deliveryForm.querySelector('button[type="submit"]');
  button.disabled = true;
  const payload = { state, city_lga, fee_naira, updated_at: new Date().toISOString() };
  const result = editingDeliveryRateId
    ? await client.from("delivery_rates").update(payload).eq("id", editingDeliveryRateId)
    : await client.from("delivery_rates").insert(payload);
  button.disabled = false;
  if (result.error) return setDeliveryStatus(result.error.message, true);
  resetDeliveryForm();
  try {
    await loadDeliveryRates();
    setDeliveryStatus("Delivery rate saved.");
  } catch (error) {
    setDeliveryStatus(`Saved, but could not refresh rates: ${error.message}`, true);
  }
}

function showGate(title, description, link) {
  dashboard.hidden = true;
  gate.hidden = false;
  gate.replaceChildren();
  const heading = document.createElement("h2");
  heading.textContent = title;
  const message = document.createElement("p");
  message.textContent = description;
  gate.append(heading, message);
  if (link) {
    const action = document.createElement("a");
    action.className = "button button-primary";
    action.href = link.href;
    action.textContent = link.label;
    gate.append(action);
  }
}

function setStatus(message, isError = false) {
  productStatus.textContent = message;
  productStatus.classList.toggle("is-error", isError);
  productStatus.hidden = !message;
}

function setCategoryStatus(message, isError = false) {
  categoryStatus.textContent = message;
  categoryStatus.classList.toggle("is-error", isError);
  categoryStatus.hidden = !message;
}

function makeButton(label, action, className = "button button-secondary") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", action);
  return button;
}

function getVariants(product) {
  if (Array.isArray(product.colours) && product.colours.length) return product.colours;
  return [{ name: product.colour || "As pictured", image: product.image, photos: [product.image] }];
}

function renderProducts() {
  productList.replaceChildren();
  const query = productSearchInput.value.trim().toLowerCase();
  const sorted = [...currentProducts.values()]
    .filter((product) => !query || `${product.name} ${currentCategories.get(product.category)?.label || product.category}`
      .toLowerCase().includes(query))
    .sort((first, second) => first.name.localeCompare(second.name));
  sorted.forEach((product) => {
    const row = document.createElement("div");
    const image = document.createElement("img");
    const details = document.createElement("div");
    const title = document.createElement("strong");
    const description = document.createElement("small");
    const actions = document.createElement("div");
    row.className = "admin-list-row admin-product-row";
    image.src = product.image || getVariants(product)[0]?.image || "";
    image.alt = "";
    title.textContent = product.name;
    description.textContent = `${currentCategories.get(product.category)?.label || product.category} · ₦${Number(product.price).toLocaleString("en-NG")}${product.soldOut ? " · Sold out" : ""}`;
    details.append(title, description);
    actions.className = "admin-row-actions";
    actions.append(makeButton("Edit", () => openProductForm(product)), makeButton("Remove", () => archiveProduct(product)));
    row.append(image, details, actions);
    productList.append(row);
  });
  if (!sorted.length) productList.textContent = query ? "No products match your search." : "No products yet.";
  if (archivedProducts.size) {
    const heading = document.createElement("h3");
    heading.textContent = "Removed products";
    productList.append(heading);
    archivedProducts.forEach((product) => {
      if (query && !product.name.toLowerCase().includes(query)) return;
      const row = document.createElement("div");
      const label = document.createElement("span");
      row.className = "admin-list-row admin-archived-row";
      label.textContent = product.name;
      row.append(label, makeButton("Restore", () => restoreProduct(product)));
      productList.append(row);
    });
  }
  document.querySelector(".admin-product-count").textContent = currentProducts.size.toLocaleString("en-NG");
}

function renderCategories() {
  const select = productForm.elements.category;
  const selected = select.value;
  select.replaceChildren();
  categoryList.replaceChildren();
  currentCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.label;
    select.append(option);
    const row = document.createElement("div");
    const label = document.createElement("strong");
    const actions = document.createElement("div");
    row.className = "admin-list-row";
    label.textContent = category.label;
    actions.className = "admin-row-actions";
    actions.append(makeButton("Rename", () => renameCategory(category)));
    if (!originalCategories.has(category.id)) actions.append(makeButton("Remove", () => archiveCategory(category)));
    row.append(label, actions);
    categoryList.append(row);
  });
  if (currentCategories.has(selected)) select.value = selected;
  document.querySelector(".admin-category-count").textContent = currentCategories.size.toLocaleString("en-NG");
}

async function loadCatalogue() {
  const [productResult, categoryResult] = await Promise.all([
    client.from("catalogue_products").select("id, data, archived"),
    client.from("catalogue_categories").select("id, label, archived")
  ]);
  if (productResult.error || categoryResult.error) throw productResult.error || categoryResult.error;
  currentProducts = new Map(originalProducts);
  archivedProducts = new Map();
  productResult.data.forEach((row) => {
    if (row.archived) {
      currentProducts.delete(row.id);
      archivedProducts.set(row.id, row.data);
    } else currentProducts.set(row.id, row.data);
  });
  currentCategories = new Map(originalCategories);
  categoryResult.data.forEach((row) => {
    if (row.archived) currentCategories.delete(row.id);
    else currentCategories.set(row.id, { id: row.id, label: row.label });
  });
  renderCategories();
  renderProducts();
}

function addColourRow(colour = {}, openNewRow = false) {
  const row = document.createElement("details");
  const summary = document.createElement("summary");
  const content = document.createElement("div");
  const heading = document.createElement("div");
  const name = document.createElement("input");
  const hex = document.createElement("input");
  const photos = document.createElement("div");
  const fileInput = document.createElement("input");
  const pending = document.createElement("small");
  row.className = "admin-colour-row";
  summary.textContent = colour.name || "New colour";
  content.className = "admin-colour-content";
  if (mobileDashboard.matches && openNewRow) {
    colourList.querySelectorAll(".admin-colour-row").forEach((item) => { item.open = false; });
  }
  row.open = !mobileDashboard.matches || openNewRow || colourList.children.length === 0;
  heading.className = "admin-section-heading";
  name.placeholder = "Colour name (e.g. Black)";
  name.value = colour.name || "";
  name.required = true;
  name.maxLength = 50;
  name.dataset.field = "name";
  name.setAttribute("aria-label", "Colour name");
  name.addEventListener("input", () => { summary.textContent = name.value.trim() || "New colour"; });
  hex.type = "color";
  hex.value = /^#[0-9a-f]{6}$/i.test(colour.hex || "") ? colour.hex : "#111111";
  hex.dataset.field = "hex";
  hex.setAttribute("aria-label", "Colour swatch");
  photos.className = "admin-photo-list";
  fileInput.type = "file";
  fileInput.accept = "image/jpeg,image/png,image/webp,image/avif";
  fileInput.multiple = true;
  fileInput.setAttribute("aria-label", `Add photos for ${colour.name || "this colour"}`);
  const savedPhotos = Array.isArray(colour.photos) && colour.photos.length
    ? [...colour.photos] : colour.image ? [colour.image] : [];
  colourFiles.set(row, { savedPhotos, newFiles: [], original: colour });
  function renderPhotos() {
    photos.replaceChildren();
    colourFiles.get(row).savedPhotos.forEach((url, index) => {
      const item = document.createElement("div");
      const image = document.createElement("img");
      image.src = url;
      image.alt = `Photo ${index + 1}`;
      const remove = makeButton("×", () => {
        colourFiles.get(row).savedPhotos.splice(index, 1);
        renderPhotos();
      }, "admin-remove-photo");
      remove.setAttribute("aria-label", `Remove photo ${index + 1}`);
      item.append(image, remove);
      photos.append(item);
    });
    pending.replaceChildren();
    colourFiles.get(row).newFiles.forEach((file, index) => {
      pending.append(makeButton(`Remove ${file.name}`, () => {
        colourFiles.get(row).newFiles.splice(index, 1);
        renderPhotos();
      }));
    });
  }
  fileInput.addEventListener("change", () => {
    colourFiles.get(row).newFiles.push(...fileInput.files);
    fileInput.value = "";
    renderPhotos();
  });
  heading.append(name, makeButton("Remove colour", () => {
    if (colourList.children.length > 1) row.remove();
  }));
  content.append(heading, hex, photos, fileInput, pending);
  row.append(summary, content);
  colourList.append(row);
  renderPhotos();
}

function openProductForm(product = null) {
  editingProductId = product?.id || null;
  productForm.reset();
  colourList.replaceChildren();
  productForm.querySelector(".admin-form-title").textContent = product ? `Edit ${product.name}` : "Add product";
  productForm.elements.name.value = product?.name || "";
  productForm.elements.category.value = product?.category || currentCategories.keys().next().value || "";
  productForm.elements.price.value = product?.price || "";
  productForm.elements.sizes.value = product?.sizes?.join(", ") || "";
  productForm.elements.description.value = product?.description || "";
  productForm.elements.bestSeller.checked = Boolean(product?.bestSeller);
  productForm.elements.newArrival.checked = Boolean(product?.newArrival);
  productForm.elements.soldOut.checked = Boolean(product?.soldOut);
  productForm.querySelectorAll(".admin-editor-section").forEach((section) => {
    section.open = !mobileDashboard.matches || section.dataset.section === "essentials";
  });
  (product ? getVariants(product) : [{}]).forEach((colour) => addColourRow(colour));
  productForm.hidden = false;
  productForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeProductForm() {
  productForm.hidden = true;
  editingProductId = null;
  colourList.replaceChildren();
}

async function uploadPhotos(productId, row, uploadedPaths) {
  const state = colourFiles.get(row);
  const count = state.savedPhotos.length + state.newFiles.length;
  if (!count || count > 8) throw new Error("Each colour needs 1–8 photos.");
  const urls = [...state.savedPhotos];
  for (const file of state.newFiles) {
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type) || file.size > 8388608) {
      throw new Error("Photos must be JPG, PNG, WebP or AVIF, under 8 MB each.");
    }
    const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" }[file.type];
    const path = `${productId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from("product-images").upload(path, file, {
      contentType: file.type, upsert: false
    });
    if (error) throw error;
    uploadedPaths.push(path);
    urls.push(client.storage.from("product-images").getPublicUrl(path).data.publicUrl);
  }
  return urls;
}

async function saveProduct(event) {
  event.preventDefault();
  if (!productForm.reportValidity()) return;
  const sizes = [...new Set(productForm.elements.sizes.value.split(",").map((size) => size.trim()).filter(Boolean))];
  if (!sizes.length) return setStatus("Add at least one size.", true);
  const productId = editingProductId || `apx-${crypto.randomUUID()}`;
  const colourRows = [...colourList.children];
  const uploadedPaths = [];
  const saveButton = productForm.querySelector(".admin-save-product");
  saveButton.disabled = true;
  setStatus("Uploading photos and saving product…");
  try {
    const colours = [];
    for (const row of colourRows) {
      const name = row.querySelector('[data-field="name"]').value.trim();
      const hex = row.querySelector('[data-field="hex"]').value;
      if (!name) throw new Error("Each colour needs a name.");
      const photos = await uploadPhotos(productId, row, uploadedPaths);
      colours.push({ ...colourFiles.get(row).original, name, hex, image: photos[0], photos });
    }
    if (new Set(colours.map((colour) => colour.name.toLowerCase())).size !== colours.length) {
      throw new Error("Colour names must be unique within a product.");
    }
    const product = {
      ...(currentProducts.get(productId) || {}),
      id: productId,
      name: productForm.elements.name.value.trim(),
      category: productForm.elements.category.value,
      price: Number(productForm.elements.price.value),
      description: productForm.elements.description.value.trim(),
      sizes,
      bestSeller: productForm.elements.bestSeller.checked,
      newArrival: productForm.elements.newArrival.checked,
      soldOut: productForm.elements.soldOut.checked,
      colours,
      image: colours[0].image,
      imageAlt: `${productForm.elements.name.value.trim()} in ${colours[0].name}`
    };
    if (!Number.isSafeInteger(product.price) || product.price <= 0) throw new Error("Enter a valid naira price.");
    const { error } = await client.from("catalogue_products").upsert({
      id: productId, data: product, archived: false, updated_at: new Date().toISOString()
    });
    if (error) throw error;
    uploadedPaths.length = 0;
    closeProductForm();
    await loadCatalogue();
    setStatus(`${product.name} saved. Refresh the shop to see the change.`);
  } catch (error) {
    if (uploadedPaths.length) await client.storage.from("product-images").remove(uploadedPaths);
    setStatus(error.message || "Could not save product.", true);
  } finally {
    saveButton.disabled = false;
  }
}

async function archiveProduct(product) {
  if (!window.confirm(`Remove ${product.name} from the shop? You can restore it here later.`)) return;
  const { error } = await client.from("catalogue_products").upsert({
    id: product.id, data: product, archived: true, updated_at: new Date().toISOString()
  });
  if (error) return setStatus(error.message, true);
  await loadCatalogue();
  setStatus(`${product.name} removed from the shop.`);
}

async function restoreProduct(product) {
  const { error } = await client.from("catalogue_products").upsert({
    id: product.id, data: product, archived: false, updated_at: new Date().toISOString()
  });
  if (error) return setStatus(error.message, true);
  await loadCatalogue();
  setStatus(`${product.name} restored.`);
}

async function saveCategory(id, label, archived = false) {
  const { error } = await client.from("catalogue_categories").upsert({
    id, label, archived, updated_at: new Date().toISOString()
  });
  if (error) return setCategoryStatus(error.message, true);
  await loadCatalogue();
  setCategoryStatus(`Category ${archived ? "removed" : "saved"}.`);
}

async function renameCategory(category) {
  const label = window.prompt("New category name", category.label)?.trim();
  if (!label || label === category.label) return;
  await saveCategory(category.id, label);
}

async function archiveCategory(category) {
  if ([...currentProducts.values(), ...archivedProducts.values()]
    .some((product) => product.category === category.id)) {
    return setCategoryStatus("Move or remove products in this category first.", true);
  }
  if (!window.confirm(`Remove the ${category.label} category?`)) return;
  await saveCategory(category.id, category.label, true);
}

async function refreshAnalytics() {
  analyticsStatus.textContent = "Loading analytics…";
  const { data, error } = await client.rpc("admin_store_metrics");
  const metrics = data?.[0];
  if (error || !metrics) {
    analyticsStatus.textContent = "Analytics are unavailable. Apply store-analytics.sql in Supabase, then refresh.";
    return;
  }
  document.querySelector(".admin-views-today").textContent = Number(metrics.views_today).toLocaleString("en-NG");
  document.querySelector(".admin-views-today-detail").textContent = Number(metrics.views_today).toLocaleString("en-NG");
  document.querySelector(".admin-views-month").textContent = Number(metrics.views_30_days).toLocaleString("en-NG");
  document.querySelector(".admin-paid-orders").textContent = Number(metrics.paid_orders).toLocaleString("en-NG");
  document.querySelector(".admin-gross-revenue").textContent =
    `₦${BigInt(metrics.gross_revenue_naira).toLocaleString("en-NG")}`;
  document.querySelector(".admin-test-paid-orders").textContent =
    Number(metrics.test_paid_orders).toLocaleString("en-NG");
  analyticsStatus.textContent = "Updated from recorded views and verified payments.";
}

async function loadOrders() {
  ordersStatus.textContent = "Loading orders…";
  const { data, error } = await client.from("store_orders")
    .select("order_number, customer_name, customer_email, customer_phone, customer_notes, delivery_state, delivery_city, delivery_address, fulfilment, payment_method, payment_status, order_status, is_test, total_naira, items, created_at")
    .order("created_at", { ascending: false }).limit(100);
  if (error) {
    ordersStatus.textContent = "Orders are unavailable. Apply orders-fulfilment.sql in Supabase, then refresh.";
    return;
  }
  ordersList.replaceChildren();
  document.querySelector(".admin-order-count").textContent = String(data.length);
  const visibleOrders = data.filter((order) => ordersFilter.value === "all" ||
    (ordersFilter.value === "test") === order.is_test);
  ordersStatus.textContent = visibleOrders.length
    ? `Showing ${visibleOrders.length} of the most recent ${data.length} orders.`
    : `No ${ordersFilter.value === "all" ? "" : `${ordersFilter.value} `}orders in the most recent ${data.length}.`;
  visibleOrders.forEach((order) => {
    const card = document.createElement("details");
    const summary = document.createElement("summary");
    const details = document.createElement("div");
    card.className = "admin-order-card";
    summary.textContent = `${order.is_test ? "TEST · " : ""}${order.order_number} · ₦${order.total_naira.toLocaleString("en-NG")} · ${order.payment_status.replaceAll("_", " ")}`;
    const lines = [
      new Date(order.created_at).toLocaleString("en-NG"),
      `${order.customer_name} · ${order.customer_email} · ${order.customer_phone}`,
      `${order.fulfilment} · ${order.payment_method} · ${order.order_status}`,
      order.fulfilment === "delivery"
        ? `${order.delivery_address}, ${order.delivery_city}, ${order.delivery_state}` : "Pickup"
    ];
    if (order.customer_notes) lines.push(`Customer notes: ${order.customer_notes}`);
    (order.items || []).forEach((item) => lines.push(`${item.quantity} × ${item.name} · ${item.colour} · ${item.size}`));
    lines.forEach((line) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      details.append(paragraph);
    });
    const controls = document.createElement("div");
    const statusLabel = document.createElement("label");
    const statusSelect = document.createElement("select");
    const saveButton = document.createElement("button");
    controls.className = "admin-order-actions";
    statusLabel.textContent = "Fulfilment status";
    statusSelect.setAttribute("aria-label", `Fulfilment status for ${order.order_number}`);
    const statuses = order.is_test || !["paid", "pay_on_delivery"].includes(order.payment_status)
      ? [order.order_status, "cancelled"]
      : ["new", "confirmed", "dispatched", "completed", "cancelled"];
    [...new Set(statuses)].forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status.replaceAll("_", " ");
      statusSelect.append(option);
    });
    statusSelect.value = order.order_status;
    saveButton.type = "button";
    saveButton.className = "button button-secondary";
    saveButton.textContent = "Save status";
    saveButton.disabled = true;
    statusSelect.addEventListener("change", () => {
      saveButton.disabled = statusSelect.value === order.order_status;
    });
    saveButton.addEventListener("click", async () => {
      if (statusSelect.value === "cancelled" &&
          !window.confirm("Cancel this order? This does not refund a Paystack payment.")) return;
      saveButton.disabled = true;
      ordersStatus.textContent = `Updating ${order.order_number}…`;
      const { data: updated, error: updateError } = await client.from("store_orders")
        .update({ order_status: statusSelect.value })
        .eq("order_number", order.order_number)
        .select("order_status").single();
      if (updateError) {
        ordersStatus.textContent = `Could not update ${order.order_number}: ${updateError.message}`;
        saveButton.disabled = false;
        return;
      }
      order.order_status = updated.order_status;
      lines[2] = `${order.fulfilment} · ${order.payment_method} · ${order.order_status}`;
      details.querySelectorAll("p")[2].textContent = lines[2];
      ordersStatus.textContent = `${order.order_number} marked ${order.order_status}.`;
    });
    statusLabel.append(statusSelect);
    controls.append(statusLabel, saveButton);
    details.append(controls);
    card.append(summary, details);
    ordersList.append(card);
  });
}

if (!window.supabase?.createClient) {
  showGate("Service unavailable", "Please check your connection and refresh this page.");
} else {
  client = window.supabase.createClient(adminSupabaseUrl, adminSupabasePublishableKey);
  async function checkAccess() {
    const currentCheck = ++accessCheck;
    const { data: userData, error: userError } = await client.auth.getUser();
    if (currentCheck !== accessCheck) return;
    if (userError || !userData.user) {
      showGate("Sign in required", "Sign in to your account before opening the dashboard.", {
        href: "account.html", label: "Go to account"
      });
      return;
    }
    const { data, error } = await client.from("admin_users")
      .select("user_id").eq("user_id", userData.user.id).maybeSingle();
    if (currentCheck !== accessCheck) return;
    if (error) return showGate("Could not verify access", "Please try again later.");
    if (!data) {
      showGate("Access denied", "This account does not have admin access.", {
        href: "shop.html", label: "Back to shop"
      });
      return;
    }
    emailDisplay.textContent = userData.user.email || "Admin account";
    gate.hidden = true;
    dashboard.hidden = false;
    scheduleNavigationHighlight();
    try {
      await loadCatalogue();
    } catch (loadError) {
      setStatus(`Could not load the catalogue: ${loadError.message}`, true);
    }
    try {
      await loadDeliveryRates();
    } catch (loadError) {
      setDeliveryStatus("Delivery rates are unavailable. Apply delivery-rates.sql in Supabase, then refresh.", true);
    }
    refreshAnalytics();
    loadOrders();
    scheduleNavigationHighlight();
  }
  client.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      accessCheck++;
      closeProductForm();
      productList.replaceChildren();
      categoryList.replaceChildren();
      deliveryList.replaceChildren();
      deliveryRates = [];
      ordersList.replaceChildren();
      resetDeliveryForm();
      showGate("Sign in required", "Sign in to your account before opening the dashboard.", {
        href: "account.html", label: "Go to account"
      });
    }
  });
  signOutButton.addEventListener("click", async () => {
    signOutButton.disabled = true;
    const { error } = await client.auth.signOut();
    signOutButton.disabled = false;
    if (error) setStatus(error.message, true);
  });
  document.querySelector(".admin-new-product").addEventListener("click", () => openProductForm());
  productSearchInput.addEventListener("input", renderProducts);
  document.querySelector(".admin-cancel-edit").addEventListener("click", closeProductForm);
  document.querySelector(".admin-add-colour").addEventListener("click", () => addColourRow({}, true));
  productForm.addEventListener("invalid", (event) => {
    const colourRow = event.target.closest(".admin-colour-row");
    if (colourRow) colourRow.open = true;
    const section = event.target.closest(".admin-editor-section");
    if (section) section.open = true;
  }, true);
  mobileDashboard.addEventListener("change", () => {
    productForm.querySelectorAll(".admin-editor-section").forEach((section) => {
      section.open = !mobileDashboard.matches || section.dataset.section === "essentials";
    });
    colourList.querySelectorAll(".admin-colour-row").forEach((row, index) => {
      row.open = !mobileDashboard.matches || index === 0;
    });
  });
  productForm.addEventListener("submit", saveProduct);
  categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const label = categoryForm.elements.label.value.trim();
    const id = label.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!id) return setCategoryStatus("Use letters or numbers in the category name.", true);
    if (currentCategories.has(id)) return setCategoryStatus("That category already exists.", true);
    await saveCategory(id, label);
    categoryForm.reset();
  });
  document.querySelector(".admin-refresh-analytics").addEventListener("click", refreshAnalytics);
  document.querySelector(".admin-refresh-orders").addEventListener("click", loadOrders);
  ordersFilter.addEventListener("change", loadOrders);
  deliveryForm.addEventListener("submit", saveDeliveryRate);
  const navigationLinks = [...document.querySelectorAll(".admin-side-nav a")];
  const navigationSections = navigationLinks.map((link) => document.querySelector(link.hash));
  let navigationFrame = 0;

  function highlightNavigation() {
    if (dashboard.hidden) return;
    const focusLine = Math.min(window.innerHeight * 0.3, 220);
    let activeSection = navigationSections[0];
    for (const section of navigationSections) {
      if (section.getBoundingClientRect().top > focusLine) break;
      activeSection = section;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      activeSection = navigationSections[navigationSections.length - 1];
    }
    navigationLinks.forEach((link) => {
      const active = link.hash === `#${activeSection.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function scheduleNavigationHighlight() {
    if (navigationFrame) return;
    navigationFrame = window.requestAnimationFrame(() => {
      navigationFrame = 0;
      highlightNavigation();
    });
  }

  window.addEventListener("scroll", scheduleNavigationHighlight, { passive: true });
  window.addEventListener("resize", scheduleNavigationHighlight);
  window.addEventListener("hashchange", scheduleNavigationHighlight);
  checkAccess();
}
