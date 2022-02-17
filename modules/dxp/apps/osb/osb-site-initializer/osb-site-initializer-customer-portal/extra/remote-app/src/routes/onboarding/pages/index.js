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
import {ROUTE_TYPES} from '../../../common/utils/constants';
import {useOnboardingContext} from '../context';
import useOnboardingData from '../hooks/useOnboardingData';
import {ONBOARDING_STEP_TYPES} from '../utils/constants';
import getStepsComponent from '../utils/getStepsComponent';

const Pages = () => {
	const setRedirectURL = useRedirectURL();
	const [{step}, dispatch] = useOnboardingContext();
	const {
		accountFlag,
		accountSubscriptionGroups,
		koroneikiAccounts,
		userAccount,
	} = useOnboardingData();

	const stepsComponent = getStepsComponent(
		accountSubscriptionGroups.first,
		dispatch,
		koroneikiAccounts.first,
		setRedirectURL
	);

	if (
		!userAccount.loading &&
		!koroneikiAccounts.loading &&
		!accountSubscriptionGroups.loading
	) {
		if (!accountFlag.create.called) {
			accountFlag.create.mutation({
				variables: {
					accountFlag: {
						accountKey: koroneikiAccounts.first.accountKey,
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
