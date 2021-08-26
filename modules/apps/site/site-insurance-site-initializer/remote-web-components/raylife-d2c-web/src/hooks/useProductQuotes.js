/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import {LiferayService} from '../services/liferay';

export const useProductQuotes = () => {
	const [data, setData] = useState();
	const [error, setError] = useState();

	useEffect(() => {
		_loadProductQuotes();
	}, []);

	const _loadProductQuotes = async () => {
		try {
			const response = await LiferayService.getProductQuotes();
			setData(response);
		} catch (error) {
			setError(error);
		}
	};

	return {
		productQuotes: data || [],
		isLoading: !data && !error,
		isError: error,
	};
};
