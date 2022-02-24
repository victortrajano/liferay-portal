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

import {ApolloProvider} from '@apollo/client';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ReactDOM from 'react-dom';

import './common/styles/global.scss';
import {ClayIconSpriteContext} from '@clayui/icon';
import AppPropertiesProvider from './common/context/AppPropertiesProvider';
import useApollo from './common/hooks/useApollo';
import getIconSpriteMap from './common/utils/getIconSpriteMap';
import CustomerPortal from './routes/customer-portal';
import Onboarding from './routes/onboarding';

const ELEMENT_ID = 'liferay-remote-app-customer-portal';

const RouteApps = {
	onboarding: <Onboarding />,
	portal: <CustomerPortal />,
};

const CustomerPortalApp = ({route, ...properties}) => {
	const apolloClient = useApollo(
		properties.oktaAPI,
		properties.provisioningServerAPI
	);

	if (!apolloClient) {
		return <ClayLoadingIndicator />;
	}

	return (
		<ApolloProvider client={apolloClient}>
			<AppPropertiesProvider properties={properties}>
				{RouteApps[route]}
			</AppPropertiesProvider>
		</ApolloProvider>
	);
};

class CustomerPortalWebComponent extends HTMLElement {
	connectedCallback() {
		const properties = {
			articleAccountSupportURL: super.getAttribute(
				'article-account-support-url'
			),
			articleDeployingActivationKeysURL: super.getAttribute(
				'article-deploying-activation-keys-url'
			),
			liferayWebDAV: super.getAttribute('liferaywebdavurl'),
			oktaAPI: super.getAttribute('okta-api'),
			page: super.getAttribute('page'),
			provisioningServerAPI: super.getAttribute(
				'provisioning-server-api'
			),
			submitSupportTicketURL: super.getAttribute(
				'submit-support-ticket-url'
			),
		};

		ReactDOM.render(
			<ClayIconSpriteContext.Provider value={getIconSpriteMap()}>
				<CustomerPortalApp
					{...properties}
					route={super.getAttribute('route')}
				/>
			</ClayIconSpriteContext.Provider>,
			this
		);
	}
}

if (!customElements.get(ELEMENT_ID)) {
	customElements.define(ELEMENT_ID, CustomerPortalWebComponent);
}
