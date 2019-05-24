import { Config, getConfig } from '../../src/account-manager/Config';

const initColorPallet = {
    $colorPrimary0: '#2F4172',
    $colorPrimary1: '#7986AC',
    $colorPrimary2: '#4F608F',
    $colorPrimary3: '#162756',
    $colorPrimary4: '#061439',
    $colorSecondary1p0: '#AA9839',
    $colorSecondary1p1: '#FFF1AA',
    $colorSecondary1p2: '#D4C36A',
    $colorSecondary1p3: '#806E15',
    $colorSecondary1p4: '#554700',
    $colorSecondary2p0: '#AA6E39',
    $colorSecondary2p1: '#FFD2AA',
    $colorSecondary2p2: '#D49C6A',
    $colorSecondary2p3: '#804715',
    $colorSecondary2p4: '#552800',
    $frontColor: '#333',
    $frontDisabledColor: '#999',
    $invertColor: '#fff',
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

