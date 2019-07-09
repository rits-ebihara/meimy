import { getGenericPassword } from 'react-native-keychain';

import { EimAccount, getEimAccount } from '../../account-manager/EimAccount';
import { IUserDoc } from '../../eim-service/EIMDocInterface';
import { EIMServiceAdapter } from '../../eim-service/EIMServiceAdapter';

jest.mock('react-native-keychain', () => {
    return {
        setGenericPassword: jest.fn(),
        getGenericPassword: jest.fn(async () => { return false }),
    }
});

jest.mock('../../eim-service/EIMServiceAdapter.ts');

describe('new', () => {
    test('createNew', () => {
        const target = new EimAccount();
        expect(target.appKey).toEqual('');
        expect(target.domain).toEqual('');
        expect(target.eimTokens).toEqual([]);
        expect(target['serviceAdapter']).toBeNull();
        expect(target.siteName).toEqual('');
    });
    test('getAccount', () => {
        const target = getEimAccount();
        expect(target.appKey).toEqual('');
        expect(target.domain).toEqual('');
        expect(target.eimTokens).toEqual([]);
        expect(target['serviceAdapter']).toBeNull();
        expect(target.siteName).toEqual('');
        const newObj = new EimAccount();
        const targetSecond = getEimAccount(newObj);
        expect(targetSecond).toStrictEqual(newObj);
    });
});

describe('load', () => {
    test('load - not exist data', async () => {
        const target = new EimAccount();
        const loadResult = await target.load();
        expect(loadResult).toBeNull();
    });
    test('load - not exist data', async () => {
        (getGenericPassword as any).mockImplementation(async () => {
            return true;
        });
        const target = new EimAccount();
        const loadResult = await target.load();
        expect(loadResult).toBeNull();
    });
    test('load - exist data', async () => {
        const expectedObj = {
            appKey: '',
            domain: '',
            eimTokens: [],
            siteName: '',
        };
        (getGenericPassword as any).mockImplementation(async () => {
            return {
                service: '',
                username: '',
                password: JSON.stringify(expectedObj),
            };
        });
        const target = new EimAccount();
        const loadResult = await target.load();
        expect(loadResult).toEqual(expectedObj);
    });
});

describe('save', () => {
    test('save', async () => {
        const target = new EimAccount();
        await target.save();
        // 特に評価項目なし
    });
});

describe('services', () => {
    test('loadUser', async () => {
        const expectUser = {
            system: {
                documentId: 'yser-doc-id',
            },
            properties: {
                loginUserName: 'test-user',
            }
        };
        (EIMServiceAdapter as any).mockImplementation(() => {
            return {
                getLoginUser: (): IUserDoc => {
                    return expectUser;
                }
            }
        });
        const target = new EimAccount();
        expect(target.user).toBeUndefined();
        await target.loadUser();
        expect(target.user).toEqual(expectUser);
    });
    test('loadUser - faild', async () => {
        (EIMServiceAdapter as any).mockImplementation(() => {
            return {
                getLoginUser: () => {
                    return null;
                }
            }
        });
        const target = new EimAccount();
        expect(target.user).toBeUndefined();
        await target.loadUser();
        expect(target.user).toBeUndefined();
    });
    test('getServiceAdapter', () => {
        const target = new EimAccount();
        const adapter = target.getServiceAdapter();
        expect(adapter).toBeTruthy();
        // ２回目以降は同じオブジェクトを返す
        const adapterSecond = target.getServiceAdapter();
        expect(adapterSecond).toStrictEqual(adapter);
    });
    test('getDepartmentName', async () => {
        const target = new EimAccount();
        const dep = target.getDepartmentName();
        expect(dep).toBeNull();
        const expectUser: IUserDoc = {
            system: {
                documentId: 'yser-doc-id',
            },
            properties: {
                loginUserName: 'test-user',
                profile: undefined,
            },
        };
        target.user = expectUser;
        expect(target.getDepartmentName()).toBeNull();
        target.user.properties.profile = {
        };
        expect(target.getDepartmentName()).toBeNull();
        target.user.properties.profile = {
            department: {
                system: {
                    documentId: 'dep-doc-id',
                },
                properties: {
                    label: '',
                    name: '',
                },
            }
        };
        expect(target.getDepartmentName()).toBeNull();
        target.user.properties.profile = {
            department: {
                system: {
                    documentId: 'dep-doc-id',
                },
                properties: {
                    label: '',
                    name: '',
                    fullLabel: 'dep-full-label',
                },
            },
        };
        expect(target.getDepartmentName()).toEqual('dep-full-label');
    });
    test('clear', () => {
        const target = new EimAccount();
        target.appKey = 'a';
        target.domain = 'd';
        target.eimTokens = ['t'];
        target.getServiceAdapter();
        const existUser: IUserDoc = {
            system: {
                documentId: 'user-doc-id',
            },
            properties: {
                loginUserName: 'test-user',
            },
        };
        target.user = existUser;
        expect(target.appKey).toEqual('a');
        expect(target.domain).toEqual('d');
        expect(target.eimTokens).toEqual(['t']);
        expect(target.getServiceAdapter()).toBeTruthy();
        expect(target.user).toStrictEqual(existUser);
        target.clear();
        expect(target.appKey).toEqual('');
        expect(target.domain).toEqual('');
        expect(target.eimTokens).toEqual([]);
        expect(target['serviceAdapter']).toBeNull();
        expect(target.user).toBeUndefined();
    });
});
