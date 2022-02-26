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

import {
	PRODUCT_TYPES,
	STATUS_TAG_TYPE_NAMES,
} from '../../../../../routes/customer-portal/utils/constants';
import {Liferay} from '../../../../services/liferay';
import {
	useGetAccountSubscriptionGroups,
	useUpdateAccountSubscriptionGroup,
} from '../../../../services/liferay/graphql/account-subscription-groups';
import {useGetAccountSubscriptions} from '../../../../services/liferay/graphql/account-subscriptions';
import {useCreateAdminDXPCloud} from '../../../../services/liferay/graphql/admin-dxp-cloud';
import {useCreateDXPCloudEnvironment} from '../../../../services/liferay/graphql/dxp-cloud-environments';
import {useGetDXPCDataCenterRegions} from '../../../../services/liferay/graphql/dxpc-data-center-regions';
import {useGetKoroneikiAccountByAccountKey} from '../../../../services/liferay/graphql/koroneiki-accounts';

export default function useGraphQL() {
	const [createDXPCloudEnvironment] = useCreateDXPCloudEnvironment();
	const [createAdminDXPCloud] = useCreateAdminDXPCloud();
	const [
		updateAccountSubscriptionGroup,
	] = useUpdateAccountSubscriptionGroup();

	const {
		data: dxpcDataCenterRegionData,
		loading: dxpcDataCenterRegionLoading,
	} = useGetDXPCDataCenterRegions();
	const {
		data: koroneikiAccountData,
		loading: koroneikiAccountLoading,
	} = useGetKoroneikiAccountByAccountKey();
	const {
		data: accountSubscriptionsData,
		loading: accountSubscriptionsLoading,
	} = useGetAccountSubscriptions({
		filter: `(accountKey eq '${koroneikiAccountData?.accountKey}') and (hasDisasterDataCenterRegion eq true)`,
		skip: koroneikiAccountLoading,
	});
	const {
		data: accountSubscriptionGroupsData,
		loading: accountSubscriptionGroupsLoading,
	} = useGetAccountSubscriptionGroups({
		filter: `(accountKey eq '${koroneikiAccountData?.accountKey}') and (name eq '${PRODUCT_TYPES.dxpCloud}') and (hasActivation eq true)`,
		skip: koroneikiAccountLoading,
	});

	const accountSubscriptionGroupsItem =
		accountSubscriptionGroupsData?.c?.accountSubscriptionGroups?.items[0];

	return {
		accountSubscriptionGroups: {
			loading: accountSubscriptionGroupsLoading,
		},
		accountSubscriptions: {
			items: accountSubscriptionsData?.c?.accountSubscriptions?.items,
			loading: accountSubscriptionsLoading,
		},
		dxpCloudEnvironment: {
			create: {
				mutation: createDXPCloudEnvironment,
			},
		},
		dxpcDataCenterRegions: {
			items: dxpcDataCenterRegionData?.c?.dXPCDataCenterRegions?.items,
			loading: dxpcDataCenterRegionLoading,
		},
		getPromiseMutations: (admins, dxpCloudEnvironmentId) => [
			Promise.all(
				admins?.map(({email, firstName, github, lastName}) =>
					createAdminDXPCloud({
						variables: {
							adminDXPCloud: {
								dxpCloudEnvironmentId,
								emailAddress: email,
								firstName,
								githubUsername: github,
								lastName,
							},
							scopeKey: Liferay.ThemeDisplay.getScopeGroupId(),
						},
					})
				)
			),
			updateAccountSubscriptionGroup({
				variables: {
					accountSubscriptionGroup: {
						activationStatus: STATUS_TAG_TYPE_NAMES.inProgress,
					},
					accountSubscriptionGroupId:
						accountSubscriptionGroupsItem?.accountSubscriptionGroupId,
				},
			}),
		],
		koroneikiAccount: {
			data: koroneikiAccountData,
			loading: koroneikiAccountLoading,
		},
	};
}
