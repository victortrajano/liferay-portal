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
import React from 'react';
import ReactDOM from 'react-dom';

import './common/styles/global.scss';
import apolloClient from './apolloClient';
import AppContextProvider from './common/context/AppPropertiesProvider';
import ClayProvider from './common/providers/ClayProvider';
import CustomerPortal from './routes/customer-portal';
import Onboarding from './routes/onboarding';

const CustomerPortalApplication = ({liferayWebDAV, page, route}) => {
	if (route === 'portal') {
		return <CustomerPortal assetsPath={liferayWebDAV} page={page} />;
	}

	if (route === 'onboarding') {
		return <Onboarding assetsPath={liferayWebDAV} />;
	}
};

class CustomerPortalWebComponent extends HTMLElement {
	connectedCallback() {
		const properties = {
			submitSupportTicketURL: super.getAttribute(
				'submit-support-ticket-url'
			),
			articleDeployingActivationKeysURL: super.getAttribute(
				'article-deploying-activation-keys-url'
			),
			provisioningServerAPI: super.getAttribute(
				'provisioning-server-api'
			),
			liferayWebDAV: super.getAttribute('liferaywebdavurl'),
			oktaAPI: super.getAttribute('okta-api'),
			page: super.getAttribute('page'),
			route: super.getAttribute('route'),
			articleAccountSupportURL: super.getAttribute(
				'article-account-support-url'
			),
		};
		ReactDOM.render(
			<ClayProvider>
				<ApolloProvider client={apolloClient}>
					<AppContextProvider properties={properties}>
						<CustomerPortalApplication
							liferaywebdavurl={properties.liferayWebDAV}
							page={properties.page}
							route={properties.route}
						/>
					</AppContextProvider>
				</ApolloProvider>
			</ClayProvider>,
			this
		);
	}
}

const ELEMENT_ID = 'liferay-remote-app-customer-portal';

if (!customElements.get(ELEMENT_ID)) {
	customElements.define(ELEMENT_ID, CustomerPortalWebComponent);
}
