import { Config, getConfig } from '../../src/account-manager/Config';

describe('create', () => {
    test('create new', () => {
        const target = new Config();
        expect(target.appKeyPrefix).toEqual('');
        expect(target.appServiceId).toEqual('');
        expect(target.startPage).toEqual('');
        expect(target.theme).toEqual({});
    });
    test('create single', () => {
        const target = getConfig();
        expect(target.appKeyPrefix).toEqual('');
        expect(target.appServiceId).toEqual('');
        expect(target.startPage).toEqual('');
        expect(target.theme).toEqual({});
    });
});
