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

import ClayForm from '@clayui/form';
import {Formik} from 'formik';
import {useCallback, useEffect, useState} from 'react';
import {isLowercaseAndNumbers} from '../../../../common/utils/validations.form';
import {STATUS_TAG_TYPE_NAMES} from '../../../../routes/customer-portal/utils/constants';
import {Button, Input, Select} from '../../../components';
import {useUpdateAccountSubscriptionGroup} from '../../../services/liferay/graphql/account-subscription-groups';
import {useGetAccountSubscriptions} from '../../../services/liferay/graphql/account-subscriptions';
import {useCreateAdminDXPCloud} from '../../../services/liferay/graphql/admin-dxp-cloud';
import {useCreateDXPCloudEnvironment} from '../../../services/liferay/graphql/dxp-cloud-environments';
import {useGetDXPCDataCenterRegions} from '../../../services/liferay/graphql/dxpc-data-center-regions';
import getInitialDXPAdmin from '../../../utils/getInitialDXPAdmin';
import Layout from '../Layout';
import AdminInputs from './AdminInputs';

const SetupDXPCloudPage = ({
	errors,
	handlePage,
	leftButton,
	project,
	setFieldValue,
	subscriptionGroupId,
	touched,
	values,
}) => {
	const [baseButtonDisabled, setBaseButtonDisabled] = useState(true);

	const [createDXPCloudEnvironment] = useCreateDXPCloudEnvironment();
	const [createAdminDXPCloud] = useCreateAdminDXPCloud();
	const [
		updateAccountSubscriptionGroups,
	] = useUpdateAccountSubscriptionGroup();

	const {data: accountSubscriptionsData} = useGetAccountSubscriptions({
		filter: `(accountKey eq '${project.accountKey}') and (hasDisasterDataCenterRegion eq true)`,
	});
	const {data: dxpcDataCenterRegionData} = useGetDXPCDataCenterRegions();

	const hasDisasterRecovery = !!accountSubscriptionsData?.c
		?.accountSubscriptions?.items;
	const dxpcDataCenterRegions = dxpcDataCenterRegionData?.c?.dXPCDataCenterRegions?.items?.map(
		({name, value}) => ({
			label: name,
			value,
		})
	);

	const callbackSetFieldValue = useCallback(
		(field, value) => setFieldValue(field, value),
		[setFieldValue]
	);

	useEffect(() => {
		if (dxpcDataCenterRegions?.length) {
			callbackSetFieldValue(
				'dxp.dataCenterRegion',
				dxpcDataCenterRegions[0].value
			);

			if (hasDisasterRecovery) {
				callbackSetFieldValue(
					'dxp.disasterDataCenterRegion',
					dxpcDataCenterRegions[0].value
				);
			}
		}
	}, [dxpcDataCenterRegions, hasDisasterRecovery, callbackSetFieldValue]);

	useEffect(() => {
		const hasTouched = !Object.keys(touched).length;
		const hasError = Object.keys(errors).length;

		setBaseButtonDisabled(hasTouched || hasError);
	}, [touched, errors]);

	const sendEmail = async () => {
		const dxp = values?.dxp;

		if (dxp) {
			const {data} = createDXPCloudEnvironment({
				variables: {
					dxpCloudEnvironment: {
						accountKey: project.accountKey,
						dataCenterRegion: dxp.dataCenterRegion,
						disasterDataCenterRegion: dxp.disasterDataCenterRegion,
						projectId: dxp.projectId,
					},
					scopeKey: Liferay.ThemeDisplay.getScopeGroupId(),
				},
			});

			if (data) {
				const dxpCloudEnvironmentId =
					data.c?.createDXPCloudEnvironment?.dxpCloudEnvironmentId;
				await Promise.all(
					dxp.admins.map(({email, firstName, github, lastName}) =>
						createAdminDXPCloud({
							variables: {
								AdminDXPCloud: {
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
				);

				await updateAccountSubscriptionGroups({
					variables: {
						accountSubscriptionGroup: {
							activationStatus: STATUS_TAG_TYPE_NAMES.inProgress,
						},
						accountSubscriptionGroupId: subscriptionGroupId,
					},
				});

				handlePage(true);
			}
		}
	};

	return (
		<Layout
			className="pt-1 px-3"
			footerProps={{
				leftButton: (
					<Button borderless onClick={() => handlePage()}>
						{leftButton}
					</Button>
				),
				middleButton: (
					<Button
						disabled={baseButtonDisabled}
						displayType="primary"
						onClick={() => sendEmail()}
					>
						Submit
					</Button>
				),
			}}
			headerProps={{
				helper:
					'We’ll need a few details to finish building your DXP environment(s).',
				title: 'Set up DXP Cloud',
			}}
		>
			<div className="d-flex justify-content-between mb-2 pb-1 pl-3">
				<div className="mr-4 pr-2">
					<label>Project Name</label>

					<p className="dxp-cloud-project-name text-neutral-6 text-paragraph-lg">
						<strong>
							{project.name.length > 71
								? project.name.substring(0, 71) + '...'
								: project.name}
						</strong>
					</p>
				</div>

				<div className="flex-fill">
					<label>Liferay DXP Version</label>

					<p className="text-neutral-6 text-paragraph-lg">
						<strong>{project.dxpVersion}</strong>
					</p>
				</div>
			</div>

			<ClayForm.Group className="mb-0">
				<ClayForm.Group className="mb-0 pb-1">
					<Input
						groupStyle="pb-1"
						helper="Lowercase letters and numbers only. The Project ID cannot be changed."
						label="Project ID"
						name="dxp.projectId"
						required
						type="text"
						validations={[(value) => isLowercaseAndNumbers(value)]}
					/>

					<Select
						groupStyle="mb-0"
						label="Primary Data Center Region"
						name="dxp.dataCenterRegion"
						options={dxpcDataCenterRegions}
						required
					/>

					{hasDisasterRecovery && (
						<Select
							groupStyle="mb-0 pt-2"
							label="Disaster Recovery Data Center Region"
							name="dxp.disasterDataCenterRegion"
							options={dxpcDataCenterRegions}
							required
						/>
					)}
				</ClayForm.Group>

				{values.dxp.admins.map((admin, index) => (
					<AdminInputs admin={admin} id={index} key={index} />
				))}
			</ClayForm.Group>

			<Button
				borderless
				className="ml-3 my-2 text-brand-primary"
				onClick={() => {
					setFieldValue('dxp.admins', [
						...values.dxp.admins,
						getInitialDXPAdmin(),
					]);
					setBaseButtonDisabled(true);
				}}
				prependIcon="plus"
				small
			>
				Add Another Admin
			</Button>
		</Layout>
	);
};

const SetupDXPCloudForm = (props) => {
	return (
		<Formik
			initialValues={{
				dxp: {
					admins: [getInitialDXPAdmin()],
					dataCenterRegion: '',
					disasterDataCenterRegion: '',
					projectId: '',
				},
			}}
			validateOnChange
		>
			{(formikProps) => <SetupDXPCloudPage {...props} {...formikProps} />}
		</Formik>
	);
};

export default SetupDXPCloudForm;
