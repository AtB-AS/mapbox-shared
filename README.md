# @atb-as/mapbox-shared

Mapbox style JSON, sprite icon naming, and National Stop Registry (NSR) layer definitions shared between AtB's [travel planner web](https://github.com/AtB-AS/planner-web) and [mobile app](https://github.com/AtB-AS/mittatb-app).

## Install

```
pnpm add @atb-as/mapbox-shared
```

Requires `@atb-as/theme` at runtime for the `PinTheme` type (which is `'light' | 'dark'` derived from the theme package's `Themes<Theme>` map).

## What's in here

- `getMapboxLightStyle(userName, nsrTilesetId)` / `getMapboxDarkStyle(userName, nsrTilesetId)` — full Mapbox style JSONs, downloaded from Mapbox Studio and parameterized on the caller's user name + NSR tileset id.
- `colorTheme` — the `color-theme` payload used with the Mapbox Standard basemap import (light + dark tuned for AtB).
- `nsrSymbolLayers` / `nsrCircleLayers` — layer metadata for rendering stop places, quays, and parking from the NSR tileset (filter, zoom threshold, icon code, entity type).
- `getLayerPropsDeterminedByZoomLevel(...)` — zoom-transition math for icon + label size/opacity.
- Pin/icon naming types (`PinIcon`, `NsrPinIconCode`, `PinTheme`, etc.) matching the sprite conventions in [`AtB-AS/map-sprites`](https://github.com/AtB-AS/map-sprites).

Expression types use a strict operator union (`Expression = readonly [ExpressionName, ...]`) vendored from `@rnmapbox/maps`, which catches typos at the construction site here. The result is assignable both to `@rnmapbox/maps`'s types (identical) and to `mapbox-gl`'s looser `ExpressionSpecification` (a narrow type flows into a wider one) — no casts needed on either side.

## Updating the styles

We store Mapbox style JSON in this package rather than referencing it live from Mapbox Studio, because layer styling has to be expressed in code to support interactivity (Studio expressions are static), and Studio's asset workflow (SVG-only sprite uploads, buggy shadow rendering, duplicate uploads per OMS partner) doesn't fit AtB's setup. Sprites are hosted separately and injected by the consumer.

To pull an updated style from Studio:

1. Update the style in [Mapbox Studio](http://studio.mapbox.com/).
2. Download it with the [Mapbox Styles API](https://docs.mapbox.com/api/maps/styles/#retrieve-a-style):
   ```
   curl "https://api.mapbox.com/styles/v1/MAPBOX_USER_NAME/STYLE_URL_ID?access_token=PUBLIC_ACCESS_TOKEN"
   ```
3. Strip metadata and layers with `visibility: 'none'`:
   ```js
   const style = /* paste curl response */;

   const layers = style.layers
     .filter((l) => l?.layout?.visibility !== 'none')
     .map(({metadata, ...rest}) => rest);

   copy({sources: style.sources, glyphs: style.glyphs, layers});
   ```
4. Paste into `src/mapbox-styles/get-mapbox-{light,dark}-style.ts`. Then:
   - Replace `sources.composite.url` and `glyphs` with the `${mapboxUserName}` / `${mapboxNsrTilesetId}` template literals used in the existing files.
   - Ensure there is no `sprite` field — consumers inject the sprite URL at runtime.
   - Update the "Based on" comment at the top of the file.
   - Test both light and dark modes. Watch out for cached tiles.

### Sprites

Icons are maintained in [`AtB-AS/map-sprites`](https://github.com/AtB-AS/map-sprites) and produce the following statically-hosted assets:

- `light.json`, `light.png`, `light@2x.json`, `light@2x.png`
- `dark.json`, `dark.png`, `dark@2x.json`, `dark@2x.png`

Consumers configure the sprite URL at runtime (e.g. the mobile app reads it from firestore-configuration; the web planner has its own config).

## Local development

To test changes without cutting a release, use `pnpm add file:<path-to-mapbox-shared>` (e.g. `pnpm add file:../mapbox-shared`) in the project that depends on it.

Consumers import the built `lib/`, so run `pnpm build` when setting it up and whenever you make changes.

When you're done, set the package version in the consumer's `package.json` back to the previous version.

## Release

1. Merge a PR to main, where the commit message follows the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/).
2. The Github action `release-please-action` will create a PR to update the package version and changelog.
  - `feat` will be a minor release.
  - `fix` will be a patch release.
  - Adding `!` after the prefix (e.g. `feat!`) means it is a breaking change, and will be a major release. This includes any changes to the public API that requires users of the package to update any code.
  - Other prefixes such as `chore` or `refactor` will not trigger a release.
3. Merge the release PR to main to trigger a NPM release.

> [!NOTE]
> In case you want to create a release with a different version number than the one suggested by release-please, you can make an empty commit on main with commit message on this format:
> ```
> chore: release v1.2.3
>
> release-as: 1.2.3
> ```

For more details, see [release-please-action](https://github.com/googleapis/release-please-action).

## License

EUPL-1.2
