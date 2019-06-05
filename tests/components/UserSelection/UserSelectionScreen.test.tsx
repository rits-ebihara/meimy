/* eslint-disable max-len */
import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import { Toast } from 'native-base';
import React from 'react';
import { mocked } from 'ts-jest/utils';

import { getEimAccount } from '../../../src/account-manager/EimAccount';
import UserSelectScreen from '../../../src/components/UserSelection/UserSelectScreen';

Enzyme.configure({
    adapter: new EnzymeAdapter(),
});
//#region user result data
const userResults = JSON.parse(`{
    "metrics": {
        "totalCount": 6
    },
    "docList": [
        {
            "isCategory": false,
            "documentKey": "SiteAdmin-DJtj5N3u9VsJ",
            "appId": "addressbook",
            "index": 1,
            "documentId": "59217dfcd1314bd8bf82bfa25ecc5a44",
            "columnValues": [
                {
                    "propertyName": "properties.description",
                    "value": null
                },
                {
                    "propertyName": "properties.loginUserName",
                    "value": "SiteAdmin-DJtj5N3u9VsJ"
                },
                {
                    "propertyName": "properties.displayName",
                    "value": "SiteAdmin-DJtj5N3u9VsJ SiteAdmin-DJtj5N3u9VsJ"
                },
                {
                    "propertyName": "properties.phoneticName",
                    "value": null
                },
                {
                    "propertyName": "properties.lastName",
                    "value": "SiteAdmin-DJtj5N3u9VsJ"
                },
                {
                    "propertyName": "properties.firstName",
                    "value": "SiteAdmin-DJtj5N3u9VsJ"
                },
                {
                    "propertyName": "properties.middleName",
                    "value": null
                },
                {
                    "propertyName": "properties.birthName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalLastName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalFirstName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalMiddleName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalBirthName",
                    "value": null
                },
                {
                    "propertyName": "properties.displayGlobalName",
                    "value": null
                },
                {
                    "propertyName": "properties.phoneticLastName",
                    "value": null
                },
                {
                    "propertyName": "properties.phoneticFirstName",
                    "value": null
                },
                {
                    "propertyName": "properties.phoneticMiddleName",
                    "value": null
                },
                {
                    "propertyName": "properties.userLocalCompanyName",
                    "value": null
                },
                {
                    "propertyName": "properties.userGlobalCompanyName",
                    "value": null
                },
                {
                    "propertyName": "properties.faceImage",
                    "value": null
                },
                {
                    "propertyName": "properties.officeName",
                    "value": null
                },
                {
                    "propertyName": "properties.zip",
                    "value": null
                },
                {
                    "propertyName": "properties.location",
                    "value": null
                },
                {
                    "propertyName": "properties.country",
                    "value": null
                },
                {
                    "propertyName": "properties.region",
                    "value": null
                },
                {
                    "propertyName": "properties.state",
                    "value": null
                },
                {
                    "propertyName": "properties.city",
                    "value": null
                },
                {
                    "propertyName": "properties.street",
                    "value": null
                },
                {
                    "propertyName": "properties.building",
                    "value": null
                },
                {
                    "propertyName": "properties.mailAddress",
                    "value": "zpg_eim_paas_ope@nts.ricoh.co.jp"
                },
                {
                    "propertyName": "properties.mailAddresses",
                    "value": null
                },
                {
                    "propertyName": "properties.phone",
                    "value": null
                },
                {
                    "propertyName": "properties.phones",
                    "value": null
                },
                {
                    "propertyName": "properties.extension",
                    "value": null
                },
                {
                    "propertyName": "properties.extensions",
                    "value": null
                },
                {
                    "propertyName": "properties.faxNumber",
                    "value": null
                },
                {
                    "propertyName": "properties.language",
                    "value": "ja"
                },
                {
                    "propertyName": "properties.timezone",
                    "value": "Asia/Tokyo"
                },
                {
                    "propertyName": "properties.login",
                    "value": "1"
                },
                {
                    "propertyName": "properties.lockOut",
                    "value": null
                },
                {
                    "propertyName": "properties.loginPassword",
                    "value": "*"
                },
                {
                    "propertyName": "properties.passwordExpired",
                    "value": null
                },
                {
                    "propertyName": "properties.profile.id",
                    "value": null
                },
                {
                    "propertyName": "properties.profile.roleId",
                    "value": null
                },
                {
                    "propertyName": "system.documentId",
                    "value": "59217dfcd1314bd8bf82bfa25ecc5a44"
                },
                {
                    "propertyName": "properties.fullLabel",
                    "value": null
                },
                {
                    "propertyName": "properties.label",
                    "value": null
                },
                {
                    "propertyName": "properties.departmentIds",
                    "value": [
                        "$Administrators",
                        "docManagementApp_SupserUsers",
                        "docManagementApp_DocPreservers"
                    ]
                },
                {
                    "propertyName": "properties.groupIds",
                    "value": [
                        "$Administrators",
                        "docManagementApp_SupserUsers",
                        "docManagementApp_DocPreservers"
                    ]
                },
                {
                    "propertyName": "properties.organizationIds",
                    "value": null
                },
                {
                    "propertyName": "properties.companyName",
                    "value": null
                },
                {
                    "propertyName": "properties.organizationName",
                    "value": null
                },
                {
                    "propertyName": "properties.worklocKey",
                    "value": null
                },
                {
                    "propertyName": "properties.worklocName",
                    "value": null
                },
                {
                    "propertyName": "properties.userType",
                    "value": "user"
                }
            ]
        },
        {
            "isCategory": false,
            "documentKey": "admin",
            "appId": "addressbook",
            "index": 2,
            "documentId": "2258e1c20ef64fc1ba7353659518f4f6",
            "columnValues": [
                {
                    "propertyName": "properties.description",
                    "value": null
                },
                {
                    "propertyName": "properties.loginUserName",
                    "value": "admin"
                },
                {
                    "propertyName": "properties.displayName",
                    "value": "admin root"
                },
                {
                    "propertyName": "properties.phoneticName",
                    "value": null
                },
                {
                    "propertyName": "properties.lastName",
                    "value": "admin"
                },
                {
                    "propertyName": "properties.firstName",
                    "value": "root"
                },
                {
                    "propertyName": "properties.middleName",
                    "value": null
                },
                {
                    "propertyName": "properties.birthName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalLastName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalFirstName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalMiddleName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalBirthName",
                    "value": null
                },
                {
                    "propertyName": "properties.displayGlobalName",
                    "value": null
                },
                {
                    "propertyName": "properties.phoneticLastName",
                    "value": null
                },
                {
                    "propertyName": "properties.phoneticFirstName",
                    "value": null
                },
                {
                    "propertyName": "properties.phoneticMiddleName",
                    "value": null
                },
                {
                    "propertyName": "properties.userLocalCompanyName",
                    "value": null
                },
                {
                    "propertyName": "properties.userGlobalCompanyName",
                    "value": null
                },
                {
                    "propertyName": "properties.faceImage",
                    "value": null
                },
                {
                    "propertyName": "properties.officeName",
                    "value": null
                },
                {
                    "propertyName": "properties.zip",
                    "value": null
                },
                {
                    "propertyName": "properties.location",
                    "value": null
                },
                {
                    "propertyName": "properties.country",
                    "value": null
                },
                {
                    "propertyName": "properties.region",
                    "value": null
                },
                {
                    "propertyName": "properties.state",
                    "value": null
                },
                {
                    "propertyName": "properties.city",
                    "value": null
                },
                {
                    "propertyName": "properties.street",
                    "value": null
                },
                {
                    "propertyName": "properties.building",
                    "value": null
                },
                {
                    "propertyName": "properties.mailAddress",
                    "value": "kenji.ebihara@jp.ricoh.com"
                },
                {
                    "propertyName": "properties.mailAddresses",
                    "value": null
                },
                {
                    "propertyName": "properties.phone",
                    "value": null
                },
                {
                    "propertyName": "properties.phones",
                    "value": null
                },
                {
                    "propertyName": "properties.extension",
                    "value": null
                },
                {
                    "propertyName": "properties.extensions",
                    "value": null
                },
                {
                    "propertyName": "properties.faxNumber",
                    "value": null
                },
                {
                    "propertyName": "properties.language",
                    "value": "ja"
                },
                {
                    "propertyName": "properties.timezone",
                    "value": "Asia/Tokyo"
                },
                {
                    "propertyName": "properties.login",
                    "value": "1"
                },
                {
                    "propertyName": "properties.lockOut",
                    "value": null
                },
                {
                    "propertyName": "properties.loginPassword",
                    "value": "*"
                },
                {
                    "propertyName": "properties.passwordExpired",
                    "value": null
                },
                {
                    "propertyName": "properties.profile.id",
                    "value": "738cd3da8c12479290d2ce44afca931f"
                },
                {
                    "propertyName": "properties.profile.roleId",
                    "value": null
                },
                {
                    "propertyName": "system.documentId",
                    "value": "2258e1c20ef64fc1ba7353659518f4f6"
                },
                {
                    "propertyName": "properties.fullLabel",
                    "value": "TEST組織"
                },
                {
                    "propertyName": "properties.label",
                    "value": null
                },
                {
                    "propertyName": "properties.departmentIds",
                    "value": [
                        "$Administrators",
                        "738cd3da8c12479290d2ce44afca931f"
                    ]
                },
                {
                    "propertyName": "properties.groupIds",
                    "value": [
                        "$Administrators"
                    ]
                },
                {
                    "propertyName": "properties.organizationIds",
                    "value": [
                        "738cd3da8c12479290d2ce44afca931f"
                    ]
                },
                {
                    "propertyName": "properties.companyName",
                    "value": null
                },
                {
                    "propertyName": "properties.organizationName",
                    "value": null
                },
                {
                    "propertyName": "properties.worklocKey",
                    "value": null
                },
                {
                    "propertyName": "properties.worklocName",
                    "value": null
                },
                {
                    "propertyName": "properties.userType",
                    "value": "user"
                }
            ]
        },
        {
            "isCategory": false,
            "documentKey": "anhvd1@fsoft.com.vn",
            "appId": "addressbook",
            "index": 3,
            "documentId": "48dae60102c54fa984c1f1b1dcb24a94",
            "columnValues": [
                {
                    "propertyName": "properties.description",
                    "value": null
                },
                {
                    "propertyName": "properties.loginUserName",
                    "value": "anhvd1@fsoft.com.vn"
                },
                {
                    "propertyName": "properties.displayName",
                    "value": "fsoft anhvd1"
                },
                {
                    "propertyName": "properties.phoneticName",
                    "value": null
                },
                {
                    "propertyName": "properties.lastName",
                    "value": "fsoft"
                },
                {
                    "propertyName": "properties.firstName",
                    "value": "anhvd1"
                },
                {
                    "propertyName": "properties.middleName",
                    "value": null
                },
                {
                    "propertyName": "properties.birthName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalLastName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalFirstName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalMiddleName",
                    "value": null
                },
                {
                    "propertyName": "properties.globalBirthName",
                    "value": null
                },
                {
                    "propertyName": "properties.displayGlobalName",
                    "value": null
                },
                {
                    "propertyName": "properties.phoneticLastName",
                    "value": null
                },
                {
                    "propertyName": "properties.phoneticFirstName",
                    "value": null
                },
                {
                    "propertyName": "properties.phoneticMiddleName",
                    "value": null
                },
                {
                    "propertyName": "properties.userLocalCompanyName",
                    "value": null
                },
                {
                    "propertyName": "properties.userGlobalCompanyName",
                    "value": null
                },
                {
                    "propertyName": "properties.faceImage",
                    "value": null
                },
                {
                    "propertyName": "properties.officeName",
                    "value": null
                },
                {
                    "propertyName": "properties.zip",
                    "value": null
                },
                {
                    "propertyName": "properties.location",
                    "value": null
                },
                {
                    "propertyName": "properties.country",
                    "value": null
                },
                {
                    "propertyName": "properties.region",
                    "value": null
                },
                {
                    "propertyName": "properties.state",
                    "value": null
                },
                {
                    "propertyName": "properties.city",
                    "value": null
                },
                {
                    "propertyName": "properties.street",
                    "value": null
                },
                {
                    "propertyName": "properties.building",
                    "value": null
                },
                {
                    "propertyName": "properties.mailAddress",
                    "value": "banlq@fsoft.com.vn"
                },
                {
                    "propertyName": "properties.mailAddresses",
                    "value": null
                },
                {
                    "propertyName": "properties.phone",
                    "value": null
                },
                {
                    "propertyName": "properties.phones",
                    "value": null
                },
                {
                    "propertyName": "properties.extension",
                    "value": null
                },
                {
                    "propertyName": "properties.extensions",
                    "value": null
                },
                {
                    "propertyName": "properties.faxNumber",
                    "value": null
                },
                {
                    "propertyName": "properties.language",
                    "value": "ja"
                },
                {
                    "propertyName": "properties.timezone",
                    "value": "Asia/Tokyo"
                },
                {
                    "propertyName": "properties.login",
                    "value": "1"
                },
                {
                    "propertyName": "properties.lockOut",
                    "value": null
                },
                {
                    "propertyName": "properties.loginPassword",
                    "value": "*"
                },
                {
                    "propertyName": "properties.passwordExpired",
                    "value": null
                },
                {
                    "propertyName": "properties.profile.id",
                    "value": null
                },
                {
                    "propertyName": "properties.profile.roleId",
                    "value": null
                },
                {
                    "propertyName": "system.documentId",
                    "value": "48dae60102c54fa984c1f1b1dcb24a94"
                },
                {
                    "propertyName": "properties.fullLabel",
                    "value": null
                },
                {
                    "propertyName": "properties.label",
                    "value": null
                },
                {
                    "propertyName": "properties.departmentIds",
                    "value": null
                },
                {
                    "propertyName": "properties.groupIds",
                    "value": null
                },
                {
                    "propertyName": "properties.organizationIds",
                    "value": null
                },
                {
                    "propertyName": "properties.companyName",
                    "value": null
                },
                {
                    "propertyName": "properties.organizationName",
                    "value": null
                },
                {
                    "propertyName": "properties.worklocKey",
                    "value": null
                },
                {
                    "propertyName": "properties.worklocName",
                    "value": null
                },
                {
                    "propertyName": "properties.userType",
                    "value": "user"
                }
            ]
        }
    ],
    "system": {
        "formKey": ""
    }
}`);
//#endregion

