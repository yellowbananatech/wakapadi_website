# Wakapadi Women's Zanzibar Retreat 2027 — Brochure

Luxury A4 travel brochure (14 pages) with editorial layout and photography.

## Output

- **PDF:** `Wakapadi-Womens-Zanzibar-Retreat-2027.pdf`
- **Source:** `brochure.html`

## Regenerate

```bash
npm run brochure:pdf
```

Downloads missing stock images (skips `nigerian-women-group.jpg` if present), then exports print-ready A4 PDF via Puppeteer.

## Swap images

Replace any file in `brochure/images/` **keeping the same filename**, then run `npm run brochure:pdf`.

| Filename | Used on |
|---|---|
| `cover.jpg` | Page 1 — Cover |
| `letter.jpg` | Page 2 — Welcome letter portrait |
| `glance.jpg` | Page 3 — Overview banner |
| `stoneTown.jpg` | Pages 4, 8, 9 — Stone Town |
| `nigerian-women-group.jpg` | Pages 4 & 14 — Group / closing hero (AI-generated; replace as needed) |
| `dhow.jpg` | Pages 4, 9 — Dhow cruise |
| `villa.jpg` | Pages 5, 7 — Villa |
| `villaInterior.jpg` | Page 5 — Villa inset |
| `hotel.jpg` | Page 6 — Nungwi hotel |
| `hotelBreakfast.jpg` | Page 6 — Breakfast inset |
| `conference.jpg` | Page 7 — Day 2 thumbnail |
| `dinner.jpg` | Page 7 — Day 3 thumbnail |
| `kayak.jpg` | Pages 8, 9 — Kayaking |
| `turtle.jpg` | Pages 8, 9 — Turtle Aquarium |
| `snorkel.jpg` | Page 9 — Snorkelling |
| `sunset.jpg` | Page 9 — Drone photography |
| `departure.jpg` | Page 8 — Departure |
| `aspirational.jpg` | Page 11 — Who this retreat is for |
| `beachDusk.jpg` | Page 13 — Payment page header |

## Design

- Navy `#0D2D4A`, turquoise `#48CAE4`, gold `#C9A84C`, cream `#FBF5EC`
- Cormorant Garamond + Montserrat typography
