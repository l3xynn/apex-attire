function startStorefront() {
  const script = document.createElement("script");
  script.src = "script.js?v=16";
  document.body.append(script);
}

catalogueReady.then(startStorefront, (error) => {
  console.warn("Live catalogue unavailable; products are temporarily unavailable.", error);
  hideUnverifiedCatalogue();
  startStorefront();
});
