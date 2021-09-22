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

package com.liferay.site.initializer.extender.internal;

import com.liferay.asset.list.service.AssetListEntryLocalService;
import com.liferay.commerce.account.util.CommerceAccountRoleHelper;
import com.liferay.commerce.currency.service.CommerceCurrencyLocalService;
import com.liferay.commerce.product.importer.CPFileImporter;
import com.liferay.commerce.product.service.CPMeasurementUnitLocalService;
import com.liferay.document.library.util.DLURLHelper;
import com.liferay.dynamic.data.mapping.service.DDMStructureLocalService;
import com.liferay.dynamic.data.mapping.service.DDMTemplateLocalService;
import com.liferay.dynamic.data.mapping.util.DefaultDDMStructureHelper;
import com.liferay.fragment.importer.FragmentsImporter;
import com.liferay.headless.admin.taxonomy.resource.v1_0.TaxonomyCategoryResource;
import com.liferay.headless.admin.taxonomy.resource.v1_0.TaxonomyVocabularyResource;
import com.liferay.headless.commerce.admin.catalog.resource.v1_0.CatalogResource;
import com.liferay.headless.commerce.admin.channel.resource.v1_0.ChannelResource;
import com.liferay.headless.delivery.resource.v1_0.DocumentFolderResource;
import com.liferay.headless.delivery.resource.v1_0.DocumentResource;
import com.liferay.headless.delivery.resource.v1_0.StructuredContentFolderResource;
import com.liferay.journal.service.JournalArticleLocalService;
import com.liferay.layout.page.template.importer.LayoutPageTemplatesImporter;
import com.liferay.layout.page.template.service.LayoutPageTemplateEntryLocalService;
import com.liferay.layout.page.template.service.LayoutPageTemplateStructureLocalService;
import com.liferay.layout.util.LayoutCopyHelper;
import com.liferay.object.admin.rest.resource.v1_0.ObjectDefinitionResource;
import com.liferay.portal.kernel.json.JSONFactory;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.LayoutLocalService;
import com.liferay.portal.kernel.service.LayoutSetLocalService;
import com.liferay.portal.kernel.service.ResourcePermissionLocalService;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.kernel.service.ThemeLocalService;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.settings.SettingsFactory;
import com.liferay.portal.kernel.util.MapUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.site.initializer.SiteInitializer;
import com.liferay.site.navigation.service.SiteNavigationMenuItemLocalService;
import com.liferay.site.navigation.service.SiteNavigationMenuLocalService;
import com.liferay.site.navigation.type.SiteNavigationMenuItemTypeRegistry;
import com.liferay.style.book.zip.processor.StyleBookEntryZipProcessor;

import javax.servlet.ServletContext;

import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceRegistration;

/**
 * @author Preston Crary
 */
public class SiteInitializerRegistrar {

