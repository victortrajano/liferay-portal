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

import {LOCATIONS} from '../../../common/utils/constants';
import {actionTypes} from '../context/reducer';
import {ONBOARDING_STEP_TYPES} from './constants';

export default function inviteTeamMembersFormHandle(
	dispatch,
	hasAccountSubscriptionGroupDXPCloud,
	koroneikiAccount,
	setRedirectURL
) {
	if (hasAccountSubscriptionGroupDXPCloud) {
		dispatch({
			payload: ONBOARDING_STEP_TYPES.dxpCloud,
			type: actionTypes.CHANGE_STEP,
		});
	}
	else {
		setRedirectURL(LOCATIONS.overview(koroneikiAccount?.accountKey));
	}
}
