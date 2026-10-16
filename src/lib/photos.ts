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
    alt: "A crisp golden dosa served with bowls of coconut chutney and tomato chutney",
    cta: "Tawa, batter rice & more",
    href: "/?q=dosa#shop",
    tint: "#8A3F22",
  },
  {
    slot: "idli-sambar",
    title: "Idli & sambar",
    tag: "Idli",
    tamil: "இட்லி",
    blurb: "Soft steamed idlis in a bowl of hot, tangy sambar.",
    alt: "Soft white idlis served with sambar and chutney on a steel plate",
    cta: "Shop idli rice",
    href: "/?q=idli#shop",
    tint: "#2F6B4A",
  },
  {
    slot: "parotta-salna",
    title: "Madurai parotta & salna",
    tag: "Parotta",
    tamil: "பரோட்டா",
    blurb: "Flaky layered parotta with a spicy, peppery salna.",
    alt: "Layered Madurai-style parotta served with salna gravy",
    cta: "Shop spices",
    href: "/?cat=Spices#shop",
    tint: "#A64B28",
  },
  {
    slot: "chettinad-chicken",
    title: "Chettinad chicken",
    tag: "Chettinad",
    tamil: "செட்டிநாடு",
    blurb: "Fiery, fragrant, roasted-spice chicken from Karaikudi.",
    alt: "A bowl of dark, spicy Chettinad chicken curry with curry leaves",
    cta: "Shop pepper & chilli",
    href: "/?cat=Spices#shop",
    tint: "#6B3A24",
  },
  {
    slot: "biryani",
    title: "South Indian biryani",
    tag: "Biryani",
    tamil: "பிரியாணி",
    blurb: "Seeraga samba rice layered with meat and whole spices.",
    alt: "A plate of South Indian biryani made with short-grain seeraga samba rice",
    cta: "Shop rice & grains",
    href: "/?cat=Rice%20%26%20Grains#shop",
    tint: "#3F5E34",
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
    alt: "A pile of crunchy golden murukku spirals",
    cta: "Shop snacks",
    href: "/?cat=Snacks#shop",
    tint: "#A3472A",
  },
  {
    slot: "sweets",
    title: "Traditional sweets",
    tag: "Sweets",
    tamil: "இனிப்பு",
    blurb: "Mysore pak, adhirasam and laddu for every festival.",
    alt: "A tray of traditional South Indian sweets including Mysore pak and laddu",
    cta: "Shop snacks",
    href: "/?cat=Snacks#shop",
    tint: "#1F5138",
  },
];

/** Hero banner photo (landscape, about 2:1). */
export const HERO = {
  slot: "hero-banana-leaf",
  alt: "A traditional South Indian meal served on a banana leaf with rice, sambar, rasam, poriyal, appalam and pickle",
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
export const PRODUCT_CREDITS: Record<string, Credit | undefined> = {};
/** Credit for the hero photo. */
export const HERO_CREDIT: Credit | undefined = undefined;

export const dish = (slot: string): DishSlot => {
  const d = DISHES.find((x) => x.slot === slot);
  if (!d) throw new Error(`Unknown dish slot: ${slot}`);
  return d;
};
