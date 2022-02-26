/* eslint-disable no-unused-vars */
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

import {FieldArray, Formik, useFormikContext} from 'formik';
import {useEffect, useMemo} from 'react';
import Button from '../../../components/Button';
import {Liferay} from '../../../services/liferay';
import getInitialDXPAdmin from '../../../utils/getInitialDXPAdmin';
import Layout from '../Layout';
import FormDXPEnvironment from './containers/FormDXPEnvironment';
import HeaderDetails from './containers/HeaderDetails';
import useGraphQL from './hooks/useGraphQL';
import setFirstDataCenterRegionSelected from './utils/setFirstDataCenterRegionSelected';

const SetupDXPCloudPage = ({handlePage, leftButton}) => {
	const {
		accountSubscriptions,
		dxpCloudEnvironment,
		dxpcDataCenterRegions,
		getPromiseMutations,
		koroneikiAccount,
	} = useGraphQL();

	const hasAccountSubscriptionsWithDisasterRecovery = !!accountSubscriptions.items;
	const {isValid, setFieldValue, touched, values} = useFormikContext();

	const dxpcDataCenterRegionsOptions = useMemo(
		() =>
			dxpcDataCenterRegions.items?.map(
				({name, value}) =>
					({
						label: name,
						value,
					} || [])
			),
		[dxpcDataCenterRegions.items]
	);

	useEffect(() => {
		if (dxpcDataCenterRegionsOptions?.length) {
			setFirstDataCenterRegionSelected(
				setFieldValue,
				dxpcDataCenterRegionsOptions[0],
				hasAccountSubscriptionsWithDisasterRecovery
			);
		}
	}, [
		hasAccountSubscriptionsWithDisasterRecovery,
		dxpcDataCenterRegionsOptions,
		setFieldValue,
	]);

	const handleSubmitButton = async () => {
		const {data} = await dxpCloudEnvironment.create.mutation({
			variables: {
				dxpCloudEnvironment: {
					accountKey: koroneikiAccount.data?.accountKey,
					dataCenterRegion: values.dataCenterRegion,
					disasterDataCenterRegion: values.disasterDataCenterRegion,
					projectId: values.projectId,
				},
				scopeKey: Liferay.ThemeDisplay.getScopeGroupId(),
			},
		});

		if (data) {
			const dxpCloudEnvironmentId =
				data.c?.createDXPCloudEnvironment?.dxpCloudEnvironmentId;

			await Promise.all(
				getPromiseMutations(values.admins, dxpCloudEnvironmentId)
			);

			handlePage(koroneikiAccount.data, true);
		}
	};

	return (
		<Layout
			className="pt-1 px-3"
			footerProps={{
				leftButton: (
					<Button
						borderless
						onClick={() => handlePage(koroneikiAccount.data)}
					>
						{leftButton}
					</Button>
				),
				middleButton: (
					<Button
						disabled={
							!isValid ||
							touched.admins?.length !== values.admins?.length
						}
						displayType="primary"
						onClick={handleSubmitButton}
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
			<FieldArray
				name="admins"
				render={({push}) => (
					<>
						<HeaderDetails
							koroneikiAccount={koroneikiAccount.data}
						/>

						<FormDXPEnvironment
							admins={values.admins}
							dxpcDataCenterRegionsOptions={
								dxpcDataCenterRegionsOptions
							}
							hasAccountSubscriptionsWithDisasterRecovery={
								hasAccountSubscriptionsWithDisasterRecovery
							}
						/>

						<Button
							borderless
							className="ml-3 my-2 text-brand-primary"
							onClick={() => push(getInitialDXPAdmin())}
							prependIcon="plus"
							small
						>
							Add Another Admin
						</Button>
					</>
				)}
			/>
		</Layout>
	);
};

const SetupDXPCloudForm = (props) => {
	return (
		<Formik
			initialValues={{
				admins: [getInitialDXPAdmin()],
				dataCenterRegion: '',
				disasterDataCenterRegion: '',
				projectId: '',
			}}
		>
			<SetupDXPCloudPage {...props} />
		</Formik>
	);
};

export default SetupDXPCloudForm;