//#region group result data
const groupResults = JSON.parse(`{
    "metrics":{
      "totalCount":6
    },
    "docList":[
      {
        "isCategory":false,
        "documentKey":"$GuestManagers",
        "appId":"addressbook",
        "index":1,
        "documentId":"$GuestManagers",
        "columnValues":[
          {
            "propertyName":"properties.label",
            "value":"ゲストユーザー管理者グループ",
            "searchValue":"ゲストユーザー管理者グループ"
          },
          {
            "propertyName":"properties.name",
            "value":"$GuestManagers"
          },
          {
            "propertyName":"properties.groupType",
            "value":"group"
          },
          {
            "propertyName":"properties.fullLabel",
            "value":"ゲストユーザー管理者グループ"
          },
          {
            "propertyName":"properties.shortLabel",
            "value":null
          },
          {
            "propertyName":"properties.members",
            "value":"[{\\"userId\\":\\"17682578c8964fc4b597f10768b350f4\\",\\"roles\\":[],\\"type\\":\\"user\\"}]"
          },
          {
            "propertyName":"properties.path",
            "value":"/"
          },
          {
            "propertyName":"properties.description",
            "value":null
          },
          {
            "propertyName":"properties.fullpath",
            "value":"/$GuestManagers"
          },
          {
            "propertyName":"system.documentId",
            "value":"$GuestManagers"
          },
          {
            "propertyName":"system.createUserId",
            "value":"SYSTEMUSER"
          },
          {
            "propertyName":"properties.displayName",
            "value":null
          }
        ]
      },
      {
        "isCategory":false,
        "documentKey":"$Administrators",
        "appId":"addressbook",
        "index":2,
        "documentId":"$Administrators",
        "columnValues":[
          {
            "propertyName":"properties.label",
            "value":"サイト管理者グループ",
            "searchValue":"サイト管理者グループ"
          },
          {
            "propertyName":"properties.name",
            "value":"$Administrators"
          },
          {
            "propertyName":"properties.groupType",
            "value":"group"
          },
          {
            "propertyName":"properties.fullLabel",
            "value":"サイト管理者グループ"
          },
          {
            "propertyName":"properties.shortLabel",
            "value":null
          },
          {
            "propertyName":"properties.members",
            "value":"[{\\"userId\\":\\"59217dfcd1314bd8bf82bfa25ecc5a44\\",\\"type\\":\\"user\\",\\"roles\\":[]},{\\"userId\\":\\"17682578c8964fc4b597f10768b350f4\\",\\"type\\":\\"user\\",\\"roles\\":[]},{\\"userId\\":\\"399789bd480144d9935ec41fe1db19c6\\",\\"type\\":\\"user\\",\\"roles\\":[]},{\\"userId\\":\\"3d6d3b0466494685ab9eff56f38b875a\\",\\"type\\":\\"user\\",\\"roles\\":[]},{\\"userId\\":\\"2258e1c20ef64fc1ba7353659518f4f6\\",\\"type\\":\\"user\\",\\"roles\\":[]}]"
          },
          {
            "propertyName":"properties.path",
            "value":"/"
          },
          {
            "propertyName":"properties.description",
            "value":null
          },
          {
            "propertyName":"properties.fullpath",
            "value":"/$Administrators"
          },
          {
            "propertyName":"system.documentId",
            "value":"$Administrators"
          },
          {
            "propertyName":"system.createUserId",
            "value":"SYSTEMUSER"
          },
          {
            "propertyName":"properties.displayName",
            "value":null
          }
        ]
      },
      {
        "isCategory":false,
        "documentKey":"AdministratorMembers",
        "appId":"addressbook",
        "index":3,
        "documentId":"AdministratorMembers",
        "columnValues":[
          {
            "propertyName":"properties.label",
            "value":"管理者グループ",
            "searchValue":"管理者グループ"
          },
          {
            "propertyName":"properties.name",
            "value":"AdministratorMembers"
          },
          {
            "propertyName":"properties.groupType",
            "value":"group"
          },
          {
            "propertyName":"properties.fullLabel",
            "value":"管理者グループ"
          },
          {
            "propertyName":"properties.shortLabel",
            "value":null
          },
          {
            "propertyName":"properties.members",
            "value":"[]"
          },
          {
            "propertyName":"properties.path",
            "value":"/"
          },
          {
            "propertyName":"properties.description",
            "value":null
          },
          {
            "propertyName":"properties.fullpath",
            "value":"/AdministratorMembers"
          },
          {
            "propertyName":"system.documentId",
            "value":"AdministratorMembers"
          },
          {
            "propertyName":"system.createUserId",
            "value":"399789bd480144d9935ec41fe1db19c6"
          },
          {
            "propertyName":"properties.displayName",
            "value":"森 秀智"
          }
        ]
      }
    ],
    "system":{
      "formKey":""
    }
  }`);
