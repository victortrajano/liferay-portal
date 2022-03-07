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

import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {useMemo, useState} from 'react';
import {FORMAT_DATE} from '../../../../common/utils/constants/slaCardDate';
import {SLA_CARD_NAMES} from '../../../../common/utils/constants/slaCardNames';
import getDateCustomFormat from '../../utils/getDateCustomFormat';
import SlaCardLayout from './Layout';

const SlaCard = ({koroneikiAccount}) => {
	const [currentSlaCardPosition, setCurrentSlaCardPosition] = useState(0);

	const memoizedSlaCards = useMemo(() => {
		const {
			slaCurrent,
			slaCurrentEndDate,
			slaCurrentStartDate,
			slaExpired,
			slaExpiredEndDate,
			slaExpiredStartDate,
			slaFuture,
			slaFutureEndDate,
			slaFutureStartDate,
		} = koroneikiAccount;

		const slaCurrentStatus = !!slaCurrent && {
			endDate: getDateCustomFormat(
				slaCurrent === slaFuture ? slaFutureEndDate : slaCurrentEndDate,
				FORMAT_DATE,
				'en-US'
			),
			label: SLA_CARD_NAMES.current,
			startDate: getDateCustomFormat(
				slaCurrent === slaExpired
					? slaExpiredStartDate
					: slaCurrentStartDate,
				FORMAT_DATE,
				'en-US'
			),
			title: slaCurrent.split(' ')[0],
		};

		const slaCards = [];

		if (slaCurrentStatus) {
			slaCards.push(slaCurrentStatus);
		}

		if (!!slaExpired && slaExpired !== slaCurrent) {
			slaCards.push({
				endDate: getDateCustomFormat(
					slaExpiredEndDate,
					FORMAT_DATE,
					'en-US'
				),
				label: SLA_CARD_NAMES.expired,
				startDate: getDateCustomFormat(
					slaExpiredStartDate,
					FORMAT_DATE,
					'en-US'
				),
				title: slaExpired.split(' ')[0],
			});
		}

		if (!!slaFuture && slaFuture !== slaCurrent) {
			slaCards.push({
				endDate: getDateCustomFormat(
					slaFutureEndDate,
					FORMAT_DATE,
					'en-US'
				),
				label: SLA_CARD_NAMES.future,
				startDate: getDateCustomFormat(
					slaFutureStartDate,
					FORMAT_DATE,
					'en-US'
				),
				title: slaFuture.split(' ')[0],
			});
		}

		return slaCards;
	}, [koroneikiAccount]);

	const handleSlaCardClick = () => {
		const nextPosition = currentSlaCardPosition + 1;

		if (memoizedSlaCards[nextPosition]) {
			setCurrentSlaCardPosition(nextPosition);
		} else {
			setCurrentSlaCardPosition(0);
		}
	};

	return (
		<div className="cp-sla-container position-absolute">
			<h5 className="mb-4">Support Level</h5>

			{memoizedSlaCards.length ? (
				<div>
					<div
						className={classNames({
							'ml-2': memoizedSlaCards.length > 1,
						})}
					>
						<div
							className={classNames(
								'align-items-center d-flex cp-sla-card-holder',
								{
									'cp-sla-multiple-card ml-2':
										memoizedSlaCards.length > 1,
								}
							)}
						>
							{memoizedSlaCards.map((slaCard, index) => (
								<SlaCardLayout
									key={slaCard.title}
									selected={currentSlaCardPosition === index}
									{...slaCard}
								/>
							))}
						</div>
					</div>

					{memoizedSlaCards.length > 1 && (
						<button
							className="btn btn-outline-primary d-none hide ml-3 position-relative rounded-circle"
							onClick={handleSlaCardClick}
						>
							<ClayIcon symbol="angle-right" />
						</button>
					)}
				</div>
			) : (
				<div className="bg-neutral-1 cp-n-sla-card rounded-lg">
					<p className="p-3 text-neutral-7 text-paragraph-sm">
						The project&apos;s Support Level is displayed here for
						projects with ticketing support.
					</p>
				</div>
			)}
		</div>
	);
};

export default SlaCard;
