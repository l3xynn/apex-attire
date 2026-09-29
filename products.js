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
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
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
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
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
    description: "A checkered cropped shirt with a boxy, cut-short fit for easy layering.",
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
    description: "Checkered cropped shirts with a boxy, cut-short fit for easy layering.",
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
    description: "A classic polo with embroidered detailing, easy to dress up or down.",
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
    description: "A clean, classic polo in bright orange for a smart-casual look.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Orange",
    image: "images/lacoste.jpg",
    imageAlt: "Orange Lacoste polo"
  },
  {
    id: "apx-jjh-001",
    name: "Jean Jacket with Fur Hood",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A denim jacket with a warm fur-trimmed hood for cooler evenings.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Black",
    image: "images/jean jacket with fur.jpg",
    imageAlt: "Black APEX ATTIRE jean jacket"
  },
  {
    id: "apx-bls-001",
    name: "Balenciaga Long Sleeves",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A black and white long-sleeve top with bold branding.",
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
    description: "A relaxed grey long-sleeve top for everyday wear.",
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
    description: "A soft black sweatshirt with a relaxed fit for cooler days.",
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
    description: "A black long-sleeve top with a quarter-zip collar for easy layering.",
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
    description: "Soft, tapered joggers built for everyday comfort.",
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
    description: "Relaxed wide-leg sweatpants in soft grey, built for comfort.",
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
    description: "Black wide-leg jeans with a baggy, easy fit.",
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
    description: "A clean low-profile sneaker for everyday city wear.",
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
    description: "A classic low-profile Samba sneaker in white for everyday wear.",
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
    description: "A clean low-profile sneaker for everyday city wear.",
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
    description: "A clean low-profile sneaker for everyday city wear.",
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
    description: "A relaxed heavyweight hoodie built for cooler evenings.",
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
    description: "A relaxed heavyweight hoodie built for cooler evenings.",
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
    description: "A structured cap with a minimal, everyday streetwear profile.",
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
    description: "A polished silver-tone ring set for understated layering.",
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
    description: "A polished silver-tone hand chain for understated layering.",
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
    description: "Polished silver-tone nose rings for a subtle finish.",
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
    description: "Polished silver-tone Cuban link chains for layering.",
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
    description: "A silver-tone 2-piece bracelet set for everyday wear.",
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
    description: "A durable canvas tote for daily essentials.",
    sizes: ["One size"],
    colour: "Black",
    image: "images/black tote bag.jpg",
    imageAlt: "Canvas tote bag"
  },
  
  
];