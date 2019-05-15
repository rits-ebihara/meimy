import { exists, mkdir, unlink } from 'react-native-fs';
import { mocked } from 'ts-jest/dist/util/testing';

import { EIMServiceAdapter } from '../../src/eim-service/EIMServiceAdapter';
import { ILangResourceStrings } from '../../src/eim-service/ILangResources';
import { LangResourceController } from '../../src/eim-service/LangResourceController';

jest.mock('react-native-fs', () => {
    return {
        CachesDirectoryPath: '/test/',
        exists: jest.fn(async () => {
            return false;
        }),
        unlink: jest.fn(),
        mkdir: jest.fn(),
    };
});

jest.mock('../../src/eim-service/EIMServiceAdapter.ts', () => {
    return {
        EIMServiceAdapter: jest.fn(),
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
}
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
