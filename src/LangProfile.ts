import { Localization } from '.';
import { enResource } from './lang/lang_en';
import { jaResource } from './lang/lang_ja';

export type TKey =
    'LK_MSG_file' |
    'LK_MSG_stringResource' |
    'LK_MSG_saveError' |
    'LK_siteInfo' |
    'LK_siteName' |
    'LK_siteDomain' |
    'LK_authenticationMethod' |
    'LK_password' |
    'LK_office' |
    'LK_signIn' |
    'LK_accountDelete' |
    'LK_MSG_siteNameDelete' |
    'LK_cancel' |
    'LK_delete' |
    'LK_MSG_siteDomain' |
    'LK_MSG_siteNameRequired' |
    'LK_MSG_authentication' |
    'LK_EIMSiteList' |
    'LK_appList' |
    'LK_MSG_networkError' |
    'LK_MSG_serverError' |
    'LK_close' |
    'LK_accessPoint' |
    'LK_MSG_app' |
    'LK_MSG_document' |
    'LK_show' |
    'LK_user' |
    'LK_group' |
    'LK_organization' |
    'LK_MSG_searchWord' |
    'LK_MSG_applicable' |
    'LK_netWork';

export const langProfile = Localization.create<TKey>({
    en: enResource,
    ja: jaResource,
    zh: jaResource,
});