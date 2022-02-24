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
import {useGetKoroneikiAccounts} from '../../../../services/liferay/graphql/koroneiki-accounts';
import {useCreateTeamMemberInvitation} from '../../../../services/liferay/graphql/team-member-invitations';
import {
	useCreateOrUpdateUserAccount,
	useGetUserAccount,
} from '../../../../services/liferay/graphql/user-accounts';
import {useCreateOrUpdateAccount} from '../../../../services/provisioning/graphql/accounts';

export default function useGraphQL() {
	const [createTeamMemberInvitation] = useCreateTeamMemberInvitation();
	const [createOrUpdateUserAccount] = useCreateOrUpdateUserAccount();
	const [createOrUpdateAccount] = useCreateOrUpdateAccount();

	const {
		data: userAccountData,
		loading: userAccountLoading,
	} = useGetUserAccount(Liferay.ThemeDisplay.getUserId());

	const selectAccountBrief =
		userAccountData?.userAccount?.selectedAccountBrief;

	const {
		data: koroneikiAccountsData,
		loading: koroneikiAccountsLoading,
	} = useGetKoroneikiAccounts({
		filter: `accountKey eq '${selectAccountBrief?.externalReferenceCode}'`,
		skip: userAccountLoading,
	});

	const koroneikiAccountItem =
		koroneikiAccountsData?.c?.koroneikiAccounts?.items[0];

	const {
		data: accountAccountRolesData,
		loading: accountAccountRolesLoading,
	} = useGetAccountAccountRoles(selectAccountBrief?.id, {
		skip: userAccountLoading,
	});

	return {
		accountAccountRoles: {
			items: accountAccountRolesData?.accountAccountRoles?.items,
			loading: accountAccountRolesLoading,
		},
		koroneikiAccount: {
			...koroneikiAccountItem,
			loading: koroneikiAccountsLoading,
		},
		promiseMutations: (role, emailAddress) =>
			Promise.all([
				createTeamMemberInvitation({
					variables: {
						scopeKey: Liferay.ThemeDisplay.getScopeGroupId(),
						teamMemberInvitation: {
							accountKey: koroneikiAccountItem?.accountKey,
							email: emailAddress,
							role: role.name,
						},
					},
				}),
				createOrUpdateUserAccount({
					variables: {
						accountKey: koroneikiAccountItem?.accountKey,
						accountRoleId: role.id,
						emailAddress,
					},
				}),
				createOrUpdateAccount({
					variables: {
						accountKey: koroneikiAccountItem?.accountKey,
						emailAddress,
						role: role.name,
					},
				}),
			]),
	};
}
