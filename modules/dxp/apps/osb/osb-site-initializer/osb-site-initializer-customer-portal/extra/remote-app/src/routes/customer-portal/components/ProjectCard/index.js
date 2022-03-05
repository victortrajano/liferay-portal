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
import classNames from 'classnames';
import {memo} from 'react';
import useRedirectURL from '../../../../common/hooks/useRedirectURL';
import {LOCATIONS} from '../../../../common/utils/constants/locations';
import {REDIRECT_URL_TYPES} from '../../../../common/utils/constants/redirectURLTypes';
import getDateCustomFormat from '../../utils/getDateCustomFormat';
import StatusTag from '../StatusTag';
import getStatus from './utils/getStatus';
import getStatusMessage from './utils/getStatusMessage';

const ProjectCard = ({isSmall, ...koroneikiAccount}) => {
	const setRedirectURL = useRedirectURL(REDIRECT_URL_TYPES.assign);
	const statusTag = getStatus(koroneikiAccount);

	return (
		<ClayCard
			className={classNames('m-0', {
				'cp-project-card': !isSmall,
				'cp-project-card-sm': isSmall,
			})}
			onClick={() =>
				setRedirectURL(LOCATIONS.overview(koroneikiAccount?.accountKey))
			}
		>
			<ClayCard.Body
				className={classNames('d-flex h-100 justify-content-between', {
					'flex-column': !isSmall,
					'flex-row': isSmall,
				})}
			>
				<ClayCard.Description
					className="text-neutral-7"
					displayType="title"
					tag={isSmall ? 'h4' : 'h3'}
					title={koroneikiAccount?.code}
				>
					{koroneikiAccount?.code}

					{isSmall && (
						<div className="font-weight-lighter subtitle text-neutral-5 text-paragraph text-uppercase">
							{koroneikiAccount?.code}
						</div>
					)}
				</ClayCard.Description>

				<div
					className={classNames('d-flex justify-content-between', {
						'align-items-end': isSmall,
					})}
				>
					<ClayCard.Description
						displayType="text"
						tag="div"
						title={null}
						truncate={false}
					>
						<StatusTag currentStatus={statusTag} />

						<div
							className={classNames(
								'text-paragraph-sm',
								'text-neutral-5',
								{
									'my-1': !isSmall,
									'sm-mb': isSmall,
								}
							)}
						>
							{getStatusMessage(statusTag)}

							<span className="font-weight-bold text-paragraph">
								{getDateCustomFormat(
									koroneikiAccount?.slaCurrentEndDate,
									{
										day: '2-digit',
										month: 'short',
										year: 'numeric',
									}
								)}
							</span>
						</div>

						{isSmall && (
							<div className="text-align-end text-neutral-5 text-paragraph-sm">
								{'Support Region '}

								<span className="font-weight-bold">
									{koroneikiAccount?.region}
								</span>
							</div>
						)}
					</ClayCard.Description>
				</div>
			</ClayCard.Body>
		</ClayCard>
	);
};

export default memo(ProjectCard);
