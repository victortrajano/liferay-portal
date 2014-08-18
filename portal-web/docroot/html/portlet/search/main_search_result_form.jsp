<%--
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
--%>

<%@ include file="/html/portlet/search/init.jsp" %>

<%
ResultRow row = (ResultRow)request.getAttribute(WebKeys.SEARCH_CONTAINER_RESULT_ROW);

Document document = (Document)row.getObject();

String className = document.get(Field.ENTRY_CLASS_NAME);

String downloadURL = null;
String returnToFullPageURL = (String)request.getAttribute("search.jsp-returnToFullPageURL");
PortletURL viewFullContentURL = null;
String viewURL = null;

AssetRendererFactory assetRendererFactory = AssetRendererFactoryRegistryUtil.getAssetRendererFactoryByClassName(className);

AssetRenderer assetRenderer = null;

boolean inheritRedirect = false;

if (assetRendererFactory != null) {
	long classPK = GetterUtil.getLong(document.get(Field.ENTRY_CLASS_PK));

	long resourcePrimKey = GetterUtil.getLong(document.get(Field.ROOT_ENTRY_CLASS_PK));

	if (resourcePrimKey > 0) {
		classPK = resourcePrimKey;
	}

	AssetEntry assetEntry = AssetEntryLocalServiceUtil.getEntry(className, classPK);

	assetRenderer = assetRendererFactory.getAssetRenderer(classPK);

	downloadURL = assetRenderer.getURLDownload(themeDisplay);

	viewFullContentURL = _getViewFullContentURL(request, themeDisplay, PortletKeys.ASSET_PUBLISHER, document);

	viewFullContentURL.setParameter("struts_action", "/asset_publisher/view_content");

	if (Validator.isNotNull(returnToFullPageURL)) {
		viewFullContentURL.setParameter("returnToFullPageURL", returnToFullPageURL);
	}

	viewFullContentURL.setParameter("assetEntryId", String.valueOf(assetEntry.getEntryId()));
	viewFullContentURL.setParameter("type", assetRendererFactory.getType());

	if (Validator.isNotNull(assetRenderer.getUrlTitle())) {
		if ((assetRenderer.getGroupId() > 0) && (assetRenderer.getGroupId() != scopeGroupId)) {
			viewFullContentURL.setParameter("groupId", String.valueOf(assetRenderer.getGroupId()));
		}

		viewFullContentURL.setParameter("urlTitle", assetRenderer.getUrlTitle());
	}

	if (viewInContext) {
		inheritRedirect = true;

		String viewFullContentURLString = viewFullContentURL.toString();

		viewFullContentURLString = HttpUtil.setParameter(viewFullContentURLString, "redirect", currentURL);

		viewURL = assetRenderer.getURLViewInContext(liferayPortletRequest, liferayPortletResponse, viewFullContentURLString);

		viewURL = AssetUtil.checkViewURL(assetEntry, viewInContext, viewURL, currentURL, themeDisplay);
	}
	else {
		viewURL = viewFullContentURL.toString();
	}
}
else {
	String portletId = document.get(Field.PORTLET_ID);

	viewFullContentURL = _getViewFullContentURL(request, themeDisplay, portletId, document);

	if (Validator.isNotNull(returnToFullPageURL)) {
		viewFullContentURL.setParameter("returnToFullPageURL", returnToFullPageURL);
	}

	viewURL = viewFullContentURL.toString();
}

Indexer indexer = IndexerRegistryUtil.getIndexer(className);

Summary summary = null;

if (indexer != null) {
	String snippet = document.get(Field.SNIPPET);

	summary = indexer.getSummary(document, snippet, viewFullContentURL, renderRequest, renderResponse);
}
else if (assetRenderer != null) {
	summary = new Summary(locale, assetRenderer.getTitle(locale), assetRenderer.getSearchSummary(locale), viewFullContentURL);
}

