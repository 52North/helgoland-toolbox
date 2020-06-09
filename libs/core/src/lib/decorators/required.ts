export function Required(target: object, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    get() {
      throw new Error(`Attribute '${propertyKey}' is required in component ${this.constructor.name}`);
    },
    set(value) {
      Object.defineProperty(target, propertyKey, { value, writable: true, configurable: true });
    },
  });
}
