export class IdCache<T> {
  private cache: Map<string, T> = new Map();

  has(id: string): boolean {
    return this.cache.has(id);
  }

  get(id: string): T | undefined {
    return this.cache.get(id);
  }

  set(id: string, value: T) {
    this.cache.set(id, value);
  }
}
