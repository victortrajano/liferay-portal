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

import {gql, useQuery} from '@apollo/client';
import {STORAGE_KEYS} from '../../../../../utils/constants/storageKeys';
import {storage} from '../../../../liferay/storage';

const GET_CURRENT_SESSION = gql`
	query getCurrentSession {
		session @rest(type: "Session", path: "/sessions/me") {
			id
			login
			userId
			expiresAt
			status
			lastPasswordVerification
			lastFactorVerification
		}
	}
`;

export function useGetCurrentSession(options = {skip: false}) {
	return useQuery(GET_CURRENT_SESSION, {
		fetchPolicy: 'network-only',
		onCompleted: (data) => {
			const session = data?.session;

			if (session) {
				storage.setItem(STORAGE_KEYS.authToken, session.id);
			}
		},
		skip: options.skip,
	});
}
