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

import {Liferay} from '../../../../services/liferay';
import {useGetAccountAccountRoles} from '../../../../services/liferay/graphql/account-account-roles';
import {useGetKoroneikiAccountByAccountKey} from '../../../../services/liferay/graphql/koroneiki-accounts';
import {useCreateTeamMemberInvitation} from '../../../../services/liferay/graphql/team-member-invitations';
import {useCreateOrUpdateUserAccount} from '../../../../services/liferay/graphql/user-accounts';
import {useCreateOrUpdateAccountProvisioning} from '../../../../services/provisioning/graphql/accounts';

export default function useGraphQL() {
	const [createTeamMemberInvitation] = useCreateTeamMemberInvitation();
	const [createOrUpdateUserAccount] = useCreateOrUpdateUserAccount();
	const [
		createOrUpdateAccountProvisioning,
	] = useCreateOrUpdateAccountProvisioning();

	const {data, loading} = useGetKoroneikiAccountByAccountKey();

	const {
		data: accountAccountRolesData,
		loading: accountAccountRolesLoading,
	} = useGetAccountAccountRoles(data?.accountBrief.id, {
		skip: loading,
	});

	return {
		accountAccountRoles: {
			items: accountAccountRolesData?.accountAccountRoles?.items,
			loading: accountAccountRolesLoading,
		},
		koroneikiAccount: {
			...data,
			loading,
		},
		promiseMutations: (role, emailAddress) =>
			Promise.all([
				createTeamMemberInvitation({
					variables: {
						scopeKey: Liferay.ThemeDisplay.getScopeGroupId(),
						teamMemberInvitation: {
							accountKey: data?.accountKey,
							email: emailAddress,
							role: role.name,
						},
					},
				}),
				createOrUpdateUserAccount({
					variables: {
						accountKey: data?.accountKey,
						accountRoleId: role.id,
						emailAddress,
					},
				}),
				createOrUpdateAccountProvisioning({
					variables: {
						accountKey: data?.accountKey,
						emailAddress,
						role: role.name,
					},
				}),
			]),
	};
}
