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

package com.liferay.digital.signature.rest.client.serdes.v1_0;

import com.liferay.digital.signature.rest.client.dto.v1_0.DSRecipient;
import com.liferay.digital.signature.rest.client.json.BaseJSONParser;

import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;

import javax.annotation.Generated;

/**
 * @author José Abelenda
 * @generated
 */
@Generated("")
public class DSRecipientSerDes {

	public static DSRecipient toDTO(String json) {
		DSRecipientJSONParser dsRecipientJSONParser =
			new DSRecipientJSONParser();

		return dsRecipientJSONParser.parseToDTO(json);
	}

	public static DSRecipient[] toDTOs(String json) {
		DSRecipientJSONParser dsRecipientJSONParser =
			new DSRecipientJSONParser();

		return dsRecipientJSONParser.parseToDTOs(json);
	}

	public static String toJSON(DSRecipient dsRecipient) {
		if (dsRecipient == null) {
			return "null";
		}

		StringBuilder sb = new StringBuilder();

		sb.append("{");

		if (dsRecipient.getDsRecipientId() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"dsRecipientId\": ");

			sb.append("\"");

			sb.append(_escape(dsRecipient.getDsRecipientId()));

			sb.append("\"");
		}

		if (dsRecipient.getEmailAddress() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"emailAddress\": ");

			sb.append("\"");

			sb.append(_escape(dsRecipient.getEmailAddress()));

			sb.append("\"");
		}

		if (dsRecipient.getName() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"name\": ");

			sb.append("\"");

			sb.append(_escape(dsRecipient.getName()));

			sb.append("\"");
		}

		if (dsRecipient.getStatus() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"status\": ");

			sb.append("\"");

			sb.append(_escape(dsRecipient.getStatus()));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	public static Map<String, Object> toMap(String json) {
		DSRecipientJSONParser dsRecipientJSONParser =
			new DSRecipientJSONParser();

		return dsRecipientJSONParser.parseToMap(json);
	}

	public static Map<String, String> toMap(DSRecipient dsRecipient) {
		if (dsRecipient == null) {
			return null;
		}

		Map<String, String> map = new TreeMap<>();

		if (dsRecipient.getDsRecipientId() == null) {
			map.put("dsRecipientId", null);
		}
		else {
			map.put(
				"dsRecipientId",
				String.valueOf(dsRecipient.getDsRecipientId()));
		}

		if (dsRecipient.getEmailAddress() == null) {
			map.put("emailAddress", null);
		}
		else {
			map.put(
				"emailAddress", String.valueOf(dsRecipient.getEmailAddress()));
		}

		if (dsRecipient.getName() == null) {
			map.put("name", null);
		}
		else {
			map.put("name", String.valueOf(dsRecipient.getName()));
		}

		if (dsRecipient.getStatus() == null) {
			map.put("status", null);
		}
		else {
			map.put("status", String.valueOf(dsRecipient.getStatus()));
		}

		return map;
	}

	public static class DSRecipientJSONParser
		extends BaseJSONParser<DSRecipient> {

		@Override
		protected DSRecipient createDTO() {
			return new DSRecipient();
		}

		@Override
		protected DSRecipient[] createDTOArray(int size) {
			return new DSRecipient[size];
		}

		@Override
		protected void setField(
			DSRecipient dsRecipient, String jsonParserFieldName,
			Object jsonParserFieldValue) {

			if (Objects.equals(jsonParserFieldName, "dsRecipientId")) {
				if (jsonParserFieldValue != null) {
					dsRecipient.setDsRecipientId((String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "emailAddress")) {
				if (jsonParserFieldValue != null) {
					dsRecipient.setEmailAddress((String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "name")) {
				if (jsonParserFieldValue != null) {
					dsRecipient.setName((String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "status")) {
				if (jsonParserFieldValue != null) {
					dsRecipient.setStatus((String)jsonParserFieldValue);
				}
			}
		}

	}

	private static String _escape(Object object) {
		String string = String.valueOf(object);

		for (String[] strings : BaseJSONParser.JSON_ESCAPE_STRINGS) {
			string = string.replace(strings[0], strings[1]);
		}

		return string;
	}

	private static String _toJSON(Map<String, ?> map) {
		StringBuilder sb = new StringBuilder("{");

		@SuppressWarnings("unchecked")
		Set set = map.entrySet();

		@SuppressWarnings("unchecked")
		Iterator<Map.Entry<String, ?>> iterator = set.iterator();

		while (iterator.hasNext()) {
			Map.Entry<String, ?> entry = iterator.next();

			sb.append("\"");
			sb.append(entry.getKey());
			sb.append("\": ");

			Object value = entry.getValue();

			Class<?> valueClass = value.getClass();

			if (value instanceof Map) {
				sb.append(_toJSON((Map)value));
			}
			else if (valueClass.isArray()) {
				Object[] values = (Object[])value;

				sb.append("[");

				for (int i = 0; i < values.length; i++) {
					sb.append("\"");
					sb.append(_escape(values[i]));
					sb.append("\"");

					if ((i + 1) < values.length) {
						sb.append(", ");
					}
				}

				sb.append("]");
			}
			else if (value instanceof String) {
				sb.append("\"");
				sb.append(_escape(entry.getValue()));
				sb.append("\"");
			}
			else {
				sb.append(String.valueOf(entry.getValue()));
			}

			if (iterator.hasNext()) {
				sb.append(", ");
			}
		}

		sb.append("}");

		return sb.toString();
	}

}