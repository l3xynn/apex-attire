// Every product on the site lives here.
// To add, edit or remove a product, change this list. Nothing else needs touching.

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
    colour: "Black",
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
    imageAlt: "Green APEX ATTIRE oversized T-shirt"
  },
  {
    id: "apx-crp-001",
    name: "Cropped Shirt",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Checkered red & blue",
    image: "images/cropped shirt.jpg",
    imageAlt: "checkered cropped shirt"
  },
  {
    id: "apx-crp-001",
    name: "3 Cropped Shirts",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Checkered",
    image: "images/cropped shirts.jpg",
    imageAlt: "Checkered cropped shirts"
  },
  {
    id: "apx-tee-001",
    name: "Embroidered Polo",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Green",
    image: "images/embroidered polo.jpg",
    imageAlt: "Green embroidered polo"
  },
  {
    id: "apx-tee-001",
    name: "Lacoste Polo",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Orange",
    image: "images/lacoste.jpg",
    imageAlt: "Orange Lacoste polo"
  },
  {
    id: "apx-tee-001",
    name: "Jean Jacket with Fur Hood",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Blue",
    image: "images/jean jacket with fur.jpg",
    imageAlt: "Blue APEX ATTIRE jean jacket"
  },
  {
    id: "apx-tee-001",
    name: "Balenciaga Long Sleeves",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Black",
    image: "images/balenciaga long sleeves.jpg",
    imageAlt: "Black & White balenciaga long sleeves "
  },
  {
    id: "apx-tee-001",
    name: "Casual Longsleeve",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Grey",
    image: "images/grey shirt longsleeve.jpg",
    imageAlt: "Grey APEX ATTIRE longsleeve"
  },
  {
    id: "apx-tee-001",
    name: "Sweatshirt",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Black",
    image: "images/black sweat shirt.jpg",
    imageAlt: "Black APEX ATTIRE oversized T-shirt"
  },
  {
    id: "apx-tee-001",
    name: "Quarter Zip Long Sleeve",
    category: "apparel",
    bestSeller: true,
    price: 7000,
    description: "A heavyweight, relaxed-fit T-shirt designed for daily rotation.",
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
    id: "apx-jgr-001",
    name: "Wide-Leg Sweatpants",
    category: "pants",
    price: 22000,
    description: "Soft, tapered joggers built for everyday comfort.",
    sizes: ["S", "M", "L", "XL"],
    colour: "Grey",
    image: "images/wide-leg sweatpants.jpg",
    imageAlt: "Grey sweatpants"
  },
  {
    id: "apx-jgr-001",
    name: "Wide-Leg Baggy Jeans",
    category: "pants",
    price: 22000,
    description: "Soft, tapered joggers built for everyday comfort.",
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
    id: "apx-ads-001",
    name: "Adidas Samba",
    category: "shoes",
    price: 25000,
    description: "Soft, tapered joggers built for everyday comfort.",
    sizes: ["41", "42", "43", "44"],
    colour: "White",
    image: "images/adidas samba.jpg",
    imageAlt: "Adidas Samba"
  },
  {
    id: "apx-snk-001",
    name: "New Balance Sneakers",
    category: "shoes",
    price: 22000,
    description: "A clean low-profile sneaker for everyday city wear.",
    sizes: ["40", "41", "42", "43", "44"],
    colour: "Brown",
    image: "images/new balance 997.jpg",
    imageAlt: "Minimal white streetwear sneakers"
  },
  {
    id: "apx-snk-001",
    name: "Adidas Sneakers",
    category: "shoes",
    price: 22000,
    description: "A clean low-profile sneaker for everyday city wear.",
    sizes: ["40", "41", "42", "43", "44"],
    colour: "Brown",
    image: "images/Adidas shoes.jpg",
    imageAlt: "Minimal white streetwear sneakers"
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
    id: "apx-hdy-001",
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
    colour: "Beige",
    image: "images/NY beige cap.jpg",
    imageAlt: "Black streetwear cap"
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
    description: "A polished silver-tone ring set for understated layering.",
    sizes: ["One Size"],
    colour: "Silver",
    image: "images/hand chain.jpg",
    imageAlt: "Silver rings and jewellery"
  },
  {
    id: "apx-rng-001",
    name: "Nose Rings",
    category: "jewellery",
    price: 9000,
    description: "A polished silver-tone ring set for understated layering.",
    sizes: ["One size"],
    colour: "Silver",
    image: "images/nose rings.jpg",
    imageAlt: "Silver rings and jewellery"
  },
  {
    id: "apx-rng-001",
    name: "Cuban Link Chains",
    category: "jewellery",
    price: 9000,
    description: "A polished silver-tone ring set for understated layering.",
    sizes: ["One size"],
    colour: "Silver",
    image: "images/cuban link chain.jpg",
    imageAlt: "Silver rings and jewellery"
  },
  {
    id: "apx-brc-001",
    name: "2-Piece bracelet",
    category: "jewellery",
    price: 7500,
    description: "Soft, tapered joggers built for everyday comfort.",
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