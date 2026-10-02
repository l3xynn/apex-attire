// Every product on the site lives here.
// To add, edit or remove a product, change this list. Nothing else needs touching.
//
// VARIANTS (optional). A product with one colour just uses the plain
// `colour`, `image` and `imageAlt` fields. For several colours, add a
// `colours` list. Each colour can have:
//
//   colours: [
//     {
//       name: "Black",                   // required
//       hex: "#111111",                  // circle colour (common names like Black/White/Grey work without it)
//       image: "images/tee-black.jpg",   // photo shown when this colour is picked
//       imageAlt: "Black oversized tee",
//       price: 7500,                     // optional, only if this colour costs something different
//       unavailableSizes: ["XL"],        // optional, sizes that are out of stock in this colour
//       soldOut: true                    // optional, the whole colour is out of stock
//     },
//     { name: "White", hex: "#f5f5f5", image: "images/tee-white.jpg" }
//   ],
//
// A product can also have `unavailableSizes: ["S"]` at the top level to mark
// sizes that are out of stock in every colour.
//
// Optional `keywords: ["trainers", "kicks"]` adds extra words the search will match.
//
// Every product id must be unique: the bag uses it to tell items apart.

const productCategories = [
  { id: "apparel", label: "Apparel" },
  { id: "pants", label: "Pants"},
  { id: "shorts", label: "Shorts" },
  { id: "shoes", label: "Shoes" },
  { id: "caps", label: "Caps" },
  { id: "jewellery", label: "Jewellery" },
  { id: "totes", label: "Totes" },
  
];

