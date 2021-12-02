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

package com.liferay.remote.app.model;

import java.io.Serializable;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * This class is used by SOAP remote services, specifically {@link com.liferay.remote.app.service.http.RemoteAppEntryServiceSoap}.
 *
 * @author Brian Wing Shun Chan
 * @deprecated As of Athanasius (7.3.x), with no direct replacement
 * @generated
 */
@Deprecated
public class RemoteAppEntrySoap implements Serializable {

	public static RemoteAppEntrySoap toSoapModel(RemoteAppEntry model) {
		RemoteAppEntrySoap soapModel = new RemoteAppEntrySoap();

		soapModel.setMvccVersion(model.getMvccVersion());
		soapModel.setUuid(model.getUuid());
		soapModel.setExternalReferenceCode(model.getExternalReferenceCode());
		soapModel.setRemoteAppEntryId(model.getRemoteAppEntryId());
		soapModel.setCompanyId(model.getCompanyId());
		soapModel.setUserId(model.getUserId());
		soapModel.setUserName(model.getUserName());
		soapModel.setCreateDate(model.getCreateDate());
		soapModel.setModifiedDate(model.getModifiedDate());
		soapModel.setCustomElementCSSURLs(model.getCustomElementCSSURLs());
		soapModel.setCustomElementHTMLElementName(
			model.getCustomElementHTMLElementName());
		soapModel.setCustomElementURLs(model.getCustomElementURLs());
		soapModel.setDescription(model.getDescription());
		soapModel.setFriendlyURLMapping(model.getFriendlyURLMapping());
		soapModel.setIFrameURL(model.getIFrameURL());
		soapModel.setInstanceable(model.isInstanceable());
		soapModel.setName(model.getName());
		soapModel.setPortletCategoryName(model.getPortletCategoryName());
		soapModel.setProperties(model.getProperties());
		soapModel.setSourceCodeURL(model.getSourceCodeURL());
		soapModel.setType(model.getType());
		soapModel.setStatus(model.getStatus());
		soapModel.setStatusByUserId(model.getStatusByUserId());
		soapModel.setStatusByUserName(model.getStatusByUserName());
		soapModel.setStatusDate(model.getStatusDate());

		return soapModel;
	}

	public static RemoteAppEntrySoap[] toSoapModels(RemoteAppEntry[] models) {
		RemoteAppEntrySoap[] soapModels = new RemoteAppEntrySoap[models.length];

		for (int i = 0; i < models.length; i++) {
			soapModels[i] = toSoapModel(models[i]);
		}

		return soapModels;
	}

	public static RemoteAppEntrySoap[][] toSoapModels(
		RemoteAppEntry[][] models) {

		RemoteAppEntrySoap[][] soapModels = null;

		if (models.length > 0) {
			soapModels =
				new RemoteAppEntrySoap[models.length][models[0].length];
		}
		else {
			soapModels = new RemoteAppEntrySoap[0][0];
		}

		for (int i = 0; i < models.length; i++) {
			soapModels[i] = toSoapModels(models[i]);
		}

		return soapModels;
	}

	public static RemoteAppEntrySoap[] toSoapModels(
		List<RemoteAppEntry> models) {

		List<RemoteAppEntrySoap> soapModels = new ArrayList<RemoteAppEntrySoap>(
			models.size());

		for (RemoteAppEntry model : models) {
			soapModels.add(toSoapModel(model));
		}

		return soapModels.toArray(new RemoteAppEntrySoap[soapModels.size()]);
	}

	public RemoteAppEntrySoap() {
	}

	public long getPrimaryKey() {
		return _remoteAppEntryId;
	}

	public void setPrimaryKey(long pk) {
		setRemoteAppEntryId(pk);
	}

	public long getMvccVersion() {
		return _mvccVersion;
	}

	public void setMvccVersion(long mvccVersion) {
		_mvccVersion = mvccVersion;
	}

	public String getUuid() {
		return _uuid;
	}

	public void setUuid(String uuid) {
		_uuid = uuid;
	}

	public String getExternalReferenceCode() {
		return _externalReferenceCode;
	}

	public void setExternalReferenceCode(String externalReferenceCode) {
		_externalReferenceCode = externalReferenceCode;
	}

