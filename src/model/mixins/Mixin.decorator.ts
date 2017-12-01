export function Mixin(baseCtors: Function[]) {
    return (derivedCtor: Function) => {
        baseCtors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    };
}