if (summary != null) {
	if ((assetRendererFactory == null) && viewInContext) {
		viewURL = viewFullContentURL.toString();
	}

	viewURL = _checkViewURL(themeDisplay, viewURL, currentURL, inheritRedirect);

	boolean highlightEnabled = (Boolean)request.getAttribute("search.jsp-highlightEnabled");
	String[] queryTerms = (String[])request.getAttribute("search.jsp-queryTerms");

	summary.setHighlight(highlightEnabled);
	summary.setQueryTerms(queryTerms);

	PortletURL portletURL = (PortletURL)request.getAttribute("search.jsp-portletURL");
	%>

	<span class="asset-entry">
		<span class="asset-entry-type">
			<%= ResourceActionsUtil.getModelResource(themeDisplay.getLocale(), className) %>

			<c:if test="<%= locale != summary.getLocale() %>">

				<%
				Locale summaryLocale = summary.getLocale();
				%>

				<liferay-ui:icon image='<%= "../language/" + LocaleUtil.toLanguageId(summaryLocale) %>' message='<%= LanguageUtil.format(locale, "this-result-comes-from-the-x-version-of-this-content", summaryLocale.getDisplayLanguage(locale), false) %>' />
			</c:if>
		</span>

		<span class="asset-entry-title">
			<a class="<%= (assetRenderer != null) ? assetRenderer.getIconCssClass() : StringPool.BLANK %>" href="<%= viewURL %>">
				<%= summary.getHighlightedTitle() %>
			</a>

			<c:if test="<%= Validator.isNotNull(downloadURL) %>">
				<liferay-ui:icon
					iconCssClass="icon-download-alt"
					label="<%= false %>"
					message='<%= LanguageUtil.format(request, "download-x", HtmlUtil.escape(summary.getTitle()), false) %>'
					url="<%= downloadURL %>"
				/>
			</c:if>
		</span>

		<%
		String[] assetCategoryIds = document.getValues(Field.ASSET_CATEGORY_IDS);
		String[] assetTagNames = document.getValues(Field.ASSET_TAG_NAMES);
		%>

		<c:if test="<%= Validator.isNotNull(summary.getContent()) || Validator.isNotNull(assetCategoryIds[0]) || Validator.isNotNull(assetTagNames[0]) %>">
			<div class="asset-entry-content">
				<c:if test="<%= Validator.isNotNull(summary.getContent()) %>">
					<span class="asset-entry-summary">
						<%= summary.getHighlightedContent() %>
					</span>
				</c:if>

				<c:if test="<%= Validator.isNotNull(assetTagNames[0]) %>">
					<div class="asset-entry-tags">

						<%
						for (int i = 0; i < assetTagNames.length; i++) {
							String assetTagName = assetTagNames[i].trim();

							PortletURL tagURL = PortletURLUtil.clone(portletURL, renderResponse);

							tagURL.setParameter(Field.ASSET_TAG_NAMES, assetTagName);
						%>

							<c:if test="<%= i == 0 %>">
								<div class="taglib-asset-tags-summary">
							</c:if>

							<a class="tag" href="<%= tagURL.toString() %>"><%= assetTagName %></a>

							<c:if test="<%= (i + 1) == assetTagNames.length %>">
								</div>
							</c:if>

						<%
						}
						%>

					</div>
				</c:if>

				<c:if test="<%= Validator.isNotNull(assetCategoryIds[0]) %>">
					<div class="asset-entry-categories">

						<%
						Locale assetCategoryLocale = locale;

						if (locale != summary.getLocale()) {
							assetCategoryLocale = summary.getLocale();
						}

						Map<Long, List<AssetCategory>> assetVocabularyIdsToCategoryIdsMap = new HashMap<Long, List<AssetCategory>>();

						for (int i = 0; i < assetCategoryIds.length; i++) {
							long assetCategoryId = GetterUtil.getLong(assetCategoryIds[i]);

							AssetCategory assetCategory = AssetCategoryLocalServiceUtil.fetchCategory(assetCategoryId);

							if (assetCategory == null) {
								continue;
							}

							List<AssetCategory> assetCategories = assetVocabularyIdsToCategoryIdsMap.get(assetCategory.getVocabularyId());

							if (assetCategories == null) {
								assetCategories = new ArrayList<AssetCategory>();
							}

							assetCategories.add(assetCategory);

							assetVocabularyIdsToCategoryIdsMap.put(assetCategory.getVocabularyId(), assetCategories);
						}
						%>

						<div class="taglib-asset-categories-summary">

							<%
							for (Map.Entry<Long, List<AssetCategory>> entry : assetVocabularyIdsToCategoryIdsMap.entrySet()) {
								long assetVocabularyId = entry.getKey();

								AssetVocabulary assetVocabulary = AssetVocabularyLocalServiceUtil.getVocabulary(assetVocabularyId);
							%>

								<%= HtmlUtil.escape(assetVocabulary.getTitle(assetCategoryLocale)) %>:

								<%
								List<AssetCategory> assetCategories = entry.getValue();

								for (AssetCategory assetCategory : assetCategories) {
									PortletURL categoryURL = PortletURLUtil.clone(portletURL, renderResponse);

									categoryURL.setParameter(Field.ASSET_CATEGORY_IDS, String.valueOf(assetCategory.getCategoryId()));
								%>

									<a class="asset-category" href="<%= categoryURL.toString() %>">
										<%= _buildAssetCategoryPath(assetCategory, assetCategoryLocale) %>
									</a>

							<%
								}
							}
							%>

						</div>
					</div>
				</c:if>
			</div>
		</c:if>
	</span>

<%
}
%>