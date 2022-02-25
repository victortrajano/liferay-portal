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

const HeaderDetails = ({koroneikiAccount}) => {
	const accountBrief = koroneikiAccount?.accountBrief;

	return (
		<div className="d-flex justify-content-between mb-2 pb-1 pl-3">
			<div className="mr-4 pr-2">
				<label>Project Name</label>

				<p className="dxp-cloud-project-name text-neutral-6 text-paragraph-lg">
					<strong>
						{accountBrief?.name?.length > 71
							? accountBrief?.name.substring(0, 71) + '...'
							: accountBrief?.name}
					</strong>
				</p>
			</div>

			<div className="flex-fill">
				<label>Liferay DXP Version</label>

				<p className="text-neutral-6 text-paragraph-lg">
					<strong>{koroneikiAccount?.dxpVersion}</strong>
				</p>
			</div>
		</div>
	);
};

export default HeaderDetails;
