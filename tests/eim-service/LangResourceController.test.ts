import * as dateMock from 'jest-date-mock';
import { exists, mkdir, readDir, readFile, unlink, writeFile } from 'react-native-fs';
import { mocked } from 'ts-jest/utils';

import { getEimAccount } from '../../src/account-manager/EimAccount';
import { EIMServiceAdapter } from '../../src/eim-service/EIMServiceAdapter';
import { ILangResources, ILangResourceStrings } from '../../src/eim-service/ILangResources';
import { LangResourceController } from '../../src/eim-service/LangResourceController';

jest.mock('react-native-fs', () => {
    return {
        CachesDirectoryPath: '/test/',
        exists: jest.fn(async () => {
            return false;
        }),
        unlink: jest.fn(),
        mkdir: jest.fn(),
        readDir: jest.fn(),
        readFile: jest.fn(),
        writeFile: jest.fn(),
    };
});

jest.mock('../../src/eim-service/EIMServiceAdapter.ts', () => {
    return {
        EIMServiceAdapter: jest.fn(),
    };
});

jest.mock('../../src/account-manager/EimAccount.ts', () => {
    return {
        getEimAccount: jest.fn(),
    };
});

const langStrings: ILangResourceStrings = {
    de: {
        "word1": "b1"
    },
    ja: {
        "word1": "日１"
    },
    en: {
        "word1": "en1"
    },
    it: {},
    fr: {},
    es: {},
    nl: {}
};
const initLangStrings: ILangResourceStrings = {
    de: {},
    en: {},
    es: {},
    fr: {},
    it: {},
    ja: {},
    nl: {},
};

describe('createCacheDir', () => {
    let target: LangResourceController;
    beforeEach(() => {
        mocked(unlink).mockClear();
        target = new LangResourceController();
    });
    test('exist dir', async () => {
        mocked(exists).mockImplementation(async () => true);
        await target['createCacheDir']();
        expect(unlink).toBeCalledWith('\\test\\word_resources');
        expect(mkdir).toBeCalledWith('\\test\\word_resources');
    });
    test('not exist dir', async () => {
        mocked(exists).mockImplementation(async () => false);
        await target['createCacheDir']();
        expect(unlink).not.toBeCalled();
        expect(mkdir).toBeCalledWith('\\test\\word_resources');
    });
});

describe('getLangWord', () => {
    let target: LangResourceController;
    beforeEach(() => {
        target = new LangResourceController();
        target['loadWordResource'] = jest.fn(async () => {
            return langStrings;
        });
    });
    test('exist word', async () => {
        const esa = new EIMServiceAdapter('domain');
        const result = await target.getLangWord(
            'domain', 'appkey', 'word1', 'en', esa);
        expect(result).toEqual('en1');
    });
    test('no exist word', async () => {
        const esa = new EIMServiceAdapter('domain');
        const result = await target.getLangWord(
            'domain', 'appkey', 'word2', 'en', esa);
        expect(result).toEqual('word2');
    });
});

describe('loadWordResource', () => {
    let target: LangResourceController;
    let esa: EIMServiceAdapter;
    beforeEach(() => {
        mocked(readFile).mockClear();
        mocked(writeFile).mockClear();
        target = new LangResourceController();
        esa = new EIMServiceAdapter('site1');
    });
    test('cached file', async () => {
        // キャッシュにある場合、それを読み込み、返す
        mocked(exists).mockImplementation(async () => (true));
        mocked(readFile).mockImplementation(async () => {
            return JSON.stringify(langStrings);
        });
        const result = await target['loadWordResource']('site1', 'appkey', esa);
        expect(result).toEqual(langStrings);
    });
    test('error on cached file', async () => {
        // キャッシュにある場合、それを読み込み、返す
        mocked(exists).mockImplementation(async () => (true));
        mocked(readFile).mockImplementation(async () => {
            return 'dummy';
        });
        const result = await target['loadWordResource']('site1', 'appkey', esa);
        expect(result).toEqual(initLangStrings);
    });
    test('new download', async () => {
        mocked(exists).mockImplementation(async () => (false));
        // キャッシュにない場合、ダウンロードして新しいファイルを作成する
        mocked(EIMServiceAdapter).mockImplementation(() => {
            return {
                getLangResource: async (): Promise<ILangResources> => {
                    return {
                        strings: langStrings,
                    };
                },
            } as any;
        });
        mocked(getEimAccount).mockImplementation(() => {
            return {
                eimTokens: [''],
            } as any;
        });
        // mock を更新したので、作成し直す
        const esa = new EIMServiceAdapter('site1');
        const result = await target['loadWordResource']('site1', 'appkey', esa);
        expect(result).toEqual(langStrings);
        expect(writeFile).toBeCalledWith(
            '\\test\\word_resources\\site1_appkey.json',
            JSON.stringify(langStrings),
        );
    });
});

describe('deleteOldCache', () => {
    beforeEach(() => {
        mocked(unlink).mockClear();
    });
    afterEach(() => {
        dateMock.clear();
    });
    test('delete', async () => {
        dateMock.advanceTo(new Date(2018, 0, 2, 0, 0, 0));
        mocked(readDir).mockImplementation(async () => {
            return [
                {
                    mtime: new Date(2018, 0, 1, 11, 59, 59),
                    path: '/test/word_resources/cache1.json',
                }, {
                    mtime: new Date(2018, 0, 1, 12, 0, 0),
                    path: '/test/word_resources/cache2.json',
                }, {
                    mtime: new Date(2018, 0, 1, 12, 10, 0),
                    path: '/test/word_resources/cache3.json',
                }, {
                    mtime: new Date(2018, 0, 1, 11, 59, 0),
                    path: '/test/word_resources/cache4.json',
                },
            ] as any[];
        });
        const target = new LangResourceController();
        await target['deleteOldCache']();
        expect(unlink).toBeCalledTimes(2);
        expect(unlink).toBeCalledWith('/test/word_resources/cache1.json');
        expect(unlink).toBeCalledWith('/test/word_resources/cache4.json');
    });
});
