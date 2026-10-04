const storeConfig = {
  // Checkout preview also requires the server-side ordering switch and test key.
  orderingEnabled: true,
  demoMode: true,
  demoEndsAt: "2026-10-06T03:38:33.000Z",

  // Shown in the black bar at the top. Set to "" to hide it.
  announcement: "Everyday pieces for your rotation.",

  currency: "NGN",
  currencySymbol: "₦",
  lagosDeliveryTime: "1–3 business days",
  nationwideDeliveryTime: "3–5 business days",
  pickupAvailable: true,
  maxQuantityPerItem: 10,

  deliveryStates: [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
    "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
    "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna",
    "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
    "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ],

  // Optional footer links. Leave as "" to keep them hidden.
  // WhatsApp: full number with country code, digits only, e.g. "2348012345678"
  // Instagram: your handle, e.g. "apexattire"
  whatsappNumber: "2348150778995",
  instagramHandle: ""
};
