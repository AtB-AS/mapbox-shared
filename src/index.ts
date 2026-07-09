// Mapbox style JSONs (verbatim from Mapbox Studio, minus vestigial layers
// with no features in the current NSR tileset).
export {getMapboxLightStyle} from './mapbox-styles/get-mapbox-light-style';
export {getMapboxDarkStyle} from './mapbox-styles/get-mapbox-dark-style';

// Standard basemap color-theme (used inside style imports).
export {colorTheme} from './mapbox-styles/mapbox-color-theme';

// Pin naming (used for sprite icon references like `stoppin_bus_default_light`).
export type {
  NsrPinIconCode,
  VehicleIconCode,
  StationIconCode,
  PinScooterCompany,
  LiveVehiclePinState,
  PinType,
  PinIconCode,
  PinState,
  PinTheme,
  PinIcon,
} from './mapbox-styles/pin-types';

// National Stop Registry (NSR) — layer definitions + zoom-transition math.
export {
  nsrCircleLayers,
  nsrSymbolLayers,
  NsrSymbolLayerTextLocation,
} from './national-stop-registry/nsr-layers';
export type {NsrLayer} from './national-stop-registry/nsr-layers';
export {
  getNsrLayerSourceProps,
  getFilterWhichAlsoHidesSelectedFeature,
  getLayerPropsDeterminedByZoomLevel,
} from './national-stop-registry/nsr-utils';
export type {LayerPropsDeterminedByZoomLevelParams} from './national-stop-registry/nsr-utils';
