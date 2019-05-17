/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAcl {
    readers?: any[];
    writers?: string[];
    readable?: boolean;
    writable?: boolean;
}

export interface ILink {
    rel?: string;
    href?: string;
}

export interface IProfile {
    id?: string;
    type?: string;
    roleId?: any;
}

export interface IMember {
    userId?: string;
    roles?: string[];
    type?: string;
}

export interface ITree {
    rootDocumentId?: string;
    parentDocumentId?: string;
    _pathId?: string;
}

export interface IAttachmentFiles {
    fileId: string;
    fileName: string;
    fileExtension: string;
    fileSize: number;
    lastModified: string;
    addCompleted: boolean;
}

export interface ISystem {
    acl?: IAcl;
    appId?: string;
    assignees?: string;
    attachmentFiles?: IAttachmentFiles[];
    children?: any[];
    condition?: any;
    createDatetime?: Date;
    createUserId?: string;
    createUser?: IUserDoc;
    lastModifiedUser?: IUserDoc;
    documentId: string;
    documentKey?: string;
    documentType?: string;
    executeVersion?: string;
    formId?: string;
    formKey?: string;
    lastModifiedDatetime?: Date;
    lastModifiedUserId?: string;
    links?: ILink[];
    members?: IMember[];
    modelId?: string;
    modelKey?: string;
    parents?: string[];
    revision?: number;
    siteId?: string;
    status?: string;
    taskInstances?: ITaskInstances;
    title?: string;
    tree?: ITree;
    users?: string[];
    version?: number;
    writers?: string[];
}

export interface ITaskInstances {
    assignees?: string[];
    processId?: string;
    processInstanceId?: string;
    rootProcessInstanceId?: string;
    taskDocumentId?: string;
    taskId?: string;
    taskInstanceId?: string;
}

export interface IUserProperties {
    loginUserName: string;
    lastName?: string;
    firstName?: string;
    phoneticLastName?: string;
    phoneticFirstName?: string;
    zip?: string;
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    building?: string;
    mailAddress?: string;
    phone?: string;
    extension?: string;
    faceImage?: string;
    faxNumber?: string;
    language?: string;
    timezone?: string;
    displayName?: string;
    displayGlobalName?: string;
    dateFormat?: string;
    dateSeparator?: string;
    timeFormat?: string;
    userType?: string;
    aclReaders?: any[];
    aclWriters?: any[];
    loginPassword?: string;
    profiles?: IProfile[];
    profile?: {
        id?: string;
        type?: string;
        roleId?: any;
        department?: IGroupDoc;
    };
    departmentIds?: string[];
    groupIds?: any[];
    organizationIds?: string[];
    ancestorIds?: string[];
}

export interface IUserDoc {
    system: ISystem;
    properties: IUserProperties;
}

export interface IGroupDoc {
    system: ISystem;
    properties: IGroupProperties;
}

export interface IFormEvent {
    onload?: string;
}

export interface IActionScript {
    type: 'simple' | 'function';
    name?: string;
    args?: any;
    script?: string;
    progressOnFailure?: boolean;
}

type showHide = 'show' | 'hide';

export interface IFormControlVisibility {
    creating: showHide;
    updating: showHide;
    browsing: showHide;
}

export interface IFormAction {
    name: string;
    label?: string;
    appearance?: {
        type?: 'simple' | 'delete' | 'arrow' | 'icon';
        narrow?: boolean;
        color?: 'white' | 'gray' | 'blue' | 'orange' | 'green';
        icon?: string;
        arrowDirection?: 'left' | 'right';
        size?: 'small' | 'medium' | 'large' | 'x-large';
    };
    layout?: {
        position: 'left' | 'right';
        order: number;
    };
    scripts: IActionScript[];
    visibility: IFormControlVisibility;
}

type direction = 'vertical' | 'horizontal';

export interface IFormFieldRestriction {
    name: 'required' | 'maxLength' | 'minLength' | 'maximum' | 'minimum' | 'regex';
    value: string;
}

