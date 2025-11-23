export function castArray<T>(value: T | readonly T[]): T[] {
  if (Array.isArray(value)) {
    return value.slice();
  }

  return <T[]>[value];
}
