import { Component } from 'react';
import { NavigationScreenOptions } from 'react-navigation';
import { ICombinedNavProps, IProps } from '../../../redux-helper/redux-helper';
import { IAccountManagerState } from '../../IAccountManagerState';
import { IAccountListState } from '../../states/IAccountLisState';
export declare class _AccountList extends Component<ICombinedNavProps<IAccountListState>> {
    static navigationOptions: NavigationScreenOptions;
    render: () => JSX.Element;
    componentDidMount: () => Promise<void>;
    private onPressListItem;
    private onPressAddButton;
    private transferPage;
}
export declare const __private__: {
    mapStateToProps: (state: IAccountManagerState) => IProps<IAccountListState>;
};
declare const _default: any;
export default _default;
