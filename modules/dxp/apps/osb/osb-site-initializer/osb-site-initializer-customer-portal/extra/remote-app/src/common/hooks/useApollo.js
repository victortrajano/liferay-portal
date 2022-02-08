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

import {ApolloClient, InMemoryCache, from} from '@apollo/client';
import {BatchHttpLink} from '@apollo/client/link/batch-http';
import {RestLink} from 'apollo-link-rest';
import {LocalStorageWrapper, persistCache} from 'apollo3-cache-persist';
import {useEffect, useState} from 'react';
import {Liferay} from '../services/liferay';
import {liferayTypePolicies} from '../services/liferay/graphql/typePolicies';

export default function useApollo() {
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
				uri: `${Liferay.ThemeDisplay.getPortalURL()}/o/graphql`,
			});

			const LiferayURI = `${Liferay.ThemeDisplay.getPortalURL()}/o`;

			const liferayRESTLink = new RestLink({
				endpoints: {
					'headless-delivery': `${LiferayURI}/headless-delivery/v1.0`,
				},
				headers: {
					'x-csrf-token': Liferay.authToken,
				},
				uri: LiferayURI,
			});

			await persistCache({
				cache,
				storage: new LocalStorageWrapper(window.sessionStorage),
			});

			const apolloClient = new ApolloClient({
				cache,
				link: from([liferayRESTLink, batchLink]),
			});

			setClient(apolloClient);
		};

		init();
	}, []);

	return client;
}
