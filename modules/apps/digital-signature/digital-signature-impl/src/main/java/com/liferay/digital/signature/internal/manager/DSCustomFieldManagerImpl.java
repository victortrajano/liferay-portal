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
import com.liferay.digital.signature.model.DSCustomField;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.util.StringBundler;

import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Victor Trajano
 */
@Component(immediate = true, service = DSCustomFieldManager.class)
public class DSCustomFieldManagerImpl implements DSCustomFieldManager {

	@Override
	public List<DSCustomField> addDSCustomFields(
		long groupId, String dsEnvelopeId, List<DSCustomField> dsCustomFields) {

		dsCustomFields = _toDSCustomFields(
			_dsHttp.post(
				groupId,
				StringBundler.concat(
					"envelopes/", dsEnvelopeId, "/custom_fields"),
				JSONUtil.put(
					"textCustomFields",
					JSONUtil.toJSONArray(
						dsCustomFields,
						dsCustomField -> JSONUtil.put(
							"fieldId", dsCustomField.getFieldId()
						).put(
							"name", dsCustomField.getName()
						).put(
							"show", dsCustomField.getShow()
						).put(
							"value", dsCustomField.getValue()
						),
						_log))));

		if (_log.isDebugEnabled()) {
			_log.debug(
				"Added digital signature custom fields in envelope ID " +
					dsEnvelopeId);
		}

		return dsCustomFields;
	}

	private List<DSCustomField> _toDSCustomFields(JSONObject jsonObject) {
		return JSONUtil.toList(
			jsonObject.getJSONArray("textCustomFields"),
			customFieldJSONObject -> new DSCustomField() {
				{
					fieldId = customFieldJSONObject.getLong("fieldId");
					name = customFieldJSONObject.getString("name");
					required = customFieldJSONObject.getBoolean("required");
					show = customFieldJSONObject.getBoolean("show");
					value = customFieldJSONObject.getString("value");
				}
			},
			_log);
	}

	private static final Log _log = LogFactoryUtil.getLog(
		DSCustomFieldManagerImpl.class);

	@Reference
	private DSHttp _dsHttp;

}