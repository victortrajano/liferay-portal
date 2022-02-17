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

import {createContext, useContext} from 'react';

const stateProperties = {
	articleAccountSupportURL: '',
	articleDeployingActivationKeysURL: '',
	liferayWebDAV: '',
	oktaAPI: '',
	page: '',
	provisioningServerAPI: '',
	route: '',
	submitSupportTicketURL: '',
};

export const AppPropertiesContext = createContext(stateProperties);

const AppPropertiesProvider = ({children, properties}) => (
	<AppPropertiesContext.Provider value={properties}>
		{children}
	</AppPropertiesContext.Provider>
);

export default AppPropertiesProvider;

const useAppPropertiesContext = () => useContext(AppPropertiesContext);

export {useAppPropertiesContext};
