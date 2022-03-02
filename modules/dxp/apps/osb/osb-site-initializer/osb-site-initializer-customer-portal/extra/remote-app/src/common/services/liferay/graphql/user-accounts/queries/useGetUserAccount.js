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

import {gql, useQuery} from '@apollo/client';
import {Liferay} from '../../..';
import {CUSTOM_EVENT_TYPES} from '../../../../../../routes/customer-portal/utils/constants';
import useHash from '../../../../../hooks/useHash';

const GET_USER_ACCOUNT = gql`
	query getUserAccount($userAccountId: Long!, $accountKey: String) {
		userAccount(userAccountId: $userAccountId) {
			accountBriefs {
				externalReferenceCode
				id
				name
				roleBriefs {
					id
					name
				}
			}
			externalReferenceCode
			id
			image
			name
			roleBriefs {
				id
				name
			}
			hasAdministratorRole @client
			selectedAccountBrief(accountKey: $accountKey) @client {
				externalReferenceCode
				hasAccountAdministratorRole
				id
				name
			}
		}
	}
`;

const eventUserAccount = Liferay.publish(CUSTOM_EVENT_TYPES.userAccount, {
	async: true,
	fireOnce: true,
});

export function useGetUserAccount(userAccountId, options = {skip: false}) {
	const hashLocation = useHash();

	const accountKey = hashLocation
		.replace('#/', '')
		.split('/')
		.filter(Boolean)[0];

	return useQuery(GET_USER_ACCOUNT, {
		onCompleted: (data) =>
			eventUserAccount.fire({
				detail: data?.userAccount,
			}),
		skip: options.skip,
		variables: {
			accountKey,
			userAccountId,
		},
	});
}
