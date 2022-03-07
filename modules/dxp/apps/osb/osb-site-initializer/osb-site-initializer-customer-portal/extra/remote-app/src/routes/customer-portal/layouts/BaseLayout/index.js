/* eslint-disable no-unused-vars */
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

import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import ProjectSupport from '../../components/ProjectSupport';
import QuickLinksPanel from '../../containers/QuickLinksPanel';
import SideMenu from '../../containers/SideMenu';

const Layout = () => {
	const [componentsVisibility, setComponentsVisibility] = useState({
		showProjectSupport: true,
		showQuickLinksPanel: true,
	});

	const [quickLinkContents, setQuickLinkContents] = useState([]);

	return (
		<div className="d-flex position-relative w-100">
			<SideMenu />

			<div className="d-flex flex-fill pt-4">
				<div className="w-100">
					{componentsVisibility.showProjectSupport && (
						<ProjectSupport />
					)}

					<Outlet
						context={{
							quickLinks: [
								quickLinkContents,
								setQuickLinkContents,
							],
							visibility: [
								componentsVisibility,
								setComponentsVisibility,
							],
						}}
					/>
				</div>

				{componentsVisibility.showQuickLinksPanel && (
					<QuickLinksPanel contents={quickLinkContents} />
				)}
			</div>
		</div>
	);
};

export default Layout;