	public long getRemoteAppEntryId() {
		return _remoteAppEntryId;
	}

	public void setRemoteAppEntryId(long remoteAppEntryId) {
		_remoteAppEntryId = remoteAppEntryId;
	}

	public long getCompanyId() {
		return _companyId;
	}

	public void setCompanyId(long companyId) {
		_companyId = companyId;
	}

	public long getUserId() {
		return _userId;
	}

	public void setUserId(long userId) {
		_userId = userId;
	}

	public String getUserName() {
		return _userName;
	}

	public void setUserName(String userName) {
		_userName = userName;
	}

	public Date getCreateDate() {
		return _createDate;
	}

	public void setCreateDate(Date createDate) {
		_createDate = createDate;
	}

	public Date getModifiedDate() {
		return _modifiedDate;
	}

	public void setModifiedDate(Date modifiedDate) {
		_modifiedDate = modifiedDate;
	}

	public String getCustomElementCSSURLs() {
		return _customElementCSSURLs;
	}

	public void setCustomElementCSSURLs(String customElementCSSURLs) {
		_customElementCSSURLs = customElementCSSURLs;
	}

	public String getCustomElementHTMLElementName() {
		return _customElementHTMLElementName;
	}

	public void setCustomElementHTMLElementName(
		String customElementHTMLElementName) {

		_customElementHTMLElementName = customElementHTMLElementName;
	}

	public String getCustomElementURLs() {
		return _customElementURLs;
	}

	public void setCustomElementURLs(String customElementURLs) {
		_customElementURLs = customElementURLs;
	}

	public String getDescription() {
		return _description;
	}

	public void setDescription(String description) {
		_description = description;
	}

	public String getFriendlyURLMapping() {
		return _friendlyURLMapping;
	}

	public void setFriendlyURLMapping(String friendlyURLMapping) {
		_friendlyURLMapping = friendlyURLMapping;
	}

	public String getIFrameURL() {
		return _iFrameURL;
	}

	public void setIFrameURL(String iFrameURL) {
		_iFrameURL = iFrameURL;
	}

	public boolean getInstanceable() {
		return _instanceable;
	}

	public boolean isInstanceable() {
		return _instanceable;
	}

	public void setInstanceable(boolean instanceable) {
		_instanceable = instanceable;
	}

	public String getName() {
		return _name;
	}

	public void setName(String name) {
		_name = name;
	}

	public String getPortletCategoryName() {
		return _portletCategoryName;
	}

	public void setPortletCategoryName(String portletCategoryName) {
		_portletCategoryName = portletCategoryName;
	}

	public String getProperties() {
		return _properties;
	}

	public void setProperties(String properties) {
		_properties = properties;
	}

	public String getSourceCodeURL() {
		return _sourceCodeURL;
	}

	public void setSourceCodeURL(String sourceCodeURL) {
		_sourceCodeURL = sourceCodeURL;
	}

	public String getType() {
		return _type;
	}

	public void setType(String type) {
		_type = type;
	}

	public int getStatus() {
		return _status;
	}

	public void setStatus(int status) {
		_status = status;
	}

	public long getStatusByUserId() {
		return _statusByUserId;
	}

	public void setStatusByUserId(long statusByUserId) {
		_statusByUserId = statusByUserId;
	}

	public String getStatusByUserName() {
		return _statusByUserName;
	}

	public void setStatusByUserName(String statusByUserName) {
		_statusByUserName = statusByUserName;
	}

	public Date getStatusDate() {
		return _statusDate;
	}

	public void setStatusDate(Date statusDate) {
		_statusDate = statusDate;
	}

	private long _mvccVersion;
	private String _uuid;
	private String _externalReferenceCode;
	private long _remoteAppEntryId;
	private long _companyId;
	private long _userId;
	private String _userName;
	private Date _createDate;
	private Date _modifiedDate;
	private String _customElementCSSURLs;
	private String _customElementHTMLElementName;
	private String _customElementURLs;
	private String _description;
	private String _friendlyURLMapping;
	private String _iFrameURL;
	private boolean _instanceable;
	private String _name;
	private String _portletCategoryName;
	private String _properties;
	private String _sourceCodeURL;
	private String _type;
	private int _status;
	private long _statusByUserId;
	private String _statusByUserName;
	private Date _statusDate;

}