import { Injectable } from '@angular/core';

/**
 * LocalStorage save objects with a given key
 *
 * @export
 */
@Injectable()
export class LocalStorage {

    private localStorageEnabled = false;
    private defaults = {};

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
     */
    public load<T>(key: string): T {
        if (this.localStorageEnabled) {
            const result = localStorage.getItem(key);
            if (result) {
                return JSON.parse(result);
            }
        }
        return this.defaults[key];
    }

    /**
     * loads an array of objects for the key
     *
     * @param key
     * @returns the array of objects if exists, else null
     */
    public loadArray<T>(key: string): T[] {
        if (this.localStorageEnabled) {
            const result = localStorage.getItem(key);
            if (result) {
                return JSON.parse(result);
            }
        }
        return this.defaults[key];
    }

    /**
     * load a textual string for the given key
     *
     * @param key
     * @returns the string if exists, else null
     */
    public loadTextual(key: string): string {
        if (this.localStorageEnabled) {
            const result = localStorage.getItem(key);
            if (result) {
                return result;
            }
        }
        return this.defaults[key];
    }

    /**
     * clears the complete local storage
     */
    public clearStorage() {
        if (this.localStorageEnabled) {
            localStorage.clear();
        }
    }

    /**
     * removes the item for the specified key
     * @param key
     */
    public removeItem(key: string) {
        if (this.localStorageEnabled) {
            localStorage.removeItem(key);
        }
    }

    /**
     * sets a default value for the given key, which will be delivered, if nothing is stored in localstorage for the key
     *
     * @param key
     * @param object
     */
    protected defineDefault(key: string, object: any) {
        this.defaults[key] = object;
    }

}
