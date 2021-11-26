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

import com.liferay.digital.signature.rest.client.dto.v1_0.DSDocument;
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
public class DSDocumentSerDes {

	public static DSDocument toDTO(String json) {
		DSDocumentJSONParser dsDocumentJSONParser = new DSDocumentJSONParser();

		return dsDocumentJSONParser.parseToDTO(json);
	}

	public static DSDocument[] toDTOs(String json) {
		DSDocumentJSONParser dsDocumentJSONParser = new DSDocumentJSONParser();

		return dsDocumentJSONParser.parseToDTOs(json);
	}

	public static String toJSON(DSDocument dsDocument) {
		if (dsDocument == null) {
			return "null";
		}

		StringBuilder sb = new StringBuilder();

		sb.append("{");

		if (dsDocument.getData() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"data\": ");

			sb.append("\"");

			sb.append(_escape(dsDocument.getData()));

			sb.append("\"");
		}

		if (dsDocument.getFileEntryExternalReferenceCode() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"fileEntryExternalReferenceCode\": ");

			sb.append("\"");

			sb.append(_escape(dsDocument.getFileEntryExternalReferenceCode()));

			sb.append("\"");
		}

		if (dsDocument.getFileExtension() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"fileExtension\": ");

			sb.append("\"");

			sb.append(_escape(dsDocument.getFileExtension()));

			sb.append("\"");
		}

		if (dsDocument.getId() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"id\": ");

			sb.append("\"");

			sb.append(_escape(dsDocument.getId()));

			sb.append("\"");
		}

		if (dsDocument.getName() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"name\": ");

			sb.append("\"");

			sb.append(_escape(dsDocument.getName()));

			sb.append("\"");
		}

		if (dsDocument.getUri() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"uri\": ");

			sb.append("\"");

			sb.append(_escape(dsDocument.getUri()));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	public static Map<String, Object> toMap(String json) {
		DSDocumentJSONParser dsDocumentJSONParser = new DSDocumentJSONParser();

		return dsDocumentJSONParser.parseToMap(json);
	}

	public static Map<String, String> toMap(DSDocument dsDocument) {
		if (dsDocument == null) {
			return null;
		}

		Map<String, String> map = new TreeMap<>();

		if (dsDocument.getData() == null) {
			map.put("data", null);
		}
		else {
			map.put("data", String.valueOf(dsDocument.getData()));
		}

		if (dsDocument.getFileEntryExternalReferenceCode() == null) {
			map.put("fileEntryExternalReferenceCode", null);
		}
		else {
			map.put(
				"fileEntryExternalReferenceCode",
				String.valueOf(dsDocument.getFileEntryExternalReferenceCode()));
		}

		if (dsDocument.getFileExtension() == null) {
			map.put("fileExtension", null);
		}
		else {
			map.put(
				"fileExtension", String.valueOf(dsDocument.getFileExtension()));
		}

		if (dsDocument.getId() == null) {
			map.put("id", null);
		}
		else {
			map.put("id", String.valueOf(dsDocument.getId()));
		}

		if (dsDocument.getName() == null) {
			map.put("name", null);
		}
		else {
			map.put("name", String.valueOf(dsDocument.getName()));
		}

		if (dsDocument.getUri() == null) {
			map.put("uri", null);
		}
		else {
			map.put("uri", String.valueOf(dsDocument.getUri()));
		}

		return map;
	}

	public static class DSDocumentJSONParser
		extends BaseJSONParser<DSDocument> {

		@Override
		protected DSDocument createDTO() {
			return new DSDocument();
		}

		@Override
		protected DSDocument[] createDTOArray(int size) {
			return new DSDocument[size];
		}

		@Override
		protected void setField(
			DSDocument dsDocument, String jsonParserFieldName,
			Object jsonParserFieldValue) {

			if (Objects.equals(jsonParserFieldName, "data")) {
				if (jsonParserFieldValue != null) {
					dsDocument.setData((String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(
						jsonParserFieldName,
						"fileEntryExternalReferenceCode")) {

				if (jsonParserFieldValue != null) {
					dsDocument.setFileEntryExternalReferenceCode(
						(String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "fileExtension")) {
				if (jsonParserFieldValue != null) {
					dsDocument.setFileExtension((String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "id")) {
				if (jsonParserFieldValue != null) {
					dsDocument.setId((String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "name")) {
				if (jsonParserFieldValue != null) {
					dsDocument.setName((String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "uri")) {
				if (jsonParserFieldValue != null) {
					dsDocument.setUri((String)jsonParserFieldValue);
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