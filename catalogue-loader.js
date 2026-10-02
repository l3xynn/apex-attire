let catalogueUnavailable = false;

function hideUnverifiedCatalogue() {
  catalogueUnavailable = true;
  products.splice(0, products.length);
}

const catalogueReady = (async () => {
  if (!window.supabase?.createClient) {
    hideUnverifiedCatalogue();
    return;
  }

  const client = window.supabase.createClient(
    "https://fzepfojrtalfayimnsnp.supabase.co",
    "sb_publishable_h0Kp4nIXdZkDePlB2JToqA_Us6h6OGt"
  );

  let timeoutId;
  const results = await Promise.race([Promise.all([
    client.from("catalogue_products").select("id, data, archived"),
    client.from("catalogue_categories").select("id, label, archived")
  ]), new Promise((resolve) => {
    timeoutId = setTimeout(() => resolve(null), 5000);
  })]);
  clearTimeout(timeoutId);

  if (!results) {
    console.warn("Live catalogue timed out; products are temporarily unavailable.");
    hideUnverifiedCatalogue();
    return;
  }
  const [productResult, categoryResult] = results;

  if (productResult.error || categoryResult.error) {
    console.warn("Live catalogue unavailable; products are temporarily unavailable.");
    hideUnverifiedCatalogue();
    return;
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  productResult.data.forEach((row) => {
    if (row.archived) productMap.delete(row.id);
    else if (row.data && row.data.id === row.id) productMap.set(row.id, row.data);
  });
  products.splice(0, products.length, ...productMap.values());

  const categoryMap = new Map(productCategories.map((category) => [category.id, category]));
  categoryResult.data.forEach((row) => {
    if (row.archived) categoryMap.delete(row.id);
    else categoryMap.set(row.id, { id: row.id, label: row.label });
  });
  productCategories.splice(0, productCategories.length, ...categoryMap.values());

})();