//#endregion

//#region  organization result data
const orgResults = JSON.parse(`{
    "metrics": {
        "totalCount": 13
    },
    "docList": [
        {
            "isCategory": false,
            "documentKey": "0abebb0204264abb9d0f0e91be2901e5",
            "appId": "addressbook",
            "index": 1,
            "documentId": "0abebb0204264abb9d0f0e91be2901e5",
            "columnValues": [
                {
                    "propertyName": "properties.label",
                    "value": "BS事"
                },
                {
                    "propertyName": "properties.name",
                    "value": "37048320"
                },
                {
                    "propertyName": "properties.groupType",
                    "value": "organization"
                },
                {
                    "propertyName": "properties.fullLabel",
                    "value": "RITS BS事"
                },
                {
                    "propertyName": "properties.shortLabel",
                    "value": null
                },
                {
                    "propertyName": "properties.members",
                    "value": "[]"
                },
                {
                    "propertyName": "properties.path",
                    "value": "/37048300"
                },
                {
                    "propertyName": "properties.description",
                    "value": null
                },
                {
                    "propertyName": "properties.fullpath",
                    "value": "/37048300/37048320"
                },
                {
                    "propertyName": "system.documentId",
                    "value": "0abebb0204264abb9d0f0e91be2901e5"
                }
            ]
        },
        {
            "isCategory": false,
            "documentKey": "7bf3fbe443de4b96b91f49bd0e2305c6",
            "appId": "addressbook",
            "index": 2,
            "documentId": "7bf3fbe443de4b96b91f49bd0e2305c6",
            "columnValues": [
                {
                    "propertyName": "properties.label",
                    "value": "RITS"
                },
                {
                    "propertyName": "properties.name",
                    "value": "37048300"
                },
                {
                    "propertyName": "properties.groupType",
                    "value": "organization"
                },
                {
                    "propertyName": "properties.fullLabel",
                    "value": "RITS"
                },
                {
                    "propertyName": "properties.shortLabel",
                    "value": null
                },
                {
                    "propertyName": "properties.members",
                    "value": "[]"
                },
                {
                    "propertyName": "properties.path",
                    "value": "/"
                },
                {
                    "propertyName": "properties.description",
                    "value": null
                },
                {
                    "propertyName": "properties.fullpath",
                    "value": "/37048300"
                },
                {
                    "propertyName": "system.documentId",
                    "value": "7bf3fbe443de4b96b91f49bd0e2305c6"
                }
            ]
        },
        {
            "isCategory": false,
            "documentKey": "738cd3da8c12479290d2ce44afca931f",
            "appId": "addressbook",
            "index": 3,
            "documentId": "738cd3da8c12479290d2ce44afca931f",
            "columnValues": [
                {
                    "propertyName": "properties.label",
                    "value": "TEST組織"
                },
                {
                    "propertyName": "properties.name",
                    "value": "test"
                },
                {
                    "propertyName": "properties.groupType",
                    "value": "organization"
                },
                {
                    "propertyName": "properties.fullLabel",
                    "value": "TEST組織"
                },
                {
                    "propertyName": "properties.shortLabel",
                    "value": null
                },
                {
                    "propertyName": "properties.members",
                    "value": "[{\\"userId\\":\\"2a8047083a7c409989a56633b240baf6\\",\\"type\\":\\"user\\",\\"roles\\":[]},{\\"userId\\":\\"28a6f145303b47e89cff31fc604e89c9\\",\\"type\\":\\"user\\",\\"roles\\":[]},{\\"userId\\":\\"28e622bd58d04977933d88a6c612b285\\",\\"type\\":\\"user\\",\\"roles\\":[]},{\\"userId\\":\\"2258e1c20ef64fc1ba7353659518f4f6\\",\\"type\\":\\"user\\",\\"roles\\":[]}]"
                },
                {
                    "propertyName": "properties.path",
                    "value": "/"
                },
                {
                    "propertyName": "properties.description",
                    "value": null
                },
                {
                    "propertyName": "properties.fullpath",
                    "value": "/test"
                },
                {
                    "propertyName": "system.documentId",
                    "value": "738cd3da8c12479290d2ce44afca931f"
                }
            ]
        }
    ],
    "system": {
        "formKey": ""
    }
}
`)
//#endregion
jest.mock('../../../src/account-manager/EimAccount.ts', () => {
    return {
        getEimAccount: jest.fn(),
        eimTokens: 'token'
    };
});

