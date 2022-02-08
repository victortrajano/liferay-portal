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
import {Liferay} from '../../services/liferay';
import {useGetUserAccount} from '../../services/liferay/graphql/user-accounts';
import OnboardingGuardRoute from './routes/Onboarding';
import PortalGuardRoute from './routes/Portal';

const Guard = ({children, onboarding, portal}) => {
	const {data, loading} = useGetUserAccount(Liferay.ThemeDisplay.getUserId());

	if (!loading) {
		const {userAccount} = data;

		if (onboarding) {
			return (
				<OnboardingGuardRoute userAccount={userAccount}>
					{children}
				</OnboardingGuardRoute>
			);
		}

		if (portal) {
			return (
				<PortalGuardRoute userAccount={userAccount}>
					{children}
				</PortalGuardRoute>
			);
		}
	}

	return <ClayLoadingIndicator />;
};

export default Guard;