	public SiteInitializerRegistrar(
		AssetListEntryLocalService assetListEntryLocalService, Bundle bundle,
		BundleContext bundleContext,
		CatalogResource.Factory catalogResourceFactory,
		ChannelResource.Factory channelResourceFactory,
		CommerceAccountRoleHelper commerceAccountRoleHelper,
		CommerceCurrencyLocalService commerceCurrencyLocalService,
		CPFileImporter cpFileImporter,
		CPMeasurementUnitLocalService cpMeasurementUnitLocalService,
		DDMStructureLocalService ddmStructureLocalService,
		DDMTemplateLocalService ddmTemplateLocalService,
		DefaultDDMStructureHelper defaultDDMStructureHelper,
		DLURLHelper dlURLHelper,
		DocumentFolderResource.Factory documentFolderResourceFactory,
		DocumentResource.Factory documentResourceFactory,
		FragmentsImporter fragmentsImporter,
		GroupLocalService groupLocalService,
		JournalArticleLocalService journalArticleLocalService,
		JSONFactory jsonFactory, LayoutCopyHelper layoutCopyHelper,
		LayoutLocalService layoutLocalService,
		LayoutPageTemplateEntryLocalService layoutPageTemplateEntryLocalService,
		LayoutPageTemplatesImporter layoutPageTemplatesImporter,
		LayoutPageTemplateStructureLocalService
			layoutPageTemplateStructureLocalService,
		LayoutSetLocalService layoutSetLocalService,
		ObjectDefinitionResource.Factory objectDefinitionResourceFactory,
		Portal portal,
		ResourcePermissionLocalService resourcePermissionLocalService,
		RoleLocalService roleLocalService, SettingsFactory settingsFactory,
		SiteNavigationMenuItemLocalService siteNavigationMenuItemLocalService,
		SiteNavigationMenuItemTypeRegistry siteNavigationMenuItemTypeRegistry,
		SiteNavigationMenuLocalService siteNavigationMenuLocalService,
		StructuredContentFolderResource.Factory
			structuredContentFolderResourceFactory,
		StyleBookEntryZipProcessor styleBookEntryZipProcessor,
		TaxonomyCategoryResource.Factory taxonomyCategoryResourceFactory,
		TaxonomyVocabularyResource.Factory taxonomyVocabularyResourceFactory,
		ThemeLocalService themeLocalService,
		UserLocalService userLocalService) {

		_assetListEntryLocalService = assetListEntryLocalService;
		_bundle = bundle;
		_bundleContext = bundleContext;
		_catalogResourceFactory = catalogResourceFactory;
		_channelResourceFactory = channelResourceFactory;
		_commerceAccountRoleHelper = commerceAccountRoleHelper;
		_commerceCurrencyLocalService = commerceCurrencyLocalService;
		_cpFileImporter = cpFileImporter;
		_cpMeasurementUnitLocalService = cpMeasurementUnitLocalService;
		_ddmStructureLocalService = ddmStructureLocalService;
		_ddmTemplateLocalService = ddmTemplateLocalService;
		_defaultDDMStructureHelper = defaultDDMStructureHelper;
		_dlURLHelper = dlURLHelper;
		_documentFolderResourceFactory = documentFolderResourceFactory;
		_documentResourceFactory = documentResourceFactory;
		_fragmentsImporter = fragmentsImporter;
		_groupLocalService = groupLocalService;
		_journalArticleLocalService = journalArticleLocalService;
		_jsonFactory = jsonFactory;
		_layoutCopyHelper = layoutCopyHelper;
		_layoutLocalService = layoutLocalService;
		_layoutPageTemplateEntryLocalService =
			layoutPageTemplateEntryLocalService;
		_layoutPageTemplatesImporter = layoutPageTemplatesImporter;
		_layoutPageTemplateStructureLocalService =
			layoutPageTemplateStructureLocalService;
		_layoutSetLocalService = layoutSetLocalService;
		_objectDefinitionResourceFactory = objectDefinitionResourceFactory;
		_portal = portal;
		_resourcePermissionLocalService = resourcePermissionLocalService;
		_roleLocalService = roleLocalService;
		_settingsFactory = settingsFactory;
		_siteNavigationMenuItemLocalService =
			siteNavigationMenuItemLocalService;
		_siteNavigationMenuItemTypeRegistry =
			siteNavigationMenuItemTypeRegistry;
		_siteNavigationMenuLocalService = siteNavigationMenuLocalService;
		_structuredContentFolderResourceFactory =
			structuredContentFolderResourceFactory;
		_styleBookEntryZipProcessor = styleBookEntryZipProcessor;
		_taxonomyCategoryResourceFactory = taxonomyCategoryResourceFactory;
		_taxonomyVocabularyResourceFactory = taxonomyVocabularyResourceFactory;
		_themeLocalService = themeLocalService;
		_userLocalService = userLocalService;
	}

	protected void setServletContext(ServletContext servletContext) {
		_servletContext = servletContext;
	}

