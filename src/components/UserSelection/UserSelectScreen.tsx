import { Body, Button, Form, Icon, Input, Item, List, ListItem, Right, Spinner, Text, Toast, View } from 'native-base';
import React, { Component } from 'react';
import { Modal, Picker, TextStyle, ViewStyle } from 'react-native';

import { getConfig } from '../../account-manager/Config';
import { getEimAccount } from '../../account-manager/EimAccount';
import { getDocListValue } from '../../eim-service/EIMServiceAdapter';
import { IDocListRowForView } from '../../eim-service/IDocListForView';
import { IDocListSearchOption, SearchCondition } from '../../eim-service/IDocListSearchOption';
import { DirectoryTypeKey } from '../UserBadge';
import { IGroupList, IOrganizationList, IUserList } from './IUserList';

const config = getConfig();

type DocListName = 'userdoclist' | 'groupdoclist' | 'organizationdoclist';

type directoryTypeName = 'ユーザー' | '組織' | 'グループ';

const directoryTypeKeys: DirectoryTypeKey[] = [
    'user',
    'group',
    'organization',
];

const directoryType: { [key in DirectoryTypeKey]: directoryTypeName } = {
    user: 'ユーザー',
    group: 'グループ',
    organization: '組織',
};

export interface IFilter {
    users: boolean;
    groups: boolean;
    organizations: boolean;
}

interface IOptionalProps {
    filter: IFilter;
}

interface IProps extends Partial<IOptionalProps> {
    onSelect: (docId: string, type: DirectoryTypeKey) => void;
}


interface ISearchedListItem {
    docId: string;
    displayName: string;
    corpName: string;
    orgName: string;
    faceImageId: string;
}

interface IState {
    selectedDirectoryType: DirectoryTypeKey;
    searchResult: ISearchedListItem[];
    searchWords: string;
    searchCondition: {
        offset: number;
        limit: number;
    };
    shown: boolean;
    processing: boolean;
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
    public static defaultProps: IOptionalProps = {
        filter: {
            users: true,
            groups: true,
            organizations: true,
        }
    }
    private searchedDirType: DirectoryTypeKey = 'user';
    private searchedWord: string = '';
    private getInitState = (): IState => ({
        searchResult: [],
        selectedDirectoryType: 'user',
        searchWords: '',
        searchCondition: {
            limit: 30,
            offset: 0,
        },
        shown: false,
        processing: false,
    });
    public constructor(props: IProps) {
        super(props);
        this.state = this.getInitState();
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
                            <Button key="close-button" icon transparent
                                onPress={this.closeButtonPress}>
                                <Icon name="close" />
                            </Button>
                        </View>
                        <View>
                            <Form style={searchBox}>
                                <Item fixedLabel style={{ flexGrow: 1 }}>
                                    <Input key="search-word-input" value={this.state.searchWords}
                                        placeholder="検索"
                                        onChangeText={this.changeSearchWords}
                                        returnKeyType="search" />
                                </Item>
                                <Button key="search-button"
                                    icon transparent style={{ flexGrow: 0 }}
                                    onPress={this.pressSearchButton}>
                                    <Icon name="search" />
                                </Button>
                                <View style={{ flexGrow: 1 }}>
                                    {this.createDirectoryTypePicker(this.state.selectedDirectoryType)}
                                </View>
                            </Form>
                            <List key="result-list">
                                {this.createSearchedUserList()}
                            </List>
                            {
                                // 更に表示 ボタン
                                (this.state.processing) ?
                                    <Spinner /> :
                                    (0 < this.state.searchResult.length) ?
                                        <Button key="more-search-button" full
                                            onPress={this.pressMoreSearch}>
                                            <Text>さらに表示</Text>
                                        </Button> :
                                        null
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    public show = () => {
        const s = this.getInitState();
        s.shown = true;
        this.setState(s);
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
            <ListItem key={item.docId}>
                <Body>
                    <Text>{item.displayName}</Text>
                    <Text style={listOrgStyle}>{item.orgName}</Text>
                </Body>
                <Right>
                    <Button icon transparent success
                        onPress={this.pressResultRow.bind(this, item.docId)}>
                        <Icon name="md-add-circle" />
                    </Button>
                </Right>
            </ListItem>
        ));
    }
    private pressResultRow = (docId: string) => {
        this.props.onSelect(docId, this.searchedDirType);
        this.closeButtonPress();
    }
    private createDirectoryTypePicker = (selectedDirectoryType: DirectoryTypeKey) => {
        const items: JSX.Element[] =
            directoryTypeKeys.map(key => (
                <Picker.Item key={key} label={directoryType[key]} value={key} />
            ));
        return (
            <Picker
                key="dir-picker"
                mode="dropdown"
                selectedValue={selectedDirectoryType}
                onValueChange={this.changeDirectoryType.bind(this)}>
                {items}
            </Picker>);
    }

