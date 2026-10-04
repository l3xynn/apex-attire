(() => {
  const pagePath = document.body.dataset.page;
  if (!["home", "shop"].includes(pagePath) || navigator.doNotTrack === "1") return;

  fetch("https://fzepfojrtalfayimnsnp.supabase.co/functions/v1/record-page-view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: pagePath }),
    keepalive: true
  }).catch(() => {});
})();
