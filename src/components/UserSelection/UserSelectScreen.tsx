import {
    Body,
    Button,
    Container,
    Form,
    Header,
    Icon,
    Input,
    Item,
    Label,
    List,
    ListItem,
    Right,
    Text,
} from 'native-base';
import React, { Component } from 'react';
import { Picker, ViewStyle } from 'react-native';

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
}

const containerStyle: ViewStyle = {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};

const searchBox: ViewStyle = {
    flexDirection: 'row',
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
        };
    }
    public render() {
        return (
            <Container style={containerStyle}>
                <Header>
                    <Right>
                        <Button icon transparent>
                            <Icon name="close" />
                        </Button>
                    </Right>
                </Header>
                <Body>
                    <Form style={searchBox}>
                        <Item fixedLabel>
                            <Label>検索</Label>
                            <Input value={this.state.searchWords}
                                onChangeText={this.changeSearchWords} />
                        </Item>
                        <Button icon transparent>
                            <Icon name="search" />
                        </Button>
                        {this.createDirectoryTypePicker(this.state.selectedDirectoryType)}
                    </Form>
                    <List>
                        {this.createSearchedUserList()}
                    </List>
                </Body>
            </Container>
        )
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
                    <Text>{item.orgName}</Text>
                </Body>
                <Right>
                    <Button icon transparent success>
                        <Icon name="add-circle" />
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
                onValueChange={this.changeDirectoryType.bind(this, selectedDirectoryType)}>
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
