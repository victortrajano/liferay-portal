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

package com.liferay.digital.signature.internal.manager;

import com.liferay.digital.signature.internal.http.DSHttp;
import com.liferay.digital.signature.manager.DSCustomFieldManager;
import com.liferay.digital.signature.manager.DSEnvelopeManager;
import com.liferay.digital.signature.model.DSCustomField;
import com.liferay.digital.signature.model.DSDocument;
import com.liferay.digital.signature.model.DSEnvelope;
import com.liferay.digital.signature.model.DSRecipient;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Brian Wing Shun Chan
 */
@Component(immediate = true, service = DSEnvelopeManager.class)
public class DSEnvelopeManagerImpl implements DSEnvelopeManager {

	@Override
	public DSEnvelope addDSEnvelope(
		long companyId, long groupId, DSEnvelope dsEnvelope) {

		String dsEnvelopeName = dsEnvelope.getName();
		String dsEnvelopeSenderEmailAddress =
			dsEnvelope.getSenderEmailAddress();

		dsEnvelope = _toDSEnvelope(
			_dsHttp.post(
				companyId, groupId, "envelopes", dsEnvelope.toJSONObject()));

		_dsCustomFieldManager.addDSCustomFields(
			companyId, groupId, dsEnvelope.getDSEnvelopeId(),
			new DSCustomField() {
				{
					name = "envelopeName";
					show = true;
					value = dsEnvelopeName;
				}
			},
			new DSCustomField() {
				{
					name = "envelopeSenderEmailAddress";
					show = true;
					value = dsEnvelopeSenderEmailAddress;
				}
			});

		return getDSEnvelope(
			companyId, groupId, dsEnvelope.getDSEnvelopeId(),
			"custom_fields,recipients");
	}

	@Override
	public void deleteDSEnvelopes(
		long companyId, long groupId, String... dsEnvelopeIds) {

		_dsHttp.put(
			companyId, groupId, "folders/recyclebin",
			JSONUtil.put(
				"envelopeIds",
				JSONUtil.toJSONArray(
					dsEnvelopeIds, dsEnvelopeId -> dsEnvelopeId, _log)));
	}

	@Override
	public DSEnvelope getDSEnvelope(
		long companyId, long groupId, String dsEnvelopeId) {

		return getDSEnvelope(
			companyId, groupId, dsEnvelopeId,
			"custom_fields,documents,recipients");
	}

	@Override
	public DSEnvelope getDSEnvelope(
		long companyId, long groupId, String dsEnvelopeId, String include) {

		JSONObject jsonObject = _dsHttp.get(
			companyId, groupId,
			StringBundler.concat(
				"envelopes/", dsEnvelopeId, "?include=", include));

		return _toDSEnvelope(jsonObject);
	}

	@Override
	public Page<DSEnvelope> getDSEnvelopesPage(
		long companyId, long groupId, String fromDateString, String keywords,
		String order, Pagination pagination, String status) {

		Matcher matcher = _pattern.matcher(keywords);

		if (matcher.matches()) {
			DSEnvelope dsEnvelope = getDSEnvelope(companyId, groupId, keywords);

			if (Validator.isNull(dsEnvelope.getDSEnvelopeId())) {
				return Page.of(Collections.emptyList(), pagination, 0);
			}

			return Page.of(
				Collections.singletonList(dsEnvelope), pagination, 1);
		}

		String location = StringBundler.concat(
			"envelopes?count=", pagination.getPageSize(), "&from_date=",
			fromDateString, "&folder_types=sentitems&start_position=",
			pagination.getStartPosition(),
			"&include=custom_fields,documents,recipients&order=", order);

		if (!Validator.isBlank(keywords)) {
			location += "&search_text=" + keywords;
		}

		if (!Validator.isBlank(status)) {
			location += "&status=" + status;
		}

		JSONObject jsonObject = _dsHttp.get(companyId, groupId, location);

		return Page.of(
			JSONUtil.toList(
				jsonObject.getJSONArray("envelopes"),
				envelopeJSONObject -> _toDSEnvelope(envelopeJSONObject), _log),
			pagination, jsonObject.getInt("totalSetSize"));
	}

	private List<DSDocument> _getDSDocuments(JSONArray jsonArray) {
		return JSONUtil.toList(
			jsonArray,
			jsonObject -> new DSDocument() {
				{
					dsDocumentId = jsonObject.getString("documentId");
					fileExtension = jsonObject.getString("fileExtension");
					name = jsonObject.getString("name");
					uri = jsonObject.getString("uri");
				}
			},
			_log);
	}

	private List<DSRecipient> _getDSRecipients(JSONObject jsonObject) {
		if (jsonObject == null) {
			return Collections.emptyList();
		}

		return JSONUtil.toList(
			jsonObject.getJSONArray("signers"),
			signerJSONObject -> new DSRecipient() {
				{
					dsRecipientId = signerJSONObject.getString("recipientId");
					emailAddress = signerJSONObject.getString("email");
					name = signerJSONObject.getString("name");
					status = signerJSONObject.getString("status");
				}
			},
			_log);
	}

	private void _setDSEnvelopeCustomField(
		DSEnvelope dsEnvelope, JSONObject jsonObject) {

		String name = jsonObject.getString("name");
		String value = jsonObject.getString("value");

		if (Objects.equals(name, "envelopeName")) {
			dsEnvelope.setName(value);
		}
		else if (Objects.equals(name, "envelopeSenderEmailAddress")) {
			dsEnvelope.setSenderEmailAddress(value);
		}
	}

	private void _setDSEnvelopeCustomFields(
		DSEnvelope dsEnvelope, JSONObject jsonObject) {

		if (jsonObject == null) {
			return;
		}

		JSONArray jsonArray = jsonObject.getJSONArray("textCustomFields");

		jsonArray.forEach(
			element -> _setDSEnvelopeCustomField(
				dsEnvelope, (JSONObject)element));
	}

	private DSEnvelope _toDSEnvelope(JSONObject jsonObject) {
		if (jsonObject == null) {
			return new DSEnvelope();
		}

		DSEnvelope dsEnvelope = new DSEnvelope() {
			{
				createdLocalDateTime = _toLocalDateTime(
					jsonObject.getString("createdDateTime"));
				dsDocuments = _getDSDocuments(
					jsonObject.getJSONArray("envelopeDocuments"));
				dsEnvelopeId = jsonObject.getString("envelopeId");
				dsRecipients = _getDSRecipients(
					jsonObject.getJSONObject("recipients"));
				emailBlurb = jsonObject.getString("emailBlurb");
				emailSubject = jsonObject.getString("emailSubject");
				status = jsonObject.getString("status");
			}
		};

		_setDSEnvelopeCustomFields(
			dsEnvelope, jsonObject.getJSONObject("customFields"));

		return dsEnvelope;
	}

	private LocalDateTime _toLocalDateTime(String localDateTimeString) {
		try {
			return LocalDateTime.parse(
				localDateTimeString,
				DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSSSX"));
		}
		catch (Exception exception) {
			if (_log.isWarnEnabled()) {
				_log.warn("Invalid local date time " + localDateTimeString);
			}

			return null;
		}
	}

	private static final Log _log = LogFactoryUtil.getLog(
		DSEnvelopeManagerImpl.class);

	private static final Pattern _pattern = Pattern.compile(
		"[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}" +
			"\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}");

	@Reference
	private DSCustomFieldManager _dsCustomFieldManager;

	@Reference
	private DSHttp _dsHttp;

}