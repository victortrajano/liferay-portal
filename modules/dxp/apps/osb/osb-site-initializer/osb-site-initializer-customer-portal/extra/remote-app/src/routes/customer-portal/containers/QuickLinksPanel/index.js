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

import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import {useCallback, useEffect, useState} from 'react';
import {fetchHeadless} from '../../../../common/services/liferay/api';
import {storage} from '../../../../common/services/liferay/storage';
import {STORAGE_KEYS} from '../../../../common/utils/constants';
import {usePortalContext} from '../../context';
import {actionTypes} from '../../context/reducer';
import QuickLinksSkeleton from './Skeleton';

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
	if ('target' in node) {
		node.setAttribute('target', '_blank');
		node.setAttribute('rel', 'noopener noreferrer');
	}
});

const QuickLinksPanel = ({accountKey}) => {
	const [
		{isQuickLinksExpanded, quickLinks, structuredContents},
		dispatch,
	] = usePortalContext();
	const [quickLinksContents, setQuickLinksContents] = useState([]);

	useEffect(() => {
		const quickLinksExpandedStorage = storage.getItem(
			STORAGE_KEYS.quickLinksExpanded
		);

		if (quickLinksExpandedStorage) {
			dispatch({
				payload: JSON.parse(quickLinksExpandedStorage),
				type: actionTypes.UPDATE_QUICK_LINKS_EXPANDED_PANEL,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchQuickLinksPanelContent = useCallback(async () => {
		const renderedQuickLinksContents = await quickLinks.reduce(
			async (quickLinkAccumulator, quickLink) => {
				const accumulator = await quickLinkAccumulator;

				const structuredContentId = structuredContents?.find(
					({friendlyUrlPath, key}) =>
						friendlyUrlPath === quickLink ||
						key === quickLink.toUpperCase()
				)?.id;

				if (structuredContentId) {
					const structuredComponent = await fetchHeadless({
						resolveAsJson: false,
						url: `/structured-contents/${structuredContentId}/rendered-content/ACTION-CARD`,
					});

					const htmlBody = await structuredComponent.text();

					accumulator.push(
						htmlBody.replace('{{accountKey}}', accountKey)
					);
				}

				return accumulator;
			},
			Promise.resolve([])
		);

		setQuickLinksContents(renderedQuickLinksContents);
	}, [accountKey, quickLinks, structuredContents]);

	useEffect(() => {
		if (quickLinks) {
			fetchQuickLinksPanelContent();
		}
	}, [quickLinks, fetchQuickLinksPanelContent]);

	return (
		<>
			{quickLinksContents.length ? (
				<div
					className={classNames(
						'cp-link-body quick-links-container rounded',
						{
							'p-4': isQuickLinksExpanded,
							'position-absolute px-3 py-4': !isQuickLinksExpanded,
						}
					)}
				>
					<div className="align-items-center d-flex justify-content-between">
						<h5 className="m-0 text-neutral-10">Quick Links</h5>

						<a
							className={classNames(
								'btn font-weight-bold p-2 text-neutral-8 text-paragraph-sm',
								{
									'pl-3': !isQuickLinksExpanded,
								}
							)}
							onClick={() => {
								dispatch({
									payload: !isQuickLinksExpanded,
									type:
										actionTypes.UPDATE_QUICK_LINKS_EXPANDED_PANEL,
								});
								storage.setItem(
									STORAGE_KEYS.quickLinksExpanded,
									JSON.stringify(!isQuickLinksExpanded)
								);
							}}
						>
							<ClayIcon
								className="mr-1"
								symbol={isQuickLinksExpanded ? 'hr' : 'plus'}
							/>

							{isQuickLinksExpanded ? 'Hide' : ''}
						</a>
					</div>

					{isQuickLinksExpanded && (
						<div>
							{quickLinksContents.map((quickLinkContent) => (
								<div
									className="bg-white cp-link-body my-3 p-3 quick-links-card rounded-lg"
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(
											quickLinkContent,
											{
												USE_PROFILES: {html: true},
											}
										),
									}}
									key={quickLinkContent}
								></div>
							))}
						</div>
					)}
				</div>
			) : (
				<QuickLinksSkeleton />
			)}
		</>
	);
};

QuickLinksPanel.Skeleton = QuickLinksSkeleton;

export default QuickLinksPanel;
