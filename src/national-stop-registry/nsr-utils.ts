import {Expression, FilterExpression} from '../types';
import {NsrLayer} from './nsr-layers';
import {NsrPinIconCode, PinTheme, PinType} from '../mapbox-styles/pin-types';

export const getNsrLayerSourceProps = (
  mapboxNsrSourceLayerId: string,
  layerId: string,
): {sourceID: string; sourceLayerID: string; id: string} => ({
  sourceID: 'composite',
  sourceLayerID: mapboxNsrSourceLayerId,
  id: layerId,
});

export const getFilterWhichAlsoHidesSelectedFeature = (
  /**
   * @property {FilterExpression} filter should be an array with 'all' as the first element
   */
  filter: FilterExpression,
  selectedFeaturePropertyId: string | undefined,
): FilterExpression => [
  ...filter,
  ['!=', ['get', 'id'], selectedFeaturePropertyId ?? ''],
];

const scaleTransitionZoomRange = 1.5; // icon starts very small and then reaches full size across this zoom range
const opacityTransitionExtraZoomRange = scaleTransitionZoomRange / 8;

type IconImageProps = {
  iconCode: NsrPinIconCode;
  themeName: PinTheme;
};

const nsrPinType: PinType = 'stop'; // pinType = 'stop' for all NSR items

const getExpressionForNsrIconImage = (
  iconType: 'default' | 'minimized',
  iconImageProps: IconImageProps,
  aFeatureIsSelected: boolean,
): Expression => [
  'concat',
  nsrPinType,
  'pin_',
  iconImageProps.iconCode,
  '_',
  ['case', aFeatureIsSelected, 'minimized', iconType],
  '_',
  iconImageProps.themeName,
];

export type LayerPropsDeterminedByZoomLevelParams = {
  reachFullScaleAtZoomLevel: NsrLayer['reachFullScaleAtZoomLevel'];
  selectedFeaturePropertyId: string | undefined;
  iconImageProps?: IconImageProps;
  opacityTransitionZoomRangeDelay?: number;
  showTextWhileAFeatureIsSelected?: boolean;
  iconFullSize?: number;
  textSizeFactor?: number;
};

type LayerPropsDeterminedByZoomLevel = {
  minZoomLevel: number;
  style: {
    iconImage: Expression | string;
    iconSize: Expression;
    iconOpacity: Expression;
    textSize: Expression;
    textOpacity: Expression | number;
  };
};

/*
 * Standardized calculations for icon size and opacity zoom transitions.
 * (Inlined from the mobile app's map utils.)
 */
const getIconZoomTransitionStyle = (
  reachFullScaleAtZoomLevel: number,
  iconFullSize: number | Expression,
  scaleTransitionZoomRangeArg: number,
  opacityTransitionExtraZoomRangeArg: number,
): {iconSize: Expression; iconOpacity: Expression} => {
  const iconOpacity: Expression = [
    'interpolate',
    ['linear'],
    ['zoom'],
    reachFullScaleAtZoomLevel - scaleTransitionZoomRangeArg,
    0,
    reachFullScaleAtZoomLevel -
      scaleTransitionZoomRangeArg +
      opacityTransitionExtraZoomRangeArg,
    1,
  ];

  const iconSize: Expression = [
    'interpolate',
    ['linear'],
    ['zoom'],
    reachFullScaleAtZoomLevel - scaleTransitionZoomRangeArg,
    0.3,
    reachFullScaleAtZoomLevel,
    iconFullSize,
  ];

  return {iconSize, iconOpacity};
};

export const getLayerPropsDeterminedByZoomLevel: (
  layerPropsDeterminedByZoomLevelProps: LayerPropsDeterminedByZoomLevelParams,
) => LayerPropsDeterminedByZoomLevel = ({
  reachFullScaleAtZoomLevel,
  selectedFeaturePropertyId,
  iconImageProps,
  opacityTransitionZoomRangeDelay = 0.8,
  showTextWhileAFeatureIsSelected = false,
  iconFullSize = 1,
  textSizeFactor = 1,
}) => {
  const aFeatureIsSelected =
    !!selectedFeaturePropertyId && selectedFeaturePropertyId !== '';

  const iconImage = !iconImageProps
    ? ''
    : getExpressionForNsrIconImage(
        'default',
        iconImageProps,
        aFeatureIsSelected,
      );

  // mapbox breaks unless iconImage is either a string literal directly, or in a zoom step or interpolate function,
  // so here it is wrapped with a step function that always returns the same
  const iconImageWrapped: Expression = [
    'step',
    ['zoom'],
    iconImage,
    reachFullScaleAtZoomLevel,
    iconImage,
  ];

  const {iconOpacity, iconSize} = getIconZoomTransitionStyle(
    reachFullScaleAtZoomLevel,
    iconFullSize,
    scaleTransitionZoomRange,
    opacityTransitionExtraZoomRange,
  );

  // Icons and labels start small and invisible, then grow and become more visible and prominent as you zoom in.
  return {
    minZoomLevel: reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
    style: {
      iconImage: iconImageWrapped,
      iconOpacity,
      iconSize,
      textSize: [
        'interpolate',
        ['exponential', 1.5],
        ['zoom'],
        14,
        textSizeFactor * 13,
        22,
        textSizeFactor * 27,
      ],
      textOpacity:
        aFeatureIsSelected && !showTextWhileAFeatureIsSelected
          ? 0
          : [
              'interpolate',
              ['linear'],
              ['zoom'],
              Math.max(
                reachFullScaleAtZoomLevel + opacityTransitionZoomRangeDelay,
                13.75,
              ) - opacityTransitionExtraZoomRange,
              0,
              Math.max(
                reachFullScaleAtZoomLevel + opacityTransitionZoomRangeDelay,
                13.75,
              ),
              1,
            ],
    },
  };
};
