import {FilterExpression} from '../types';

/**
 * Extends a layer filter with a condition that hides the currently selected
 * feature. Useful when the selected feature is rendered separately (e.g. in
 * its own layer with different styling), so it should be omitted from the
 * default layer to avoid rendering it twice.
 *
 * @param filter - existing filter, must be an array with 'all' as the first element
 * @param selectedFeaturePropertyId - id of the feature to hide, or undefined for none
 */
export const getFilterWhichAlsoHidesSelectedFeature = (
  filter: FilterExpression,
  selectedFeaturePropertyId: string | undefined,
): FilterExpression => [
  ...filter,
  ['!=', ['get', 'id'], selectedFeaturePropertyId ?? ''],
];
