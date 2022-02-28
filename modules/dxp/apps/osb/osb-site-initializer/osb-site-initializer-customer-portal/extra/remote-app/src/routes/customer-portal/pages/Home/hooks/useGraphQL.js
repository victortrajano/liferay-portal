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

import {useEffect, useState} from 'react';
import {Liferay} from '../../../../../common/services/liferay';
import {useGetKoroneikiAccounts} from '../../../../../common/services/liferay/graphql/koroneiki-accounts';
import {useGetUserAccount} from '../../../../../common/services/liferay/graphql/user-accounts';

export default function useGraphQL() {
	const [initialTotalCount, setInitialTotalCount] = useState(0);

	const {
		data: userAccountData,
		loading: userAccountLoading,
	} = useGetUserAccount(Liferay.ThemeDisplay.getUserId());

	const {data, fetchMore, loading, refetch} = useGetKoroneikiAccounts({
		skip:
			userAccountLoading ||
			!userAccountData?.userAccount?.hasAdministratorRole,
	});

	const koroneikiAccounts = data?.c?.koroneikiAccounts;

	useEffect(() => {
		const totalCount = koroneikiAccounts?.totalCount;

		setInitialTotalCount((previousInitialTotalCount) => {
			if (totalCount > previousInitialTotalCount) {
				return totalCount;
			}

			return previousInitialTotalCount;
		});
	}, [koroneikiAccounts?.totalCount]);

	return [
		{
			initialTotalCount,
			items: koroneikiAccounts?.items,
			loading: loading || userAccountLoading,
			totalCount: koroneikiAccounts?.totalCount,
		},
		{
			fetchMore,
			refetch,
		},
	];
}
