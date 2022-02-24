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
import {setContext} from '@apollo/client/link/context';
import {RestLink} from 'apollo-link-rest';
import {LocalStorageWrapper, persistCache} from 'apollo3-cache-persist';
import {useEffect, useState} from 'react';
import {Liferay} from '../services/liferay';
import {liferayTypePolicies} from '../services/liferay/graphql/typePolicies';
import {oktaTypePolicies} from '../services/okta/graphql/typePolicies';
import {QUERY_OPERATIONS} from '../utils/constants/queryOperations';
import {STORAGE_KEYS} from '../utils/constants/storageKeys';

const LiferayURI = `${Liferay.ThemeDisplay.getPortalURL()}/o`;

export default function useApollo(oktaAPI, provisioningServerAPI) {
	const [client, setClient] = useState();

	useEffect(() => {
		const init = async () => {
			const cache = new InMemoryCache({
				typePolicies: {
					...liferayTypePolicies,
					...oktaTypePolicies,
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

			const provisioningRESTLink = new RestLink({
				uri: provisioningServerAPI,
			});

			const ProvisioningAuthLink = setContext((_, {headers}) => {
				const authToken = localStorage.getItem(STORAGE_KEYS.authToken);

				return {
					headers: {
						...headers,
						'Okta-Session-ID': authToken || '',
					},
				};
			});

			const restLink = split(
				(operation) =>
					QUERY_OPERATIONS.okta.includes(operation.operationName),
				oktaRESTLink,
				split(
					(operation) =>
						QUERY_OPERATIONS.provisioning.includes(
							operation.operationName
						),
					ProvisioningAuthLink.concat(provisioningRESTLink),
					liferayRESTLink
				)
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
	}, [oktaAPI, provisioningServerAPI]);

	return client;
}
