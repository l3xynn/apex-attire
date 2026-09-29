const storeConfig = {
  // Orders stay closed until a verified server-side checkout is connected.
  orderingEnabled: false,

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

  // Optional footer links. Leave as "" to keep them hidden.
  // WhatsApp: full number with country code, digits only, e.g. "2348012345678"
  // Instagram: your handle, e.g. "apexattire"
  whatsappNumber: "",
  instagramHandle: ""
};
