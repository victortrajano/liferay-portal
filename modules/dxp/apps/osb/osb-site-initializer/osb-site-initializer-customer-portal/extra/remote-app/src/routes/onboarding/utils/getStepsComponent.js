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

import InviteTeamMembersForm from '../../../common/containers/setup-forms/InviteTeamMembersForm';
import SetupDXPCloudForm from '../../../common/containers/setup-forms/SetupDXPCloudForm';
import SuccessDXPCloud from '../pages/SuccessDXPCloud';
import Welcome from '../pages/Welcome';
import {ONBOARDING_STEP_TYPES} from './constants';
import inviteTeamMembersFormHandle from './inviteTeamMembersFormHandle';
import setupDXPCloudFormHandle from './setupDXPCloudFormHandle';

export default function getStepsComponent(
	accountSubscriptionGroup,
	dispatch,
	koroneikiAccount,
	setRedirectURL
) {
	return {
		[ONBOARDING_STEP_TYPES.invites]: {
			Component: (
				<InviteTeamMembersForm
					handlePage={() =>
						inviteTeamMembersFormHandle(
							dispatch,
							!!accountSubscriptionGroup,
							koroneikiAccount,
							setRedirectURL
						)
					}
					leftButton="Skip for now"
					project={koroneikiAccount}
				/>
			),
		},
		[ONBOARDING_STEP_TYPES.dxpCloud]: {
			Component: (
				<SetupDXPCloudForm
					handlePage={(isSuccess) =>
						setupDXPCloudFormHandle(
							dispatch,
							isSuccess,
							koroneikiAccount,
							setRedirectURL
						)
					}
					leftButton="Skip for now"
					project={koroneikiAccount}
					subscriptionGroupId={accountSubscriptionGroup?.id}
				/>
			),
		},
		[ONBOARDING_STEP_TYPES.successDxpCloud]: {
			Component: <SuccessDXPCloud project={koroneikiAccount} />,
		},
		[ONBOARDING_STEP_TYPES.welcome]: {
			Component: <Welcome />,
			Skeleton: <Welcome.Skeleton />,
		},
	};
}
