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

import {gql, useLazyQuery, useQuery} from '@apollo/client';

const GET_ACCOUNT_SUBSCRIPTIONS = gql`
	query getAccountSubscriptions($filter: String) {
		c {
			accountSubscriptions(filter: $filter) {
				items {
					accountKey
					accountSubscriptionGroupERC
					accountSubscriptionId
					endDate
					instanceSize
					name
					quantity
					startDate
					subscriptionStatus
				}
			}
		}
	}
`;

export function useGetAccountSubscriptions(
	options = {filter: '', skip: false}
) {
	return useQuery(GET_ACCOUNT_SUBSCRIPTIONS, {
		skip: options.skip,
		variables: {
			filter: options.filter,
		},
	});
}

export function useLazyGetAccountSubscriptions() {
	return useLazyQuery(GET_ACCOUNT_SUBSCRIPTIONS);
}
