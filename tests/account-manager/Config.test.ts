import { Config, getConfig } from '../../src/account-manager/Config';

const initColorPallet = {
    $colorPrimary0: '',
    $colorPrimary1: '',
    $colorPrimary2: '',
    $colorPrimary3: '',
    $colorPrimary4: '',
    $colorSecondary1p0: '',
    $colorSecondary1p1: '',
    $colorSecondary1p2: '',
    $colorSecondary1p3: '',
    $colorSecondary1p4: '',
    $colorSecondary2p0: '',
    $colorSecondary2p1: '',
    $colorSecondary2p2: '',
    $colorSecondary2p3: '',
    $colorSecondary2p4: '',
    $frontColor: '',
    $frontDisabledColor: '',
    $invertColor: '',
};

describe('create', () => {
    test('create new', () => {
        const target = new Config();
        expect(target.appKeyPrefix).toEqual('');
        expect(target.appServiceId).toEqual('');
        expect(target.startPage).toEqual('');
        expect(target.theme).toEqual({});
        expect(target.colorPalets).toEqual(initColorPallet);
    });
    test('create single', () => {
        const target = getConfig();
        expect(target.appKeyPrefix).toEqual('');
        expect(target.appServiceId).toEqual('');
        expect(target.startPage).toEqual('');
        expect(target.theme).toEqual({});
        expect(target.colorPalets).toEqual(initColorPallet);
    });
});

describe('setConfig', () => {
    const target = new Config();
    target.setConfig({
        appKeyPrefix: 'key-prefix',
        appServiceId: 'service-id',
        colorPalets: {
            $colorPrimary0: 'p0',
            $colorPrimary1: 'p1',
            $colorPrimary2: 'p2',
            $colorPrimary3: 'p3',
            $colorPrimary4: 'p4',
            $colorSecondary1p0: 's1p0',
            $colorSecondary1p1: 's1p1',
            $colorSecondary1p2: 's1p2',
            $colorSecondary1p3: 's1p3',
            $colorSecondary1p4: 's1p4',
            $colorSecondary2p0: 's2p0',
            $colorSecondary2p1: 's2p1',
            $colorSecondary2p2: 's2p2',
            $colorSecondary2p3: 's2p3',
            $colorSecondary2p4: 's2p4',
            $frontColor: 'fc',
            $frontDisabledColor: 'fdc',
            $invertColor: 'ic',
        },
        startPage: 'start-page',
        theme: {
            test: 'hoge',
        },
    });
    expect(target.appKeyPrefix).toEqual('key-prefix');
    expect(target.appServiceId).toEqual('service-id');
    expect(target.startPage).toEqual('start-page');
    expect(target.theme).toEqual({ test: 'hoge' });
    expect(target.colorPalets).toEqual({
        $colorPrimary0: 'p0',
        $colorPrimary1: 'p1',
        $colorPrimary2: 'p2',
        $colorPrimary3: 'p3',
        $colorPrimary4: 'p4',
        $colorSecondary1p0: 's1p0',
        $colorSecondary1p1: 's1p1',
        $colorSecondary1p2: 's1p2',
        $colorSecondary1p3: 's1p3',
        $colorSecondary1p4: 's1p4',
        $colorSecondary2p0: 's2p0',
        $colorSecondary2p1: 's2p1',
        $colorSecondary2p2: 's2p2',
        $colorSecondary2p3: 's2p3',
        $colorSecondary2p4: 's2p4',
        $frontColor: 'fc',
        $frontDisabledColor: 'fdc',
        $invertColor: 'ic',
    });
    expect(target.accountListServiceName).toEqual('service-id.account_list');
    expect(target.lastAccountServiceName).toEqual('service-id.last_account');
});

