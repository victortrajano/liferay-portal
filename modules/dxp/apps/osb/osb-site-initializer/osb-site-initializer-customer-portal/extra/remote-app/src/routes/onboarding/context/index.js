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

import {createContext, useContext, useReducer} from 'react';
import {ONBOARDING_STEP_TYPES} from '../utils/constants';
import reducer from './reducer';

const OnboardingContext = createContext();

const OnboardingProvider = ({children}) => {
	const [state, dispatch] = useReducer(reducer, {
		step: ONBOARDING_STEP_TYPES.welcome,
	});

	return (
		<OnboardingContext.Provider value={[state, dispatch]}>
			{children}
		</OnboardingContext.Provider>
	);
};

const useOnboardingContext = () => useContext(OnboardingContext);

export default OnboardingProvider;
export {useOnboardingContext};
