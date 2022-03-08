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

import {Liferay} from '../../../../../common/services/liferay';
import {useGetKoroneikiAccountByAccountKey} from '../../../../../common/services/liferay/graphql/koroneiki-accounts';
import {useGetStructuredContentFolders} from '../../../../../common/services/liferay/graphql/structured-content-folders';
import {useLazyGetStructuredContent} from '../../../../../common/services/liferay/graphql/structured-contents';

export default function useGraphQL() {
	const {
		data: koroneikiAccountData,
		loading: koroneikiAccountLoading,
	} = useGetKoroneikiAccountByAccountKey();
	const {
		data: structuredContentFolderData,
		loading: structuredContentFolderLoading,
	} = useGetStructuredContentFolders(Liferay.ThemeDisplay.getScopeGroupId(), {
		filter: "name eq 'actions'",
	});
	const [
		getStructuredContentsWithRenderedContent,
	] = useLazyGetStructuredContent();

	const structuredContents =
		structuredContentFolderData?.structuredContentFolders?.items[0]
			?.structuredContents?.items;

	return {
		getStructuredContentsWithRenderedContent,
		koroneikiAccount: koroneikiAccountData,
		loading: koroneikiAccountLoading || structuredContentFolderLoading,
		structuredContents,
	};
}
