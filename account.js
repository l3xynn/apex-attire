const supabaseUrl = "https://fzepfojrtalfayimnsnp.supabase.co";
const supabasePublishableKey = "sb_publishable_h0Kp4nIXdZkDePlB2JToqA_Us6h6OGt";

const form = document.querySelector(".account-form");
const tabs = document.querySelectorAll(".account-tab");
const title = document.querySelector(".account-form-title");
const intro = document.querySelector(".account-form-intro");
const submitButton = document.querySelector(".account-submit");
const passwordInput = document.querySelector("#account-password");
const passwordToggles = document.querySelectorAll(".account-password-toggle");
const forgotPasswordButton = document.querySelector(".account-forgot-password");
const recoveryRequestForm = document.querySelector(".account-recovery-request");
const recoveryUpdateForm = document.querySelector(".account-recovery-update");
const backToSignInButton = document.querySelector(".account-back-to-sign-in");
const confirmField = document.querySelector(".account-confirm-field");
const signupFields = document.querySelector(".account-signup-fields");
const stateSelect = document.querySelector("#signup-state");
const message = document.querySelector(".account-message");
const signedIn = document.querySelector(".account-signed-in");
const emailDisplay = document.querySelector(".account-email-display");
const accountInformation = document.querySelector(".account-information");
const accountDetailsStatus = document.querySelector(".account-details-status");
const nameDisplay = document.querySelector(".account-name-display");
const phoneDisplay = document.querySelector(".account-phone-display");
const profileForm = document.querySelector(".account-profile-form");
const addressForm = document.querySelector(".account-address-form");
const addressList = document.querySelector(".account-address-list");
const addressEmpty = document.querySelector(".account-address-empty");
const addressStateSelect = document.querySelector("#account-address-state");
const signOutButton = document.querySelector(".account-sign-out");
const retrySetupButton = document.querySelector(".account-retry-setup");
const adminLink = document.querySelector(".admin-account-link");
const verificationReturn = window.location.hash.includes("access_token=") ||
  new URLSearchParams(window.location.search).has("code");
let isPasswordRecovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
let recoverySessionReady = false;
const phonePattern = /^(?:\+?234|0)[789][01]\d{8}$/;
let mode = "sign-in";
let currentUserId = null;
let client = null;
let accountView = "normal";
let currentProfile = null;
let currentAddresses = [];
let editingAddressId = null;
let detailsVersion = 0;

if (new URLSearchParams(window.location.search).has("embedded")) {
  document.body.classList.add("is-embedded");
}

(storeConfig.deliveryStates || []).forEach((state) => {
  [stateSelect, addressStateSelect].forEach((select) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    select.append(option);
  });
});

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("is-error", isError);
  message.hidden = !text;
}

function setSetupPending(isPending) {
  accountInformation.hidden = isPending;
  retrySetupButton.hidden = !isPending;
}

function showDetailsStatus(text, isError = false) {
  accountDetailsStatus.textContent = text;
  accountDetailsStatus.classList.toggle("is-error", isError);
  accountDetailsStatus.hidden = !text;
}

