"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const Config_1 = require("../../account-manager/Config");
const EimAccount_1 = require("../../account-manager/EimAccount");
const EIMServiceAdapter_1 = require("../../eim-service/EIMServiceAdapter");
const LangProfile_1 = require("../../LangProfile");
const config = Config_1.getConfig();
const directoryType = {
    user: 'LK_user',
    group: 'LK_group',
    organization: 'LK_organization',
};
const containerStyle = {
    backgroundColor: '#fff',
    width: '95%',
    height: '95%',
};
const searchBox = {
    flexDirection: 'row',
    flexGrow: 0,
};
const listOrgStyle = {
    fontSize: 12,
    color: config.colorPalets.$frontDisabledColor,
};
const warnMessageStyle = {
    color: '#999',
    textAlign: 'center',
};
class UserSelectScreen extends react_1.Component {
    constructor(props) {
        super(props);
        this.searchedDirType = 'user';
        this.searchedWord = '';
        this.searchCondition = { offset: 0, limit: 30 };
        this.getInitState = (props) => ({
            canContinue: false,
            searchResult: [],
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedDirectoryType: this.initSelectedDirType(props.filter),
            searchWords: '',
            shown: false,
            showNoResultMessage: false,
            processing: false,
        });
        this.initSelectedDirType = (filter) => {
            let ret = 'user';
            if (filter.groups) {
                ret = 'group';
            }
            if (filter.organizations) {
                ret = 'organization';
            }
            if (filter.users) {
                ret = 'user';
            }
            return ret;
        };
        this.show = () => {
            const s = this.getInitState(this.props);
            s.shown = true;
            this.searchCondition.offset = 0;
            this.setState(s);
        };
        this.createContinueButton = () => {
            return (this.state.processing) ?
                react_1.default.createElement(native_base_1.Spinner, null) :
                (0 < this.state.searchResult.length && this.state.canContinue) ?
                    react_1.default.createElement(native_base_1.Button, { key: "more-search-button", full: true, onPress: this.pressMoreSearch },
                        react_1.default.createElement(native_base_1.Text, null, LangProfile_1.langProfile.replaceLang('LK_show'))) :
                    null;
        };
        this.closeButtonPress = () => {
            this.setState({
                shown: false,
            });
        };
        this.changeSearchWords = (value) => {
            this.setState({
                searchWords: value,
            });
        };
        this.createSearchedUserList = () => {
            return this.state.searchResult.map(item => (react_1.default.createElement(native_base_1.ListItem, { key: item.docId },
                react_1.default.createElement(native_base_1.Body, null,
                    react_1.default.createElement(native_base_1.Text, null, item.displayName),
                    react_1.default.createElement(native_base_1.Text, { style: listOrgStyle }, item.orgName)),
                react_1.default.createElement(native_base_1.Right, null,
                    react_1.default.createElement(native_base_1.Button, { icon: true, transparent: true, success: true, onPress: this.pressResultRow.bind(this, item.docId) },
                        react_1.default.createElement(native_base_1.Icon, { name: "md-add-circle" }))))));
        };
        this.pressResultRow = (docId) => {
            this.props.onSelect(docId, this.searchedDirType);
            this.closeButtonPress();
        };
        this.createDirectoryTypePicker = (selectedDirectoryType) => {
            const items = [];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const filter = this.props.filter;
            // ユーザー
            if (filter.users) {
                items.push(react_1.default.createElement(react_native_1.Picker.Item, { key: 'user', label: LangProfile_1.langProfile.replaceLang(directoryType['user']), value: 'user' }));
            }
            if (filter.groups) {
                items.push(react_1.default.createElement(react_native_1.Picker.Item, { key: 'group', label: LangProfile_1.langProfile.replaceLang(directoryType['group']), value: 'group' }));
            }
            if (filter.organizations) {
                items.push(react_1.default.createElement(react_native_1.Picker.Item, { key: 'organization', label: LangProfile_1.langProfile.replaceLang(directoryType['organization']), value: 'organization' }));
            }
            if (items.length < 2) {
                return null;
            }
            return (react_1.default.createElement(react_native_1.Picker, { key: "dir-picker", mode: "dropdown", selectedValue: selectedDirectoryType, onValueChange: this.changeDirectoryType.bind(this) }, items));
        };
        this.changeDirectoryType = (key) => {
            this.setState({
                selectedDirectoryType: key,
            });
        };
        this.pressMoreSearch = () => {
            this.setState({
                processing: true,
            });
            this.startSearch[this.state.selectedDirectoryType]();
        };
        this.pressSearchButton = () => {
            if (this.state.searchWords.trim() === '') {
                return;
            }
            this.searchedWord = this.state.searchWords.trim();
            this.searchCondition.offset = 0;
            this.setState({
                canContinue: false,
                searchResult: [],
                processing: true,
                showNoResultMessage: false,
            });
            this.startSearch[this.state.selectedDirectoryType]();
        };
        this.startSearch = {
            group: () => {
                const search = this.createSearchCondition([{
                        ignoreCaseSense: false,
                        operator: 'equal',
                        propertyName: 'properties.groupType',
                        type: 'string',
                        value: 'group',
                    }]);
                const condition = {
                    ...this.searchCondition,
                    search,
                };
                return this.commonSearch('groupdoclist', this.createGroupRowData, condition);
            },
            organization: () => {
                const search = this.createSearchCondition();
                const condition = {
                    ...this.searchCondition,
                    search,
                };
                return this.commonSearch('organizationdoclist', this.createOrganizationRowData, condition);
            },
            user: () => {
                const search = this.createSearchCondition([
                    '(',
                    {
                        propertyName: 'properties.userType',
                        type: 'string',
                        operator: 'equal',
                        value: 'user',
                        ignoreCaseSense: false
                    },
                    'or',
                    {
                        propertyName: 'properties.userType',
                        type: 'string',
                        operator: 'equal',
                        value: null,
                        ignoreCaseSense: false
                    },
                    ')',
                ]);
                const condition = {
                    ...this.searchCondition,
                    search,
                };
                return this.commonSearch('userdoclist', this.createUserRowData, condition);
            }
        };
        this.createSearchCondition = (searches) => {
            const argConditons = !searches ? [] : ['(', ...searches, ')', 'and'];
            const fulltext = {
                ignoreCaseSense: true,
                propertyName: 'fulltextsearch_list',
                type: 'string',
                operator: 'fulltextsearch_sentence',
                value: this.searchedWord,
            };
            return [...argConditons, fulltext];
        };
        this.commonSearch = async (listName, createRow, condition) => {
            this.searchedDirType = this.state.selectedDirectoryType;
            const account = EimAccount_1.getEimAccount();
            const sa = account.getServiceAdapter();
            try {
                const result = await sa.getDocListForView(account.eimTokens, 'addressbook', listName, {
                    ...condition,
                });
                const addList = result.docList.map(createRow);
                const newList = this.state.searchResult.concat(addList);
                const canContinue = newList.length < result.metrics.totalCount;
                this.searchCondition.offset += result.docList.length;
                this.setState({
                    canContinue,
                    searchResult: newList,
                    showNoResultMessage: newList.length === 0,
                    processing: false,
                });
            }
            catch (_a) {
                native_base_1.Toast.show({
                    text: LangProfile_1.langProfile.replaceLang('LK_netWork'),
                    type: 'danger',
                });
            }
        };
        this.createUserRowData = (item) => {
            const { columnValues } = item;
            return {
                corpName: EIMServiceAdapter_1.getDocListValue(columnValues, 'properties.companyName') || '',
                displayName: EIMServiceAdapter_1.getDocListValue(columnValues, 'properties.displayName') || '',
                faceImageId: '',
                docId: item.documentId,
                orgName: EIMServiceAdapter_1.getDocListValue(columnValues, 'properties.fullLabel') || '',
            };
        };
        this.createGroupRowData = (item) => {
            const { columnValues } = item;
            return {
                corpName: '',
                displayName: EIMServiceAdapter_1.getDocListValue(columnValues, 'properties.fullLabel') || '',
                faceImageId: '',
                docId: item.documentId,
                orgName: '',
            };
        };
        this.createOrganizationRowData = (item) => {
            const { columnValues } = item;
            return {
                corpName: '',
                displayName: EIMServiceAdapter_1.getDocListValue(columnValues, 'properties.fullLabel') || '',
                faceImageId: '',
                docId: item.documentId,
                orgName: '',
            };
        };
        this.state = this.getInitState(props);
    }
    render() {
        return (react_1.default.createElement(react_native_1.Modal, { transparent: true, animated: true, animationType: "fade", visible: this.state.shown },
            react_1.default.createElement(native_base_1.View, { style: {
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    alignItems: 'center',
                    justifyContent: 'center'
                } },
                react_1.default.createElement(native_base_1.View, { style: containerStyle },
                    react_1.default.createElement(native_base_1.View, { style: { flexDirection: 'row-reverse' } },
                        react_1.default.createElement(native_base_1.Button, { key: "close-button", icon: true, transparent: true, onPress: this.closeButtonPress },
                            react_1.default.createElement(native_base_1.Icon, { name: "close" }))),
                    react_1.default.createElement(native_base_1.View, { style: { flex: 1 } },
                        react_1.default.createElement(native_base_1.Form, { style: searchBox },
                            react_1.default.createElement(native_base_1.Item, { fixedLabel: true, style: { flexGrow: 1 } },
                                react_1.default.createElement(native_base_1.Input, { key: "search-word-input", value: this.state.searchWords, placeholder: LangProfile_1.langProfile.replaceLang('LK_MSG_searchWord'), onChangeText: this.changeSearchWords, onSubmitEditing: this.pressSearchButton, returnKeyType: "search" })),
                            react_1.default.createElement(native_base_1.Button, { key: "search-button", icon: true, transparent: true, style: { flexGrow: 0 }, onPress: this.pressSearchButton },
                                react_1.default.createElement(native_base_1.Icon, { name: "search" })),
                            react_1.default.createElement(native_base_1.View, { style: { flexGrow: 1 } }, this.createDirectoryTypePicker(this.state.selectedDirectoryType))),
                        react_1.default.createElement(native_base_1.Content, { style: { flexGrow: 1 } },
                            this.state.showNoResultMessage ?
                                react_1.default.createElement(native_base_1.Text, { style: warnMessageStyle }, LangProfile_1.langProfile.replaceLang('LK_MSG_applicable')) : null,
                            react_1.default.createElement(native_base_1.List, { key: "result-list" }, this.createSearchedUserList()),
                            this.createContinueButton()))))));
    }
}
UserSelectScreen.defaultProps = {
    filter: {
        users: true,
        groups: true,
        organizations: true,
    }
};
exports.UserSelectScreen = UserSelectScreen;
exports.default = UserSelectScreen;
