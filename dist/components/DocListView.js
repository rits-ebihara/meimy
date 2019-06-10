"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const EimAccount_1 = require("../account-manager/EimAccount");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class DocListView extends react_1.Component {
    constructor(props) {
        super(props);
        this.$isMounted = false;
        this.render = () => {
            const { docListData } = this.state;
            const list = this.createRowElement(docListData);
            const moreButton = this.createMoreButton();
            const refreshControl = react_1.default.createElement(react_native_1.RefreshControl, { refreshing: this.state.onSearch, onRefresh: this.reload });
            return (react_1.default.createElement(native_base_1.Content, { refreshControl: refreshControl, style: { display: !!this.props.hide ? 'none' : 'flex' } },
                react_1.default.createElement(native_base_1.List, null, list ?
                    list :
                    react_1.default.createElement(native_base_1.Spinner, { color: this.props.theme.brandPrimary })),
                moreButton,
                !!docListData && docListData.docList.length === 0
                    ? react_1.default.createElement(native_base_1.Text, { style: { color: this.props.theme.textColor } }, "\u5BFE\u8C61\u306E\u6587\u66F8\u306F\u3042\u308A\u307E\u305B\u3093\u3002")
                    : null,
                react_1.default.createElement(react_native_1.RefreshControl, { refreshing: this.state.onSearch, onRefresh: this.reload })));
        };
        this.componentDidMount = () => {
            this.$isMounted = true;
            this.loadDocList(0);
        };
        this.componentWillUnmount = () => {
            this.$isMounted = false;
        };
        this.reload = () => {
            this.loadDocList(0);
        };
        this.callLoadDocListData = async (props, offset) => {
            const searchOptions = {
                limit: props.rowCountAtOnce,
                offset,
                search: props.searchCondition,
                sort: props.sortCondition,
            };
            const eimAccount = EimAccount_1.getEimAccount();
            return await eimAccount.getServiceAdapter().getDocListForView(eimAccount.eimTokens, props.appKey || eimAccount.appKey, props.docListKey, searchOptions);
        };
        this.createRowElement = (docListData) => {
            return !docListData ? null :
                docListData.docList.map((row) => {
                    const cols = {};
                    row.columnValues.forEach((col) => {
                        cols[col.propertyName] = col.value;
                    });
                    return this.props.rowElement(row, cols);
                });
        };
        this.createMoreButton = () => {
            const { docListData } = this.state;
            if (!docListData) {
                return null;
            }
            if (docListData.metrics.totalCount <= this.state.offset) {
                return null;
            }
            return ((this.state.onSearch) ?
                react_1.default.createElement(native_base_1.Spinner, { color: this.props.theme.brandPrimary })
                : react_1.default.createElement(native_base_1.Button, { full: true, light: true, onPress: this.loadDocList.bind(this, this.state.offset) },
                    react_1.default.createElement(native_base_1.Text, null, "\u3055\u3089\u306B\u8868\u793A")));
        };
        this.loadDocList = (offset) => {
            if (offset === 0) {
                this.setState({
                    docListData: undefined,
                    onSearch: true,
                });
            }
            else {
                this.setState({
                    onSearch: true,
                });
            }
            this.callLoadDocListData(this.props, offset).then((result) => {
                const { state } = this;
                const docListData = clone_1.default(result);
                if (!!state.docListData) {
                    docListData.docList =
                        state.docListData.docList.concat(docListData.docList);
                }
                if (this.$isMounted) {
                    this.setState({
                        docListData,
                        offset: offset + this.props.rowCountAtOnce,
                        onSearch: false,
                    });
                }
                if (this.props.onFinishLoad) {
                    this.props.onFinishLoad();
                }
            }).catch(((e) => {
                this.setState({
                    onSearch: false,
                });
                console.warn(e);
            }));
        };
        this.state = {
            offset: 0,
            onSearch: false,
        };
    }
}
exports.DocListView = DocListView;
