// Reprice products using real supplier (Senator Nnamdi) WhatsApp quotes.
// Prices are NGN, category-clustered; supplier stated category rules explicitly
// (e.g. "All Joggers is 40k", "All two piece are 70k", "Double breasted suit-100k").
import fs from "node:fs";
import path from "node:path";

const dataPath = path.join(process.cwd(), "src", "data", "products.json");
const products = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const has = (s, ...words) => words.some((w) => s.includes(w));

function priceFor(p) {
  const c = p.category;
  const s = `${p.subcategory || ""} ${p.name || ""} ${(p.tags || []).join(" ")}`.toLowerCase();

  switch (c) {
    case "jeans": {
      if (has(s, "short")) return 30000;                         // "Short jean 30k"
      if (has(s, "baggy", "boot", "wide", "cargo", "flared", "carpenter", "drop-crotch", "relaxed")) return 50000; // "Baggy Jean 50k", "Boot cut 50k"
      return 40000;                                              // "The rest are 40k"
    }
    case "chinos": {
      if (has(s, "jogger", "sweatpant", "lounge", "drawstring", "sweat")) return 40000; // "All Joggers is 40k"
      if (has(s, "cargo", "flared", "boot")) return 50000;       // Fela/cargo/bootcut 50k
      return 40000;                                              // "Chinos pant 40k"
    }
    case "t-shirts": {
      if (has(s, "knit", "pullover", "vest", "sweat")) return 40000; // sweat top 40k
      return 30000;                                              // "Inner shirt 30k"
    }
    case "polo-shirts":
      return 40000;                                              // "Neated polo 40k", "Long sleeve polo 40k"
    case "shirts": {
      if (has(s, "co-ord", "coord", "set")) return 60000;
      return 40000;
    }
    case "jackets": {
      if (has(s, "vest", "gilet")) return 40000;
      return 60000;                                              // "Jacket - 60k"
    }
    case "blazers":
      return 90000;                                              // 90k mannequin blazers
    case "suits": {
      if (has(s, "two", "2-piece", "2 piece")) return 70000;    // "All two piece are 70k"
      if (has(s, "three", "3-piece", "3 piece")) return 120000;
      return 100000;
    }
    case "double-breasted-suits":
      return 100000;                                             // "Double breasted suit-100k"
    case "tuxedos":
      return 90000;                                              // "Tuxedo suit-90k"
    case "sneakers":
      return 70000;                                              // sneakers 70k
    case "corporate-shoes": {
      if (has(s, "monk", "wholecut", "whole-cut")) return 120000;
      return 100000;                                             // dress shoes 100k-120k
    }
    case "casual-shoes": {
      if (has(s, "loafer", "horsebit", "mule", "slip-on")) return 100000; // loafers 100k-120k
      return 90000;                                              // boots
    }
    case "slides": {
      if (has(s, "sandal", "fisherman", "thong", "izmir", "chypre")) return 40000;
      return 50000;                                              // slides 50k
    }
    case "caps":
      return 20000;                                              // fedora 20k
    case "ties":
      return 10000;                                              // "Tie: 10k"
    default:
      return p.price; // leave anything without supplier evidence untouched
  }
}

const roundTo = (n, step) => Math.round(n / step) * step;
let changed = 0;
const hist = {};
for (const p of products) {
  const np = priceFor(p);
  if (np !== p.price) changed++;
  const onSale = p.comparePrice != null;
  p.price = np;
  p.comparePrice = onSale ? roundTo(np * 1.3, 5000) : null; // clean higher MSRP for sale items
  (hist[p.category] = hist[p.category] || new Set()).add(np);
}

fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
console.log(`Repriced ${changed} of ${products.length} products.`);
for (const c of Object.keys(hist).sort())
  console.log(`  ${c}: ${[...hist[c]].sort((a,b)=>a-b).map(v=>v/1000+"k").join(", ")}`);
