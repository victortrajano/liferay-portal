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

import {ApolloClient, InMemoryCache} from '@apollo/client';
import {BatchHttpLink} from '@apollo/client/link/batch-http';
import {LocalStorageWrapper, persistCache} from 'apollo3-cache-persist';
import {useEffect, useState} from 'react';
import {Liferay} from '../services/liferay';
import {API_BASE_URL} from '../utils/constants';

export default function useApollo() {
	const [client, setClient] = useState();

	useEffect(() => {
		const init = async () => {
			const cache = new InMemoryCache();
			const batchLink = new BatchHttpLink({
				headers: {
					'x-csrf-token': Liferay.authToken,
				},
				uri: `${API_BASE_URL}/o/graphql`,
			});

			await persistCache({
				cache,
				storage: new LocalStorageWrapper(window.localStorage),
			});

			const apolloClient = new ApolloClient({
				cache,
				link: batchLink,
			});

			setClient(apolloClient);
		};

		init();
	}, []);

	return client;
}
