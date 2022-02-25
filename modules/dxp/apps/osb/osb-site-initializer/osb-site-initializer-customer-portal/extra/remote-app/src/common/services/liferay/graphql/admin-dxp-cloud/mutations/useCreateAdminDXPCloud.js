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

import {gql, useMutation} from '@apollo/client';

const CREATE_ADMIN_DXP_CLOUD = gql`
	mutation createAdminDXPCloud(
		$scopeKey: String!
		$adminDXPCloud: InputC_AdminDXPCloud!
	) {
		c {
			createAdminDXPCloud(
				scopeKey: $scopeKey
				AdminDXPCloud: $adminDXPCloud
			) {
				adminDXPCloudId
				dateCreated
				dateModified
				dxpCloudEnvironmentId
				emailAddress
				externalReferenceCode
				firstName
				githubUsername
				lastName
				status
			}
		}
	}
`;

export function useCreateAdminDXPCloud() {
	return useMutation(CREATE_ADMIN_DXP_CLOUD);
}
