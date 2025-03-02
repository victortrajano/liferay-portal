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

package com.liferay.headless.commerce.admin.catalog.resource.v1_0.test;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.ISO8601DateFormat;

import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.ProductTaxConfiguration;
import com.liferay.headless.commerce.admin.catalog.client.http.HttpInvoker;
import com.liferay.headless.commerce.admin.catalog.client.pagination.Page;
import com.liferay.headless.commerce.admin.catalog.client.resource.v1_0.ProductTaxConfigurationResource;
import com.liferay.headless.commerce.admin.catalog.client.serdes.v1_0.ProductTaxConfigurationSerDes;
import com.liferay.petra.reflect.ReflectionUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.service.CompanyLocalServiceUtil;
import com.liferay.portal.kernel.test.util.GroupTestUtil;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.DateFormatFactoryUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.odata.entity.EntityField;
import com.liferay.portal.odata.entity.EntityModel;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;
import com.liferay.portal.vulcan.resource.EntityModelResource;

import java.lang.reflect.InvocationTargetException;

import java.text.DateFormat;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.Generated;

import javax.ws.rs.core.MultivaluedHashMap;

import org.apache.commons.beanutils.BeanUtilsBean;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

/**
 * @author Zoltán Takács
 * @generated
 */
@Generated("")
public abstract class BaseProductTaxConfigurationResourceTestCase {

	@ClassRule
	@Rule
	public static final LiferayIntegrationTestRule liferayIntegrationTestRule =
		new LiferayIntegrationTestRule();

	@BeforeClass
	public static void setUpClass() throws Exception {
		_dateFormat = DateFormatFactoryUtil.getSimpleDateFormat(
			"yyyy-MM-dd'T'HH:mm:ss'Z'");
	}

	@Before
	public void setUp() throws Exception {
		irrelevantGroup = GroupTestUtil.addGroup();
		testGroup = GroupTestUtil.addGroup();

		testCompany = CompanyLocalServiceUtil.getCompany(
			testGroup.getCompanyId());

		_productTaxConfigurationResource.setContextCompany(testCompany);

		ProductTaxConfigurationResource.Builder builder =
			ProductTaxConfigurationResource.builder();

		productTaxConfigurationResource = builder.authentication(
			"test@liferay.com", "test"
		).locale(
			LocaleUtil.getDefault()
		).build();
	}

	@After
	public void tearDown() throws Exception {
		GroupTestUtil.deleteGroup(irrelevantGroup);
		GroupTestUtil.deleteGroup(testGroup);
	}