	protected void start() {
		_serviceRegistration = _bundleContext.registerService(
			SiteInitializer.class,
			new BundleSiteInitializer(
				_assetListEntryLocalService, _bundle, _catalogResourceFactory,
				_channelResourceFactory, _commerceAccountRoleHelper,
				_commerceCurrencyLocalService, _cpFileImporter,
				_cpMeasurementUnitLocalService, _ddmStructureLocalService,
				_ddmTemplateLocalService, _defaultDDMStructureHelper,
				_dlURLHelper, _documentFolderResourceFactory,
				_documentResourceFactory, _fragmentsImporter,
				_groupLocalService, _journalArticleLocalService, _jsonFactory,
				_layoutCopyHelper, _layoutLocalService,
				_layoutPageTemplateEntryLocalService,
				_layoutPageTemplatesImporter,
				_layoutPageTemplateStructureLocalService,
				_layoutSetLocalService, _objectDefinitionResourceFactory,
				_portal, _resourcePermissionLocalService, _roleLocalService,
				_servletContext, _settingsFactory,
				_siteNavigationMenuItemLocalService,
				_siteNavigationMenuItemTypeRegistry,
				_siteNavigationMenuLocalService,
				_structuredContentFolderResourceFactory,
				_styleBookEntryZipProcessor, _taxonomyCategoryResourceFactory,
				_taxonomyVocabularyResourceFactory, _themeLocalService,
				_userLocalService),
			MapUtil.singletonDictionary(
				"site.initializer.key", _bundle.getSymbolicName()));
	}

	protected void stop() {
		_serviceRegistration.unregister();
	}

	private final AssetListEntryLocalService _assetListEntryLocalService;
	private final Bundle _bundle;
	private final BundleContext _bundleContext;
	private final CatalogResource.Factory _catalogResourceFactory;
	private final ChannelResource.Factory _channelResourceFactory;
	private final CommerceAccountRoleHelper _commerceAccountRoleHelper;
	private final CommerceCurrencyLocalService _commerceCurrencyLocalService;
	private final CPFileImporter _cpFileImporter;
	private final CPMeasurementUnitLocalService _cpMeasurementUnitLocalService;
	private final DDMStructureLocalService _ddmStructureLocalService;
	private final DDMTemplateLocalService _ddmTemplateLocalService;
	private final DefaultDDMStructureHelper _defaultDDMStructureHelper;
	private final DLURLHelper _dlURLHelper;
	private final DocumentFolderResource.Factory _documentFolderResourceFactory;
	private final DocumentResource.Factory _documentResourceFactory;
	private final FragmentsImporter _fragmentsImporter;
	private final GroupLocalService _groupLocalService;
	private final JournalArticleLocalService _journalArticleLocalService;
	private final JSONFactory _jsonFactory;
	private final LayoutCopyHelper _layoutCopyHelper;
	private final LayoutLocalService _layoutLocalService;
	private final LayoutPageTemplateEntryLocalService
		_layoutPageTemplateEntryLocalService;
	private final LayoutPageTemplatesImporter _layoutPageTemplatesImporter;
	private final LayoutPageTemplateStructureLocalService
		_layoutPageTemplateStructureLocalService;
	private final LayoutSetLocalService _layoutSetLocalService;
	private final ObjectDefinitionResource.Factory
		_objectDefinitionResourceFactory;
	private final Portal _portal;
	private final ResourcePermissionLocalService
		_resourcePermissionLocalService;
	private final RoleLocalService _roleLocalService;
	private ServiceRegistration<?> _serviceRegistration;
	private ServletContext _servletContext;
	private final SettingsFactory _settingsFactory;
	private final SiteNavigationMenuItemLocalService
		_siteNavigationMenuItemLocalService;
	private final SiteNavigationMenuItemTypeRegistry
		_siteNavigationMenuItemTypeRegistry;
	private final SiteNavigationMenuLocalService
		_siteNavigationMenuLocalService;
	private final StructuredContentFolderResource.Factory
		_structuredContentFolderResourceFactory;
	private final StyleBookEntryZipProcessor _styleBookEntryZipProcessor;
	private final TaxonomyCategoryResource.Factory
		_taxonomyCategoryResourceFactory;
	private final TaxonomyVocabularyResource.Factory
		_taxonomyVocabularyResourceFactory;
	private final ThemeLocalService _themeLocalService;
	private final UserLocalService _userLocalService;

}