function renderAddresses() {
  addressList.replaceChildren();
  addressEmpty.hidden = currentAddresses.length > 0;
  currentAddresses.forEach((address) => {
    const card = document.createElement("div");
    const title = document.createElement("strong");
    const lines = document.createElement("p");
    const actions = document.createElement("div");
    const editButton = document.createElement("button");
    const removeButton = document.createElement("button");
    card.className = "account-address-card";
    title.textContent = address.label;
    lines.textContent = [address.address_line1, address.address_line2, address.city, address.state, address.postal_code]
      .filter(Boolean).join(", ");
    actions.className = "account-address-actions";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.setAttribute("aria-label", `Edit ${address.label} address`);
    editButton.addEventListener("click", () => openAddressForm(address));
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${address.label} address`);
    removeButton.addEventListener("click", () => removeAddress(address, removeButton));
    actions.append(editButton, removeButton);
    card.append(title, lines, actions);
    addressList.append(card);
  });
}

async function loadAccountDetails(userId) {
  const version = ++detailsVersion;
  showDetailsStatus("Loading your details…");
  const [profileResult, addressResult] = await Promise.all([
    client.from("customer_profiles").select("full_name, phone").eq("id", userId).maybeSingle(),
    client.from("delivery_addresses")
      .select("id, label, address_line1, address_line2, city, state, postal_code")
      .eq("user_id", userId).order("created_at", { ascending: false })
  ]);
  if (currentUserId !== userId || version !== detailsVersion) return false;
  if (profileResult.error || addressResult.error) {
    showDetailsStatus("Could not load your details. Please refresh and try again.", true);
    return false;
  }
  currentProfile = profileResult.data;
  currentAddresses = addressResult.data || [];
  nameDisplay.textContent = currentProfile?.full_name || "Not added yet";
  phoneDisplay.textContent = currentProfile?.phone || "Not added yet";
  renderAddresses();
  showDetailsStatus("");
  return true;
}

function setPasswordVisibility(button, visible) {
  const input = document.getElementById(button.getAttribute("aria-controls"));
  input.type = visible ? "text" : "password";
  button.textContent = visible ? "Hide" : "Show";
  button.setAttribute("aria-label", `${visible ? "Hide" : "Show"} ${input.labels[0].textContent.trim().toLowerCase()}`);
  button.setAttribute("aria-pressed", String(visible));
  button.hidden = !input.value;
}

passwordToggles.forEach((button) => {
  const input = document.getElementById(button.getAttribute("aria-controls"));
  button.addEventListener("click", () => {
    setPasswordVisibility(button, input.type === "password");
  });
  input.addEventListener("input", () => {
    if (input.value) button.hidden = false;
    else setPasswordVisibility(button, false);
  });
  input.addEventListener("change", () => { button.hidden = !input.value; });
  input.addEventListener("focus", () => { button.hidden = !input.value; });
});

function setAccountView(view) {
  accountView = view;
  form.hidden = view !== "normal";
  document.querySelector(".account-tabs").hidden = view !== "normal";
  signedIn.hidden = true;
  recoveryRequestForm.hidden = view !== "request";
  recoveryUpdateForm.hidden = view !== "update";
  passwordToggles.forEach((button) => setPasswordVisibility(button, false));
}

function setMode(nextMode) {
  mode = nextMode;
  const signingUp = mode === "sign-up";
  title.textContent = signingUp ? "Join the APEX side" : "Welcome back";
  intro.textContent = signingUp
    ? "Set up your account once. Your details will be ready when ordering opens."
    : "Sign in and get straight back to the shop.";
  submitButton.textContent = signingUp ? "Create account" : "Sign in";
  passwordInput.autocomplete = signingUp ? "new-password" : "current-password";
  passwordToggles.forEach((button) => setPasswordVisibility(button, false));
  forgotPasswordButton.hidden = signingUp;
  signupFields.hidden = !signingUp;
  confirmField.hidden = !signingUp;
  signupFields.querySelectorAll("input, select").forEach((field) => {
    field.disabled = !signingUp;
  });
  confirmField.querySelector("input").disabled = !signingUp;
  tabs.forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
  showMessage("");
}

function showUser(user) {
  if (accountView !== "normal") return;
  const hasUser = Boolean(user);
  signedIn.hidden = !hasUser;
  form.hidden = hasUser;
  document.querySelector(".account-tabs").hidden = hasUser;
  emailDisplay.textContent = user?.email || "your account";
  const nextUserId = user?.id || null;
  if (nextUserId === currentUserId) return;
  currentUserId = nextUserId;
  detailsVersion += 1;
  adminLink.hidden = true;
  setSetupPending(false);
  profileForm.hidden = true;
  addressForm.hidden = true;
  currentProfile = null;
  currentAddresses = [];
  nameDisplay.textContent = "—";
  phoneDisplay.textContent = "—";
  addressList.replaceChildren();
  addressEmpty.hidden = true;
  showDetailsStatus("");
  if (nextUserId) {
    loadAccountDetails(nextUserId);
    setTimeout(async () => {
      const { data, error } = await client.from("admin_users")
        .select("user_id").eq("user_id", nextUserId).maybeSingle();
      if (currentUserId === nextUserId && !error && data) adminLink.hidden = false;
    }, 0);
  }
}

function openAddressForm(address = null) {
  editingAddressId = address?.id || null;
  addressForm.reset();
  addressForm.elements.label.value = address?.label || "";
  addressForm.elements.addressLine1.value = address?.address_line1 || "";
  addressForm.elements.addressLine2.value = address?.address_line2 || "";
  addressForm.elements.city.value = address?.city || "";
  addressForm.elements.state.value = address?.state || "";
  addressForm.elements.postalCode.value = address?.postal_code || "";
  addressForm.querySelector('[type="submit"]').textContent = address ? "Save changes" : "Save address";
  addressForm.hidden = false;
  addressForm.elements.label.focus();
}

async function removeAddress(address, button) {
  if (!window.confirm(`Remove your ${address.label} address?`)) return;
  const userId = currentUserId;
  button.disabled = true;
  showDetailsStatus("");
  const { error } = await client.from("delivery_addresses").delete()
    .eq("id", address.id).eq("user_id", userId);
  if (currentUserId !== userId) return;
  button.disabled = false;
  if (error) return showDetailsStatus("Could not remove the address. Please try again.", true);
  currentAddresses = currentAddresses.filter((item) => item.id !== address.id);
  if (editingAddressId === address.id) addressForm.hidden = true;
  renderAddresses();
  showDetailsStatus("Address removed.");
}

document.querySelector(".account-edit-profile").addEventListener("click", () => {
  profileForm.elements.fullName.value = currentProfile?.full_name || "";
  profileForm.elements.phone.value = currentProfile?.phone || "";
  profileForm.hidden = false;
  profileForm.elements.fullName.focus();
});

document.querySelector(".account-cancel-profile").addEventListener("click", () => {
  profileForm.hidden = true;
});

document.querySelector(".account-add-address").addEventListener("click", () => openAddressForm());
document.querySelector(".account-cancel-address").addEventListener("click", () => {
  addressForm.hidden = true;
  editingAddressId = null;
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!profileForm.reportValidity() || !currentUserId) return;
  const fullName = profileForm.elements.fullName.value.trim();
  const phone = profileForm.elements.phone.value.trim();
  if (!fullName || !phonePattern.test(phone.replace(/[\s-]/g, ""))) {
    showDetailsStatus("Enter your name and a valid Nigerian phone number.", true);
    return;
  }
  const userId = currentUserId;
  const button = profileForm.querySelector('[type="submit"]');
  button.disabled = true;
  showDetailsStatus("");
  const { error } = await client.from("customer_profiles").upsert({
    id: userId, full_name: fullName, phone, updated_at: new Date().toISOString()
  }, { onConflict: "id" });
  button.disabled = false;
  if (currentUserId !== userId) return;
  if (error) return showDetailsStatus("Could not save your details. Please try again.", true);
  currentProfile = { full_name: fullName, phone };
  nameDisplay.textContent = fullName;
  phoneDisplay.textContent = phone;
  profileForm.hidden = true;
  showDetailsStatus("Personal information saved.");
});

addressForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!addressForm.reportValidity() || !currentUserId) return;
  const userId = currentUserId;
  const addressId = editingAddressId;
  const address = {
    label: addressForm.elements.label.value.trim(),
    address_line1: addressForm.elements.addressLine1.value.trim(),
    address_line2: addressForm.elements.addressLine2.value.trim() || null,
    city: addressForm.elements.city.value.trim(),
    state: addressForm.elements.state.value,
    postal_code: addressForm.elements.postalCode.value.trim() || null
  };
  if (!address.label || !address.address_line1 || !address.city || !address.state) {
    showDetailsStatus("Complete the required address fields.", true);
    return;
  }
  const button = addressForm.querySelector('[type="submit"]');
  button.disabled = true;
  showDetailsStatus("");
  const request = addressId
    ? client.from("delivery_addresses").update(address).eq("id", addressId).eq("user_id", userId)
    : client.from("delivery_addresses").insert({ ...address, user_id: userId });
  const { error } = await request;
  button.disabled = false;
  if (currentUserId !== userId) return;
  if (error) return showDetailsStatus("Could not save the address. Please try again.", true);
  addressForm.hidden = true;
  editingAddressId = null;
  if (await loadAccountDetails(userId)) showDetailsStatus("Address saved.");
});

async function saveSignupDetails(user) {
  const details = user?.user_metadata?.apex_signup;
  if (!details) return;
  const fullName = String(details.fullName || "").trim().slice(0, 120);
  const phone = String(details.phone || "").trim().slice(0, 30);
  const address = details.address || {};
  if (!fullName || !phone || !address.line1 || !address.city || !address.state) {
    throw new Error("Your signup details are incomplete. Please contact APEX ATTIRE.");
  }

  const { error: profileError } = await client.from("customer_profiles").upsert({
    id: user.id,
    full_name: fullName,
    phone,
    updated_at: new Date().toISOString()
  }, { onConflict: "id" });
  if (profileError) throw profileError;

  const { data: existing, error: readError } = await client.from("delivery_addresses")
    .select("id").eq("user_id", user.id).limit(1);
  if (readError) throw readError;
  if (!existing.length) {
    const { error: addressError } = await client.from("delivery_addresses").insert({
      user_id: user.id,
      label: String(address.label || "Home").slice(0, 60),
      address_line1: String(address.line1).slice(0, 200),
      address_line2: String(address.line2 || "").slice(0, 200) || null,
      city: String(address.city).slice(0, 100),
      state: String(address.state).slice(0, 100),
      postal_code: String(address.postalCode || "").slice(0, 20) || null
    });
    if (addressError) throw addressError;
  }

  await client.auth.updateUser({ data: { apex_signup: null } });
}

function goToShop() {
  const shopUrl = new URL("shop.html", window.location.href).href;
  if (window.parent !== window) window.parent.location.assign(shopUrl);
  else window.location.assign(shopUrl);
}

tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.mode)));
setMode("sign-in");

forgotPasswordButton.addEventListener("click", () => {
  recoveryRequestForm.elements.email.value = form.elements.email.value.trim();
  setAccountView("request");
  showMessage("");
  recoveryRequestForm.elements.email.focus();
});

backToSignInButton.addEventListener("click", () => {
  setAccountView("normal");
  setMode("sign-in");
});

if (!window.supabase?.createClient) {
  showMessage("Account service could not load. Please check your connection and refresh.", true);
  form.hidden = true;
} else {
  client = window.supabase.createClient(supabaseUrl, supabasePublishableKey);

  client.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      isPasswordRecovery = true;
      recoverySessionReady = true;
      setAccountView("update");
      showMessage("");
    } else if (event === "SIGNED_OUT") showUser(null);
    else if (session?.user) showUser(session.user);
  });

  client.auth.getUser().then(async ({ data, error }) => {
    if (error || !data.user) {
      if (isPasswordRecovery) {
        setAccountView("request");
        showMessage("This reset link is invalid or expired. Request a new one.", true);
      }
      showUser(null);
      return;
    }
    if (isPasswordRecovery) {
      if (recoverySessionReady) setAccountView("update");
      else {
        setAccountView("request");
        showMessage("This reset link is invalid or expired. Request a new one.", true);
      }
      return;
    }
    showUser(data.user);
    if (verificationReturn) {
      try {
        await saveSignupDetails(data.user);
        goToShop();
      } catch (saveError) {
        setSetupPending(true);
        showMessage(saveError.message || "Could not finish setting up your account.", true);
      }
    }
  });

  recoveryRequestForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!recoveryRequestForm.reportValidity()) return;
    const button = recoveryRequestForm.querySelector('[type="submit"]');
    button.disabled = true;
    showMessage("");
    try {
      const { error } = await client.auth.resetPasswordForEmail(
        recoveryRequestForm.elements.email.value.trim(),
        { redirectTo: new URL("account.html", window.location.href).href }
      );
      if (error) throw error;
      showMessage("If that email has an account, you’ll receive a reset link shortly. Check your inbox and spam folder.");
    } catch (requestError) {
      showMessage(requestError.message || "Could not send a reset link. Please try again.", true);
    } finally {
      button.disabled = false;
    }
  });

  recoveryUpdateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!recoveryUpdateForm.reportValidity()) return;
    const password = recoveryUpdateForm.elements.password.value;
    if (!recoverySessionReady) {
      showMessage("Your reset link is invalid or expired. Request a new one.", true);
      return;
    }
    if (password !== recoveryUpdateForm.elements.confirmPassword.value) {
      showMessage("Passwords do not match.", true);
      return;
    }
    const button = recoveryUpdateForm.querySelector('[type="submit"]');
    button.disabled = true;
    showMessage("");
    try {
      const { data, error: sessionError } = await client.auth.getUser();
      if (sessionError || !data.user) throw new Error("Your reset link has expired. Request a new one.");
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
      recoveryUpdateForm.reset();
      await client.auth.signOut();
      isPasswordRecovery = false;
      recoverySessionReady = false;
      setAccountView("normal");
      setMode("sign-in");
      showMessage("Password updated. Sign in with your new password.");
    } catch (updateError) {
      showMessage(updateError.message || "Could not update your password. Please try again.", true);
    } finally {
      button.disabled = false;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    if (mode === "sign-up") {
      if (password !== form.elements.confirmPassword.value) {
        showMessage("Passwords do not match.", true);
        return;
      }
      if (!phonePattern.test(form.elements.phone.value.trim().replace(/[\s-]/g, ""))) {
        showMessage("Enter a valid Nigerian phone number.", true);
        return;
      }
    }

    submitButton.disabled = true;
    showMessage("");
    try {
      if (mode === "sign-up") {
        const signupData = {
          fullName: form.elements.fullName.value.trim(),
          phone: form.elements.phone.value.trim(),
          address: {
            label: form.elements.addressLabel.value.trim(),
            line1: form.elements.addressLine1.value.trim(),
            line2: form.elements.addressLine2.value.trim(),
            city: form.elements.city.value.trim(),
            state: form.elements.state.value,
            postalCode: form.elements.postalCode.value.trim()
          }
        };
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: { apex_signup: signupData },
            emailRedirectTo: new URL("account.html", window.location.href).href
          }
        });
        if (error) throw error;
        form.reset();
        if (data.session && data.user) {
          try {
            await saveSignupDetails(data.user);
          } catch (saveError) {
            setSetupPending(true);
            throw saveError;
          }
          goToShop();
        } else {
          setMode("sign-in");
          showMessage("Check your email to confirm your account. We’ll finish saving your details after confirmation.");
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        try {
          await saveSignupDetails(data.user);
        } catch (saveError) {
          setSetupPending(true);
          throw saveError;
        }
        goToShop();
      }
    } catch (submitError) {
      showMessage(submitError.message || "Something went wrong. Please try again.", true);
    } finally {
      submitButton.disabled = false;
    }
  });

  signOutButton.addEventListener("click", async () => {
    signOutButton.disabled = true;
    const { error } = await client.auth.signOut();
    signOutButton.disabled = false;
    if (error) showMessage(error.message, true);
    else {
      showUser(null);
      setMode("sign-in");
    }
  });

  retrySetupButton.addEventListener("click", async () => {
    retrySetupButton.disabled = true;
    showMessage("");
    try {
      const { data, error } = await client.auth.getUser();
      if (error || !data.user) throw error || new Error("Please sign in again.");
      await saveSignupDetails(data.user);
      setSetupPending(false);
      goToShop();
    } catch (setupError) {
      showMessage(setupError.message || "Could not finish account setup.", true);
    } finally {
      retrySetupButton.disabled = false;
    }
  });
}
