import { inject, TestBed } from '@angular/core/testing';

import { LocalStorage } from './local-storage.service';

describe('LocalStorage', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LocalStorage]
        });
    });

    it('should be created', inject([LocalStorage], (service: LocalStorage) => {
        expect(service).toBeTruthy();
    }));

    it('should save and load data', inject([LocalStorage], (service: LocalStorage) => {
        const testData = { id: 12345 };
        const name = 'test';
        service.save(name, testData);
        expect(service.load(name)).toEqual(testData);
    }));

    it('should save and load data array', inject([LocalStorage], (service: LocalStorage) => {
        const testData = ['1', '2', 'asdfasdf'];
        const name = 'array';
        service.save(name, testData);
        expect(service.loadArray(name)).toEqual(testData);
    }));

    it('should be null on wrong parameter name', inject([LocalStorage], (service: LocalStorage) => {
        expect(service.load('missingName')).toBeUndefined();
        expect(service.loadArray('missingArray')).toBeUndefined();
        expect(service.loadTextual('missingArray')).toBeUndefined();
    }));

    it('should load textual content', inject([LocalStorage], (service: LocalStorage) => {
        const testData = '1231514dfaasd';
        const name = 'string';
        service.save(name, testData);
        expect(service.loadTextual(name)).toMatch(testData);
    }));

});
