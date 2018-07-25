import { Injectable } from '@angular/core';

/**
 * LocalStorage save objects with a given key
 *
 * @export
 */
@Injectable()
export class LocalStorage {

    private localStorageEnabled = false;

    constructor() {
        if (typeof (Storage) !== 'undefined') {
            this.localStorageEnabled = true;
        }
    }

    /**
     * Saves the object with the key in the local storage
     *
     * @param key
     * @param object
     * @returns successfull saving
     * @memberof LocalStorage
     */
    public save(key: string, object: any): boolean {
        if (this.localStorageEnabled) {
            localStorage.setItem(key, JSON.stringify(object));
            return true;
        }
        return false;
    }

    /**
     * loads the object with for the key
     *
     * @param key
     * @returns the object if exists, else null
     * @memberof LocalStorage
     */
    public load<T>(key: string): T {
        if (this.localStorageEnabled) {
            const result = localStorage.getItem(key);
            if (result) {
                return JSON.parse(result);
            }
            return null;
        }
    }

    /**
     * loads an array of objects for the key
     *
     * @param key
     * @returns the array of objects if exists, else null
     * @memberof LocalStorage
     */
    public loadArray<T>(key: string): T[] {
        if (this.localStorageEnabled) {
            const result = localStorage.getItem(key);
            if (result) {
                return JSON.parse(result);
            }
            return null;
        }
    }

    /**
     * load a textual string for the given key
     *
     * @param key
     * @returns the string if exists, else null
     * @memberof LocalStorage
     */
    public loadTextual(key: string): string {
        if (this.localStorageEnabled) {
            const result = localStorage.getItem(key);
            if (result) { return result; }
        }
        return null;
    }

}
