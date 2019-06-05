import { Component } from 'react';
import { DirectoryTypeKey } from '../UserBadge';
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
    canContinue: boolean;
    selectedDirectoryType: DirectoryTypeKey;
    searchResult: ISearchedListItem[];
    searchWords: string;
    shown: boolean;
    showNoResultMessage: boolean;
    processing: boolean;
}
export declare class UserSelectScreen extends Component<IProps, IState> {
    static defaultProps: IOptionalProps;
    private searchedDirType;
    private searchedWord;
    private searchCondition;
    private getInitState;
    constructor(props: IProps);
    render(): JSX.Element;
    show: () => void;
    private createContinueButton;
    private closeButtonPress;
    private changeSearchWords;
    private createSearchedUserList;
    private pressResultRow;
    private createDirectoryTypePicker;
    private changeDirectoryType;
    private pressMoreSearch;
    private pressSearchButton;
    private startSearch;
    private createSearchCondition;
    private commonSearch;
    private createUserRowData;
    private createGroupRowData;
    private createOrganizationRowData;
}
export default UserSelectScreen;
