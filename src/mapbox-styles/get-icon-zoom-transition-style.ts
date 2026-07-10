import {Expression, ReadonlyExpression} from '../types';

/*
 * Standardized calculations for icon size and opacity zoom transitions.
 */
export const getIconZoomTransitionStyle = (
  reachFullScaleAtZoomLevel: number,
  iconFullSize: number | ReadonlyExpression,
  scaleTransitionZoomRange: number,
  opacityTransitionExtraZoomRange: number,
): {iconSize: Expression; iconOpacity: Expression} => {
  const iconOpacity: Expression = [
    'interpolate',
    ['linear'],
    ['zoom'],
    reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
    0,
    reachFullScaleAtZoomLevel -
      scaleTransitionZoomRange +
      opacityTransitionExtraZoomRange,
    1,
  ];

  const iconSize: Expression = [
    'interpolate',
    ['linear'],
    ['zoom'],
    reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
    0.3,
    reachFullScaleAtZoomLevel,
    iconFullSize,
  ];

  return {iconSize, iconOpacity};
};
