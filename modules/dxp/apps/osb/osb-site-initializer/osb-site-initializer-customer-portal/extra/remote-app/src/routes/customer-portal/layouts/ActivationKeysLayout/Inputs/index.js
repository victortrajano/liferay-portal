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

import {ClaySelect} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import {useEffect, useState} from 'react';
import client from '../../../../../apolloClient';
import {Button} from '../../../../../common/components';
import {useApplicationProvider} from '../../../../../common/context/AppPropertiesProvider';
import {
	getAccountSubscriptions,
	getAccountSubscriptionsTerms,
} from '../../../../../common/services/liferay/graphql/queries';
import {getCommonLicenseKey} from '../../../../../common/services/liferay/rest/raysource/LicenseKeys';
import downloadFromBlob from '../../../../../common/utils/downloadFromBlob';
import getCurrentEndDate from '../../../../../common/utils/getCurrentEndDate';
import {EXTENSION_FILE_TYPES, STATUS_CODE} from '../../../utils/constants';
import {getYearlyTerms} from '../../../utils/getYearlyTerms';

const ActivationKeysInputs = ({
	accountKey,
	productKey,
	productTitle,
	sessionId,
}) => {
	const {submitSupportTicketURL, provisioningServerAPI} =
		useApplicationProvider();

	const [accountSubscriptions, setAccountSubscriptions] = useState([]);

	const [
		selectedAccountSubscriptionName,
		setSelectedAccountSubscriptionName,
	] = useState('');

	const [accountSubscriptionsTermsDates, setAccountSubscriptionsTermsDates] =
		useState([]);
	const [selectDateInterval, setSelectedDateInterval] = useState();

	const [hasLicenseDownloadError, setLicenseDownloadError] = useState(false);

	useEffect(() => {
		const fetchAccountSubscriptions = async () => {
			const {data} = await client.query({
				query: getAccountSubscriptions,
				variables: {
					filter: `accountSubscriptionGroupERC eq '${accountKey}_${productKey}'`,
				},
			});

			if (data) {
				const items = data.c?.accountSubscriptions?.items;
				setAccountSubscriptions(data.c?.accountSubscriptions?.items);

				setSelectedAccountSubscriptionName(items[0].name);
			}
		};

		fetchAccountSubscriptions();
	}, [accountKey, productKey]);

	useEffect(() => {
		const getSubscriptionTerms = async () => {
			const filterAccountSubscriptionERC = `accountSubscriptionERC eq '${accountKey}_${productKey}_${selectedAccountSubscriptionName.toLowerCase()}'`;

			const {data} = await client.query({
				query: getAccountSubscriptionsTerms,
				variables: {
					filter: filterAccountSubscriptionERC,
				},
			});

			if (data) {
				const accountSubscriptionsTerms =
					data.c?.accountSubscriptionTerms?.items || [];

				if (accountSubscriptionsTerms.length) {
					const dateIntervals = getYearlyTerms(
						accountSubscriptionsTerms[0]
					);

					setAccountSubscriptionsTermsDates(dateIntervals);
					setSelectedDateInterval(dateIntervals[0]);
				}
			}
		};

		if (selectedAccountSubscriptionName) {
			getSubscriptionTerms();
		}
	}, [accountKey, productKey, selectedAccountSubscriptionName]);

	useEffect(() => {
		if (selectedAccountSubscriptionName && selectDateInterval) {
			setLicenseDownloadError(false);
		}
	}, [selectDateInterval, selectedAccountSubscriptionName]);

	const handleClick = async () => {
		const license = await getCommonLicenseKey(
			accountKey,
			selectDateInterval.endDate.toISOString(),
			selectDateInterval.startDate.toISOString(),
			selectedAccountSubscriptionName.toLowerCase(),
			provisioningServerAPI,
			encodeURI(productTitle),
			sessionId
		);

		if (license.status === STATUS_CODE.success) {
			const contentType = license.headers.get('content-type');
			const extensionFile = EXTENSION_FILE_TYPES[contentType] || '.txt';
			const licenseBlob = await license.blob();

			downloadFromBlob(licenseBlob, `license${extensionFile}`);

			return;
		}

		setLicenseDownloadError(true);
	};

	return (
		<div className="mt-3">
			<p className="text-paragraph">
				Select an active Liferay {productTitle} subscription to download
				the activation key.
			</p>

			<div className="d-flex mb-3">
				<label className="cp-subscription-select mr-3">
					Subscription
					<div className="position-relative">
						<ClayIcon
							className="select-icon"
							symbol="caret-bottom"
						/>

						<ClaySelect
							onChange={(event) =>
								setSelectedAccountSubscriptionName(
									event.target.value
								)
							}
							value={selectedAccountSubscriptionName}
						>
							{accountSubscriptions.map((accountSubscription) => (
								<ClaySelect.Option
									key={
										accountSubscription.accountSubscriptionId
									}
									label={accountSubscription.name}
									value={accountSubscription.name}
								/>
							))}
						</ClaySelect>
					</div>
				</label>

				<label className="cp-subscription-term-select">
					Subscription Term
					<div className="position-relative">
						<ClayIcon
							className="select-icon"
							symbol="caret-bottom"
						/>

						<ClaySelect
							onChange={(event) => {
								setSelectedDateInterval(
									accountSubscriptionsTermsDates[
										event.target.value
									]
								);
							}}
						>
							{accountSubscriptionsTermsDates.map(
								(dateInterval, index) => {
									const formattedDate = `${getCurrentEndDate(
										dateInterval.startDate
									)} - ${getCurrentEndDate(
										dateInterval.endDate
									)}`;

									return (
										<ClaySelect.Option
											className="options"
											key={index}
											label={formattedDate}
											value={index}
										/>
									);
								}
							)}
						</ClaySelect>
					</div>
				</label>
			</div>

			<Button
				className="btn btn-outline-primary"
				disabled={
					hasLicenseDownloadError ||
					!(selectedAccountSubscriptionName && selectDateInterval)
				}
				onClick={handleClick}
				prependIcon="download"
				type="button"
			>
				Download Key
			</Button>

			{hasLicenseDownloadError && (
				<p className="mt-3 text-neutral-7 text-paragraph">
					{`The requested activation key is not yet available. For more
					information about the availability of your Enterprise Search
					activation keys, please `}

					<a
						href={submitSupportTicketURL}
						rel="noreferrer"
						target="_blank"
					>
						<u className="font-weight-bold text-neutral-9">
							contact the Support team
						</u>
					</a>
				</p>
			)}
		</div>
	);
};

export default ActivationKeysInputs;
