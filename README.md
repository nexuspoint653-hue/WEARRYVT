# WEARRYVT

The RYVT storefront — Metro Detroit premium athletic wear.

Two self-contained pages. Every asset (film, images, fonts fallback) is
embedded, so there is no build step and no external fetch beyond Google Fonts.

- `index.html` — the landing film. One screen, no scrolling into the store.
- `store.html` — the storefront: home, shop, product, the Renaissance Tee,
  about, FAQ, contact, and the legal set (terms, privacy, shipping, social
  disclaimer), plus search, cart drawer and cookie preferences.
- `HANDOVER.md` — how each page maps onto a Shopify template and section,
  the product metafields required, and the behaviour that is code rather
  than a theme setting.

## Deploying

Netlify: connect the repo, no build command, publish directory `.`.
`netlify.toml` already sets that.

## Still to come

Every photograph is a generated placeholder and the film is a stand-in.
Prices and product copy are provisional. The legal pages need a lawyer and
the real entity details before launch.
