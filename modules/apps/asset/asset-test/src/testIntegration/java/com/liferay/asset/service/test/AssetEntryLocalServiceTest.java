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

package com.liferay.asset.service.test;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.asset.kernel.model.AssetEntry;
import com.liferay.asset.kernel.model.AssetLink;
import com.liferay.asset.kernel.model.adapter.StagedAssetLink;
import com.liferay.asset.kernel.service.AssetEntryLocalService;
import com.liferay.asset.kernel.service.AssetLinkLocalService;
import com.liferay.asset.test.util.AssetTestUtil;
import com.liferay.exportimport.kernel.service.StagingLocalService;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.SystemEvent;
import com.liferay.portal.kernel.model.SystemEventConstants;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.SystemEventLocalService;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.util.GroupTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.test.util.UserTestUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.uuid.PortalUUIDUtil;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;

import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author Michael Bowerman
 */
@RunWith(Arquillian.class)
public class AssetEntryLocalServiceTest {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new LiferayIntegrationTestRule();

	@Before
	public void setUp() throws Exception {
		UserTestUtil.setUser(TestPropsValues.getUser());
	}

	@Test
	public void testDeleteEntry() throws Exception {
		UserTestUtil.setUser(TestPropsValues.getUser());

		Group group = GroupTestUtil.addGroup();

		_stagingLocalService.enableLocalStaging(
			TestPropsValues.getUserId(), group, false, false,
			new ServiceContext());

		group = group.getStagingGroup();

		AssetEntry assetEntry1 = _addAssetEntryWithClassUUID(
			group.getGroupId());
		AssetEntry assetEntry2 = _addAssetEntryWithClassUUID(
			group.getGroupId());

		AssetLink assetLink = _assetLinkLocalService.addLink(
			TestPropsValues.getUserId(), assetEntry1.getEntryId(),
			assetEntry2.getEntryId(), 0, 0);

		_assetEntryLocalService.deleteEntry(assetEntry2);

		SystemEvent systemEvent = _systemEventLocalService.fetchSystemEvent(
			group.getGroupId(),
			_portal.getClassNameId(StagedAssetLink.class.getName()),
			assetLink.getLinkId(), SystemEventConstants.TYPE_DELETE);

		Assert.assertEquals(
			assetEntry1.getClassUuid() + StringPool.POUND +
				assetEntry2.getClassUuid(),
			systemEvent.getClassUuid());
	}

	private AssetEntry _addAssetEntryWithClassUUID(long groupId) {
		AssetEntry assetEntry = AssetTestUtil.addAssetEntry(groupId);

		assetEntry.setClassUuid(PortalUUIDUtil.generate());

		return _assetEntryLocalService.updateAssetEntry(assetEntry);
	}

	@Inject
	private AssetEntryLocalService _assetEntryLocalService;

	@Inject
	private AssetLinkLocalService _assetLinkLocalService;

	@Inject
	private Portal _portal;

	@Inject
	private StagingLocalService _stagingLocalService;

	@Inject
	private SystemEventLocalService _systemEventLocalService;

}