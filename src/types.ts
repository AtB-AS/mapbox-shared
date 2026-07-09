// Style-spec expression types, vendored from `@rnmapbox/maps`'s
// `MapboxStyles.d.ts`. We can't re-export from `@rnmapbox/maps` directly
// because its `package.json` `exports` field blocks the deep import path
// under `nodenext` / `bundler` module resolution, and inlining the types
// keeps this package free of an `@rnmapbox/maps` peer dependency (which
// would be surprising for web-only consumers).
//
// Using the strict literal-union `ExpressionName` (rather than
// `Expression = any[]`) gives us:
//   - Autocomplete + typo detection on operator names inside this package.
//   - Cross-platform drift caught at the construction site: an operator not
//     in this union fails to compile here, before it can reach a consumer.
//   - Zero casts for the app-side consumer (types match `@rnmapbox/maps`).
//   - Zero casts for the web-side consumer: `mapbox-gl`'s
//     `ExpressionSpecification` is `[string, ...any[]]` (looser), so a value
//     typed as `readonly [ExpressionName, ...]` flows in without a cast.
//
// Keep in sync with `@rnmapbox/maps` if their `ExpressionName` union grows.

type ExpressionName =
  | 'array'
  | 'boolean'
  | 'collator'
  | 'format'
  | 'image'
  | 'literal'
  | 'number'
  | 'number-format'
  | 'object'
  | 'string'
  | 'to-boolean'
  | 'to-color'
  | 'to-number'
  | 'to-string'
  | 'typeof'
  | 'accumulated'
  | 'feature-state'
  | 'geometry-type'
  | 'id'
  | 'line-progress'
  | 'properties'
  | 'at'
  | 'get'
  | 'has'
  | 'in'
  | 'index-of'
  | 'length'
  | 'slice'
  | '!'
  | '!='
  | '<'
  | '<='
  | '=='
  | '>'
  | '>='
  | 'all'
  | 'any'
  | 'case'
  | 'match'
  | 'coalesce'
  | 'within'
  | 'interpolate'
  | 'interpolate-hcl'
  | 'interpolate-lab'
  | 'step'
  | 'let'
  | 'var'
  | 'concat'
  | 'downcase'
  | 'is-supported-script'
  | 'resolved-locale'
  | 'upcase'
  | 'rgb'
  | 'rgba'
  | 'to-rgba'
  | '-'
  | '*'
  | '/'
  | '%'
  | '^'
  | '+'
  | 'abs'
  | 'acos'
  | 'asin'
  | 'atan'
  | 'ceil'
  | 'cos'
  | 'distance'
  | 'e'
  | 'floor'
  | 'ln'
  | 'ln2'
  | 'log10'
  | 'log2'
  | 'max'
  | 'min'
  | 'pi'
  | 'round'
  | 'sin'
  | 'sqrt'
  | 'tan'
  | 'zoom'
  | 'heatmap-density';

type ExpressionField =
  | string
  | number
  | boolean
  | Expression
  | ExpressionField[]
  | {[key: string]: ExpressionField};

export type Expression = readonly [ExpressionName, ...ExpressionField[]];
export type FilterExpression = Expression;

// Value of a text-field property — a string or expression that produces a string.
export type TextField = string | Expression;
