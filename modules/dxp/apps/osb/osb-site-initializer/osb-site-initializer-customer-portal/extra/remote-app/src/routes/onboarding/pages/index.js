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
import useGraphQL from '../hooks/useGraphQL';
import {ONBOARDING_STEP_TYPES} from '../utils/constants';
import getStepsComponent from '../utils/getStepsComponent';

const Pages = () => {
	const setRedirectURL = useRedirectURL();
	const [{step}, dispatch] = useOnboardingContext();

	const {
		accountFlag,
		accountSubscriptionGroup: accountSubscriptionGroupDXPCloud,
		koroneikiAccount,
	} = useGraphQL();
	const stepsComponent = getStepsComponent(
		accountSubscriptionGroupDXPCloud.data,
		dispatch,
		setRedirectURL
	);

	if (
		!accountSubscriptionGroupDXPCloud.loading &&
		!koroneikiAccount.loading
	) {
		if (!accountFlag.create.called) {
			accountFlag.create.mutation({
				variables: {
					accountFlag: {
						accountKey: koroneikiAccount.data?.accountKey,
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
