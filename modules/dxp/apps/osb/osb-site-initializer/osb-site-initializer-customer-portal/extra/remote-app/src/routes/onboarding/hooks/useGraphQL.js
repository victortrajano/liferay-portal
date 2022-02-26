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

import {useCreateAccountFlag} from '../../../common/services/liferay/graphql/account-flags/mutations/useCreateAccountFlag';
import {useGetAccountSubscriptionGroups} from '../../../common/services/liferay/graphql/account-subscription-groups';
import {useGetKoroneikiAccountByAccountKey} from '../../../common/services/liferay/graphql/koroneiki-accounts';
import {PRODUCT_TYPES} from '../../customer-portal/utils/constants/productTypes';

export default function useGraphQL() {
	const {
		data: koroneikiAccount,
		loading,
	} = useGetKoroneikiAccountByAccountKey();

	const {
		data: accountSubscriptionGroupsData,
		loading: accountSubscriptionGroupsLoading,
	} = useGetAccountSubscriptionGroups({
		filter: `(accountKey eq '${koroneikiAccount?.accountKey}') and (name eq '${PRODUCT_TYPES.dxpCloud}') and (hasActivation eq true)`,
		skip: loading,
	});

	const [
		createAccountFlag,
		{called: createAccountFlagCalled},
	] = useCreateAccountFlag();

	const accountSubscriptionGroupDXPCloud =
		accountSubscriptionGroupsData?.c?.accountSubscriptionGroups?.items[0];

	return {
		accountFlag: {
			create: {
				called: createAccountFlagCalled,
				mutation: createAccountFlag,
			},
		},
		accountSubscriptionGroup: {
			data: accountSubscriptionGroupDXPCloud,
			loading: accountSubscriptionGroupsLoading || loading,
		},
		koroneikiAccount: {
			data: koroneikiAccount,
			loading,
		},
	};
}
