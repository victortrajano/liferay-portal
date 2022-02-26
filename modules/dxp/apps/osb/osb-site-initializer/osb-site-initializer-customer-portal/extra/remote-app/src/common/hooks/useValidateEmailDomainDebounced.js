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

import {useEffect, useState} from 'react';
import {useGetLazyBannedEmailDomains} from '../services/liferay/graphql/banned-email-domains';
import useDebounce from './useDebounce';

export default function useValidateEmailDomainDebounced(value, delay) {
	const [validating, setValidating] = useState(false);
	const [isValidDomain, setIsValidDomain] = useState(true);

	const debouncedValue = useDebounce(value, delay);

	const [
		getBannedEmailDomains,
		{called, data, loading},
	] = useGetLazyBannedEmailDomains();

	useEffect(() => {
		const emailDomain = debouncedValue?.split('@')[1];

		if (emailDomain) {
			setValidating(true);

			getBannedEmailDomains({
				variables: {
					filter: `domain eq '${emailDomain}'`,
				},
			});
		}

		setIsValidDomain(true);
	}, [debouncedValue, getBannedEmailDomains]);

	useEffect(() => {
		if (called && !loading) {
			const bannedDomainsItems = data?.c?.bannedEmailDomains?.items;
			setIsValidDomain(!bannedDomainsItems?.length);

			setValidating(false);
		}
	}, [called, data, loading]);

	return {isValidDomain, validating};
}
