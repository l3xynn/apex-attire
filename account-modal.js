const accountModal = document.createElement("dialog");
const accountModalClose = document.createElement("button");
const accountModalFrame = document.createElement("iframe");

accountModal.className = "account-modal";
accountModal.setAttribute("aria-label", "APEX ATTIRE account");
accountModalClose.type = "button";
accountModalClose.className = "account-modal-close";
accountModalClose.setAttribute("aria-label", "Close account window");
const closeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const closePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
closeIcon.setAttribute("viewBox", "0 0 24 24");
closeIcon.setAttribute("aria-hidden", "true");
closePath.setAttribute("d", "M6 6l12 12M18 6 6 18");
closePath.setAttribute("fill", "none");
closePath.setAttribute("stroke", "currentColor");
closePath.setAttribute("stroke-width", "2");
closePath.setAttribute("stroke-linecap", "round");
closeIcon.append(closePath);
accountModalClose.append(closeIcon);
accountModalFrame.title = "APEX ATTIRE account";
accountModalFrame.setAttribute("loading", "lazy");
accountModal.append(accountModalClose, accountModalFrame);
document.body.append(accountModal);

accountModalClose.addEventListener("click", () => accountModal.close());
accountModal.addEventListener("click", (event) => {
  if (event.target === accountModal) accountModal.close();
});

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href="account.html"]');
  if (!link || !window.matchMedia("(min-width: 761px)").matches ||
    event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  accountModalFrame.src = "account.html?embedded=1";
  accountModal.showModal();
  accountModalClose.focus();
});
