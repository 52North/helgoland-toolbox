export class IdCache<T> {

  private cache: Map<string, T> = new Map();

  public has(id: string): boolean {
    return this.cache.has(id);
  }

  public get(id: string): T | undefined {
    return this.cache.get(id);
  }

  public set(id: string, value: T) {
    this.cache.set(id, value);
  }

}
