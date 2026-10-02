import { readFileSync, readdirSync } from "node:fs";
import { runInNewContext } from "node:vm";

const root = new URL("../", import.meta.url);
const source = readFileSync(new URL("products.js", root), "utf8");
const context = {};
runInNewContext(source, context);

const filenames = new Set(readdirSync(new URL("images/", root)));
const missing = [];

for (const product of context.apexCatalogue.products) {
  const images = [product.image];
  for (const colour of product.colours || []) {
    images.push(colour.image, ...(colour.images || []));
  }
  for (const image of images) {
    if (typeof image !== "string" || !image.startsWith("images/")) continue;
    const filename = image.slice("images/".length);
    if (!filenames.has(filename)) missing.push(`${product.name}: ${image}`);
  }
}

if (missing.length) {
  process.stderr.write(`Image filenames must match exactly:\n${missing.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("All product image paths match their filenames.\n");
}
