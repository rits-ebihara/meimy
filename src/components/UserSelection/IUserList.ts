export interface IUserList {
    'properties.description'?: string;
    'properties.loginUserName'?: string;
    'properties.displayName'?: string;
    'properties.phoneticName'?: string;
    'properties.lastName'?: string;
    'properties.firstName'?: string;
    'properties.middleName'?: string;
    'properties.birthName'?: string;
    'properties.globalLastName'?: string;
    'properties.globalFirstName'?: string;
    'properties.globalMiddleName'?: string;
    'properties.globalBirthName'?: string;
    'properties.displayGlobalName'?: string;
    'properties.phoneticLastName'?: string;
    'properties.phoneticFirstName'?: string;
    'properties.phoneticMiddleName'?: string;
    'properties.userLocalCompanyName'?: string;
    'properties.userGlobalCompanyName'?: string;
    'properties.faceImage'?: string;
    'properties.officeName'?: string;
    'properties.zip'?: string;
    'properties.location'?: string;
    'properties.country'?: string;
    'properties.region'?: string;
    'properties.state'?: string;
    'properties.city'?: string;
    'properties.street'?: string;
    'properties.building'?: string;
    'properties.mailAddress'?: string;
    'properties.mailAddresses'?: string;
    'properties.phone'?: string;
    'properties.phones'?: string;
    'properties.extension'?: string;
    'properties.extensions'?: string;
    'properties.faxNumber'?: string;
    'properties.language'?: string;
    'properties.timezone'?: string;
    'properties.login'?: string;
    'properties.lockOut'?: string;
    'properties.loginPassword'?: string;
    'properties.passwordExpired'?: string;
    'properties.profile.id'?: string;
    'properties.profile.roleId'?: string;
    'system.documentId'?: string;
    'properties.fullLabel'?: string;
    'properties.label'?: string;
    'properties.departmentIds'?: string;
    'properties.groupIds'?: string;
    'properties.organizationIds'?: string;
    'properties.companyName'?: string;
    'properties.organizationName'?: string;
    'properties.worklocKey'?: string;
    'properties.worklocName'?: string;
    'properties.userType'?: string;
}

export interface IOrganizationList {
    'properties.fullLabel'?: string;
    'properties.label'?: string;
}

export interface IGroupList {
    'properties.fullLabel'?: string;
    'properties.label'?: string;
    'properties.groupType'?: string;
}
