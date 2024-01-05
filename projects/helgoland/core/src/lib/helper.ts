export function filterUndefined<T>(list: (T | undefined)[]): T[] {
  return list.filter((e) => e !== undefined) as T[];
}
