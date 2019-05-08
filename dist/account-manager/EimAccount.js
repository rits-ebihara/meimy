"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_keychain_1 = require("react-native-keychain");
const eim_service_1 = require("../eim-service");
const Config_1 = require("./Config");
const config = Config_1.getConfig();
class EimAccount {
    constructor() {
        this.load = async () => {
            const lastAccountString = await react_native_keychain_1.getGenericPassword({ service: config.lastAccountServiceName });
            if (!lastAccountString) {
                return null;
            }
            if (typeof lastAccountString === 'boolean') {
                return null;
            }
            else {
                return JSON.parse(lastAccountString.password);
            }
        };
        this.save = async () => {
            const lastAccountString = JSON.stringify(this);
            await react_native_keychain_1.setGenericPassword('dummy', lastAccountString, { service: config.lastAccountServiceName });
        };
        this.loadUser = async () => {
            const sa = new eim_service_1.EIMServiceAdapter(this.domain);
            const user = await sa.getLoginUser(this.eimTokens);
            if (!!user) {
                this.user = user;
            }
        };
        this.getServiceAdapter = () => {
            if (!this.serviceAdapter) {
                this.serviceAdapter = new eim_service_1.EIMServiceAdapter(this.domain);
            }
            return this.serviceAdapter;
        };
        this.clear = () => {
            this.appKey = '';
            this.domain = '';
            this.eimTokens = [];
            this.serviceAdapter = null;
            this.user = undefined;
        };
        this.appKey = '';
        this.domain = '';
        this.eimTokens = [];
        this.serviceAdapter = null;
        this.siteName = '';
    }
    getDepartmentName() {
        const user = this.user;
        const profile = user ? user.properties.profile : null;
        const department = profile ? profile.department : null;
        const properties = department ? department.properties : null;
        const fullLabel = properties ? properties.fullLabel || null : null;
        return fullLabel;
    }
}
exports.EimAccount = EimAccount;
const eimAccount = new EimAccount();
exports.getEimAccount = (obj) => {
    return obj || eimAccount;
};
// eslint-disable-next-line max-len
// adb shell am start -a android.intent.action.VIEW "eimapplink-decision-form://decision-form/?link=https%3A%2F%2Fapp-dev54.ope.azure.ricoh-eim.com%2F\&hash=%2Fapps%2FDWS%2Fdocuments%2Fa7c2cee5e03a42538e90bec4df8789d8"
// eslint-disable-next-line max-len
// https://applink.eim.ricoh.com/applink/decision-form?link=https%3A%2F%2F{eim domain}%2F&hash=%2Fapps%2F{app id}%2Fdocuments%2F{doc id}&andid=jp.co.ricoh.jrits.eim.decisionformat&iosid=jp.co.ricoh.jrits.eim.decisionformat
// eslint-disable-next-line max-len
// https://applink.eim.ricoh.com/applink/decision-form?link=https%3A%2F%2Fapp-dev54.ope.azure.ricoh-eim.com%2F&hash=%2Fapps%2FDWS%2Fdocuments%2F95f6a02d6d7a448dadeefb2819ea4e2f&andid=jp.co.ricoh.jrits.eim.decisionformat&iosid=jp.co.ricoh.jrits.eim.decisionformat
