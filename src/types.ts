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
//   - Zero casts for the app-side consumer: our mutable tuple is assignable
//     to `@rnmapbox/maps`'s `readonly [ExpressionName, ...]` variant.
//   - Zero casts for the web-side consumer: the shape matches `mapbox-gl`'s
//     `ExpressionSpecification` (`[string, ...any[]]`) directly. A `readonly`
//     tuple would NOT be assignable there — TS rejects `readonly` → mutable.
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
  // `readonly` lets rnmapbox-typed values fit as nested elements.
  | readonly [ExpressionName, ...ExpressionField[]]
  | ExpressionField[]
  | {[key: string]: ExpressionField};

export type Expression = [ExpressionName, ...ExpressionField[]];
export type FilterExpression = Expression;

// Use in parameter positions to accept both our mutable `Expression` and
// values pre-typed as `@rnmapbox/maps`'s readonly `Expression`. Mutable →
// readonly widening means our own values still fit.
export type ReadonlyExpression = readonly [
  ExpressionName,
  ...ExpressionField[],
];

// Value of a text-field property — a string or expression that produces a string.
export type TextField = string | Expression;
