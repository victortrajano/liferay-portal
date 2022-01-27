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

package com.liferay.journal.web.internal.frontend.taglib.form.navigator;

import com.liferay.frontend.taglib.form.navigator.FormNavigatorEntry;
import com.liferay.item.selector.ItemSelectorView;
import com.liferay.journal.model.JournalArticle;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceContextThreadLocal;
import com.liferay.portal.kernel.theme.ThemeDisplay;

import javax.servlet.ServletContext;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Eudaldo Alonso
 */
@Component(
	property = "form.navigator.entry.order:Integer=80",
	service = FormNavigatorEntry.class
)
public class JournalDisplayPageFormNavigatorEntry
	extends BaseJournalFormNavigatorEntry {

	@Override
	public String getKey() {
		return "display-page";
	}

	@Override
	public boolean isVisible(User user, JournalArticle article) {
		if (isGlobalScopeArticle(article) || _isDepotArticle(article)) {
			return false;
		}

		return true;
	}

	@Reference(target = "(view=private)", unbind = "-")
	public void setPrivateLayoutsItemSelectorView(
		ItemSelectorView<?> itemSelectorView) {
	}

	@Reference(target = "(view=public)", unbind = "-")
	public void setPublicLayoutsItemSelectorView(
		ItemSelectorView<?> itemSelectorView) {
	}

	@Override
	@Reference(
		target = "(osgi.web.symbolicname=com.liferay.journal.web)", unbind = "-"
	)
	public void setServletContext(ServletContext servletContext) {
		super.setServletContext(servletContext);
	}

	@Override
	protected String getJspPath() {
		return "/article/display_page.jsp";
	}

	private Group _getGroup(JournalArticle article) {
		if ((article != null) && (article.getId() > 0)) {
			return _groupLocalService.fetchGroup(article.getGroupId());
		}

		ServiceContext serviceContext =
			ServiceContextThreadLocal.getServiceContext();

		ThemeDisplay themeDisplay = serviceContext.getThemeDisplay();

		return themeDisplay.getScopeGroup();
	}

	private boolean _isDepotArticle(JournalArticle article) {
		Group group = _getGroup(article);

		if ((group != null) && group.isDepot()) {
			return true;
		}

		return false;
	}

	@Reference
	private GroupLocalService _groupLocalService;

}