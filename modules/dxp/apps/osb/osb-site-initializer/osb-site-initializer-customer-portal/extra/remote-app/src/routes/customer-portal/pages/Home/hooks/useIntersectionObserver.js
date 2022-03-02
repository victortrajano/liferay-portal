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

import {useEffect} from 'react';

export default function useIntersectionObserver(elementRef, callback) {
	useEffect(() => {
		const options = {
			root: null,
			threshold: 0.1,
		};

		const observer = new IntersectionObserver((entities) => {
			const target = entities[0];

			if (target.isIntersecting) {
				callback();
			}
		}, options);

		if (elementRef.current) {
			observer.observe(elementRef.current);
		}
	}, [elementRef, callback]);
}
