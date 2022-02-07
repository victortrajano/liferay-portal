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

import useRedirectURL from '../../../common/hooks/useRedirectURL';
import {Liferay} from '../../../common/services/liferay';
import {useCreateAccountFlag} from '../../../common/services/liferay/graphql/account-flags/mutations/useCreateAccountFlag';
import {useGetAccountSubscriptionGroups} from '../../../common/services/liferay/graphql/account-subscription-groups';
import {useGetKoroneikiAccounts} from '../../../common/services/liferay/graphql/koroneiki-accounts/queries/useGetKoroneikiAccounts';
import {useGetUserAccount} from '../../../common/services/liferay/graphql/user-accounts';
import {ROUTE_TYPES} from '../../../common/utils/constants';
import {PRODUCT_TYPES} from '../../customer-portal/utils/constants/productTypes';
import {useOnboardingContext} from '../context';
import {ONBOARDING_STEP_TYPES} from '../utils/constants';
import getStepsComponent from '../utils/getStepsComponent';

const Pages = () => {
	const setRedirectURL = useRedirectURL();
	const [{step}, dispatch] = useOnboardingContext();

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

	const stepsComponent = getStepsComponent(
		accountSubscriptionGroupDXPCloud,
		dispatch,
		koroneikiAccount,
		setRedirectURL
	);

	if (!koroneikiAccountsLoading && !accountSubscriptionGroupsLoading) {
		if (!createAccountFlagCalled) {
			createAccountFlag({
				variables: {
					accountFlag: {
						accountKey: koroneikiAccount.accountKey,
						finished: true,
						name: ROUTE_TYPES.onboarding,
					},
				},
			});
		}

		return stepsComponent[step].Component;
	}

	return stepsComponent[ONBOARDING_STEP_TYPES.welcome].Skeleton;
};

export default Pages;
