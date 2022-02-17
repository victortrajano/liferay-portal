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

import {Liferay} from '../../../common/services/liferay';
import {useCreateAccountFlag} from '../../../common/services/liferay/graphql/account-flags/mutations/useCreateAccountFlag';
import {useGetAccountSubscriptionGroups} from '../../../common/services/liferay/graphql/account-subscription-groups';
import {useGetKoroneikiAccounts} from '../../../common/services/liferay/graphql/koroneiki-accounts/queries/useGetKoroneikiAccounts';
import {useGetUserAccount} from '../../../common/services/liferay/graphql/user-accounts';
import {PRODUCT_TYPES} from '../../customer-portal/utils/constants/productTypes';

export default function useOnboardingData() {
	const {
		data: userAccountData,
		loading: userAccountLoading,
	} = useGetUserAccount(Liferay.ThemeDisplay.getUserId());

	const selectAccountBrief =
		userAccountData?.userAccount?.selectedAccountBrief;

	const {
		data: koroneikiAccountsData,
		loading: koroneikiAccountsLoading,
	} = useGetKoroneikiAccounts({
		filter: `accountKey eq '${selectAccountBrief?.externalReferenceCode}'`,
		skip: userAccountLoading,
	});
	const {
		data: accountSubscriptionGroupsData,
		loading: accountSubscriptionGroupsLoading,
	} = useGetAccountSubscriptionGroups({
		filter: `(accountKey eq '${selectAccountBrief?.externalReferenceCode}') and (name eq '${PRODUCT_TYPES.dxpCloud}') and (hasActivation eq true)`,
		skip: userAccountLoading,
	});

	const [
		createAccountFlag,
		{called: createAccountFlagCalled},
	] = useCreateAccountFlag();

	const koroneikiAccount =
		koroneikiAccountsData?.c?.koroneikiAccounts?.items[0];
	const accountSubscriptionGroupDXPCloud =
		accountSubscriptionGroupsData?.c?.accountSubscriptionGroups?.items[0];

	return {
		accountFlag: {
			create: {
				called: createAccountFlagCalled,
				mutation: createAccountFlag,
			},
		},
		accountSubscriptionGroups: {
			first: accountSubscriptionGroupDXPCloud,
			loading: accountSubscriptionGroupsLoading,
		},
		koroneikiAccounts: {
			first: koroneikiAccount,
			loading: koroneikiAccountsLoading,
		},
		userAccount: {
			loading: userAccountLoading,
		},
	};
}
