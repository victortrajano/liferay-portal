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

import {ApolloClient, InMemoryCache, from, split} from '@apollo/client';
import {BatchHttpLink} from '@apollo/client/link/batch-http';
import {RestLink} from 'apollo-link-rest';
import {LocalStorageWrapper, persistCache} from 'apollo3-cache-persist';
import {useEffect, useState} from 'react';
import {Liferay} from '../services/liferay';
import {liferayTypePolicies} from '../services/liferay/graphql/typePolicies';
import {OKTA_OPERATIONS} from '../utils/constants/oktaOperations';

const LiferayURI = `${Liferay.ThemeDisplay.getPortalURL()}/o`;

export default function useApollo(oktaAPI) {
	const [client, setClient] = useState();

	useEffect(() => {
		const init = async () => {
			const cache = new InMemoryCache({
				typePolicies: {
					...liferayTypePolicies,
				},
			});
			const batchLink = new BatchHttpLink({
				headers: {
					'x-csrf-token': Liferay.authToken,
				},
				uri: `${LiferayURI}/graphql`,
			});

			const liferayRESTLink = new RestLink({
				endpoints: {
					'headless-delivery': `${LiferayURI}/headless-delivery/v1.0`,
				},
				headers: {
					'x-csrf-token': Liferay.authToken,
				},
				uri: LiferayURI,
			});

			const oktaRESTLink = new RestLink({
				credentials: 'include',
				uri: oktaAPI,
			});

			const restLink = split(
				(operation) =>
					OKTA_OPERATIONS.includes(operation.operationName),
				oktaRESTLink,
				liferayRESTLink
			);

			await persistCache({
				cache,
				storage: new LocalStorageWrapper(window.sessionStorage),
			});

			const apolloClient = new ApolloClient({
				cache,
				link: from([restLink, batchLink]),
			});

			setClient(apolloClient);
		};

		init();
	}, [oktaAPI]);

	return client;
}
