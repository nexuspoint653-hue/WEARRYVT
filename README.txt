RYVT - finished site
====================

Two files, both completely self-contained (film, logo and images are embedded,
nothing is fetched from the internet):

  index.html   the landing. One screen of film with the wordmark, the menu and
               the corner pills. Scrolling reveals the footer and nothing else -
               the store is not underneath it. Every link opens the store.
  store.html   the store, as its own page: home, Shop All with filters, product
               pages, the Renaissance Tee story, About, Shipping and Returns,
               Terms, Privacy, the social media disclaimer, questions, contact,
               the bag and a 404. A slim strip at the top goes back to the film.

To view it
----------
Double-click start-local-server.bat  ->  http://localhost:5173
(That is a real local server. Close the black window to stop it.)

Or just double-click index.html - it works from the file system too.

What is in it
-------------
- Landing film with the promotional header, city clock, now playing pill,
  New Drops pill and the free-shipping link
- Scroll-linked hero collapse, with a compact header fading in inside the banner
- Custom cursor: a dot that tracks and a ring that lags, inverting over light
  and dark ground
- Product cards ported from the Laya build: hover image swap, badge, save star,
  quick view, swatches and colourway name
- Product page with the spotlight gallery, mosaic and separate motion block
- Sticky Add to Bag on phones, which proxies the real button
- Mega menu, search panel, category tiles, split footer

Placeholders
------------
Every grey plate is a placeholder for a photograph, and the film is a generated
stand-in. Prices and copy are stand-ins where real ones were not supplied.
