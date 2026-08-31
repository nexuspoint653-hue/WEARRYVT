# RYVT - Shopify handover

Two static pages hold the finished design, and they are deliberately separate:
the landing is one screen of film that reveals only a footer, and the store is
its own page. Everything maps onto a Shopify template and a section in
`ryvt-shopify-theme`.

    index.html   the landing        -> templates/page.landing.json
    store.html   everything else    -> the templates in the table below

The landing links into the store by name: `store.html?view=shop&filter=Tees`.
In Shopify these become ordinary URLs - /collections/tees, /pages/faq, and so on.

Open `index.html` (or run `start-local-server.bat` for http://localhost:5173).

---

## Page map

| Design | View in store.html | Shopify template | Section |
| --- | --- | --- | --- |
| Landing film | `index.html` | `templates/page.landing.json` | `landing-film` |
| Home | `home` | `templates/index.json` | `hero`, `stat-band`, `media-band`, `category-row`, `related-products`, `story-block`, `editorial-split` |
| Shop All | `shop` | `templates/collection.json` | `main-collection` |
| Product | `product` | `templates/product.json` | `main-product`, `related-products` |
| The Renaissance Tee | `story` | `templates/page.renaissance.json` | `story-block`, `timeline`, `statement` |
| About | `about` | `templates/page.about.json` | `content-split`, `stat-band` |
| Shipping and Returns | `shipping` | `templates/page.shipping.json` | `legal-doc` |
| Terms and Conditions | `terms` | `templates/page.terms-conditions.json` | `legal-doc` |
| Privacy Policy | `privacy` | `templates/page.privacy-policy.json` | `legal-doc` |
| Social Media Disclaimer | `social` | `templates/page.social-media-disclaimer.json` | `legal-doc` |
| Bag | `cart` drawer | Shopify cart / `main-cart` | `cart-drawer` |
| Not found | `404` | `templates/404.json` | `main-404` |
| Questions | `faq` | `templates/page.faq.json` | `faq` |
| Contact | `contact` | `templates/page.contact.json` | `contact-form`, `legal-doc` |

Each legal page is one `legal-doc` section: the left rail is built from the
section's blocks, so adding a block adds both a numbered heading and its entry
in "On this page". Paste the copy from the matching view in `store.html`.

## The film

`landing-film.liquid` takes its video from, in order: the theme editor's Video
setting, a YouTube or Vimeo URL, then `assets/ryvt-landing-film.mp4` with a
`.webm` sibling. Set a poster image as well - it is what mobile Safari shows
when it refuses to autoplay. The placeholder film shipped in `assets/` is a
generated stand-in; replace it with real footage, keeping the filenames.

## Product data the theme needs

- **Metafield `custom.badge`** (single line text) - drives the card badge.
  Leave empty and the card falls back to Sale, New In, or Best Seller from tags.
- **Colour option** named Colour or Color, with swatches set under
  Settings > Products > Swatches. The cards and the PDP read real colours from it.
- **Size option** named Size. The size guide switches to the waist and inseam
  table when the product type is Bottoms.
- Two images minimum per product: the second is the hover image on cards.
- Product video, if there is one, appears in the PDP motion block under the
  spotlight gallery.

## Behaviour that is code, not settings

- **Numbers count up** from zero whenever a figure scrolls into view, and reset
  on the way out so it replays. Any element matching the counter selector list
  is wrapped automatically - prices, tallies, spec figures.
- **Hero collapse** on the landing: 100vh to 30vh over exactly 70vh of scroll.
  The spacer must stay 100vh; if it shrinks with the banner the document gets
  shorter mid-scroll and the browser clamps the scroll position.
- **Sticky Add to Bag** on phones proxies the real button and mirrors its
  disabled state. It sets `--pdp-cta-height`, which the footer already reads.
- **Custom cursor** carries its own contrast and inverts over light ground.
  It is off on touch devices.

## Known gaps, to be closed on Shopify

- **Checkout** is Shopify's. The bag here holds real state - lines, quantities,
  subtotal and the free-shipping threshold - and hands off at the button.
- **Accounts** are not built. The account icon is a placeholder; Shopify
  customer accounts replace it.
- **Reviews** need a review app. `snippets/rating.liquid` already reads
  `product.metafields.reviews.rating`, and renders nothing until one is installed.
- **Search** here is client-side over eight products. Shopify's predictive
  search replaces it; the panel layout stays.
- **Journal** posts are not written. The nav entry can point at a Shopify blog.
- **Legal copy is a draft.** It is specific and usable, but a lawyer should read
  it, and the entity name, address and effective dates need confirming.

## What is still placeholder

Every grey plate stands in for a photograph, the film is generated, and prices
and copy are stand-ins where real ones were not supplied. Product names, the
category structure and all legal copy are written to be kept.
