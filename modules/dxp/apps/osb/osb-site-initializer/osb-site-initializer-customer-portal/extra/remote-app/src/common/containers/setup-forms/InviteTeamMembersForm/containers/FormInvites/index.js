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

import ClayForm from '@clayui/form';
import {Button} from '../../../../../components';
import TeamMemberInputs from '../TeamMemberInputs';

const MAXIMUM_INVITES_COUNT = 10;

const FormInvites = ({
	accountRolesOptions,
	handleAddMoreMembers,
	handleSelectOnChange,
	invites,
	koroneikiAccount,
}) => {
	return (
		<div className="invites-form overflow-auto px-3">
			<div className="px-3">
				<label>Project Name</label>

				<p className="invites-project-name text-neutral-6 text-paragraph-lg">
					<strong>{koroneikiAccount?.accountBrief?.name}</strong>
				</p>
			</div>

			<ClayForm.Group className="m-0">
				{invites?.map((invite, index) => (
					<TeamMemberInputs
						index={index}
						invite={invite}
						key={index}
						options={accountRolesOptions}
						placeholderEmail="username@example.com"
						selectOnChange={(roleId) =>
							handleSelectOnChange(roleId, index)
						}
					/>
				))}
			</ClayForm.Group>

			{invites?.length < MAXIMUM_INVITES_COUNT && (
				<Button
					borderless
					className="mb-3 ml-3 mt-2 text-brand-primary"
					onClick={handleAddMoreMembers}
					prependIcon="plus"
					small
				>
					Add More Members
				</Button>
			)}
		</div>
	);
};

export default FormInvites;
