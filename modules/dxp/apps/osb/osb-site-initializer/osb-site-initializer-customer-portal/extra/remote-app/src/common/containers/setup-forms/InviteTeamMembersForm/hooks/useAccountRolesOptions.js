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

import {useEffect, useState} from 'react';
import {ROLE_TYPES} from '../../../../utils/constants';

export default function useAccountRolesOptions(
	accountRoles,
	availableAdminsRoles
) {
	const [accountRolesOptions, setAccountRolesOptions] = useState([]);

	useEffect(() => {
		if (accountRoles) {
			setAccountRolesOptions(
				accountRoles.map((accountRole) => ({
					disabled: false,
					label: accountRole.name,
					value: accountRole.id,
				}))
			);
		}
	}, [accountRoles]);

	useEffect(
		() =>
			setAccountRolesOptions((previousAccountRoles) =>
				previousAccountRoles.map((previousAccountRole) => {
					const isRequestorOrAdmin =
						previousAccountRole.label ===
							ROLE_TYPES.requestor.name ||
						previousAccountRole.label === ROLE_TYPES.admin.name;
					const isDisabled =
						availableAdminsRoles < 1 && isRequestorOrAdmin;

					return {
						...previousAccountRole,
						disabled: isDisabled,
					};
				})
			),
		[availableAdminsRoles]
	);

	return accountRolesOptions;
}
