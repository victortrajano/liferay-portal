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
import {Input, Select} from '../../../../../components';
import {isLowercaseAndNumbers} from '../../../../../utils/validations.form';
import AdminInputs from '../AdminInputs';

const FormDXPEnvironment = ({
	admins,
	dxpcDataCenterRegionsOptions,
	hasAccountSubscriptionsWithDisasterRecovery,
}) => (
	<ClayForm.Group className="mb-0">
		<ClayForm.Group className="mb-0 pb-1">
			<Input
				groupStyle="pb-1"
				helper="Lowercase letters and numbers only. The Project ID cannot be changed."
				label="Project ID"
				name="projectId"
				required
				type="text"
				validations={[(value) => isLowercaseAndNumbers(value)]}
			/>

			<Select
				groupStyle="mb-0"
				label="Primary Data Center Region"
				name="dataCenterRegion"
				options={dxpcDataCenterRegionsOptions}
				required
			/>

			{hasAccountSubscriptionsWithDisasterRecovery && (
				<Select
					groupStyle="mb-0 pt-2"
					label="Disaster Recovery Data Center Region"
					name="disasterDataCenterRegion"
					options={dxpcDataCenterRegionsOptions}
					required
				/>
			)}
		</ClayForm.Group>

		{admins?.map((admin, index) => (
			<AdminInputs admin={admin} index={index} key={index} />
		))}
	</ClayForm.Group>
);

export default FormDXPEnvironment;
