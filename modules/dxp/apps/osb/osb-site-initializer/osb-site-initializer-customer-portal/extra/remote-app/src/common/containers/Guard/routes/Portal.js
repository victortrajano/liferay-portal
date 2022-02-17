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

import ClayLoadingIndicator from '@clayui/loading-indicator';
import {PAGE_TYPES} from '../../../../routes/customer-portal/utils/constants/pageTypes';
import getCurrentPageName from '../../../../routes/customer-portal/utils/getCurrentPageName';
import useRedirectURL from '../../../hooks/useRedirectURL';
import {LOCATIONS} from '../../../utils/constants';

const PortalGuardRoute = ({children, userAccount}) => {
	const setRedirectURL = useRedirectURL();

	const currentPageName = getCurrentPageName();
	const isCurrentPageNameHome =
		!currentPageName || currentPageName === PAGE_TYPES.home;

	const hasSelectedAccountBrief = !!userAccount.selectedAccountBrief;

	if (
		!hasSelectedAccountBrief &&
		!userAccount.isLiferayStaff &&
		!isCurrentPageNameHome
	) {
		const hasOneAccountBrief = userAccount.accountBriefs?.length === 1;

		setRedirectURL(
			hasOneAccountBrief
				? LOCATIONS.overview(userAccount.accountBriefs[0])
				: LOCATIONS.home()
		);
	} else {
		return children;
	}

	return <ClayLoadingIndicator />;
};

export default PortalGuardRoute;
