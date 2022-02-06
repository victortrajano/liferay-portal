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

import {SEARCH_PARAMS_KEYS} from '.';
import {Liferay} from '../../services/liferay';
import getLiferaySiteName from '../getLiferaySiteName';

const BASE_URL = `${Liferay.ThemeDisplay.getPortalURL()}/${getLiferaySiteName()}`;

export const LOCATIONS = {
	home: () => new URL(BASE_URL),
	onboarding: (accountKey) =>
		new URL(
			`${BASE_URL}/onboarding?${SEARCH_PARAMS_KEYS.accountKey}=${accountKey}`
		),
	overview: (accountKey) =>
		new URL(
			`${BASE_URL}/overview?${SEARCH_PARAMS_KEYS.accountKey}=${accountKey}`
		),
};
