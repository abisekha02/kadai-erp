import { AVAILABLE } from "./photos.generated";

export type Credit = { author: string; license: string; source: string };

export type DishSlot = {
  slot: string;
  title: string;
  tamil: string;
  tag: string;
  blurb: string;
  alt: string; // descriptive alt text used when the photo is present
  cta: string;
  href: string;
  tint: string; // background shown behind the Tamil lettering when no photo is present
  credit?: Credit; // fill this in when you add the photo (shown on /credits)
};

/** Promo banners and dish photos on the home page. Drop `<slot>.webp` into public/photos to light each one up. */
export const DISHES: DishSlot[] = [
  {
    slot: "dosa-chutney",
    title: "Crispy dosa & chutneys",
    tag: "Dosa",
    tamil: "தோசை",
    blurb: "Golden, paper-thin dosa with coconut and tomato chutney.",
    alt: "Two crisp rolled dosas on a banana leaf and wooden plate, with coconut and green chutneys and podi spice powders in small pots",
    cta: "Tawa, batter rice & more",
    href: "/?q=dosa#shop",
    tint: "#8A3F22",
    credit: { author: "Saveurs Secretes", license: "Pexels License", source: "https://www.pexels.com/photo/5560763/" },
  },
  {
    slot: "idli-sambar",
    title: "Idli & sambar",
    tag: "Idli",
    tamil: "இட்லி",
    blurb: "Soft steamed idlis in a bowl of hot, tangy sambar.",
    alt: "Steamed idlis topped with curry leaves on a banana leaf, with a pot of sambar and a bowl of coconut chutney",
    cta: "Shop idli rice",
    href: "/?q=idli#shop",
    tint: "#2F6B4A",
    credit: { author: "Nifty Highness", license: "Pexels License", source: "https://www.pexels.com/photo/31199041/" },
  },
  {
    slot: "parotta-salna",
    title: "Madurai parotta & salna",
    tag: "Parotta",
    tamil: "பரோட்டா",
    blurb: "Flaky layered parotta with a spicy, peppery salna.",
    alt: "A stack of layered parotta on a white plate with a bowl of chicken curry, raita, sliced onion and lime",
    cta: "Shop spices",
    href: "/?cat=Spices#shop",
    tint: "#A64B28",
    credit: { author: "Milton Photography", license: "Pexels License", source: "https://www.pexels.com/photo/35071820/" },
  },
  {
    slot: "chettinad-chicken",
    title: "Chettinad chicken",
    tag: "Chettinad",
    tamil: "செட்டிநாடு",
    blurb: "Fiery, fragrant, roasted-spice chicken from Karaikudi.",
    alt: "A steel bowl of spicy orange curry garnished with herbs, surrounded by green chillies, tomatoes, onions and curry leaves",
    cta: "Shop pepper & chilli",
    href: "/?cat=Spices#shop",
    tint: "#6B3A24",
    credit: { author: "Prabal", license: "Pexels License", source: "https://www.pexels.com/photo/9609839/" },
  },
  {
    slot: "biryani",
    title: "South Indian biryani",
    tag: "Biryani",
    tamil: "பிரியாணி",
    blurb: "Seeraga samba rice layered with meat and whole spices.",
    alt: "Chicken biryani in a teal bowl with fried onions and coriander, served with raita, onion rings and green chutney",
    cta: "Shop rice & grains",
    href: "/?cat=Rice%20%26%20Grains#shop",
    tint: "#3F5E34",
    credit: { author: "Dhiraj Jain", license: "Pexels License", source: "https://www.pexels.com/photo/12737656/" },
  },
  {
    slot: "filter-coffee",
    title: "Filter coffee",
    tag: "Coffee",
    tamil: "காபி",
    blurb: "Frothy kaapi in a steel tumbler and dabara.",
    alt: "Frothy South Indian filter coffee in a steel tumbler and dabara set",
    cta: "Shop coffee & tea",
    href: "/?cat=Coffee%20%26%20Tea#shop",
    tint: "#5A3A28",
  },
  {
    slot: "murukku",
    title: "Murukku",
    tag: "Murukku",
    tamil: "முறுக்கு",
    blurb: "Crunchy rice-flour spirals, fried fresh.",
    alt: "Spiral murukku on a wooden tray and in a steel bowl, with two glasses of frothy tea",
    cta: "Shop snacks",
    href: "/?cat=Snacks#shop",
    tint: "#A3472A",
    credit: { author: "Saveurs Secretes", license: "Pexels License", source: "https://www.pexels.com/photo/5992272/" },
  },
  {
    slot: "sweets",
    title: "Traditional sweets",
    tag: "Sweets",
    tamil: "இனிப்பு",
    blurb: "Mysore pak, adhirasam and laddu for every festival.",
    alt: "A wooden bowl of golden gram-flour fudge squares topped with sliced almonds and pistachios",
    cta: "Shop snacks",
    href: "/?cat=Snacks#shop",
    tint: "#1F5138",
    credit: { author: "Pure Punjabi", license: "Pexels License", source: "https://www.pexels.com/photo/7182054/" },
  },
];

