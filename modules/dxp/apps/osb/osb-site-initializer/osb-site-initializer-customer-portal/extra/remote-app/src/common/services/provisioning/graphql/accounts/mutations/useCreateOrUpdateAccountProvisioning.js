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

const CREATE_OR_UPDATE_ACCOUNT_PROVISIONING = gql`
	mutation createOrUpdateAccountProvisioning(
		$accountKey: String!
		$emailAddress: String!
		$role: String!
	) {
		accountCreatedOrUpdated(
			accountKey: $accountKey
			emailAddress: $emailAddress
			role: $role
			input: {}
		)
			@rest(
				type: "Account_Provisioning"
				path: "/accounts/{args.accountKey}/contacts/by-email-address/{args.emailAddress}/roles?contactRoleNames={args.role}"
				method: "PUT"
			)
	}
`;

export function useCreateOrUpdateAccountProvisioning() {
	return useMutation(CREATE_OR_UPDATE_ACCOUNT_PROVISIONING);
}
