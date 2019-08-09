import { Body, Container, ListItem, Spinner, Text, Toast } from 'native-base';
import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';

import { ICombinedNavProps, IProps } from '../../../redux-helper/redux-helper';
import { createLoadAppListAction, createSetAppListAction } from '../../actions/EimAppListActions';
import NavigateActions from '../../actions/NavigateActions';
import { getConfig } from '../../Config';
import { IAccountManagerState } from '../../IAccountManagerState';
import IEimAppList from '../../states/IEimAppListState';

const config = getConfig();

class EimAppList extends Component<ICombinedNavProps<IEimAppList>> {
    public static navigationOptions = () => {
        return {
            headerStyle: {
                backgroundColor: config.colorPalets.$colorPrimary3,
            },
            headerTintColor: config.colorPalets.$invertColor,
            headerTitle: 'アプリ一覧',
        };
    }
    public constructor(props: ICombinedNavProps<IEimAppList>) {
        super(props);
        BackHandler.addEventListener('hardwareBackPress', this.onPressBackButton);
    }
    public render = () => {
        const appListBox = this.props.state.appList.map((app) => {
            return (
                <ListItem noIndent key={app.appKey} onPress={this.onPressItem.bind(this, app.appKey)}>
                    <Body>
                        <Text>{app.appName}</Text>
                        <Text note>{app.description}</Text>
                    </Body>
                </ListItem>
            );
        });
        return (
            <Container>
                {this.props.state.loading ? <Spinner color="blue" /> : appListBox}
            </Container>
        );
    }
    public componentDidMount = () => {
        createLoadAppListAction(this.props.dispatch, NavigateActions, this.props.navigation, this.onNetworkError);
    }
    public onPressItem = (appKey: string) => {
        NavigateActions.openApp({ appKey }, this.props.navigation);
    }

    private onNetworkError = () => {
        Toast.show({
            text: 'ネットワークエラーが発生しました。',
            type: 'warning',
        });
        this.props.dispatch(createSetAppListAction([]));
    }

    private onPressBackButton = () => {
        this.props.navigation.pop();
        return true;
    }
}

const mapStateToProps = (state: IAccountManagerState): IProps<IEimAppList> => {
    return {
        state: state.appList,
    };
};

export const __private__ = {
    EimAppList: EimAppList,
    mapStateToProps,
};

export default connect(mapStateToProps)(EimAppList);
