/** Maps a product to the photo slot it should use (product-<key>), based on its name and category. */
export type PhotoKey =
  | "coffee" | "tea" | "chilli" | "pepper" | "cardamom" | "rice"
  | "cashew" | "murukku" | "tumbler" | "tawa" | "grinder" | "generic";

export function photoKey(name: string, category = ""): PhotoKey {
  const n = name.toLowerCase();
  if (n.includes("coffee")) return "coffee";
  if (n.includes("tea")) return "tea";
  if (n.includes("chilli") || n.includes("chili")) return "chilli";
  if (n.includes("pepper")) return "pepper";
  if (n.includes("cardamom")) return "cardamom";
  if (n.includes("rice")) return "rice";
  if (n.includes("cashew") || n.includes("nut")) return "cashew";
  if (n.includes("murukku") || n.includes("snack")) return "murukku";
  if (n.includes("tumbler") || n.includes("brass")) return "tumbler";
  if (n.includes("tawa") || n.includes("dosa")) return "tawa";
  if (n.includes("grinder")) return "grinder";
  const c = category.toLowerCase();
  if (c.includes("coffee")) return "coffee";
  if (c.includes("spice")) return "chilli";
  if (c.includes("rice")) return "rice";
  if (c.includes("snack")) return "murukku";
  if (c.includes("kitchen")) return "tawa";
  return "generic";
}
