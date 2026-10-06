# Homepage illustration assets

Generated on 2026-10-06 with the **built-in `image_gen.imagegen` tool**. The CLI/API fallback was not used. Image 1 in the first three calls was the accepted website mockup at:

`/Users/jszhang/.codex/generated_images/01a11164-66f4-7a70-8f3d-21922b3a60f9/exec-ffc03d3e-d6c1-4ce2-b761-6e795ce5fea9.png`

The generated originals remain in place. The final images were copied into this directory without pixel edits or encoding changes.

## Hero: `hero-way.png`

- Final asset: `/Users/jszhang/github/my/cyber-taoist/site/src/assets/hero-way.png`
- Original: `/Users/jszhang/.codex/generated_images/01a11179-5f42-78c0-b6f0-3c675e306065/exec-a68e240d-7e51-4496-8f47-760e0e5452fd.png`
- Dimensions: 1254 × 1254 pixels.
- Reference input: the accepted mockup above.

Exact prompt:

```text
Use case: stylized-concept. Asset type: production illustration asset for a black-and-gold philosophy website. The attached image is a STYLE AND COMPOSITION REFERENCE only: recreate just its upper-right hero illustration as a separate illustration, no webpage, no UI and absolutely no text. Square composition 1024x1024. A large luminous golden yellow (#FCD228) open enso circle made of rough dry brushstrokes, centered slightly left. Very fine golden celestial orbital geometry: one large fine circle on right, a small circle at center, subtle vertical/horizontal construction lines and tiny nodes. A flat textured golden sun in upper-right. Bottom third: layered charcoal mountains edged with muted gold, a winding warm gray path from bottom foreground toward the horizon; one tiny solitary person walking away on the path. Japanese sumi-e ink collage blended with precision technical draftsmanship. Background perfectly pure black #000000 all the way to every edge, no glow or gradient. Main illustration fills almost entire square with no gratuitous empty margins. Flat two-dimensional editorial illustration, deeply textured brush and rocky forms, high contrast. No lettering, no logos, no border, no webpage and no typography.
```

## Rock: `practice-rock.png`

- Final asset: `/Users/jszhang/github/my/cyber-taoist/site/src/assets/practice-rock.png`
- Original final edit: `/Users/jszhang/.codex/generated_images/01a11179-5f42-78c0-b6f0-3c675e306065/exec-9679221c-79a2-4041-9753-90efd04ab568.png`
- Original initial generation: `/Users/jszhang/.codex/generated_images/01a11179-5f42-78c0-b6f0-3c675e306065/exec-2c03cb05-962c-4b35-b459-4213bbd6dc86.png`
- Dimensions: 1536 × 1024 pixels.
- Format: RGBA PNG with transparent background. Representative outer-edge pixels were checked and have alpha 0.
- Reference input for initial generation: the accepted mockup above.
- Reference input for final transparency edit: the initial rock generation.

Exact initial generation prompt:

```text
Use case: stylized-concept. Asset type: isolated editorial illustration for a website's golden-yellow band. The attached website image is a style reference. Recreate only the charcoal faceted rock seen on the gold band in the middle of the reference as its own separate image. Landscape composition 1200x800. Single dark jagged rough stone, charcoal and gray ink-wash facets, tiny muted gold speckles, grounded by a little black dry-brush ink dust extending horizontally beneath it. The stone occupies central 65 percent width and 75 percent height, enough edge room that all ink is visible. Background must be perfectly flat solid brand yellow #FCD228, uniform edge to edge, no gradient, no paper texture in background, no frame. Style is photoreal stone fused with Japanese ink brush texture, not cartoon. No letters, no text, no labels, no logos, no webpage, no additional objects.
```

The initial output contained a slight background gradient, so a separate built-in imagegen edit produced a transparent cutout for compositing over the exact CSS brand color.

Exact final transparency-edit prompt:

```text
Use case: background-extraction. Edit this image into a production transparent PNG cutout. Remove the yellow background entirely and make it genuinely transparent alpha, not a white or checkerboard background baked into the image. Keep the exact same charcoal rock silhouette, angular gray facets, subtle gold speckles, and black dry-brush ink ground below it. Preserve composition and size, all rock and ink details. Only remove the yellow background. The output will be placed over a solid #FCD228 yellow HTML background so no yellow opaque border or rectangle may remain. No words, no logos, no new objects.
```

## Mountain path: `practice-path.png`

- Final asset: `/Users/jszhang/github/my/cyber-taoist/site/src/assets/practice-path.png`
- Original: `/Users/jszhang/.codex/generated_images/01a11179-5f42-78c0-b6f0-3c675e306065/exec-9449f544-c8f0-4eaa-a50b-574f008f4671.png`
- Dimensions: 1774 × 887 pixels.
- Reference input: the accepted mockup above.

Exact prompt:

```text
Use case: stylized-concept. Asset type: wide landscape illustration for a black website section. The attached website image is a style reference: recreate only the small lower-left mountain landscape under 'Your first practice' as a separate image, with no webpage and absolutely no words. Wide low panoramic composition 1536x768. A winding warm pale-gray path approaches from the bottom foreground, curls through charcoal-black angular mountain rocks, and fades into layered low mountain ridges. One tiny solitary pale-gray walker seen from behind stands near lower-right middle of the landscape. Gray dry-brush textures on black rocks, fine muted gold accents on rocky edges, sparse golden ink brush marks in terrain. Japanese ink landscape meets contemporary technical editorial collage. Illustration spreads across entire width and lower 80% of canvas, no huge empty border. Perfect pure black #000000 background all the way to every canvas edge so it blends seamlessly into black HTML. No sun, no circle, no orbital diagram, no text, no labels, no logos, no border.
```

## Production encoding

The PNG files above remain the unchanged source outputs. `tools/assets.js` now creates WebP derivatives during each build: a 640-pixel mobile variant and a desktop variant up to 1280 pixels wide, quality 85 with full-quality alpha. Layout and illustration content are unchanged.

The three desktop derivatives total approximately 653 KB, compared with approximately 5.7 MB of PNG sources. Production pages use responsive `srcset` selection. Neither the original PNG files nor this provenance document is copied to the public output.
