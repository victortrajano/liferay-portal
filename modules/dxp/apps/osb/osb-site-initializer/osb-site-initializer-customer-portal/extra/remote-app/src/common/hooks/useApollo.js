import {ApolloClient, InMemoryCache} from '@apollo/client';
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