const products = [
  {
    id: "apx-tee-001",
    name: "Oversized Tee",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "Roomy through the body and easy with denim or joggers. Pick the colour that suits the day.",
    sizes: ["S", "M", "L", "XL"],
    colours:
     [{ name: "Light Blue", hex: "#add8e6", image: "images/tee shirt blue.jpg" }, 
      { name: "Black", hex: "#000000", image: "images/tee shirt.jpg" }, 
      { name: "Green", hex: "#008000", image: "images/tee shirt green.jpg" }
    ],
    image: "images/tee shirt.jpg",
    imageAlt: "Black APEX ATTIRE oversized T-shirt"
  },
  {
    id: "apx-tee-002",
    name: "Regular Plain Tee",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "No big graphic, no extra noise. A plain tee for the days you want to keep the fit simple.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Green",
    image: "images/4 tees.jpg",
    imageAlt: "Green APEX ATTIRE regular plain T-shirt"
  },
  {
    id: "apx-crp-001",
    name: "Cropped Shirt",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A checkered shirt with a cropped, boxy shape. The piece that breaks up a plain fit.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Checkered red & blue",
    image: "images/cropped shirt.jpg",
    imageAlt: "checkered cropped shirt"
  },
  {
    id: "apx-crp-002",
    name: "3 Cropped Shirts",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "Checkered cropped shirts with an easy, boxy line. Keep the rest of the outfit clean.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Checkered",
    image: "images/cropped shirts.jpg",
    imageAlt: "Checkered cropped shirts"
  },
  {
    id: "apx-epl-001",
    name: "Embroidered Polo",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "The familiar polo shape, finished with embroidery. An easy step up from a basic tee.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Green",
    image: "images/embroidered polo.jpg",
    imageAlt: "Green embroidered polo"
  },
  {
    id: "apx-lpl-001",
    name: "Lacoste Polo",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "An orange Lacoste polo that does the talking. Keep the trousers and shoes simple.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Orange",
    image: "images/Lacoste.jpg",
    imageAlt: "Orange Lacoste polo"
  },
  {
    id: "apx-jjh-001",
    name: "Jean Jacket with Fur Hood",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "Denim with a fur-trimmed hood. The layer to reach for when the evening changes the plan.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Black",
    image: "images/Jean jacket with fur.jpg",
    imageAlt: "Black APEX ATTIRE jean jacket"
  },
  {
    id: "apx-bls-001",
    name: "Balenciaga Long Sleeves",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A black-and-white Balenciaga long sleeve with bold logo detail. Let the rest of the fit stay quiet.",
    sizes: ["S", "M", "L", "XL"],
    colours: 
    [{ name: "Black", hex: "#000000", image: "images/balenciaga long sleeves.jpg" },
     { name: "White", hex: "#ffffff", image: "images/balenciaga long sleeves.jpg" }],
    image: "images/balenciaga long sleeves.jpg",
    imageAlt: "Black and white Balenciaga long-sleeve top"
  },
  {
    id: "apx-cls-001",
    name: "Casual Longsleeve",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A grey long sleeve that works under a jacket or stands on its own.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Grey",
    image: "images/grey shirt longsleeve.jpg",
    imageAlt: "Grey APEX ATTIRE longsleeve"
  },
  {
    id: "apx-swh-001",
    name: "Sweatshirt",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "Black, uncomplicated and easy to pair. Wear it with denim, joggers or wide-leg trousers.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Black",
    image: "images/black sweat shirt.jpg",
    imageAlt: "Black APEX ATTIRE sweatshirt"
  },
  {
    id: "apx-qzl-001",
    name: "Quarter Zip Long Sleeve",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A black long sleeve with a quarter-zip neckline. Zip it up or leave it open.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Black",
    image: "images/quarter zip long sleeve.jpg",
    imageAlt: "Black APEX ATTIRE quarter zip long sleeve"
  },
  {
    id: "apx-jgr-001",
    name: "Relaxed Joggers",
    category: "pants",
    price: 22000,
    description: "Black tapered joggers for off-duty days that still call for a put-together fit.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Black",
    image: "images/black-joggers.jpg",
    imageAlt: "Black relaxed joggers"
  },
  {
    id: "apx-spt-001",
    name: "Wide-Leg Sweatpants",
    category: "pants",
    price: 22000,
    description: "Grey sweatpants with room through the leg. Give a fitted top some contrast.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Grey",
    image: "images/wide-leg sweatpants.jpg",
    imageAlt: "Grey sweatpants"
  },
  {
    id: "apx-bgg-001",
    name: "Wide-Leg Baggy Jeans",
    category: "pants",
    price: 22000,
    description: "Black denim with a wide, baggy profile. Let the shape lead the outfit.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Black",
    image: "images/black wide-leg jeans.jpg",
    imageAlt: "Black wide-leg jeans"
  },
  {
    id: "apx-snk-001",
    name: "Nike AF1",
    category: "shoes",
    price: 22000,
    description: "A white Nike Air Force 1 that goes with denim, sweats and almost everything between.",
    sizes: ["41", "42", "43", "44", "45"],
    colour: "White",
    image: "images/white sneakers.jpg",
    imageAlt: "Minimal white streetwear sneakers"
  },
  {
    id: "apx-ads-002",
    name: "Adidas Samba",
    category: "shoes",
    price: 25000,
    description: "White Adidas Sambas with a low profile. Sharp under wide-leg trousers or shorts.",
    sizes: ["41", "42", "43", "44"],
    colour: "White",
    image: "images/adidas samba.jpg",
    imageAlt: "Adidas Samba"
  },
  {
    id: "apx-snk-003",
    name: "New Balance Sneakers",
    category: "shoes",
    price: 22000,
    description: "Brown New Balance sneakers that add a little texture to a pared-back fit.",
    sizes: ["40", "41", "42", "43", "44"],
    colour: "Brown",
    image: "images/new balance 997.jpg",
    imageAlt: "Brown New Balance sneakers"
  },
  {
    id: "apx-snk-004",
    name: "Adidas Sneakers",
    category: "shoes",
    price: 22000,
    description: "Brown Adidas sneakers for a quieter switch from an all-white pair.",
    sizes: ["40", "41", "42", "43", "44"],
    colour: "Brown",
    image: "images/Adidas shoes.jpg",
    imageAlt: "Brown Adidas sneakers"
  },
  {
    id: "apx-hdy-001",
    name: "Heavyweight Hoodie",
    category: "apparel",
    price: 15000,
    description: "A grey hoodie with a relaxed outline. Throw it on when the day runs late.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Grey",
    image: "images/grey hoodie.jpg",
    imageAlt: "Neutral oversized hoodie"
  },
  {
    id: "apx-hdy-002",
    name: "Two-tone Thermal Hoodie",
    category: "apparel",
    price: 25000,
    description: "Two tones, one standout layer. Zip it over a plain tee and let it lead.",
    sizes: ["L", "XL"],
    colour: "Two-toned",
    image: "images/two tone letter and tropical print zipup thermal hoodie without tee.jpg",
    imageAlt: "Two-tone hoodie"
  },
  {
    id: "apx-cap-001",
    name: "NY Face cap",
    category: "caps",
    price: 4500,
    description: "An NY cap in beige or deep blue. The easy finish when the rest of the fit is sorted.",
    sizes: ["One size"],
    colours:
     [{ name: "Beige", hex: "#f5f5dc", image: "images/NY beige cap.jpg" },
      { name: "Deep Blue", hex: "#03034b", image: "images/NY blue cap.jpg" }
     ],
    image: "images/NY beige cap.jpg",
    imageAlt: "Beige NY face cap"
  },
  {
    id: "apx-rng-001",
    name: "Silver Ring Set",
    category: "jewellery",
    price: 9000,
    description: "Silver-tone rings you can wear one at a time or stack together.",
    sizes: ["Adjustable"],
    colour: "Silver",
    image: "images/rings.jpg",
    imageAlt: "Silver rings and jewellery"
  },
  {
    id: "apx-hcn-001",
    name: "Hand Chain",
    category: "jewellery",
    price: 9000,
    description: "A silver-tone hand chain that brings a small detail into focus.",
    sizes: ["One Size"],
    colour: "Silver",
    image: "images/hand chain.jpg",
    imageAlt: "Silver hand chain"
  },
  {
    id: "apx-nrs-001",
    name: "Nose Rings",
    category: "jewellery",
    price: 9000,
    description: "Silver-tone nose rings for a small change that still gets noticed.",
    sizes: ["One size"],
    colour: "Silver",
    image: "images/nose rings.jpg",
    imageAlt: "Silver nose rings"
  },
  {
    id: "apx-cbl-001",
    name: "Cuban Link Chains",
    category: "jewellery",
    price: 9000,
    description: "Silver-tone Cuban links that give a simple neckline more presence.",
    sizes: ["One size"],
    colour: "Silver",
    image: "images/cuban link chain.jpg",
    imageAlt: "Silver Cuban link chains"
  },
  {
    id: "apx-brc-001",
    name: "2-Piece bracelet",
    category: "jewellery",
    price: 7500,
    description: "Two silver-tone bracelets. Wear them together or split them across outfits.",
    sizes: ["One Size"],
    colour: "Silver",
    image: "images/2 piece bracelet.jpg",
    imageAlt: "Silver 2-piece men's bracelet"
  },
  {
    id: "apx-tote-001",
    name: "Canvas Carry Tote",
    category: "totes",
    price: 8500,
    description: "A black canvas tote for the things that won't fit in your pockets.",
    sizes: ["One size"],
    colour: "Black",
    image: "images/black tote bag.jpg",
    imageAlt: "Canvas tote bag"
  },
  
  
];

