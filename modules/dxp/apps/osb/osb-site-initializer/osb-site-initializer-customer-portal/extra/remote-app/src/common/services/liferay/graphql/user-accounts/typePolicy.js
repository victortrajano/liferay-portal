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

import {ROLE_TYPES} from '../../../../utils/constants/roleTypes';
import {SEARCH_PARAMS_KEYS} from '../../../../utils/constants/searchParamsKeys';
import {searchParams} from '../../searchParams';

export const userAccountsTypePolicy = {
	AccountBrief: {
		keyFields: ['externalReferenceCode'],
	},
	RoleBrief: {
		keyFields: ['id'],
	},
	UserAccount: {
		fields: {
			hasAdministratorRole: {
				read(_, {readField}) {
					return !!readField('roleBriefs')?.find(
						(roleBrief) =>
							readField('name', roleBrief) === 'Administrator'
					);
				},
			},
			selectedAccountBrief: {
				read(_, {readField, toReference}) {
					const accountKey = searchParams.get(
						SEARCH_PARAMS_KEYS.accountKey
					);

					if (!accountKey) {
						return null;
					}

					const accountBriefRef = readField('accountBriefs')?.find(
						(accountBrief) =>
							readField('externalReferenceCode', accountBrief) ===
							accountKey
					);

					if (accountBriefRef) {
						const hasAccountAdministratorRole = !!readField(
							'roleBriefs',
							accountBriefRef
						)?.find(
							(roleBrief) =>
								readField('name', roleBrief) ===
								ROLE_TYPES.admin.key
						);

						return {
							externalReferenceCode: accountKey,
							hasAccountAdministratorRole,
							id: readField('id', accountBriefRef),
							name: readField('name', accountBriefRef),
						};
					} else if (readField('hasAdministratorRole')) {
						const accountRef = toReference({
							__typename:
								'com_liferay_headless_admin_user_dto_v1_0_Account',
							externalReferenceCode: accountKey,
						});

						if (accountRef) {
							return {
								externalReferenceCode: accountKey,
								hasAccountAdministratorRole: false,
								id: readField('id', accountRef),
								name: readField('name', accountRef),
							};
						}
					}

					return null;
				},
			},
		},
		keyFields: ['id'],
	},
};
