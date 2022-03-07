/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {accountAccountRolesTypePolicy} from './account-account-roles/typePolicy';
import {accountFlagsTypePolicy} from './account-flags/typePolicy';
import {accountSubscriptionGroupsTypePolicy} from './account-subscription-groups/typePolicy';
import {accountsTypePolicy} from './accounts/typePolicy';
import {bannedEmailDomainsTypePolicy} from './banned-email-domains/typePolicy';
import {dxpCloudEnvironmentsTypePolicy} from './dxp-cloud-environments/typePolicy';
import {dxpcDataCenterRegionsTypePolicy} from './dxpc-data-center-regions/typePolicy';
import {
	koroneikiAccountsQueryTypePolicy,
	koroneikiAccountsTypePolicy,
} from './koroneiki-accounts/typePolicy';
import {structuredContentFoldersTypePolicy} from './structured-content-folders/typePolicy';
import {structuredContentsTypePolicy} from './structured-contents/typePolicy';
import {teamMemberInvitationsTypePolicy} from './team-member-invitations/typePolicy';
import {userAccountsTypePolicy} from './user-accounts/typePolicy';

export const liferayTypePolicies = {
	...accountsTypePolicy,
	...accountAccountRolesTypePolicy,
	...accountFlagsTypePolicy,
	...accountSubscriptionGroupsTypePolicy,
	...accountSubscriptionGroupsTypePolicy,
	...bannedEmailDomainsTypePolicy,
	...dxpcDataCenterRegionsTypePolicy,
	...dxpCloudEnvironmentsTypePolicy,
	...koroneikiAccountsTypePolicy,
	...structuredContentsTypePolicy,
	...teamMemberInvitationsTypePolicy,
	...userAccountsTypePolicy,
	...structuredContentFoldersTypePolicy,
	Mutationc: {
		merge: true,
	},
	c: {
		fields: {
			...koroneikiAccountsQueryTypePolicy,
		},
		merge: true,
	},
};
