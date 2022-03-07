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

import {gql, useLazyQuery, useQuery} from '@apollo/client';

const GET_STRUCTURED_CONTENT = gql`
	query getStructuredContent($structuredContentId: Long!) {
		structuredContent(id: $structuredContentId)
			@rest(
				type: "StructuredContent"
				path: "/structured-contents/{args.id}?nestedFields=renderedContentValue"
				endpoint: "headless-delivery"
			) {
			friendlyUrlPath
			key
			id
			renderedContents @type(name: "RenderedContent") {
				contentTemplateId
				renderedContentValue
			}
		}
	}
`;

export function useGetStructuredContent(
	structuredContentId,
	options = {skip: false}
) {
	return useQuery(GET_STRUCTURED_CONTENT, {
		skip: options.skip,
		variables: {
			structuredContentId,
		},
	});
}

export function useLazyGetStructuredContent() {
	return useLazyQuery(GET_STRUCTURED_CONTENT);
}
