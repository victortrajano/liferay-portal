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

import {useCallback, useEffect, useMemo, useState} from 'react';
import {Liferay} from '../../../../../common/services/liferay';
import {useGetKoroneikiAccounts} from '../../../../../common/services/liferay/graphql/koroneiki-accounts';
import {useGetUserAccount} from '../../../../../common/services/liferay/graphql/user-accounts';
import getFilterKoroneikiAccounts from '../utils/getFilterKoroneikiAccounts';

export default function useGraphQL() {
	const [initialTotalCount, setInitialTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastSearchTerm, setLastSearchTerm] = useState('');
	const [accumulatedItems, setAccumulatedItems] = useState([]);

	const {
		data: userAccountData,
		loading: userAccountLoading,
	} = useGetUserAccount(Liferay.ThemeDisplay.getUserId());

	const userAccount = userAccountData?.userAccount;
	const filterKoroneikiAccounts = useMemo(
		() =>
			!userAccount?.hasAdministratorRole
				? getFilterKoroneikiAccounts(userAccount?.accountBriefs)
				: '',
		[userAccount?.accountBriefs, userAccount?.hasAdministratorRole]
	);

	const getFilterKoroneikiAccountsBySearch = useCallback(
		(searchTerm) => {
			const filterBySearch = `contains(code, '${searchTerm}')`;

			return searchTerm
				? filterKoroneikiAccounts
					? `(${filterKoroneikiAccounts}) and ${filterBySearch}`
					: filterBySearch
				: filterKoroneikiAccounts;
		},
		[filterKoroneikiAccounts]
	);

	const {data, loading, refetch} = useGetKoroneikiAccounts({
		filter: filterKoroneikiAccounts,
		skip: userAccountLoading,
	});

	const koroneikiAccounts = data?.c?.koroneikiAccounts;

	useEffect(() => {
		const totalCount = koroneikiAccounts?.totalCount;

		if (totalCount > initialTotalCount) {
			setInitialTotalCount(totalCount);
			setAccumulatedItems(koroneikiAccounts?.items);
		}
	}, [
		koroneikiAccounts?.totalCount,
		initialTotalCount,
		koroneikiAccounts?.items,
	]);

	const fetchMore = useCallback(async () => {
		const {data} = await refetch({
			filter: getFilterKoroneikiAccountsBySearch(lastSearchTerm),
			page: currentPage + 1,
		});

		const items = data?.c?.koroneikiAccounts?.items;
		if (items) {
			setCurrentPage((previousCurrentPage) => ++previousCurrentPage);
			setAccumulatedItems((previousAccumulatedItems) => [
				...previousAccumulatedItems,
				...items,
			]);
		}
	}, [
		currentPage,
		getFilterKoroneikiAccountsBySearch,
		lastSearchTerm,
		refetch,
	]);

	const search = useCallback(
		async (searchTerm) => {
			if (searchTerm !== lastSearchTerm) {
				const {data} = await refetch({
					filter: getFilterKoroneikiAccountsBySearch(searchTerm),
					page: 1,
				});

				const items = data?.c?.koroneikiAccounts?.items;
				if (items) {
					setAccumulatedItems(items);
					setCurrentPage(1);
				}

				setLastSearchTerm(searchTerm);
			}
		},
		[getFilterKoroneikiAccountsBySearch, lastSearchTerm, refetch]
	);

	return [
		{
			initialTotalCount,
			items: accumulatedItems,
			loading: loading || userAccountLoading,
			totalCount: koroneikiAccounts?.totalCount,
		},
		{
			fetchMore,
			search,
		},
	];
}
