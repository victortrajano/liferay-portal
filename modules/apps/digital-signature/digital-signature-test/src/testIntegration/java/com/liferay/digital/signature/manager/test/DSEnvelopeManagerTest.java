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

package com.liferay.digital.signature.manager.test;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.digital.signature.manager.DSCustomFieldManager;
import com.liferay.digital.signature.manager.DSEnvelopeManager;
import com.liferay.digital.signature.model.DSCustomField;
import com.liferay.digital.signature.model.DSDocument;
import com.liferay.digital.signature.model.DSEnvelope;
import com.liferay.digital.signature.model.DSRecipient;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.util.Base64;
import com.liferay.portal.kernel.util.FileUtil;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.Assert;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author Brian Wing Shun Chan
 */
@RunWith(Arquillian.class)
public class DSEnvelopeManagerTest {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new LiferayIntegrationTestRule();

	@Test
	public void testAddDSEnvelope() throws Exception {
		Class<?> clazz = getClass();

		DSEnvelope dsEnvelope = _dsEnvelopeManager.addDSEnvelope(
			TestPropsValues.getGroupId(),
			new DSEnvelope() {
				{
					dsCustomFields = Arrays.asList(
						new DSCustomField() {
							{
								name = "envelopeName";
								show = true;
								value = "envelope name";
							}
						},
						new DSCustomField() {
							{
								name = "envelopeSenderEmail";
								show = true;
								value = "envelopesender@test.com";
							}
						});
					dsDocuments = Collections.singletonList(
						new DSDocument() {
							{
								data = Base64.encode(
									FileUtil.getBytes(
										clazz.getResourceAsStream(
											"dependencies/Document.pdf")));
								dsDocumentId = "1";
								name = RandomTestUtil.randomString();
							}
						});
					dsRecipients = Collections.singletonList(
						new DSRecipient() {
							{
								dsRecipientId = "1";
								emailAddress = "test@liferay.com";
								name = RandomTestUtil.randomString();
							}
						});
					emailBlurb = RandomTestUtil.randomString();
					emailSubject = RandomTestUtil.randomString();
					status = "sent";
				}
			});

		List<DSCustomField> dsCustomFields = dsEnvelope.getDSCustomFields();

		Assert.assertTrue(Validator.isNotNull(dsEnvelope.getDSEnvelopeId()));

		Assert.assertTrue(ListUtil.isNotEmpty(dsCustomFields));

		_dsEnvelopeManager.deleteDSEnvelopes(
			TestPropsValues.getGroupId(), dsEnvelope.getDSEnvelopeId());
	}

	@Test
	public void testGetDSEnvelope() throws Exception {
		String expectedEmailSubject = RandomTestUtil.randomString();

		DSEnvelope dsEnvelope = _dsEnvelopeManager.addDSEnvelope(
			TestPropsValues.getGroupId(),
			new DSEnvelope() {
				{
					emailSubject = expectedEmailSubject;
					status = "created";
				}
			});

		dsEnvelope = _dsEnvelopeManager.getDSEnvelope(
			TestPropsValues.getGroupId(), dsEnvelope.getDSEnvelopeId());

		Assert.assertEquals(expectedEmailSubject, dsEnvelope.getEmailSubject());

		_dsEnvelopeManager.deleteDSEnvelopes(
			TestPropsValues.getGroupId(), dsEnvelope.getDSEnvelopeId());
	}

	@Test
	public void testGetDSEnvelopes() throws Exception {
		DSEnvelope dsEnvelope1 = _dsEnvelopeManager.addDSEnvelope(
			TestPropsValues.getGroupId(),
			new DSEnvelope() {
				{
					emailSubject = RandomTestUtil.randomString();
					status = "created";
				}
			});
		DSEnvelope dsEnvelope2 = _dsEnvelopeManager.addDSEnvelope(
			TestPropsValues.getGroupId(),
			new DSEnvelope() {
				{
					emailSubject = RandomTestUtil.randomString();
					status = "created";
				}
			});

		List<DSEnvelope> dsEnvelopes = _dsEnvelopeManager.getDSEnvelopes(
			TestPropsValues.getGroupId(), "2021-01-01");

		Assert.assertTrue(dsEnvelopes.size() >= 2);

		String[] dsEnvelopeIds = {
			dsEnvelope1.getDSEnvelopeId(), dsEnvelope2.getDSEnvelopeId()
		};

		dsEnvelopes = _dsEnvelopeManager.getDSEnvelopes(
			TestPropsValues.getGroupId(), dsEnvelopeIds);

		Assert.assertTrue(dsEnvelopes.size() == 2);

		_dsEnvelopeManager.deleteDSEnvelopes(
			TestPropsValues.getGroupId(), dsEnvelopeIds);
	}

	@Inject
	private DSCustomFieldManager _dsCustomFieldManager;

	@Inject
	private DSEnvelopeManager _dsEnvelopeManager;

}