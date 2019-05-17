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
export interface IProperty {
    name: string;
    type: string;
    multiple?: boolean;
    label?: boolean;
}
export interface IPropertyType {
    name: string;
    properties: IProperty[];
}
export interface IForm {
    layout: {
        sections: any[];
    };
    formActions: any[];
    documentModel: {
        documentModelProperties: IProperty[];
        propertyType: IPropertyType[];
    };
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