	@Test
	public void testClientSerDesToDTO() throws Exception {
		ObjectMapper objectMapper = new ObjectMapper() {
			{
				configure(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY, true);
				configure(
					SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
				enable(SerializationFeature.INDENT_OUTPUT);
				setDateFormat(new ISO8601DateFormat());
				setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
				setSerializationInclusion(JsonInclude.Include.NON_NULL);
				setVisibility(
					PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
				setVisibility(
					PropertyAccessor.GETTER, JsonAutoDetect.Visibility.NONE);
			}
		};

		ProductTaxConfiguration productTaxConfiguration1 =
			randomProductTaxConfiguration();

		String json = objectMapper.writeValueAsString(productTaxConfiguration1);

		ProductTaxConfiguration productTaxConfiguration2 =
			ProductTaxConfigurationSerDes.toDTO(json);

		Assert.assertTrue(
			equals(productTaxConfiguration1, productTaxConfiguration2));
	}

	@Test
	public void testClientSerDesToJSON() throws Exception {
		ObjectMapper objectMapper = new ObjectMapper() {
			{
				configure(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY, true);
				configure(
					SerializationFeature.WRITE_ENUMS_USING_TO_STRING, true);
				setDateFormat(new ISO8601DateFormat());
				setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
				setSerializationInclusion(JsonInclude.Include.NON_NULL);
				setVisibility(
					PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
				setVisibility(
					PropertyAccessor.GETTER, JsonAutoDetect.Visibility.NONE);
			}
		};

		ProductTaxConfiguration productTaxConfiguration =
			randomProductTaxConfiguration();

		String json1 = objectMapper.writeValueAsString(productTaxConfiguration);
		String json2 = ProductTaxConfigurationSerDes.toJSON(
			productTaxConfiguration);

		Assert.assertEquals(
			objectMapper.readTree(json1), objectMapper.readTree(json2));
	}

	@Test
	public void testEscapeRegexInStringFields() throws Exception {
		String regex = "^[0-9]+(\\.[0-9]{1,2})\"?";

		ProductTaxConfiguration productTaxConfiguration =
			randomProductTaxConfiguration();

		productTaxConfiguration.setTaxCategory(regex);

		String json = ProductTaxConfigurationSerDes.toJSON(
			productTaxConfiguration);

		Assert.assertFalse(json.contains(regex));

		productTaxConfiguration = ProductTaxConfigurationSerDes.toDTO(json);

		Assert.assertEquals(regex, productTaxConfiguration.getTaxCategory());
	}

	@Test
	public void testGetProductByExternalReferenceCodeTaxConfiguration()
		throws Exception {

		ProductTaxConfiguration postProductTaxConfiguration =
			testGetProductByExternalReferenceCodeTaxConfiguration_addProductTaxConfiguration();

		ProductTaxConfiguration getProductTaxConfiguration =
			productTaxConfigurationResource.
				getProductByExternalReferenceCodeTaxConfiguration(
					testGetProductByExternalReferenceCodeTaxConfiguration_getExternalReferenceCode());

		assertEquals(postProductTaxConfiguration, getProductTaxConfiguration);
		assertValid(getProductTaxConfiguration);
	}

	protected String
			testGetProductByExternalReferenceCodeTaxConfiguration_getExternalReferenceCode()
		throws Exception {

		throw new UnsupportedOperationException(
			"This method needs to be implemented");
	}

	protected ProductTaxConfiguration
			testGetProductByExternalReferenceCodeTaxConfiguration_addProductTaxConfiguration()
		throws Exception {

		throw new UnsupportedOperationException(
			"This method needs to be implemented");
	}

	@Test
	public void testGraphQLGetProductByExternalReferenceCodeTaxConfiguration()
		throws Exception {

		ProductTaxConfiguration productTaxConfiguration =
			testGraphQLGetProductByExternalReferenceCodeTaxConfiguration_addProductTaxConfiguration();

		Assert.assertTrue(
			equals(
				productTaxConfiguration,
				ProductTaxConfigurationSerDes.toDTO(
					JSONUtil.getValueAsString(
						invokeGraphQLQuery(
							new GraphQLField(
								"productByExternalReferenceCodeTaxConfiguration",
								new HashMap<String, Object>() {
									{
										put(
											"externalReferenceCode",
											"\"" +
												testGraphQLGetProductByExternalReferenceCodeTaxConfiguration_getExternalReferenceCode() +
													"\"");
									}
								},
								getGraphQLFields())),
						"JSONObject/data",
						"Object/productByExternalReferenceCodeTaxConfiguration"))));
	}

	protected String
			testGraphQLGetProductByExternalReferenceCodeTaxConfiguration_getExternalReferenceCode()
		throws Exception {

		throw new UnsupportedOperationException(
			"This method needs to be implemented");
	}

	@Test
	public void testGraphQLGetProductByExternalReferenceCodeTaxConfigurationNotFound()
		throws Exception {

		String irrelevantExternalReferenceCode =
			"\"" + RandomTestUtil.randomString() + "\"";

		Assert.assertEquals(
			"Not Found",
			JSONUtil.getValueAsString(
				invokeGraphQLQuery(
					new GraphQLField(
						"productByExternalReferenceCodeTaxConfiguration",
						new HashMap<String, Object>() {
							{
								put(
									"externalReferenceCode",
									irrelevantExternalReferenceCode);
							}
						},
						getGraphQLFields())),
				"JSONArray/errors", "Object/0", "JSONObject/extensions",
				"Object/code"));
	}

	protected ProductTaxConfiguration
			testGraphQLGetProductByExternalReferenceCodeTaxConfiguration_addProductTaxConfiguration()
		throws Exception {

		return testGraphQLProductTaxConfiguration_addProductTaxConfiguration();
	}

	@Test
	public void testPatchProductByExternalReferenceCodeTaxConfiguration()
		throws Exception {

		Assert.assertTrue(false);
	}

	@Test
	public void testGetProductIdTaxConfiguration() throws Exception {
		ProductTaxConfiguration postProductTaxConfiguration =
			testGetProductIdTaxConfiguration_addProductTaxConfiguration();

		ProductTaxConfiguration getProductTaxConfiguration =
			productTaxConfigurationResource.getProductIdTaxConfiguration(
				postProductTaxConfiguration.getId());

		assertEquals(postProductTaxConfiguration, getProductTaxConfiguration);
		assertValid(getProductTaxConfiguration);
	}

	protected ProductTaxConfiguration
			testGetProductIdTaxConfiguration_addProductTaxConfiguration()
		throws Exception {

		throw new UnsupportedOperationException(
			"This method needs to be implemented");
	}

	@Test
	public void testGraphQLGetProductIdTaxConfiguration() throws Exception {
		ProductTaxConfiguration productTaxConfiguration =
			testGraphQLGetProductIdTaxConfiguration_addProductTaxConfiguration();

		Assert.assertTrue(
			equals(
				productTaxConfiguration,
				ProductTaxConfigurationSerDes.toDTO(
					JSONUtil.getValueAsString(
						invokeGraphQLQuery(
							new GraphQLField(
								"productIdTaxConfiguration",
								new HashMap<String, Object>() {
									{
										put(
											"id",
											productTaxConfiguration.getId());
									}
								},
								getGraphQLFields())),
						"JSONObject/data",
						"Object/productIdTaxConfiguration"))));
	}

	@Test
	public void testGraphQLGetProductIdTaxConfigurationNotFound()
		throws Exception {

		Long irrelevantId = RandomTestUtil.randomLong();

		Assert.assertEquals(
			"Not Found",
			JSONUtil.getValueAsString(
				invokeGraphQLQuery(
					new GraphQLField(
						"productIdTaxConfiguration",
						new HashMap<String, Object>() {
							{
								put("id", irrelevantId);
							}
						},
						getGraphQLFields())),
				"JSONArray/errors", "Object/0", "JSONObject/extensions",
				"Object/code"));
	}

	protected ProductTaxConfiguration
			testGraphQLGetProductIdTaxConfiguration_addProductTaxConfiguration()
		throws Exception {

		return testGraphQLProductTaxConfiguration_addProductTaxConfiguration();
	}

	@Test
	public void testPatchProductIdTaxConfiguration() throws Exception {
		Assert.assertTrue(false);
	}

	protected ProductTaxConfiguration
			testGraphQLProductTaxConfiguration_addProductTaxConfiguration()
		throws Exception {

		throw new UnsupportedOperationException(
			"This method needs to be implemented");
	}

	protected void assertContains(
		ProductTaxConfiguration productTaxConfiguration,
		List<ProductTaxConfiguration> productTaxConfigurations) {

		boolean contains = false;

		for (ProductTaxConfiguration item : productTaxConfigurations) {
			if (equals(productTaxConfiguration, item)) {
				contains = true;

				break;
			}
		}

		Assert.assertTrue(
			productTaxConfigurations + " does not contain " +
				productTaxConfiguration,
			contains);
	}

	protected void assertHttpResponseStatusCode(
		int expectedHttpResponseStatusCode,
		HttpInvoker.HttpResponse actualHttpResponse) {

		Assert.assertEquals(
			expectedHttpResponseStatusCode, actualHttpResponse.getStatusCode());
	}

	protected void assertEquals(
		ProductTaxConfiguration productTaxConfiguration1,
		ProductTaxConfiguration productTaxConfiguration2) {

		Assert.assertTrue(
			productTaxConfiguration1 + " does not equal " +
				productTaxConfiguration2,
			equals(productTaxConfiguration1, productTaxConfiguration2));
	}

	protected void assertEquals(
		List<ProductTaxConfiguration> productTaxConfigurations1,
		List<ProductTaxConfiguration> productTaxConfigurations2) {

		Assert.assertEquals(
			productTaxConfigurations1.size(), productTaxConfigurations2.size());

		for (int i = 0; i < productTaxConfigurations1.size(); i++) {
			ProductTaxConfiguration productTaxConfiguration1 =
				productTaxConfigurations1.get(i);
			ProductTaxConfiguration productTaxConfiguration2 =
				productTaxConfigurations2.get(i);

			assertEquals(productTaxConfiguration1, productTaxConfiguration2);
		}
	}

	protected void assertEqualsIgnoringOrder(
		List<ProductTaxConfiguration> productTaxConfigurations1,
		List<ProductTaxConfiguration> productTaxConfigurations2) {

		Assert.assertEquals(
			productTaxConfigurations1.size(), productTaxConfigurations2.size());

		for (ProductTaxConfiguration productTaxConfiguration1 :
				productTaxConfigurations1) {

			boolean contains = false;

			for (ProductTaxConfiguration productTaxConfiguration2 :
					productTaxConfigurations2) {

				if (equals(
						productTaxConfiguration1, productTaxConfiguration2)) {

					contains = true;

					break;
				}
			}

			Assert.assertTrue(
				productTaxConfigurations2 + " does not contain " +
					productTaxConfiguration1,
				contains);
		}
	}

	protected void assertValid(ProductTaxConfiguration productTaxConfiguration)
		throws Exception {

		boolean valid = true;

		if (productTaxConfiguration.getId() == null) {
			valid = false;
		}

		for (String additionalAssertFieldName :
				getAdditionalAssertFieldNames()) {

			if (Objects.equals("taxCategory", additionalAssertFieldName)) {
				if (productTaxConfiguration.getTaxCategory() == null) {
					valid = false;
				}

				continue;
			}

			if (Objects.equals("taxable", additionalAssertFieldName)) {
				if (productTaxConfiguration.getTaxable() == null) {
					valid = false;
				}

				continue;
			}

			throw new IllegalArgumentException(
				"Invalid additional assert field name " +
					additionalAssertFieldName);
		}

		Assert.assertTrue(valid);
	}

	protected void assertValid(Page<ProductTaxConfiguration> page) {
		boolean valid = false;

		java.util.Collection<ProductTaxConfiguration> productTaxConfigurations =
			page.getItems();

		int size = productTaxConfigurations.size();

		if ((page.getLastPage() > 0) && (page.getPage() > 0) &&
			(page.getPageSize() > 0) && (page.getTotalCount() > 0) &&
			(size > 0)) {

			valid = true;
		}

		Assert.assertTrue(valid);
	}

	protected String[] getAdditionalAssertFieldNames() {
		return new String[0];
	}

	protected List<GraphQLField> getGraphQLFields() throws Exception {
		List<GraphQLField> graphQLFields = new ArrayList<>();

		for (java.lang.reflect.Field field :
				getDeclaredFields(
					com.liferay.headless.commerce.admin.catalog.dto.v1_0.
						ProductTaxConfiguration.class)) {

			if (!ArrayUtil.contains(
					getAdditionalAssertFieldNames(), field.getName())) {

				continue;
			}

			graphQLFields.addAll(getGraphQLFields(field));
		}

		return graphQLFields;
	}

	protected List<GraphQLField> getGraphQLFields(
			java.lang.reflect.Field... fields)
		throws Exception {

		List<GraphQLField> graphQLFields = new ArrayList<>();

		for (java.lang.reflect.Field field : fields) {
			com.liferay.portal.vulcan.graphql.annotation.GraphQLField
				vulcanGraphQLField = field.getAnnotation(
					com.liferay.portal.vulcan.graphql.annotation.GraphQLField.
						class);

			if (vulcanGraphQLField != null) {
				Class<?> clazz = field.getType();

				if (clazz.isArray()) {
					clazz = clazz.getComponentType();
				}

				List<GraphQLField> childrenGraphQLFields = getGraphQLFields(
					getDeclaredFields(clazz));

				graphQLFields.add(
					new GraphQLField(field.getName(), childrenGraphQLFields));
			}
		}

		return graphQLFields;
	}

	protected String[] getIgnoredEntityFieldNames() {
		return new String[0];
	}

	protected boolean equals(
		ProductTaxConfiguration productTaxConfiguration1,
		ProductTaxConfiguration productTaxConfiguration2) {

		if (productTaxConfiguration1 == productTaxConfiguration2) {
			return true;
		}

		for (String additionalAssertFieldName :
				getAdditionalAssertFieldNames()) {

			if (Objects.equals("id", additionalAssertFieldName)) {
				if (!Objects.deepEquals(
						productTaxConfiguration1.getId(),
						productTaxConfiguration2.getId())) {

					return false;
				}

				continue;
			}

			if (Objects.equals("taxCategory", additionalAssertFieldName)) {
				if (!Objects.deepEquals(
						productTaxConfiguration1.getTaxCategory(),
						productTaxConfiguration2.getTaxCategory())) {

					return false;
				}

				continue;
			}

			if (Objects.equals("taxable", additionalAssertFieldName)) {
				if (!Objects.deepEquals(
						productTaxConfiguration1.getTaxable(),
						productTaxConfiguration2.getTaxable())) {

					return false;
				}

				continue;
			}

			throw new IllegalArgumentException(
				"Invalid additional assert field name " +
					additionalAssertFieldName);
		}

		return true;
	}

	protected boolean equals(
		Map<String, Object> map1, Map<String, Object> map2) {

		if (Objects.equals(map1.keySet(), map2.keySet())) {
			for (Map.Entry<String, Object> entry : map1.entrySet()) {
				if (entry.getValue() instanceof Map) {
					if (!equals(
							(Map)entry.getValue(),
							(Map)map2.get(entry.getKey()))) {

						return false;
					}
				}
				else if (!Objects.deepEquals(
							entry.getValue(), map2.get(entry.getKey()))) {

					return false;
				}
			}

			return true;
		}

		return false;
	}

	protected java.lang.reflect.Field[] getDeclaredFields(Class clazz)
		throws Exception {

		Stream<java.lang.reflect.Field> stream = Stream.of(
			ReflectionUtil.getDeclaredFields(clazz));

		return stream.filter(
			field -> !field.isSynthetic()
		).toArray(
			java.lang.reflect.Field[]::new
		);
	}

	protected java.util.Collection<EntityField> getEntityFields()
		throws Exception {

		if (!(_productTaxConfigurationResource instanceof
				EntityModelResource)) {

			throw new UnsupportedOperationException(
				"Resource is not an instance of EntityModelResource");
		}

		EntityModelResource entityModelResource =
			(EntityModelResource)_productTaxConfigurationResource;

		EntityModel entityModel = entityModelResource.getEntityModel(
			new MultivaluedHashMap());

		Map<String, EntityField> entityFieldsMap =
			entityModel.getEntityFieldsMap();

		return entityFieldsMap.values();
	}

	protected List<EntityField> getEntityFields(EntityField.Type type)
		throws Exception {

		java.util.Collection<EntityField> entityFields = getEntityFields();

		Stream<EntityField> stream = entityFields.stream();

		return stream.filter(
			entityField ->
				Objects.equals(entityField.getType(), type) &&
				!ArrayUtil.contains(
					getIgnoredEntityFieldNames(), entityField.getName())
		).collect(
			Collectors.toList()
		);
	}

	protected String getFilterString(
		EntityField entityField, String operator,
		ProductTaxConfiguration productTaxConfiguration) {

		StringBundler sb = new StringBundler();

		String entityFieldName = entityField.getName();

		sb.append(entityFieldName);

		sb.append(" ");
		sb.append(operator);
		sb.append(" ");

		if (entityFieldName.equals("id")) {
			throw new IllegalArgumentException(
				"Invalid entity field " + entityFieldName);
		}

		if (entityFieldName.equals("taxCategory")) {
			sb.append("'");
			sb.append(String.valueOf(productTaxConfiguration.getTaxCategory()));
			sb.append("'");

			return sb.toString();
		}

		if (entityFieldName.equals("taxable")) {
			throw new IllegalArgumentException(
				"Invalid entity field " + entityFieldName);
		}

		throw new IllegalArgumentException(
			"Invalid entity field " + entityFieldName);
	}

	protected String invoke(String query) throws Exception {
		HttpInvoker httpInvoker = HttpInvoker.newHttpInvoker();

		httpInvoker.body(
			JSONUtil.put(
				"query", query
			).toString(),
			"application/json");
		httpInvoker.httpMethod(HttpInvoker.HttpMethod.POST);
		httpInvoker.path("http://localhost:8080/o/graphql");
		httpInvoker.userNameAndPassword("test@liferay.com:test");

		HttpInvoker.HttpResponse httpResponse = httpInvoker.invoke();

		return httpResponse.getContent();
	}

	protected JSONObject invokeGraphQLMutation(GraphQLField graphQLField)
		throws Exception {

		GraphQLField mutationGraphQLField = new GraphQLField(
			"mutation", graphQLField);

		return JSONFactoryUtil.createJSONObject(
			invoke(mutationGraphQLField.toString()));
	}

	protected JSONObject invokeGraphQLQuery(GraphQLField graphQLField)
		throws Exception {

		GraphQLField queryGraphQLField = new GraphQLField(
			"query", graphQLField);

		return JSONFactoryUtil.createJSONObject(
			invoke(queryGraphQLField.toString()));
	}

	protected ProductTaxConfiguration randomProductTaxConfiguration()
		throws Exception {

		return new ProductTaxConfiguration() {
			{
				id = RandomTestUtil.randomLong();
				taxCategory = StringUtil.toLowerCase(
					RandomTestUtil.randomString());
				taxable = RandomTestUtil.randomBoolean();
			}
		};
	}

	protected ProductTaxConfiguration randomIrrelevantProductTaxConfiguration()
		throws Exception {

		ProductTaxConfiguration randomIrrelevantProductTaxConfiguration =
			randomProductTaxConfiguration();

		return randomIrrelevantProductTaxConfiguration;
	}

	protected ProductTaxConfiguration randomPatchProductTaxConfiguration()
		throws Exception {

		return randomProductTaxConfiguration();
	}

	protected ProductTaxConfigurationResource productTaxConfigurationResource;
	protected Group irrelevantGroup;
	protected Company testCompany;
	protected Group testGroup;

	protected class GraphQLField {

		public GraphQLField(String key, GraphQLField... graphQLFields) {
			this(key, new HashMap<>(), graphQLFields);
		}

		public GraphQLField(String key, List<GraphQLField> graphQLFields) {
			this(key, new HashMap<>(), graphQLFields);
		}

		public GraphQLField(
			String key, Map<String, Object> parameterMap,
			GraphQLField... graphQLFields) {

			_key = key;
			_parameterMap = parameterMap;
			_graphQLFields = Arrays.asList(graphQLFields);
		}

		public GraphQLField(
			String key, Map<String, Object> parameterMap,
			List<GraphQLField> graphQLFields) {

			_key = key;
			_parameterMap = parameterMap;
			_graphQLFields = graphQLFields;
		}

		@Override
		public String toString() {
			StringBuilder sb = new StringBuilder(_key);

			if (!_parameterMap.isEmpty()) {
				sb.append("(");

				for (Map.Entry<String, Object> entry :
						_parameterMap.entrySet()) {

					sb.append(entry.getKey());
					sb.append(": ");
					sb.append(entry.getValue());
					sb.append(", ");
				}

				sb.setLength(sb.length() - 2);

				sb.append(")");
			}

			if (!_graphQLFields.isEmpty()) {
				sb.append("{");

				for (GraphQLField graphQLField : _graphQLFields) {
					sb.append(graphQLField.toString());
					sb.append(", ");
				}

				sb.setLength(sb.length() - 2);

				sb.append("}");
			}

			return sb.toString();
		}

		private final List<GraphQLField> _graphQLFields;
		private final String _key;
		private final Map<String, Object> _parameterMap;

	}

	private static final com.liferay.portal.kernel.log.Log _log =
		LogFactoryUtil.getLog(
			BaseProductTaxConfigurationResourceTestCase.class);

	private static BeanUtilsBean _beanUtilsBean = new BeanUtilsBean() {

		@Override
		public void copyProperty(Object bean, String name, Object value)
			throws IllegalAccessException, InvocationTargetException {

			if (value != null) {
				super.copyProperty(bean, name, value);
			}
		}

	};
	private static DateFormat _dateFormat;

	@Inject
	private com.liferay.headless.commerce.admin.catalog.resource.v1_0.
		ProductTaxConfigurationResource _productTaxConfigurationResource;

}