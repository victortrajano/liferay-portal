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

export const koroneikiAccountsTypePolicy = {
	C_KoroneikiAccount: {
		fields: {
			accountBrief: {
				read(_, {readField, toReference}) {
					const accountBriefRef = toReference({
						__typename: 'AccountBrief',
						externalReferenceCode: readField('accountKey'),
					});

					const accountRef = toReference({
						__typename:
							'com_liferay_headless_admin_user_dto_v1_0_Account',
						externalReferenceCode: readField('accountKey'),
					});

					return {
						id:
							readField('id', accountBriefRef) ||
							readField('id', accountRef),
					};
				},
			},
			maxRequestors: {
				read(maxRequestors) {
					return maxRequestors < 1 ? 1 : maxRequestors;
				},
			},
		},
		keyFields: ['accountKey'],
	},
	C_KoroneikiAccountPage: {
		merge: true,
	},
};

export const koroneikiAccountsQueryTypePolicy = {
	koroneikiAccounts: {
		keyArgs: ['filter'],
	},
};
