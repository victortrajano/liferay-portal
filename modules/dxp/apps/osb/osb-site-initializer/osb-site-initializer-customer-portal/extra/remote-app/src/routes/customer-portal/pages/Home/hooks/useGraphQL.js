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

import {NetworkStatus} from '@apollo/client';
import {useEffect, useMemo, useState} from 'react';
import {Liferay} from '../../../../../common/services/liferay';
import {useGetAccounts} from '../../../../../common/services/liferay/graphql/accounts/queries/useGetAccounts';
import {useGetKoroneikiAccounts} from '../../../../../common/services/liferay/graphql/koroneiki-accounts';
import {useGetUserAccount} from '../../../../../common/services/liferay/graphql/user-accounts';
import getFilterKoroneikiAccounts from '../utils/getFilterKoroneikiAccounts';

export default function useGraphQL() {
	const [initialTotalCount, setInitialTotalCount] = useState(0);
	const [
		lastGetAccountRequestStatus,
		setLastGetAccountRequestStatus,
	] = useState();

	const {
		data: userAccountData,
		loading: userAccountLoading,
	} = useGetUserAccount(Liferay.ThemeDisplay.getUserId());

	const {
		data: accountsData,
		fetchMore,
		loading: accountsLoading,
		networkStatus: getAccountsNetworkStatus,
		refetch: accountsRefetch,
	} = useGetAccounts({
		notifyOnNetworkStatusChange: true,
		skip:
			userAccountLoading ||
			!userAccountData?.userAccount?.hasAdministratorRole,
	});

	useEffect(() => {
		if (getAccountsNetworkStatus !== NetworkStatus.ready) {
			setLastGetAccountRequestStatus(getAccountsNetworkStatus);
		}
	}, [getAccountsNetworkStatus]);

	const filterKoroneikiAccounts = useMemo(() => {
		const userAccount = userAccountData?.userAccount;
		const isLiferayStaff = userAccount?.hasAdministratorRole;
		const accounts = accountsData?.accounts;

		if (isLiferayStaff && accounts) {
			return getFilterKoroneikiAccounts(accounts.items);
		}

		return getFilterKoroneikiAccounts(userAccount?.accountBriefs);
	}, [accountsData?.accounts, userAccountData?.userAccount]);

	const {
		data: koroneikiAccountsData,
		loading: koroneikiAccountsLoading,
		refetch: koroneikiAccountsRefetch,
	} = useGetKoroneikiAccounts({
		filter: filterKoroneikiAccounts,
		skip: userAccountLoading || accountsLoading,
	});

	useEffect(() => {
		if (
			(!accountsLoading &&
				lastGetAccountRequestStatus === NetworkStatus.setVariables) ||
			lastGetAccountRequestStatus === NetworkStatus.refetch
		) {
			koroneikiAccountsRefetch({
				filter: filterKoroneikiAccounts,
			});
		}
	}, [
		accountsLoading,
		filterKoroneikiAccounts,
		koroneikiAccountsRefetch,
		lastGetAccountRequestStatus,
	]);

	useEffect(() => {
		setInitialTotalCount((previousInitialTotalCount) => {
			const totalCount = accountsData?.accounts?.totalCount;

			if (totalCount > previousInitialTotalCount) {
				return totalCount;
			}

			return previousInitialTotalCount;
		});
	}, [accountsData?.accounts?.totalCount]);

	return [
		{
			items: koroneikiAccountsData?.c?.koroneikiAccounts?.items,
			loading:
				koroneikiAccountsLoading ||
				userAccountLoading ||
				accountsLoading,
		},
		{
			fetchMore,
			initialTotalCount,
			isLiferayStaff: userAccountData?.userAccount?.hasAdministratorRole,
			networkStatus: getAccountsNetworkStatus,
			refetch: accountsRefetch,
			totalCount: accountsData?.accounts?.totalCount,
		},
	];
}
