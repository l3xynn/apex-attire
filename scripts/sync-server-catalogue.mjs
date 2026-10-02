import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const source = fileURLToPath(new URL("products.js", root));
const target = fileURLToPath(new URL("supabase/functions/_shared/base-products.js", root));
copyFileSync(source, target);
process.stdout.write("Server catalogue synced from products.js.\n");
