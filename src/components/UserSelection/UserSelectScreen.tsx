import { Body, Button, Form, Icon, Input, Item, List, ListItem, Right, Text, View } from 'native-base';
import React, { Component } from 'react';
import { Modal, Picker, TextStyle, ViewStyle } from 'react-native';

import { getConfig } from '../../account-manager';

const config = getConfig();

type directoryTypeName = 'ユーザー' | '組織' | 'グループ';

type directoryTypeKey = 'user' | 'group' | 'organization';
const directoryTypeKeys: directoryTypeKey[] = [
    'user',
    'group',
    'organization',
];

const directoryType: { [key in directoryTypeKey]: directoryTypeName } = {
    user: 'ユーザー',
    group: 'グループ',
    organization: '組織',
};

export interface IFilter {
    users: boolean;
    groups: boolean;
    organizations: boolean;
}
interface IProps {
    filter?: IFilter;
    shown: boolean;
}

type DefaultProps = {
    [P in keyof IProps]?: IProps[P];
};

interface ISearchedUser {
    id: string;
    displayName: string;
    corpName: string;
    orgName: string;
    faceImageId: string;
}

interface IState {
    selectedDirectoryType: directoryTypeKey;
    openFilterSetting: boolean;
    searchResult: ISearchedUser[];
    searchWords: string;
    searchCondition: {
        offset: number;
        limit: number;
    };
    shown: boolean;
}

const containerStyle: ViewStyle = {
    backgroundColor: '#fff',
    width: '95%',
    height: '95%',
};

const searchBox: ViewStyle = {
    flexDirection: 'row',
};

const listOrgStyle: TextStyle = {
    fontSize: 12,
    color: config.colorPalets.$frontDisabledColor,
};

export class UserSelectScreen extends Component<IProps, IState> {
    public static defaultProps: DefaultProps = {
        filter: {
            users: true,
            groups: true,
            organizations: true,
        }
    }
    public constructor(props: IProps) {
        super(props);
        this.state = {
            searchResult: [],
            selectedDirectoryType: 'user',
            openFilterSetting: false,
            searchWords: '',
            searchCondition: {
                limit: 30,
                offset: 0,
            },
            shown: false,
        };
    }
    public render() {
        return (
            <Modal transparent animated
                animationType="fade" visible={this.state.shown}>
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={containerStyle}>
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <Button icon transparent onPress={this.closeButtonPress}>
                                <Icon name="close" />
                            </Button>
                        </View>
                        <View>
                            <Form style={searchBox}>
                                <Item fixedLabel style={{ flexGrow: 1 }}>
                                    <Input value={this.state.searchWords}
                                        placeholder="検索"
                                        onChangeText={this.changeSearchWords}
                                        returnKeyType="search" />
                                </Item>
                                <Button icon transparent style={{ flexGrow: 0 }}>
                                    <Icon name="search" />
                                </Button>
                                <View style={{ flexGrow: 1 }}>
                                    {this.createDirectoryTypePicker(this.state.selectedDirectoryType)}
                                </View>
                            </Form>
                            <List>
                                {this.createSearchedUserList()}
                            </List>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    public show = () => {
        this.setState({
            shown: true,
        });
    }
    private closeButtonPress = () => {
        this.setState({
            shown: false,
        });
    }
    private changeSearchWords = (value: string) => {
        this.setState({
            searchWords: value,
        });
    }
    private createSearchedUserList = () => {
        return this.state.searchResult.map(item => (
            <ListItem key={item.id}>
                <Body>
                    <Text>{item.displayName}</Text>
                    <Text style={listOrgStyle}>{item.orgName}</Text>
                </Body>
                <Right>
                    <Button icon transparent success>
                        <Icon name="md-add-circle" />
                    </Button>
                </Right>
            </ListItem>
        ));
    }
    private createDirectoryTypePicker = (selectedDirectoryType: directoryTypeKey) => {
        const items: JSX.Element[] =
            directoryTypeKeys.map(key => (
                <Picker.Item key={key} label={directoryType[key]} value={key} />
            ));
        return (
            <Picker
                mode="dropdown"
                selectedValue={selectedDirectoryType}
                onValueChange={this.changeDirectoryType.bind(this)}>
                {items}
            </Picker>);
    }

    private changeDirectoryType = (key: directoryTypeKey) => {
        this.setState({
            selectedDirectoryType: key,
        });
    }
}

export default UserSelectScreen