/** Hero banner photo (landscape, about 2:1). */
export const HERO = {
  slot: "hero-banana-leaf",
  alt: "A South Indian meal on a banana leaf with rice, curries, fried fish, prawns and curd, served with ceramic pots on a dark table",
};

/** Alt text for the optional per-product photos. The product's own name is used on cards. */
export const photoSrc = (slot: string): string | null => AVAILABLE[slot] ?? null;

export const creditFor = (slot: string): Credit | undefined => DISHES.find((d) => d.slot === slot)?.credit;

/** Every slot that currently has a file, with its alt text. Used by /credits. */
export const presentPhotos = () => {
  const dishes = DISHES.filter((d) => photoSrc(d.slot)).map((d) => ({ slot: d.slot, label: d.title, alt: d.alt, credit: d.credit }));
  const hero = photoSrc(HERO.slot) ? [{ slot: HERO.slot, label: "Home page banner", alt: HERO.alt, credit: undefined as Credit | undefined }] : [];
  const products = Object.keys(AVAILABLE)
    .filter((s) => s.startsWith("product-"))
    .map((s) => ({ slot: s, label: `Product photo: ${s.replace("product-", "")}`, alt: "", credit: PRODUCT_CREDITS[s] }));
  return [...hero, ...dishes, ...products];
};

/** Add credits for product photos here, keyed by slot (for example "product-coffee"). */
export const PRODUCT_CREDITS: Record<string, Credit | undefined> = {
  "product-tea": { author: "Anna Pou", license: "Pexels License", source: "https://www.pexels.com/photo/8329977/" },
  "product-rice": { author: "Waskyria Miranda", license: "Pexels License", source: "https://www.pexels.com/photo/31555433/" },
  "product-chilli": { author: "Taryn Elliott", license: "Pexels License", source: "https://www.pexels.com/photo/5107129/" },
  "product-coffee": { author: "Engin Akyurt", license: "Pexels License", source: "https://www.pexels.com/photo/2232704/" },
  "product-cashew": { author: "Engin Akyurt", license: "Pexels License", source: "https://www.pexels.com/photo/5472144/" },
  "product-cardamom": { author: "Eva Bronzini", license: "Pexels License", source: "https://www.pexels.com/photo/6086300/" },
};
/** Credit for the hero photo. */
export const HERO_CREDIT: Credit | undefined = { author: "Saveurs Secretes", license: "Pexels License", source: "https://www.pexels.com/photo/7234281/" };

export const dish = (slot: string): DishSlot => {
  const d = DISHES.find((x) => x.slot === slot);
  if (!d) throw new Error(`Unknown dish slot: ${slot}`);
  return d;
};
