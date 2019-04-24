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
const EimAccount_1 = __importDefault(require("../account-manager/EimAccount"));
class DocListView extends react_1.Component {
    constructor(props) {
        super(props);
        this.$isMounted = false;
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
            return await EimAccount_1.default.getServiceAdapter().getDocListForView(props.tokens, props.appKey, props.docListKey, searchOptions);
        };
        this.state = {
            offset: 0,
            onSearch: false,
        };
    }
    render() {
        const { docListData } = this.state;
        const list = !docListData ? null :
            docListData.docList.map((row) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cols = {};
                row.columnValues.forEach((col) => {
                    cols[col.propertyName] = col.value;
                });
                return this.props.rowElement(row, cols);
            });
        const moreButton = ((this.state.onSearch) ?
            react_1.default.createElement(native_base_1.Spinner, { color: this.props.spinnerColor })
            : react_1.default.createElement(native_base_1.Button, { full: true, light: true, onPress: this.loadDocList.bind(this, this.state.offset) },
                react_1.default.createElement(native_base_1.Text, null, "\u3055\u3089\u306B\u8868\u793A")));
        return (react_1.default.createElement(native_base_1.View, null,
            react_1.default.createElement(native_base_1.List, null, list ? list : react_1.default.createElement(native_base_1.Spinner, { color: this.props.spinnerColor })),
            (!!docListData &&
                this.state.offset < docListData.metrics.totalCount) ?
                moreButton : null,
            !!docListData && docListData.docList.length === 0
                ? react_1.default.createElement(native_base_1.Text, { style: { color: this.props.noDocsTextColor } }, "\u5BFE\u8C61\u306E\u6587\u66F8\u306F\u3042\u308A\u307E\u305B\u3093\u3002")
                : null));
    }
    loadDocList(offset) {
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
                docListData.docList = state.docListData.docList.concat(docListData.docList);
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
    }
}
exports.DocListView = DocListView;