const catalogueAdditions = [
  ["Boxy Everyday Tee", "apparel", 9500, "boxy everyday tee.jpg"],
  ["Washed Graphic Tee", "apparel", 10500, "washed graphic tee.jpg"],
  ["Relaxed Long Sleeve", "apparel", 12000, "relaxed long sleeve.jpg"],
  ["Everyday Sweatshirt", "apparel", 16000, "everyday sweatshirt.jpg"],
  ["Minimal Crewneck", "apparel", 15500, "minimal crewneck.jpg"],
  ["Street Zip Hoodie", "apparel", 19500, "street zip hoodie.jpg"],
  ["Layering Overshirt", "apparel", 18500, "layering overshirt.jpg"],
  ["Relaxed Polo", "apparel", 14500, "Relaxed polo.jpg"],
  ["Wide-Leg Denim", "pants", 24500, "Wide-Leg Denim.jpg"],
  ["Utility Joggers", "pants", 21000, "Utility Joggers.jpg"],
  ["Soft Fleece Trousers", "pants", 19500, "Soft Fleece Trousers.jpg"],
  ["Everyday Cargo Pants", "pants", 23000, "Cargo Pants.jpg"],
  ["Relaxed Cotton Shorts", "shorts", 14500, "Relaxed cotton shorts.jpg"],
  ["Utility Cargo Shorts", "shorts", 18000, "Utility cargo shorts.jpg"],
  ["Washed Denim Shorts", "shorts", 19500, "Washed denim shorts.jpg"],
  ["Everyday Jersey Shorts", "shorts", 13500, "Everyday Jersey shorts.jpg"],
  ["Lightweight Nylon Shorts", "shorts", 16000, "Lightweight nylon shorts.jpg"],
  ["Wide-Leg Street Shorts", "shorts", 17000, "wide-leg street shorts.jpg"],
  ["Low-Top City Sneakers", "shoes", 27500, "low-top city sneakers.jpg"],
  ["Retro Runner", "shoes", 29500, "retro runner.jpg"],
  ["Classic Court Sneaker", "shoes", 26500, "classic court sneaker.jpg"],
  ["Canvas Daily Tote", "totes", 8500, "graphic tote.jpg"],
  ["Everyday Baseball Cap", "caps", 6500, "everyday baseball cap.jpg"],
  ["Minimal Chain", "jewellery", 9500, "minimal chain.jpg"],
  ["Stacking Ring Set", "jewellery", 8000, "stacking ring set.jpg"],
  ["Layering Bracelet", "jewellery", 7500, "layering bracelet.jpg"]
];

catalogueAdditions.forEach(([name, category, price, photo], index) => {
  const image = `images/${photo}`;
  products.push({
    id: `apx-catalogue-${String(index + 1).padStart(2, "0")}`,
    name,
    category,
    price,
    newArrival: true,
    description: `${name} from the APEX ATTIRE selection.`,
    sizes: category === "shoes" ? ["40", "41", "42", "43", "44"]
      : ["caps", "jewellery", "totes"].includes(category) ? ["One size"]
      : ["S", "M", "L", "XL"],
    colour: "As pictured",
    image,
    imageAlt: name
  });
});

globalThis.apexCatalogue = { products, productCategories };
