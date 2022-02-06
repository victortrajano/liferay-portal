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

import ClayLoadingIndicator from '@clayui/loading-indicator';
import useRedirectURL from '../../../hooks/useRedirectURL';
import {useGetAccountFlags} from '../../../services/liferay/graphql/account-flags';
import {LOCATIONS, ROUTE_TYPES} from '../../../utils/constants';

const OnboardingGuardRoute = ({children, userAccount}) => {
	const setRedirectURL = useRedirectURL();

	const hasAccountAdministratorRole =
		userAccount.selectedAccountBrief?.hasAccountAdministratorRole;
	const hasOneAccountBrief = userAccount.accountBriefs?.length === 1;

	const {data, loading} = useGetAccountFlags({
		filter: `accountKey eq '${userAccount.selectedAccountBrief?.externalReferenceCode}' and name eq '${ROUTE_TYPES.onboarding}' and finished eq true`,
		skip: !hasAccountAdministratorRole,
	});

	if (!hasAccountAdministratorRole) {
		setRedirectURL(
			hasOneAccountBrief
				? LOCATIONS.overview(userAccount.accountBriefs[0])
				: LOCATIONS.home()
		);
	}
	else if (!loading) {
		const hasAccountFlags = !!data?.c?.accountFlags?.items?.length;

		if (hasAccountFlags) {
			setRedirectURL(
				hasOneAccountBrief
					? LOCATIONS.overview(
							userAccount.selectedAccountBrief
								.externalReferenceCode
					  )
					: LOCATIONS.home()
			);
		}
		else {
			return children;
		}
	}

	return <ClayLoadingIndicator />;
};

export default OnboardingGuardRoute;
