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

import 'metal';

import 'metal-component';
import ClayIcon from '@clayui/icon';
import Treeview from 'frontend-taglib/treeview/Treeview';
import React, {useState, useCallback, useRef} from 'react';

function SelectCategory({itemSelectorSaveEvent, multiSelection, namespace, nodes}) {
	const [filterQuery, setFilterQuery] = useState('');

	const selectedNodesRef = useRef(null);

	const handleQueryChange = useCallback(
		event => {
			const value = event.target.value;

			setFilterQuery(value);
		}, []
	);

	const handleSelectionChange = selectedNodes => {
		const data = {};

		// Mark unselected nodes as unchecked.
		if (selectedNodesRef.current) {
			Object.entries(selectedNodesRef.current).forEach(([id, node]) => {
				if (!selectedNodes.has(id)) {
					data[id] = {
						...node,
						unchecked: true,
					};
				}
			});
		}

		const visit = node => {
			// Mark newly selected nodes as selected.
			if (selectedNodes.has(node.id)) {
				data[node.id] = {
					categoryId: node.vocabulary ? 0 : node.id,
					nodePath: node.nodePath,
					value: node.name,
					vocabularyId: node.vocabulary ? node.id : 0,
				};

				if (node.children) {
					node.children.forEach(visit);
				}
			}
		};

		nodes.forEach(visit);

		selectedNodesRef.current = data;

		Liferay.Util.getOpener().Liferay.fire(itemSelectorSaveEvent, {data});
	};

	return (
		<div className="select-category">
			<form className="select-category-filter" role="search">
				<div className="container-fluid-1280">
					<div className="input-group">
						<div className="input-group-item">
							<input
								className="form-control input-group-inset input-group-inset-after"
								onChange={handleQueryChange}
								placeholder={Liferay.Language.get('search')}
								type="text"
							/>

							<div className="input-group-inset-item input-group-inset-item-after pr-3">
								<ClayIcon symbol="search" />
							</div>
						</div>
					</div>
				</div>
			</form>

			<form name={`${namespace}selectCategoryFm`}>
				<fieldset className="container-fluid-1280">
					<div
						className="category-tree"
						id={`${namespace}categoryContainer`}
					>
						<Treeview
							NodeComponent={Treeview.Card}
							filterQuery={filterQuery}
							multiSelection={multiSelection}
							nodes={nodes}
							onSelectedNodesChange={handleSelectionChange}
						/>
					</div>
				</fieldset>
			</form>
		</div>
	);
}

export default function(props) {
	return <SelectCategory {...props} />;
}