export interface IFormFieldButton {
    name: string;
    show: boolean | string;
}
export interface IFormSectionBadge {
    name: string;
    type: 'circleIndigo' | 'circleGray' | 'circleTeal' | 'circleTealO' | 'circleCyanO' |
    'circleOrange' | 'circleRed' | 'circleRedO' | 'squareIndigo' | 'squareGray' |
    'squareTeal' | 'squareOrange' | 'squareRed';
    label?: string;
    icon?: string;
    isInitialDisplay?: boolean;
}
export interface IFormTableLayoutCell {
    name: string;
    type: 'label' | 'fieldLabel' | 'fieldMain';
    label?: string;
    fieldName?: string;
    width?: number;
    rowSpan?: number;
    cellSpan?: number;
}
export interface IFormTableLayoutRow {
    name: string;
    isInitialDisplay?: boolean;
    cells: IFormTableLayoutCell[];
}
export interface IFormTableLayout {
    width?: number;
    isStriped?: boolean;
    rows: IFormTableLayoutRow[];
}
export interface IFormFieldGroup {
    name: string;
    fieldNames: string[];
    propertyNames: string[];
    visibility: {
        creating: boolean;
        updating: boolean;
        browsing: boolean;
    };
    conditions: {
        state: string;
        users: string[];
        values: any;
    };
}
export interface IFormSection {
    id: string;
    name: string;
    label?: string;
    description?: string;
    buttonFields?: string[];
    fieldNames: string[];
    direction?: direction;
    type?: 'typeA' | 'typeB';
    badges?: IFormSectionBadge[];
    spread?: boolean;
    initSpread?: boolean;
    fieldLayout?: string;
    tableLayout?: IFormTableLayout;
    noBorder?: boolean;
    parentSectionName?: string;
}
export interface IDocModelPropertyRestriction {
    required?: boolean;
    unique?: boolean;
    maxLength?: number;
    minLength?: number;
    maximum?: number;
    minimum?: number;
    regex?: number;
}
export interface IDocModelProperty {
    name: string;
    type: string;
    label?: boolean;
    multiple: boolean;
    fulltextsearch?: boolean;
    restriction?: IDocModelPropertyRestriction;
}
export interface IDocModelPropertyType {
    name: string;
    properties: IDocModelProperty[];
}
export interface IDocumentModel {
    key?: string;
    title: string;
    useVersion: boolean;
    useRevision: boolean;
    documentModelProperties: IDocModelProperty[];
    propertyType?: IDocModelPropertyType[];

}
export interface IFormField {
    name: string;
    label?: string;
    description?: string;
    noLabel?: boolean;
    labelDirection?: direction;
    defaultValue?: any;
    documentPropertyName?: string;
    direction?: direction;
    message?: {
        restriction: IFormFieldRestriction[];
    };
    readOnly?: {
        creating: boolean;
        updating: boolean;
    };
    buttons?: IFormFieldButton[];
    control: {
        controlType: string;
        settings: any;
    };
}
export interface IFormFeature {
    copyUrl?: boolean;
    showProperty?: boolean;
    shareDocument?: boolean;
    controlVersion?: boolean;
    controlVersionAction?: boolean;
}
export interface IForm {
    key?: string;
    name: string;
    title: string;
    description?: string;
    styleSheetString?: string;
    events?: IFormEvent;
    validation?: string;
    bibliographicInformation?: {
        show: boolean;
    };
    formActions?: IFormAction[];
    formFields: IFormField[];
    layout: {
        sections: IFormSection[];
    };
    fieldGroups?: IFormFieldGroup[];
    documentModel: IDocumentModel;
    feature?: IFormFeature;
    discardConfirmDialog?: boolean;
}

export interface IDoc<T = {}> {
    system: ISystem;
    form: IForm;
    document: {
        properties: T;
    };
}

export interface IGroupProperties {
    path?: string;
    name: string;
    groupType?: 'role' | 'organization' | 'group';
    label: string;
    aclReaders?: string[];
    aclWriters?: string[];
    parent?: string;
    key?: string;
    fullLabel?: string;
    fullpath?: string;
    labelPath?: string;
    members?: IMember[];
}
