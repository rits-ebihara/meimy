import * as dateMock from 'jest-date-mock';
import { exists, mkdir, readDir, readFile, unlink, writeFile } from 'react-native-fs';
import { mocked } from 'ts-jest/utils';

import { getEimAccount } from '../../src/account-manager/EimAccount';
import { IDoc } from '../../src/eim-service/EIMDocInterface';
import { EIMServiceAdapter } from '../../src/eim-service/EIMServiceAdapter';
import { ILangResources, ILangResourceStrings } from '../../src/eim-service/ILangResources';
import { getLangResourceController, LangResourceController } from '../../src/eim-service/LangResourceController';

jest.mock('react-native-fs', () => {
    return {
        CachesDirectoryPath: '/test',
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
        "word01": "b1",
        "word02": "b2"
    },
    ja: {
        "word01": "日１",
        "word02": "日２"
    },
    en: {
        "word01": "en1",
        "word02": "en2"
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
        expect(unlink).toBeCalledWith('/test/word_resources');
        expect(mkdir).toBeCalledWith('/test/word_resources');
    });
    test('not exist dir', async () => {
        mocked(exists).mockImplementation(async () => false);
        await target['createCacheDir']();
        expect(unlink).not.toBeCalled();
        expect(mkdir).toBeCalledWith('/test/word_resources');
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
            'domain', 'appkey', 'word01', 'en', esa);
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
    test('cached memory', async () => {
        target['memoryCache'] = {
            site: 'site1',
            appKey: 'app-key1',
            data: langStrings,
        };
        const result = await target['loadWordResource']('site1', 'app-key1', esa);
        expect(result).toStrictEqual(target['memoryCache'].data);
    });
    test('cached file', async () => {
        // キャッシュにある場合、それを読み込み、返す
        mocked(exists).mockImplementation(async () => (true));
        mocked(readFile).mockImplementation(async () => {
            return JSON.stringify(langStrings);
        });
        const result = await target['loadWordResource']('site1', 'appkey', esa);
        expect(result).toEqual(langStrings);
        expect(target['memoryCache']).toEqual({
            site: 'site1',
            appKey: 'appkey',
            data: langStrings,
        });
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
            '/test/word_resources/site1_appkey.json',
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

interface ITestDoc {
    title: string;
    body: {
        html: string;
        text: string;
    };
    check: boolean;
    type: string;
    jType: {
        type2label: string;
    };
    jTypeArray: { type2label: string }[];
    jTypeArray3: {
        type3: { type2label: string };
    }[];
}

// 文書のラベルを更新する
const testDoc: IDoc<ITestDoc> = {
    document: {
        properties: {
            title: "テスト０２",
            body: {
                html: '<p>p</p>',
                text: 'p',
            },
            check: false,
            type: 'word01',
            jType: {
                type2label: 'word02'
            },
            jTypeArray: [
                {
                    type2label: 'word02',
                },
                {
                    type2label: 'word00',
                },
            ],
            jTypeArray3: [
                {
                    type3: {
                        type2label: 'word02',
                    }
                }
            ]
        },
    },
    form: {
        layout: {
            sections: [],
        },
        formActions: [],
        documentModel: {
            documentModelProperties: [
                {
                    "name": "title",
                    "type": "string",
                    "multiple": false,
                    "label": false
                }, {
                    "name": "body",
                    "type": "richtext",
                    "multiple": false,
                }, {
                    "name": "type",
                    "type": "string",
                    "multiple": false,
                    "label": true
                }, {
                    "name": "check",
                    "type": "boolean",
                    "multiple": false,
                }, {
                    "name": "jType",
                    "type": "cprop1",
                    "multiple": false,
                }, {
                    "name": "jTypeArray",
                    "type": "cprop1",
                    "multiple": true,
                }, {
                    "name": "jTypeArray2",
                    "type": "cprop1",
                    "multiple": true,
                }, {
                    "name": "jTypeArray3",
                    "type": "cprop2",
                    "multiple": true,
                },
            ],
            propertyType: [
                {
                    "name": "cprop1",
                    "properties": [
                        {
                            "name": "type2label",
                            "type": "string",
                            "multiple": false,
                            "label": true
                        }, {
                            "name": "type2label2",
                            "type": "string",
                            "multiple": false,
                            "label": true
                        }
                    ]
                }, {
                    "name": "cprop2",
                    "properties": [
                        {
                            "name": "type3",
                            "type": "cprop1",
                            "multiple": false,
                            "label": true
                        }
                    ]
                }

            ],
        } as any,
    } as any,
    system: {
        documentId: 'id',
    },
};

const expectConvertDoc = {
    title: "テスト０２",
    body: {
        html: '<p>p</p>',
        text: 'p',
    },
    check: false,
    type: '日１',
    jType: {
        type2label: '日２'
    },
    jTypeArray: [
        {
            type2label: '日２',
        },
        {
            type2label: 'word00',
        },
    ],
    jTypeArray3: [
        {
            type3: {
                type2label: '日２',
            }
        }
    ]
};

describe('convertDocLabel', async () => {
    let target: LangResourceController;
    beforeEach(() => {
        target = new LangResourceController();
        target['loadWordResource'] = async () => {
            return langStrings;
        };
    });
    test('normal type', async () => {
        const esa = new EIMServiceAdapter('domain');
        const result =
            await target.convertDocLabel('', '', testDoc, 'ja', esa);
        expect(result).toEqual(expectConvertDoc);
    });
});

test('get instance', async () => {
    const target = await getLangResourceController();
    const target2 = await getLangResourceController();
    expect(target2).toStrictEqual(target);
});
