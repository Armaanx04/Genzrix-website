/**
 * Execution Model — static connector layout.
 * Five independent SVG segments defined in execution-model.html.
 */

export const EXECUTION_MODEL_VIEWBOX = { width: 1200, height: 680 };
export const EXECUTION_MODEL_RADIUS = 32;

/** Shared bus coordinates (viewBox 0 0 1200 680) */
export const EXECUTION_MODEL_GEOMETRY = {
  topBusY: 204,
  bottomBusY: 476,
  verticalX: 1080,
  iconCenters: {
    1: { x: 120, y: 176 },
    2: { x: 600, y: 176 },
    3: { x: 1080, y: 176 },
    4: { x: 1080, y: 448 },
    5: { x: 600, y: 448 },
    6: { x: 120, y: 448 },
  },
};

export const EXECUTION_MODEL_SEGMENTS = {
  s1: 'M 148 204 H 572',
  s2: 'M 628 204 H 1048',
  s3: 'M 1048 204 A 32 32 0 0 1 1080 236 V 444 A 32 32 0 0 1 1048 476',
  s4: 'M 1048 476 H 628',
  s5: 'M 572 476 H 148',
};
