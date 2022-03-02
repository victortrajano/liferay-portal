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

import {useLazyQuery} from '@apollo/client';
import {ClayInput} from '@clayui/form';
import {useEffect, useState} from 'react';
import {Input, Select} from '../../../../../components';
import useDebounce from '../../../../../hooks/useDebounce';
import {getBannedEmailDomains} from '../../../../../services/liferay/graphql/queries';
import {isValidEmail} from '../../../../../utils/validations.form';

const TeamMemberInputs = ({
	index,
	invite,
	options,
	placeholderEmail,
	selectOnChange,
}) => {
	const debouncedEmail = useDebounce(invite?.email, 500);
	const [bannedDomain, setBannedDomain] = useState(debouncedEmail);

	const [fetchBannedDomain, {data}] = useLazyQuery(getBannedEmailDomains);
	const bannedDomainsItems = data?.c?.bannedEmailDomains?.items;

	useEffect(() => {
		const emailDomain = debouncedEmail.split('@')[1];

		if (emailDomain) {
			fetchBannedDomain({
				variables: {
					filter: `domain eq '${emailDomain}'`,
				},
			});

			if (bannedDomainsItems?.length) {
				setBannedDomain(bannedDomainsItems[0].domain);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bannedDomainsItems, debouncedEmail]);

	return (
		<ClayInput.Group className="m-0">
			<ClayInput.GroupItem className="m-0">
				<Input
					groupStyle="m-0"
					label="Email"
					name={`invites[${index}].email`}
					placeholder={placeholderEmail}
					type="email"
					validations={[(value) => isValidEmail(value, bannedDomain)]}
				/>
			</ClayInput.GroupItem>

			<ClayInput.GroupItem className="m-0">
				<Select
					groupStyle="m-0"
					label="Role"
					name={`invites[${index}].role.id`}
					onChange={(event) => selectOnChange(event.target.value)}
					options={options}
				/>
			</ClayInput.GroupItem>
		</ClayInput.Group>
	);
};

export default TeamMemberInputs;
