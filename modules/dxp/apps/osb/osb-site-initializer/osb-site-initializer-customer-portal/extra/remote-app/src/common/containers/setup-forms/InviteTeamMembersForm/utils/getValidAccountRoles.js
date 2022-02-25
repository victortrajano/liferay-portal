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

import {ROLE_TYPES} from '../../../../utils/constants';

const SLA = {
	gold: 'Gold',
	platinum: 'Platinum',
};

const ROLE_NAME_KEY = {
	[ROLE_TYPES.admin.key]: ROLE_TYPES.admin.name,
	[ROLE_TYPES.member.key]: ROLE_TYPES.member.name,
};

export default function getValidAccountRoles(
	accountAccountRoles,
	slaCurrent,
	partner
) {
	const projectHasSLAGoldPlatinum =
		slaCurrent?.includes(SLA.gold) || slaCurrent?.includes(SLA.platinum);

	return accountAccountRoles?.reduce((rolesAccumulator, role) => {
		let isValidRole = true;

		if (!projectHasSLAGoldPlatinum) {
			isValidRole = role.name !== ROLE_TYPES.requestor.key;
		}

		if (!partner) {
			isValidRole =
				role.name !== ROLE_TYPES.partnerManager.key &&
				role.name !== ROLE_TYPES.partnerMember.key;
		}

		if (isValidRole) {
			const roleName = ROLE_NAME_KEY[role.name] || role.name;

			rolesAccumulator.push({
				...role,
				name: roleName,
			});
		}

		return rolesAccumulator;
	}, []);
}
