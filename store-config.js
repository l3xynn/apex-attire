const storeConfig = {
  // true = the bag's Checkout button works (demo checkout)
  orderingEnabled: true,

  // Shown in the black bar at the top. Set to "" to hide it.
  announcement: "Online orders coming soon!",

  currency: "NGN",
  currencySymbol: "₦",
  deliveryFee: 2500,
  deliveryTime: "1–3 business days",
  pickupAvailable: true,
  exchangeWindowDays: 2,
  maxQuantityPerItem: 10,

  // Options in the checkout "Delivery area" dropdown
  deliveryAreas: [
    "Ikeja",
    "Lekki",
    "Victoria Island",
    "Ikoyi",
    "Yaba",
    "Surulere",
    "Ajah",
    "Maryland",
    "Gbagada",
    "Ikorodu",
    "Epe",
    "Badagry",
    "Other (Lagos State)"
  ],

  // Paste your Paystack TEST public key between the quotes (starts with pk_test_).
  // Never paste a secret key (sk_...) here.
  // Leave as "" to hide the "Pay online" option.
  paystackPublicKey: "pk_test_30740eb6a1e3de76b019f7f24c170d9eab8d4812",

  // Optional footer links. Leave as "" to keep them hidden.
  // WhatsApp: full number with country code, digits only, e.g. "2348012345678"
  // Instagram: your handle, e.g. "apexattire"
  whatsappNumber: "",
  instagramHandle: ""
};