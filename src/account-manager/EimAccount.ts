import { getGenericPassword, setGenericPassword } from 'react-native-keychain';

import { EIMServiceAdapter, IUserDoc } from '../eim-service';
import config from './Config';
import { IEimAccount } from './IEimAccount';

class EimAccount implements IEimAccount {
    public appKey: string;
    public domain: string;
    public eimTokens: string[];
    public user?: IUserDoc;
    public siteName: string;
    private serviceAdapter: EIMServiceAdapter | null;
    public constructor() {
        this.appKey = '';
        this.domain = '';
        this.eimTokens = [];
        this.serviceAdapter = null;
        this.siteName = '';
    }
    public load = async () => {
        const lastAccountString = await getGenericPassword({ service: config.lastAccountServiceName });
        if (!!lastAccountString && typeof lastAccountString !== 'boolean') {
            return JSON.parse(lastAccountString.password) as IEimAccount;
        } else {
            return null;
        }
    }
    public save = async () => {
        const lastAccountString = JSON.stringify(this);
        await setGenericPassword('dummy', lastAccountString, { service: config.lastAccountServiceName });
    }
    public loadUser = async () => {
        const sa = new EIMServiceAdapter(this.domain);
        const user = await sa.getLoginUser(this.eimTokens);
        if (!!user) {
            this.user = user;
        }
    }
    public getServiceAdapter = () => {
        if (!this.serviceAdapter) {
            this.serviceAdapter = new EIMServiceAdapter(this.domain);
        }
        return this.serviceAdapter;
    }
    public getDepartmentName() {
        const user = this.user;
        const profile = user ? user.properties.profile : null;
        const department = profile ? profile.department : null;
        const properties = department ? department.properties : null;
        const fullLabel = properties ? properties.fullLabel || null : null;
        return fullLabel;
    }

    public clear = () => {
        this.appKey = '';
        this.domain = '';
        this.eimTokens = [];
        this.serviceAdapter = null;
        this.user = undefined;
    }
}

const eimAccount = new EimAccount();

export default eimAccount;

// tslint:disable-next-line:max-line-length
// adb shell am start -a android.intent.action.VIEW "eimapplink-decision-form://decision-form/?link=https%3A%2F%2Fapp-dev54.ope.azure.ricoh-eim.com%2F\&hash=%2Fapps%2FDWS%2Fdocuments%2Fa7c2cee5e03a42538e90bec4df8789d8"
// tslint:disable-next-line:max-line-length
// https://applink.eim.ricoh.com/applink/decision-form?link=https%3A%2F%2F{eim domain}%2F&hash=%2Fapps%2F{app id}%2Fdocuments%2F{doc id}&andid=jp.co.ricoh.jrits.eim.decisionformat&iosid=jp.co.ricoh.jrits.eim.decisionformat
// tslint:disable-next-line:max-line-length
// https://applink.eim.ricoh.com/applink/decision-form?link=https%3A%2F%2Fapp-dev54.ope.azure.ricoh-eim.com%2F&hash=%2Fapps%2FDWS%2Fdocuments%2F95f6a02d6d7a448dadeefb2819ea4e2f&andid=jp.co.ricoh.jrits.eim.decisionformat&iosid=jp.co.ricoh.jrits.eim.decisionformat
