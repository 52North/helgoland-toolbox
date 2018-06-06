export function Mixin(baseCtors: any[]) {
    return (derivedCtor: any) => {
        baseCtors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    };
}