jest.mock('native-base', () => ({
    ...jest.requireActual('native-base'),
    Toast: {
        show: jest.fn(),
    }
}));

const listData = [{
    docId: 'a001',
    displayName: '理光 一郎',
    corpName: 'RITS',
    orgName: 'EIM APP DEV',
    faceImageId: '',
}, {
    docId: 'a002',
    displayName: '理光 二郎',
    corpName: 'RITS',
    orgName: 'EIM APP DEV',
    faceImageId: '',
}];


describe('init', () => {
    test('default', () => {
        const wrapper = Enzyme.shallow(<UserSelectScreen onSelect={jest.fn()} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('only user', () => {
        const filter = { users: true, groups: false, organizations: false };
        const wrapper = Enzyme.shallow<UserSelectScreen>(<UserSelectScreen onSelect={jest.fn()} filter={filter} />);
        const state = wrapper.state();
        expect(state.selectedDirectoryType).toEqual('user');
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('only group', () => {
        const filter = { users: false, groups: true, organizations: false };
        const wrapper = Enzyme.shallow<UserSelectScreen>(<UserSelectScreen onSelect={jest.fn()} filter={filter} />);
        const state = wrapper.state();
        expect(state.selectedDirectoryType).toEqual('group');
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('user and group', () => {
        const filter = { users: true, groups: false, organizations: true };
        const wrapper = Enzyme.shallow<UserSelectScreen>(<UserSelectScreen onSelect={jest.fn()} filter={filter} />);
        const state = wrapper.state();
        expect(state.selectedDirectoryType).toEqual('user');
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('set list data', () => {
        const wrapper = Enzyme.shallow(<UserSelectScreen onSelect={jest.fn()} />);
        wrapper.setState({
            searchResult: listData,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('no result', () => {
        const wrapper = Enzyme.shallow<UserSelectScreen>(<UserSelectScreen onSelect={jest.fn()} />);
        wrapper.setState({
            showNoResultMessage: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('button event', () => {
    test('on press search button', () => {
        const wrapper = Enzyme.shallow(<UserSelectScreen onSelect={jest.fn()} />);
        wrapper.setState({
            searchResult: listData,
            showNoResultMessage: true,
        });
        const searchButton = wrapper.findWhere(a => a.key() === 'search-button');
        const instance = wrapper.instance() as UserSelectScreen;
        instance['searchCondition'] = {
            offset: 90,
            limit: 30,
        };
        instance['commonSearch'] = jest.fn();
        wrapper.update();
        searchButton.simulate('press');
        expect(instance['commonSearch']).not.toBeCalled();
    });
    test('on press search button', () => {
        const wrapper = Enzyme.shallow(<UserSelectScreen onSelect={jest.fn()} />);
        wrapper.setState({
            searchResult: listData,
            showNoResultMessage: true,
            searchWords: 'test',
        });
        const expectSearch = {
            'limit': 30,
            'offset': 0,
            'search':
                [
                    '(',
                    '(',
                    {
                        'ignoreCaseSense': false,
                        'operator': 'equal',
                        'propertyName': 'properties.userType',
                        'type': 'string',
                        'value': 'user'
                    },
                    'or',
                    {
                        'ignoreCaseSense': false,
                        'operator': 'equal',
                        'propertyName': 'properties.userType',
                        'type': 'string', 'value': null
                    },
                    ')',
                    ')',
                    'and',
                    {
                        'ignoreCaseSense': true,
                        'operator': 'fulltextsearch_sentence',
                        'propertyName': 'fulltextsearch_list',
                        'type': 'string',
                        'value': 'test'
                    }
                ],
        };
        const searchButton = wrapper.findWhere(a => a.key() === 'search-button');
        const instance = wrapper.instance() as UserSelectScreen;
        instance['searchCondition'] = {
            offset: 90,
            limit: 30,
        };
        instance['commonSearch'] = jest.fn();
        wrapper.update();
        searchButton.simulate('press');
        expect(instance['commonSearch']).toBeCalledWith(
            'userdoclist',
            instance['createUserRowData'],
            expectSearch);
        const state = wrapper.state() as any;
        expect(state.searchResult).toEqual([]);
        expect(state.processing).toBeTruthy();
        expect(state.showNoResultMessage).toBeFalsy();
        expect(instance['searchCondition'].offset).toEqual(0);
    });

    test('on press more search button', () => {
        const wrapper = Enzyme.shallow<UserSelectScreen>(<UserSelectScreen onSelect={jest.fn()} />);
        wrapper.setState({
            canContinue: true,
            searchResult: listData,
        });
        const expectSearch = {
            'limit': 30,
            'offset': 90,
            'search':
                [
                    '(',
                    '(',
                    {
                        'ignoreCaseSense': false,
                        'operator': 'equal',
                        'propertyName': 'properties.userType',
                        'type': 'string',
                        'value': 'user'
                    },
                    'or',
                    {
                        'ignoreCaseSense': false,
                        'operator': 'equal',
                        'propertyName': 'properties.userType',
                        'type': 'string', 'value': null
                    },
                    ')',
                    ')',
                    'and',
                    {
                        'ignoreCaseSense': true,
                        'operator': 'fulltextsearch_sentence',
                        'propertyName': 'fulltextsearch_list',
                        'type': 'string',
                        'value': ''
                    }
                ],
        };
        const instance = wrapper.instance() as UserSelectScreen;
        instance['searchCondition'] = {
            offset: 90,
            limit: 30,
        };
        instance['commonSearch'] = jest.fn();
        wrapper.update();
        const searchButton = wrapper.findWhere(a => a.key() === 'more-search-button');
        searchButton.simulate('press');
        expect(instance['commonSearch']).toBeCalledWith(
            'userdoclist', instance['createUserRowData'],
            expectSearch);
        const state = wrapper.state() as any;
        expect(state.searchResult).toEqual(listData);
        expect(state.processing).toBeTruthy();
        expect(instance['searchCondition'].offset).toEqual(90);
    });
});

describe('event', () => {
    test('show', () => {
        const wrapper = Enzyme.shallow<UserSelectScreen>(<UserSelectScreen onSelect={jest.fn()} />);
        wrapper.setState({
            canContinue: true,
            searchResult: listData,
            selectedDirectoryType: 'group',
            searchWords: 'hoge',
            shown: false,
            processing: true,
        });
        const instance = wrapper.instance();
        instance['searchCondition'] = {
            limit: 30,
            offset: 100,
        };
        wrapper.update();
        instance.show();
        const state = wrapper.state();
        expect(state).toEqual({
            canContinue: false,
            searchResult: [],
            selectedDirectoryType: 'user',
            searchWords: '',
            shown: true,
            showNoResultMessage: false,
            processing: false,
        });
        expect(instance['searchCondition']).toEqual({
            limit: 30,
            offset: 0,
        });
    });
    test('press close button', () => {
        const wrapper = Enzyme.shallow<UserSelectScreen>(<UserSelectScreen onSelect={jest.fn()} />);
        const closeButton = wrapper.findWhere(a => a.key() === 'close-button');
        closeButton.simulate('press');
        const state = wrapper.state();
        expect(state.shown).toBeFalsy();
    });
    test('change search word', () => {
        const wrapper = Enzyme.shallow<UserSelectScreen>(<UserSelectScreen onSelect={jest.fn()} />);
        const inputText = wrapper.findWhere(a => a.key() === 'search-word-input');
        inputText.simulate('changeText', 'hoge');
        const state = wrapper.state();
        expect(state.searchWords).toEqual('hoge');
    });
    test('press searched list item', () => {
        const fn = jest.fn();
        const wrapper = Enzyme.shallow<UserSelectScreen>(
            <UserSelectScreen onSelect={fn} />);
        wrapper.setState({ shown: true });
        const instance = wrapper.instance();
        instance['searchedDirType'] = 'user';
        instance['pressResultRow']('doc-id');
        const state = wrapper.state();
        expect(fn).toBeCalledWith('doc-id', 'user');
        expect(state.shown).toBeFalsy();
    });
    test('change directory type', () => {
        const fn = jest.fn();
        const wrapper = Enzyme.shallow<UserSelectScreen>(
            <UserSelectScreen onSelect={fn} />);
        const dirPicker = wrapper.findWhere(a => a.key() === 'dir-picker');
        dirPicker.simulate('valueChange', 'group');
        const state = wrapper.state();
        expect(state.selectedDirectoryType).toEqual('group');
    });
});

describe('search', () => {
    let wrapper: Enzyme.ShallowWrapper<UserSelectScreen>;
    beforeEach(() => {
        wrapper = Enzyme.shallow(<UserSelectScreen onSelect={jest.fn()} />);
    });
    test('search user on exception', async () => {
        const fn = jest.fn(async () => {
            throw new Error('test');
        });
        mocked(Toast.show).mockClear();
        mocked(getEimAccount).mockClear();
        mocked(getEimAccount).mockImplementation(() => ({
            getServiceAdapter: () => {
                return {
                    getDocListForView: fn,
                };
            },
            eimTokens: ['token'],
        } as any));
        const instance = wrapper.instance() as UserSelectScreen;
        await instance['startSearch']['user']();
        expect(Toast.show).toBeCalled();
    });
    test('search user complete', async () => {
        const fn = jest.fn();
        fn.mockReturnValue(userResults);
        mocked(Toast.show).mockClear();
        mocked(getEimAccount).mockClear();
        mocked(getEimAccount).mockImplementation(() => ({
            getServiceAdapter: () => {
                return {
                    getDocListForView: fn,
                };
            },
            eimTokens: ['token'],
        } as any));
        let resultList = wrapper.findWhere(a => a.key() === 'result-list');
        expect(toJson(resultList)).toMatchSnapshot();
        wrapper.setState({ processing: true, showNoResultMessage: true, });
        const instance = wrapper.instance() as UserSelectScreen;
        instance['searchedWord'] = 'test-word';
        await instance['startSearch']['user']();
        let state = wrapper.state() as any;
        const expectResult = [{
            corpName: '',
            displayName: 'SiteAdmin-DJtj5N3u9VsJ SiteAdmin-DJtj5N3u9VsJ',
            faceImageId: '',
            docId: '59217dfcd1314bd8bf82bfa25ecc5a44',
            orgName: ''
        },
        {
            corpName: '',
            displayName: 'admin root',
            faceImageId: '',
            docId: '2258e1c20ef64fc1ba7353659518f4f6',
            orgName: 'TEST組織'
        },
        {
            corpName: '',
            displayName: 'fsoft anhvd1',
            faceImageId: '',
            docId: '48dae60102c54fa984c1f1b1dcb24a94',
            orgName: ''
        }];
        const expectSearch = [
            '(',
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
            ')',
            ')',
            'and',
            {
                ignoreCaseSense: true,
                propertyName: 'fulltextsearch_list',
                type: 'string',
                operator: 'fulltextsearch_sentence',
                value: 'test-word',
            }
        ];
        expect(fn).toBeCalledWith(['token'], 'addressbook', 'userdoclist',
            { limit: 30, offset: 0, search: expectSearch });
        expect(Toast.show).not.toBeCalled();
        expect(state.processing).toBeFalsy();
        expect(state.searchResult).toEqual(expectResult);
        expect(state.showNoResultMessage).toBeFalsy()
        expect(instance['searchCondition'].offset).toEqual(3);
        // 更に表示のシミュレート
        await instance['startSearch']['user']();
        state = wrapper.state() as any;
        expect(state.searchResult).toEqual([...expectResult, ...expectResult]);
        expect(instance['searchCondition'].offset).toEqual(6);
        expect(state.processing);
        wrapper.update();
        resultList = wrapper.findWhere(a => a.key() === 'result-list');
        expect(toJson(resultList)).toMatchSnapshot();
    });

    test('search group complete', async () => {
        const fn = jest.fn();
        fn.mockReturnValue(groupResults);
        mocked(getEimAccount).mockClear();
        mocked(getEimAccount).mockImplementation(() => ({
            getServiceAdapter: () => {
                return {
                    getDocListForView: fn,
                };
            },
            eimTokens: ['token'],
        } as any));
        let resultList = wrapper.findWhere(a => a.key() === 'result-list');
        expect(toJson(resultList)).toMatchSnapshot();
        const instance = wrapper.instance() as UserSelectScreen;
        instance['searchedWord'] = 'test-word';
        await instance['startSearch']['group']();
        let state = wrapper.state() as any;
        const expectResult = [{
            corpName: '',
            displayName: 'ゲストユーザー管理者グループ',
            faceImageId: '',
            docId: '$GuestManagers',
            orgName: ''
        },
        {
            corpName: '',
            displayName: 'サイト管理者グループ',
            faceImageId: '',
            docId: '$Administrators',
            orgName: ''
        },
        {
            corpName: '',
            displayName: '管理者グループ',
            faceImageId: '',
            docId: 'AdministratorMembers',
            orgName: ''
        }];
        const expectSearch = [
            '(',
            {
                ignoreCaseSense: false,
                operator: 'equal',
                propertyName: 'properties.groupType',
                type: 'string',
                value: 'group',
            },
            ')',
            'and',
            {
                ignoreCaseSense: true,
                propertyName: 'fulltextsearch_list',
                type: 'string',
                operator: 'fulltextsearch_sentence',
                value: 'test-word',
            }
        ];
        expect(fn).toBeCalledWith(['token'], 'addressbook', 'groupdoclist',
            { limit: 30, offset: 0, search: expectSearch });
        expect(state.searchResult).toEqual(expectResult);
        expect(instance['searchCondition'].offset).toEqual(3);
        await instance['startSearch']['group']();
        state = wrapper.state() as any;
        expect(state.searchResult).toEqual([...expectResult, ...expectResult]);
        expect(instance['searchCondition'].offset).toEqual(6);
        wrapper.update();
        resultList = wrapper.findWhere(a => a.key() === 'result-list');
        expect(toJson(resultList)).toMatchSnapshot();
    });
    test('search organization complete', async () => {
        const fn = jest.fn();
        fn.mockReturnValue(orgResults);
        mocked(getEimAccount).mockClear();
        mocked(getEimAccount).mockImplementation(() => ({
            getServiceAdapter: () => {
                return {
                    getDocListForView: fn,
                };
            },
            eimTokens: ['token'],
        } as any));
        let resultList = wrapper.findWhere(a => a.key() === 'result-list');
        expect(toJson(resultList)).toMatchSnapshot();
        const instance = wrapper.instance() as UserSelectScreen;
        instance['searchedWord'] = 'test-word';
        await instance['startSearch']['organization']();
        let state = wrapper.state() as any;
        const expectResult = [{
            corpName: '',
            displayName: 'RITS BS事',
            faceImageId: '',
            docId: '0abebb0204264abb9d0f0e91be2901e5',
            orgName: ''
        },
        {
            corpName: '',
            displayName: 'RITS',
            faceImageId: '',
            docId: '7bf3fbe443de4b96b91f49bd0e2305c6',
            orgName: ''
        },
        {
            corpName: '',
            displayName: 'TEST組織',
            faceImageId: '',
            docId: '738cd3da8c12479290d2ce44afca931f',
            orgName: ''
        }];
        const expectSearch = [
            {
                ignoreCaseSense: true,
                propertyName: 'fulltextsearch_list',
                type: 'string',
                operator: 'fulltextsearch_sentence',
                value: 'test-word',
            }
        ];
        expect(fn).toBeCalledWith(['token'], 'addressbook', 'organizationdoclist',
            { limit: 30, offset: 0, search: expectSearch });
        expect(state.searchResult).toEqual(expectResult);
        expect(instance['searchCondition'].offset).toEqual(3);
        await instance['startSearch']['organization']();
        state = wrapper.state() as any;
        expect(state.searchResult).toEqual([...expectResult, ...expectResult]);
        expect(instance['searchCondition'].offset).toEqual(6);
        wrapper.update();
        resultList = wrapper.findWhere(a => a.key() === 'result-list');
        expect(toJson(resultList)).toMatchSnapshot();
    });
});
