import { Component } from 'react';
declare type directoryTypeKey = 'user' | 'group' | 'organization';
export interface IFilter {
    users: boolean;
    groups: boolean;
    organizations: boolean;
}
interface IProps {
    filter?: IFilter;
    shown: boolean;
}
declare type DefaultProps = {
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
export declare class UserSelectScreen extends Component<IProps, IState> {
    static defaultProps: DefaultProps;
    constructor(props: IProps);
    render(): JSX.Element;
    show: () => void;
    private closeButtonPress;
    private changeSearchWords;
    private createSearchedUserList;
    private createDirectoryTypePicker;
    private changeDirectoryType;
}
export default UserSelectScreen;
