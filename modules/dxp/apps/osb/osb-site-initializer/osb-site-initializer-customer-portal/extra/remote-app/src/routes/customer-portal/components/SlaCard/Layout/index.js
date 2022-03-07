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
import ClayLabel from '@clayui/label';
import classNames from 'classnames';
import React from 'react';

const slaCardTitle = {
	gold: 'Gold',
	limited: 'Limited',
	platinum: 'Platinum',
};

const SlaCardLayout = ({selected, ...slaCard}) => {
	const displayDate = `${slaCard.startDate} - ${slaCard.endDate}`;

	return (
		<div
			className={classNames('align-items-center d-flex', {
				'cp-sla-card': !selected,
				'cp-sla-card-active': selected,
			})}
		>
			<ClayCard
				className={classNames('m-0 p-3 rounded-lg', {
					'bg-brand-secondary-lighten-6 cp-sla-gold':
						slaCard.title === slaCardTitle.gold,
					'bg-neutral-0 cp-sla-limited':
						slaCard.title === slaCardTitle.limited,
					'cp-sla-platinum': slaCard.title === slaCardTitle.platinum,
				})}
			>
				<ClayCard.Row className="align-items-center d-flex justify-content-between">
					<div
						className={classNames('h5 mb-0', {
							'text-brand-primary-darken-2':
								slaCard.title === slaCardTitle.limited,
							'text-brand-secondary-darken-3':
								slaCard.title === slaCardTitle.gold,
							'text-neutral-7':
								slaCard.title === slaCardTitle.platinum,
						})}
					>
						{slaCard.title}
					</div>

					<div>
						<ClayCard.Caption>
							<ClayLabel
								className={classNames(
									'mr-0 p-0 text-small-caps cp-sla-label',
									{
										'label-borderless-dark text-neutral-7':
											slaCard.title ===
											slaCardTitle.platinum,
										'label-borderless-primary text-brand-primary-darken-2':
											slaCard.title ===
											slaCardTitle.limited,
										'label-borderless-secondary text-brand-secondary-darken-3':
											slaCard.title === slaCardTitle.gold,
									}
								)}
								displayType="secundary"
							>
								{slaCard.label}
							</ClayLabel>
						</ClayCard.Caption>
					</div>
				</ClayCard.Row>

				<ClayCard.Description
					className={classNames('', {
						'text-brand-primary-darken-2':
							slaCard.title === slaCardTitle.limited,
						'text-brand-secondary-darken-3':
							slaCard.title === slaCardTitle.gold,
						'text-neutral-6':
							slaCard.title === slaCardTitle.platinum,
					})}
					displayType="text"
					truncate={false}
				>
					{displayDate}
				</ClayCard.Description>
			</ClayCard>
		</div>
	);
};

export default SlaCardLayout;
