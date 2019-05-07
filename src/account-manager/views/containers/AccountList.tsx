import { Body, Container, Content, Icon, List, ListItem, Right, Text } from 'native-base';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FloatingButton } from '../../../components/FloatingButton/FloatingButton';
import { ICombinedNavProps, IProps } from '../../../redux-helper/redux-helper';
import { createSetAccountAction } from '../../actions/AccountActions';
import { asyncLoadAccountListAfterShow } from '../../actions/AccountListActions';
import navigateController from '../../actions/NavigateActions';
import { getConfig } from '../../Config';
import { IAccountManagerState } from '../../IAccountManagerState';
import RoutePageNames from '../../RoutePageNames';
import { IAccountListState } from '../../states/IAccountLisState';
import { createInitAccountState, IAccountState } from '../../states/IAccountState';
import { IAuthState } from '../../states/IAuthStates';

const config = getConfig();
class AccountList extends Component<ICombinedNavProps<IAccountListState>> {
    public static navigationOptions = () => {
        return {
            headerStyle: {
                backgroundColor: config.colorPalets.$colorPrimary3,
            },
            headerTintColor: config.colorPalets.$invertColor,
            headerTitle: 'EIMサイト一覧',
        };
    }
    public render = () => {
        // console.log(this.props.state.accounts);
        const { state } = this.props;
        const { theme } = config;
        const listItems = state.accounts.map((account) => {
            if (!account.id) { return null; }
            return (
                <ListItem noIndent key={account.id} button onPress={() => { this.onPressListItem(account); }}>
                    <Body>
                        <Text>{account.siteName}</Text>
                        <Text note>{account.siteDomain}</Text>
                    </Body>
                    <Right><Icon name="arrow-forward" /></Right>
                </ListItem>
            );
        });
        return (
            <Container>
                <Content>
                    <List>
                        {listItems}
                    </List>
                </Content>
                <FloatingButton
                    primaryButtonColor={theme.btnPrimaryBg}
                    onPress={this.onPressAddButton} />
            </Container>
        );
    }
    public componentDidMount = () => {
        asyncLoadAccountListAfterShow(this.props.dispatch).then(() => {
            this.transferPage(this.props.state.authState);
        });
    }
    private onPressListItem = (account: IAccountState) => {
        this.props.dispatch(createSetAccountAction(account));
        this.props.navigation.push(RoutePageNames.accountPageName);
    }
    private onPressAddButton = () => {
        this.props.dispatch(createSetAccountAction(createInitAccountState()));
        this.props.navigation.push(RoutePageNames.accountPageName);
    }

    private transferPage(authState: IAuthState) {
        // ドメインが指定された場合、トークンがあればそれをセットする
        const account = this.props.state.accounts
            .find((a) => a.siteDomain === authState.siteDomain);
        if (!!account) {
            authState.tokens = account.eimToken;
            authState.siteName = account.siteName;
        }
        // this.props.navigation.navigate(accountListPageName);
        navigateController.clear();
        navigateController.navigateForLink(this.props.state, authState, this.props.dispatch, this.props.navigation);
    }
}

const mapStateToProps = (state: IAccountManagerState): IProps<IAccountListState> => {
    return {
        state: state.accountList,
    };
};

export default connect(mapStateToProps)(AccountList);

// eslint-disable-next-line max-len
// adb shell am start -a android.intent.action.VIEW "eimmobile://accountmanager/?app=decision-flow\&domain=app-dev43.ope.azure.ricoh-eim.com"
// eslint-disable-next-line max-len
// adb shell am start -a android.intent.action.VIEW "eimapplink-accountmanager://accountmanager/?mapp=decision-flow\&domain=app-dev54.ope.azure.ricoh-eim.com\&appprefix=DWS\&link=https%3A%2F%2Frits3.eim.ricoh.com%2F%23%2Fapps%2FdocManagementApp%2Fdocuments%2F9dd4435823554142a069ce9ee81b1e12"
