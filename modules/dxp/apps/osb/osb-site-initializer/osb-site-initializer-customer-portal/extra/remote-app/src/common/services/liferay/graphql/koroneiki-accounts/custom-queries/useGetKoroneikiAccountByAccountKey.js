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

import {useGetKoroneikiAccounts} from '..';
import {Liferay} from '../../..';
import {useGetUserAccount} from '../../user-accounts';

export function useGetKoroneikiAccountByAccountKey() {
	const {
		data: userAccountData,
		loading: userAccountLoading,
	} = useGetUserAccount(Liferay.ThemeDisplay.getUserId());

	const selectAccountBrief =
		userAccountData?.userAccount?.selectedAccountBrief;

	const {data, loading} = useGetKoroneikiAccounts({
		filter: `accountKey eq '${selectAccountBrief?.externalReferenceCode}'`,
		skip: userAccountLoading,
	});

	return {
		data: data?.c?.koroneikiAccounts?.items[0],
		loading: userAccountLoading || loading,
	};
}
