import { Component } from 'react';
import { ICombinedNavProps, IProps } from '../../../redux-helper/redux-helper';
import { IAccountManagerState } from '../../IAccountManagerState';
import IEimAppList from '../../states/IEimAppListState';
declare class EimAppList extends Component<ICombinedNavProps<IEimAppList>> {
    static navigationOptions: () => {
        headerStyle: {
            backgroundColor: string;
        };
        headerTintColor: string;
        headerTitle: string;
    };
    constructor(props: ICombinedNavProps<IEimAppList>);
    render: () => JSX.Element;
    componentDidMount: () => void;
    onPressItem: (appKey: string) => void;
    private onNetworkError;
    private onPressBackButton;
}
export declare const __private__: {
    EimAppList: typeof EimAppList;
    mapStateToProps: (state: IAccountManagerState) => IProps<IEimAppList>;
};
declare const _default: any;
export default _default;
