/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import '@testing-library/jest-dom/extend-expect';
import {fireEvent, render} from '@testing-library/react';
import React from 'react';

import {
	LayoutSelector,
	LayoutTypeSelector,
} from '../../src/main/resources/META-INF/resources/js/style-book-editor/PreviewSelector';
import {LAYOUT_TYPES} from '../../src/main/resources/META-INF/resources/js/style-book-editor/constants/layoutTypes';
import openItemSelector from '../../src/main/resources/META-INF/resources/js/style-book-editor/openItemSelector';

jest.mock(
	'../../src/main/resources/META-INF/resources/js/style-book-editor/openItemSelector',
	() => jest.fn(() => {})
);

jest.mock(
	'../../src/main/resources/META-INF/resources/js/style-book-editor/config',
	() => ({
		config: {
			previewOptions: [
				{
					data: {
						itemSelectorURL: 'master-item-selector-url',
						recentLayouts: [],
						totalLayouts: 0,
					},
					type: 'master',
				},
				{
					data: {
						itemSelectorURL: 'page-item-selector-url',
						recentLayouts: [
							{
								name: 'Page 1',
								private: false,
								url: 'page-1-url',
							},
							{
								name: 'Page 2',
								private: false,
								url: 'page-2-url',
							},
							{
								name: 'Page 3',
								private: false,
								url: 'page-3-url',
							},
							{
								name: 'Page 4',
								private: true,
								url: 'page-4-url',
							},
						],
						totalLayouts: 6,
					},
					type: 'page',
				},
				{
					data: {
						itemSelectorURL: 'page-template-item-selector-url',
						recentLayouts: [
							{
								name: 'Page Template 1',
								private: false,
								url: 'page-template-1-url',
							},
						],
						totalLayouts: 1,
					},
					type: 'pageTemplate',
				},
				{
					data: {
						itemSelectorURL: 'display-page-item-selector-url',
						recentLayouts: [
							{
								name: 'Display Page 1',
								private: false,
								url: 'display-page-1-url',
							},
						],
						totalLayouts: 1,
					},
					type: 'displayPageTemplate',
				},
				{
					data: {
						itemSelectorURL: 'fragment-collection-selector-url',
						recentLayouts: [
							{
								name: 'Fragment Collection 1',
								private: false,
								url: 'fragment-collection-1-url',
							},
						],
						totalLayouts: 1,
					},
					type: 'fragmentCollection',
				},
			],
		},
	})
);

const renderPreviewSelector = (layoutType = LAYOUT_TYPES.page) => {
	Liferay.Util.sub.mockImplementation((langKey) => langKey);

	return render(
		<>
			<LayoutTypeSelector
				layoutType={layoutType}
				setLayoutType={() => {}}
			/>
			<LayoutSelector layoutType={layoutType} />
		</>
	);
};

describe('PreviewSelector', () => {
	afterEach(() => {
		openItemSelector.mockClear();
	});

	it('does not show layout type if it does not have at least one item', () => {
		const {queryByText} = renderPreviewSelector();

		expect(queryByText('masters')).not.toBeInTheDocument();
	});

	it('shows correct items in layout selector when selecting a type', () => {
		const {getByText} = renderPreviewSelector(
			LAYOUT_TYPES.displayPageTemplate
		);

		expect(getByText('Display Page 1')).toBeInTheDocument();
	});

	it('shows More button and number of items info when selected type has more than 4 items', () => {
		const {getByText} = renderPreviewSelector();

		expect(getByText('more')).toBeInTheDocument();
		expect(getByText('showing-x-of-x-items')).toBeInTheDocument();
	});

	it('does not show More button and number of items info when selected type has 4 items or less', () => {
		const {queryByText} = renderPreviewSelector(LAYOUT_TYPES.pageTemplate);

		expect(queryByText('more')).not.toBeInTheDocument();
		expect(queryByText('showing-x-of-x-items')).not.toBeInTheDocument();
	});

	it('calls openItemSelector with correct url when clicking More button', () => {
		const {getByText} = renderPreviewSelector();

		fireEvent.click(getByText('more'));

		expect(openItemSelector).toBeCalledWith(
			expect.objectContaining({
				itemSelectorURL: 'page-item-selector-url',
			})
		);
	});
});
