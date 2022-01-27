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

package com.liferay.frontend.taglib.clay.servlet.taglib.display.context;

import com.liferay.frontend.taglib.clay.servlet.taglib.util.CreationMenu;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.DropdownItem;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.LabelItem;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.ViewTypeItem;
import com.liferay.portal.kernel.portlet.LiferayPortletRequest;
import com.liferay.portal.kernel.portlet.LiferayPortletResponse;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Drew Brokke
 */
public class ManagementToolbarDisplayContextWrapper
	extends BaseManagementToolbarDisplayContext {

	public ManagementToolbarDisplayContextWrapper(
		HttpServletRequest httpServletRequest,
		LiferayPortletRequest liferayPortletRequest,
		LiferayPortletResponse liferayPortletResponse,
		ManagementToolbarDisplayContext managementToolbarDisplayContext) {

		super(
			httpServletRequest, liferayPortletRequest, liferayPortletResponse);

		_managementToolbarDisplayContext = managementToolbarDisplayContext;
	}

	@Override
	public List<DropdownItem> getActionDropdownItems() {
		return _managementToolbarDisplayContext.getActionDropdownItems();
	}

	@Override
	public String getClearResultsURL() {
		return _managementToolbarDisplayContext.getClearResultsURL();
	}

	@Override
	public String getComponentId() {
		return _managementToolbarDisplayContext.getComponentId();
	}

	@Override
	public String getContentRenderer() {
		return _managementToolbarDisplayContext.getContentRenderer();
	}

	@Override
	public CreationMenu getCreationMenu() {
		return _managementToolbarDisplayContext.getCreationMenu();
	}

	@Override
	public Map<String, String> getData() {
		return _managementToolbarDisplayContext.getData();
	}

	@Override
	public String getDefaultEventHandler() {
		return _managementToolbarDisplayContext.getDefaultEventHandler();
	}

	@Override
	public String getElementClasses() {
		return _managementToolbarDisplayContext.getElementClasses();
	}

	@Override
	public List<DropdownItem> getFilterDropdownItems() {
		return _managementToolbarDisplayContext.getFilterDropdownItems();
	}

	@Override
	public List<LabelItem> getFilterLabelItems() {
		return _managementToolbarDisplayContext.getFilterLabelItems();
	}

	@Override
	public String getId() {
		return _managementToolbarDisplayContext.getId();
	}

	@Override
	public String getInfoPanelId() {
		return _managementToolbarDisplayContext.getInfoPanelId();
	}

	@Override
	public int getItemsTotal() {
		return _managementToolbarDisplayContext.getItemsTotal();
	}

	@Override
	public String getNamespace() {
		return _managementToolbarDisplayContext.getNamespace();
	}

	@Override
	public List<DropdownItem> getOrderDropdownItems() {
		return _managementToolbarDisplayContext.getOrderDropdownItems();
	}

	@Override
	public String getSearchActionURL() {
		return _managementToolbarDisplayContext.getSearchActionURL();
	}

	@Override
	public String getSearchContainerId() {
		return _managementToolbarDisplayContext.getSearchContainerId();
	}

	@Override
	public String getSearchFormMethod() {
		return _managementToolbarDisplayContext.getSearchFormMethod();
	}

	@Override
	public String getSearchFormName() {
		return _managementToolbarDisplayContext.getSearchFormName();
	}

	@Override
	public String getSearchInputName() {
		return _managementToolbarDisplayContext.getSearchInputName();
	}

	@Override
	public String getSearchValue() {
		return _managementToolbarDisplayContext.getSearchValue();
	}

	@Override
	public int getSelectedItems() {
		return _managementToolbarDisplayContext.getSelectedItems();
	}

	@Override
	public String getSortingOrder() {
		return _managementToolbarDisplayContext.getSortingOrder();
	}

	@Override
	public String getSortingURL() {
		return _managementToolbarDisplayContext.getSortingURL();
	}

	@Override
	public String getSpritemap() {
		return _managementToolbarDisplayContext.getSpritemap();
	}

	@Override
	public Boolean getSupportsBulkActions() {
		return _managementToolbarDisplayContext.getSupportsBulkActions();
	}

	@Override
	public List<ViewTypeItem> getViewTypeItems() {
		return _managementToolbarDisplayContext.getViewTypeItems();
	}

	@Override
	public Boolean isDisabled() {
		return _managementToolbarDisplayContext.isDisabled();
	}

	@Override
	public Boolean isSelectable() {
		return _managementToolbarDisplayContext.isSelectable();
	}

	@Override
	public Boolean isShowAdvancedSearch() {
		return _managementToolbarDisplayContext.isShowAdvancedSearch();
	}

	@Override
	public Boolean isShowCreationMenu() {
		return _managementToolbarDisplayContext.isShowCreationMenu();
	}

	@Override
	public Boolean isShowFiltersDoneButton() {
		return _managementToolbarDisplayContext.isShowFiltersDoneButton();
	}

	@Override
	public Boolean isShowInfoButton() {
		return _managementToolbarDisplayContext.isShowInfoButton();
	}

	@Override
	public Boolean isShowSearch() {
		return _managementToolbarDisplayContext.isShowSearch();
	}

	private final ManagementToolbarDisplayContext
		_managementToolbarDisplayContext;

}