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

import {useCallback} from 'react';
import {REDIRECT_URL_TYPES} from '../utils/constants/redirectURLTypes';

export default function useRedirectURL(action = REDIRECT_URL_TYPES.replace) {
	return useCallback(
		(url) =>
			action === REDIRECT_URL_TYPES.replace
				? window.location.replace(url)
				: window.location.assign(url),
		[action]
	);
}
