export function normalizeVector(vec: [number, number]) {
  let dir = Array.from(vec);
  let length = Math.sqrt(Math.pow(dir[0], 2) + Math.pow(dir[1], 2));
  if (length === 0) return [0, 0];
  dir[0] = dir[0] / length;
  dir[1] = dir[1] / length;
  return dir as [number, number];
}

export function clamp(value: number, min?: number, max?: number) {
  let clampedValue = value;
  if (min) clampedValue = Math.max(min, clampedValue);
  if (max) clampedValue = Math.min(max, clampedValue);
  return clampedValue;
}
