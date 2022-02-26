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

import ClayForm, {ClayInput} from '@clayui/form';
import {Input} from '../../../../../components';
import useValidateEmailDomainDebounced from '../../../../../hooks/useValidateEmailDomainDebounced';
import {isValidEmail} from '../../../../../utils/validations.form';

const AdminInputs = ({admin, index}) => {
	const {isValidDomain} = useValidateEmailDomainDebounced(admin.email, 500);

	return (
		<ClayForm.Group className="mb-0 pb-1">
			<hr className="mb-4 mt-4 mx-3" />

			<Input
				groupStyle="pt-1"
				label="DXP Cloud System Admin's Email Address"
				name={`admins[${index}].email`}
				placeholder="email@example.com"
				required
				type="email"
				validations={[(value) => isValidEmail(value, isValidDomain)]}
			/>

			<ClayInput.Group className="mb-0">
				<ClayInput.GroupItem className="m-0">
					<Input
						label="System Admin’s First Name"
						name={`admins[${index}].firstName`}
						required
						type="text"
					/>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem className="m-0">
					<Input
						label="System Admin’s Last Name"
						name={`admins[${index}].lastName`}
						required
						type="text"
					/>
				</ClayInput.GroupItem>
			</ClayInput.Group>

			<Input
				groupStyle="mb-0"
				label="System Admin’s Github Username"
				name={`admins[${index}].github`}
				required
				type="text"
			/>
		</ClayForm.Group>
	);
};

export default AdminInputs;