    private changeDirectoryType = (key: DirectoryTypeKey) => {
        this.setState({
            selectedDirectoryType: key,
        });
    }
    private pressMoreSearch = () => {
        this.setState({
            processing: true,
        });
        this.startSearch[this.state.selectedDirectoryType]();
    }
    private pressSearchButton = () => {
        this.searchedWord = this.state.searchWords;
        this.setState({
            searchResult: [],
            searchCondition: {
                limit: this.state.searchCondition.limit,
                offset: 0,
            },
            processing: true,
        });
        this.startSearch[this.state.selectedDirectoryType]();
    }
    private startSearch: { [key in DirectoryTypeKey]: () => Promise<void> } = {
        group: () => {
            const search = this.createSearchCondition<IGroupList>([{
                ignoreCaseSense: false,
                operator: 'equal',
                propertyName: 'properties.groupType',
                type: 'string',
                value: 'group',
            }]);
            const condition: IDocListSearchOption<IGroupList> = {
                ...this.state.searchCondition,
                search,
            };
            return this.commonSearch('groupdoclist',
                this.createGroupRowData, condition);
        },
        organization: () => {
            const search = this.createSearchCondition<IGroupList>();
            const condition: IDocListSearchOption<IGroupList> = {
                ...this.state.searchCondition,
                search,
            };
            return this.commonSearch('organizationdoclist',
                this.createOrganizationRowData, condition);
        },
        user: () => {
            const search = this.createSearchCondition<IUserList>([
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
                ')',]);
            const condition: IDocListSearchOption<IUserList> = {
                ...this.state.searchCondition,
                search,
            };
            return this.commonSearch('userdoclist',
                this.createUserRowData,
                condition);
        }
    }
    private createSearchCondition = <T extends {}>(searches?: SearchCondition<T>[]): SearchCondition<T>[] => {
        const argConditons: SearchCondition<T>[] = !searches ? [] : ['(', ...searches, ')', 'and'];
        const fulltext: SearchCondition<T> = {
            ignoreCaseSense: true,
            propertyName: 'fulltextsearch_list',
            type: 'string',
            operator: 'fulltextsearch_sentence',
            value: this.searchedWord,
        };
        return [...argConditons, fulltext];
    }
    private commonSearch = async <T extends {}>(listName: DocListName,
        createRow: (item: IDocListRowForView<T>) => ISearchedListItem,
        condition: IDocListSearchOption<T>) => {
        this.searchedDirType = this.state.selectedDirectoryType;
        const account = getEimAccount();
        const sa = account.getServiceAdapter();
        try {
            const result = await sa.getDocListForView<T>(
                account.eimTokens,
                'addressbook',
                listName,
                {
                    ...condition,
                });
            const addList = result.docList.map(createRow);
            const newList = this.state.searchResult.concat(addList);
            condition.offset += result.docList.length;
            this.setState({
                searchResult: newList,
                searchCondition: condition,
                processing: false,
            });
        } catch {
            Toast.show({
                text: 'ネットワーク エラー',
                type: 'danger',
            });
        }
    }
    private createUserRowData = (item: IDocListRowForView<IUserList>): ISearchedListItem => {
        const { columnValues } = item;
        return {
            corpName: (getDocListValue<IUserList>(columnValues, 'properties.companyName') as string) || '',
            displayName: (getDocListValue<IUserList>(columnValues, 'properties.displayName') as string) || '',
            faceImageId: '',
            docId: item.documentId,
            orgName: (getDocListValue<IUserList>(columnValues, 'properties.organizationName') as string) || '',
        };
    }
    private createGroupRowData = (item: IDocListRowForView<IGroupList>): ISearchedListItem => {
        const { columnValues } = item;
        return {
            corpName: '',
            displayName: (getDocListValue<IGroupList>(columnValues, 'properties.fullLabel') as string) || '',
            faceImageId: '',
            docId: item.documentId,
            orgName: '',
        };
    }
    private createOrganizationRowData = (item: IDocListRowForView<IOrganizationList>): ISearchedListItem => {
        const { columnValues } = item;
        return {
            corpName: '',
            displayName: (getDocListValue<IOrganizationList>(columnValues, 'properties.fullLabel') as string) || '',
            faceImageId: '',
            docId: item.documentId,
            orgName: '',
        };
    }
}

export default UserSelectScreen
