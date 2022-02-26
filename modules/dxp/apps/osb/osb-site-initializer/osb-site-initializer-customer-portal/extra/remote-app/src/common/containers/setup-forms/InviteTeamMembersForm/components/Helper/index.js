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

import {useAppPropertiesContext} from '../../../../../context/AppPropertiesProvider';
import {ROLE_TYPES} from '../../../../../utils/constants';

const SLA = {
	gold: 'Gold',
	platinum: 'Platinum',
};

const Helper = ({availableAdminsRoles, koroneikiAccount}) => {
	const {articleAccountSupportURL} = useAppPropertiesContext();

	const projectHasSLAGoldPlatinum =
		koroneikiAccount?.slaCurrent?.includes(SLA.gold) ||
		koroneikiAccount?.slaCurrent?.includes(SLA.platinum);

	return (
		<div className="invites-helper px-3">
			<div className="mx-3 pt-3">
				<h5 className="text-neutral-7">
					{`${
						projectHasSLAGoldPlatinum
							? ROLE_TYPES.requestor.name
							: ROLE_TYPES.admin.name
					}	roles available: ${availableAdminsRoles} of ${
						koroneikiAccount?.maxRequestors
					}`}
				</h5>

				<p className="mb-0 text-neutral-7 text-paragraph-sm">
					{`Only ${koroneikiAccount?.maxRequestors} member${
						koroneikiAccount?.maxRequestors > 1 ? 's' : ''
					} per project (including yourself) have
             role permissions (Admins & Requestors) to open Support
             tickets. `}

					<a
						className="font-weight-bold text-neutral-9"
						href={articleAccountSupportURL}
						rel="noreferrer noopener"
						target="_blank"
					>
						Learn more about Customer Portal roles
					</a>
				</p>
			</div>
		</div>
	);
};

export default Helper;
