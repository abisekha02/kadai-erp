# Photos

Drop optimised photos here. The filename decides where each one appears. No code changes needed.

| File name (.webp preferred, .jpg ok) | Where it shows | Suggested size |
| --- | --- | --- |
| `hero-banana-leaf` | Home page banner: a traditional banana-leaf meal (portrait, 4:5) | 1200 x 1500 |
| `dosa-chutney` | Crispy dosa with chutneys | 1200 x 900 |
| `idli-sambar` | Idli and sambar | 1200 x 900 |
| `parotta-salna` | Madurai parotta and salna | 1200 x 900 |
| `chettinad-chicken` | Chettinad chicken | 1200 x 900 |
| `biryani` | South Indian (seeraga samba) biryani | 1200 x 900 |
| `filter-coffee` | Filter coffee in a tumbler and dabara | 1200 x 900 |
| `murukku` | Murukku | 1200 x 900 |
| `sweets` | Traditional sweets (Mysore pak, adhirasam, laddu) | 1200 x 900 |
| `product-coffee`, `product-tea`, `product-chilli`, `product-pepper`, `product-cardamom`, `product-rice`, `product-cashew`, `product-murukku`, `product-tumbler`, `product-tawa`, `product-grinder` | Product cards: the actual item being sold (square, 1:1) | 1000 x 1000 |

Missing files are fine: that slot shows the built-in illustration or Tamil lettering tile instead of a broken image.

## Rules for choosing photos

- Use real photographs with a license that allows reuse: **CC0 / public domain**, **Unsplash License**, **Pexels License**, or **Creative Commons (CC BY / CC BY-SA)** from Wikimedia Commons.
- Do **not** use AI-generated food images, and do not copy photos from restaurants, blogs or Google Images.
- CC BY and CC BY-SA **require credit**. Add it (see below). It is good practice for every photo.
- Pick photos of the right dish: Madurai parotta is layered and flaky, Chettinad chicken is dark and peppery, South Indian biryani uses short-grain seeraga samba rice.

## Prepare each photo (2 minutes)

1. Open https://squoosh.app, drop the photo in, choose **WebP**, quality about 75, resize to the width above.
2. Save it as the exact file name from the table (for example `idli-sambar.webp`) into this folder.
3. Aim for under 300 KB each. `npm run photos` warns about anything over 500 KB.

## Add the credit

Open `src/lib/photos.ts` and fill in `credit` for that dish, for example:

```ts
credit: { author: "Photographer Name", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:..." }
```

Product photos: add to `PRODUCT_CREDITS`. Hero photo: set `HERO_CREDIT`. Everything with a credit is listed on the `/credits` page automatically, and a photo without one is flagged there so you don't forget.

## Check your work

```bash
npm run photos    # lists which slots have a photo
npm run build     # production build; only existing files are ever referenced
```
