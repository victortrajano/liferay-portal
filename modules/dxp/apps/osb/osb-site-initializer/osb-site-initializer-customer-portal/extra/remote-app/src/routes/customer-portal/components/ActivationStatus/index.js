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

import ClayCard from '@clayui/card';
import ClayIcon from '@clayui/icon';
import ClayModal, {useModal} from '@clayui/modal';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import client from '../../../../apolloClient';
import BaseButton from '../../../../common/components/BaseButton';
import SetupDXPCloud from '../../../../common/components/onboarding/SetupDXPCloud';
import {
	getAccountSubscriptionGroups,
	getAccountSubscriptionsTerms,
} from '../../../../common/services/liferay/graphql/queries';
import {getCurrentEndDate} from '../../../../common/utils/';
import {ACTIVATION_STATUS_DXP_CLOUD} from '../../../../common/utils/constants';
import {useCustomerPortal} from '../../context';
import {actionTypes} from '../../context/reducer';
import {status} from '../../utils/constants';
import StatusTag from '../StatusTag';

const SetupDXPCloudModal = ({
	observer,
	onClose,
	project,
	subscriptionGroupId,
}) => {
	return (
		<ClayModal center observer={observer}>
			<SetupDXPCloud
				handlePage={onClose}
				leftButton="Cancel"
				project={project}
				subscriptionGroupId={subscriptionGroupId}
			/>
		</ClayModal>
	);
};

const ActivationStatus = ({
	dxpCloudEnvironment,
	project,
	subscriptionGroupDXPCloud,
	userAccount,
}) => {
	const [{assetsPath}, dispatch] = useCustomerPortal();
	const [activationStatusDate, setActivationStatusDate] = useState('');
	const [visible, setVisible] = useState(false);
	const modalProps = useModal({
		onClose: () => setVisible(false),
	});

	const subscriptionGroupActivationStatus =
		subscriptionGroupDXPCloud.activationStatus;

	const onCloseModal = async (isSuccess) => {
		setVisible(false);

		if (isSuccess) {
			const getSubscriptionGroups = async (accountKey) => {
				const {data: dataSubscriptionGroups} = await client.query({
					query: getAccountSubscriptionGroups,
					variables: {
						filter: `accountKey eq '${accountKey}' and hasActivation eq true`,
					},
				});

				if (dataSubscriptionGroups) {
					const items =
						dataSubscriptionGroups?.c?.accountSubscriptionGroups
							?.items;
					dispatch({
						payload: items,
						type: actionTypes.UPDATE_SUBSCRIPTION_GROUPS,
					});
				}
			};

			getSubscriptionGroups(project.accountKey);
		}
	};

	const currentActivationStatus = {
		[ACTIVATION_STATUS_DXP_CLOUD.active]: {
			buttonLink: (
				<a
					className="font-weight-semi-bold m-0 p-0 text-brand-primary text-paragraph"
					href={`https://console.liferay.cloud/projects/${dxpCloudEnvironment?.projectId}/overview`}
					rel="noopener noreferrer"
					target="_blank"
				>
					Go to Product Console
					<ClayIcon className="ml-1" symbol="order-arrow-right" />
				</a>
			),
			id: status.active,
			subtitle:
				'Your DXP Cloud environments are ready. Go to the Product Console to view DXP Cloud details.',
		},
		[ACTIVATION_STATUS_DXP_CLOUD.inProgress]: {
			id: status.inProgress,
			subtitle:
				'Your DXP Cloud environments are being set up and will be available soon.',
		},
		[ACTIVATION_STATUS_DXP_CLOUD.notActivated]: {
			buttonLink: userAccount.isAdmin && (
				<BaseButton
					appendIcon="order-arrow-right"
					className="btn btn-link font-weight-semi-bold p-0 text-brand-primary text-paragraph"
					displayType="link"
					onClick={() => setVisible(true)}
				>
					Finish Activation
				</BaseButton>
			),
			id: status.notActivated,
			subtitle:
				'Almost there! Setup DXP Cloud by finishing the activation form.',
		},
	};

	const activationStatus =
		currentActivationStatus[
			subscriptionGroupActivationStatus || 'Not Activated'
		];

	useEffect(() => {
		const getSubscriptionTerms = async () => {
			const filterAccountSubscriptionERC = `accountSubscriptionGroupERC eq '${project.accountKey}_dxp-cloud'`;
			const {data} = await client.query({
				query: getAccountSubscriptionsTerms,
				variables: {
					filter: filterAccountSubscriptionERC,
				},
			});

			if (data) {
				const endDates = data.c?.accountSubscriptionTerms?.items.map(
					(accountSubscriptionTerm) => accountSubscriptionTerm.endDate
				);
				const startDates = data.c?.accountSubscriptionTerms?.items.map(
					(accountSubscriptionTerm) =>
						accountSubscriptionTerm.startDate
				);

				const earliestStartDate = new Date(Math.max(...startDates));
				const farthestEndDate = new Date(Math.max(...endDates));
				setActivationStatusDate(
					`${getCurrentEndDate(
						earliestStartDate
					)} - ${getCurrentEndDate(farthestEndDate)}`
				);
			}
		};

		getSubscriptionTerms();
	}, [project]);

	return (
		<>
			{visible && (
				<SetupDXPCloudModal
					{...modalProps}
					onClose={onCloseModal}
					project={project}
					subscriptionGroupId={
						subscriptionGroupDXPCloud.accountSubscriptionGroupId
					}
				/>
			)}
			<div className="mb-5">
				<h2>Activation Status</h2>

				<p className="font-weight-normal text-neutral-7 text-paragraph">
					{activationStatus.subtitle}
				</p>

				<div>
					<ClayCard className="activation-status-container border border-light m-0 rounded shadow-none">
						<ClayCard.Body className="px-4 py-3">
							<div className="align-items-center d-flex position-relative">
								<img
									className={classNames(
										'ml-2 mr-4 img-activation-status',
										{
											'in-progress':
												subscriptionGroupActivationStatus ===
												ACTIVATION_STATUS_DXP_CLOUD.inProgress,
											'not-active':
												subscriptionGroupActivationStatus ===
													ACTIVATION_STATUS_DXP_CLOUD.notActivated ||
												!subscriptionGroupActivationStatus,
										}
									)}
									draggable={false}
									height={30.55}
									src={`${assetsPath}/assets/navigation-menu/dxp_icon.svg`}
									width={30.55}
								/>

								<ClayCard.Description
									className="h5 ml-3"
									displayType="title"
									tag="h5"
									title={project.name}
								>
									{project.name}

									<p className="font-weight-normal mb-2 text-neutral-7 text-paragraph">
										{activationStatusDate}
									</p>

									{activationStatus.buttonLink}
								</ClayCard.Description>

								<div className="d-flex justify-content-between ml-auto">
									<ClayCard.Description
										className="label-activation-status position-absolute"
										displayType="text"
										tag="div"
										title={null}
										truncate={false}
									>
										<StatusTag
											currentStatus={activationStatus.id}
										/>
									</ClayCard.Description>
								</div>
							</div>
						</ClayCard.Body>
					</ClayCard>
				</div>
			</div>
		</>
	);
};

export default ActivationStatus;
