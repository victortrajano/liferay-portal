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
import {storage} from '../../../../common/services/liferay/storage';
import {STORAGE_KEYS} from '../../../../common/utils/constants';
import QuickLinksSkeleton from './Skeleton';
import useGraphQL from './hooks/useGraphQL';

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
	if ('target' in node) {
		node.setAttribute('target', '_blank');
		node.setAttribute('rel', 'noopener noreferrer');
	}
});

const QuickLinksPanel = ({contents}) => {
	const [isQuickLinksExpanded, setIsQuickLinksExpanded] = useState(true);
	const [quickLinksContents, setQuickLinksContents] = useState([]);

	const {
		getStructuredContentsWithRenderedContent,
		koroneikiAccount,
		loading,
		structuredContents,
	} = useGraphQL();

	useEffect(() => {
		const quickLinksExpandedStorage = storage.getItem(
			STORAGE_KEYS.quickLinksExpanded
		);

		if (quickLinksExpandedStorage) {
			setIsQuickLinksExpanded(JSON.parse(quickLinksExpandedStorage));
		}
	}, []);

	const memoizedGetQuickLinksContent = useCallback(
		async () =>
			setQuickLinksContents(
				await contents?.reduce(
					async (contentsAccumulatorPromise, content) => {
						const contentsAccumulator = await contentsAccumulatorPromise;

						const structuredContentId = structuredContents?.find(
							({friendlyUrlPath, key}) =>
								friendlyUrlPath === content ||
								key === content.toUpperCase()
						)?.id;

						if (structuredContentId) {
							const {
								data,
							} = await getStructuredContentsWithRenderedContent({
								variables: {
									structuredContentId,
								},
							});

							const renderedContent = data?.structuredContent?.renderedContents?.find(
								({contentTemplateId}) =>
									contentTemplateId === 'ACTION-CARD'
							);

							if (renderedContent) {
								contentsAccumulator.push(
									renderedContent?.renderedContentValue.replace(
										'{{accountKey}}',
										koroneikiAccount?.accountKey
									)
								);
							}
						}

						return contentsAccumulator;
					},
					Promise.resolve([])
				)
			),
		[
			contents,
			getStructuredContentsWithRenderedContent,
			koroneikiAccount?.accountKey,
			structuredContents,
		]
	);

	useEffect(() => memoizedGetQuickLinksContent(), [
		memoizedGetQuickLinksContent,
	]);

	if (loading || !quickLinksContents?.length) {
		return <QuickLinksSkeleton />;
	}

	return (
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
					onClick={() =>
						setIsQuickLinksExpanded(
							(previousIsQuickLinksExpanded) => {
								storage.setItem(
									STORAGE_KEYS.quickLinksExpanded,
									JSON.stringify(
										!previousIsQuickLinksExpanded
									)
								);

								return !previousIsQuickLinksExpanded;
							}
						)
					}
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
								__html: DOMPurify.sanitize(quickLinkContent, {
									USE_PROFILES: {html: true},
								}),
							}}
							key={quickLinkContent}
						></div>
					))}
				</div>
			)}
		</div>
	);
};

QuickLinksPanel.Skeleton = QuickLinksSkeleton;

export default QuickLinksPanel;
