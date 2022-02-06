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

const GET_ACCOUNT_ACCOUNT_ROLES = gql`
	query getAccountAccountRoles($accountId: Long!) {
		accountAccountRoles(accountId: $accountId) {
			items {
				id
				name
			}
		}
	}
`;

export function useGetAccountAccountRoles(accountId, options = {skip: false}) {
	return useQuery(GET_ACCOUNT_ACCOUNT_ROLES, {
		skip: options.skip,
		variables: {
			accountId,
		},
	});
}
