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

package com.liferay.scheduler.model;

import com.liferay.portal.kernel.bean.AutoEscape;
import com.liferay.portal.kernel.model.AuditedModel;
import com.liferay.portal.kernel.model.BaseModel;
import com.liferay.portal.kernel.model.MVCCModel;
import com.liferay.portal.kernel.model.ShardedModel;

import java.util.Date;

import org.osgi.annotation.versioning.ProviderType;

/**
 * The base model interface for the SchedulerProcess service. Represents a row in the &quot;SchedulerProcess&quot; database table, with each column mapped to a property of this class.
 *
 * <p>
 * This interface and its corresponding implementation <code>com.liferay.scheduler.model.impl.SchedulerProcessModelImpl</code> exist only as a container for the default property accessors generated by ServiceBuilder. Helper methods and all application logic should be put in <code>com.liferay.scheduler.model.impl.SchedulerProcessImpl</code>.
 * </p>
 *
 * @author Alessio Antonio Rendina
 * @see SchedulerProcess
 * @generated
 */
@ProviderType
public interface SchedulerProcessModel
	extends AuditedModel, BaseModel<SchedulerProcess>, MVCCModel, ShardedModel {

	/**
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. All methods that expect a scheduler process model instance should use the {@link SchedulerProcess} interface instead.
	 */

	/**
	 * Returns the primary key of this scheduler process.
	 *
	 * @return the primary key of this scheduler process
	 */
	public long getPrimaryKey();

	/**
	 * Sets the primary key of this scheduler process.
	 *
	 * @param primaryKey the primary key of this scheduler process
	 */
	public void setPrimaryKey(long primaryKey);

	/**
	 * Returns the mvcc version of this scheduler process.
	 *
	 * @return the mvcc version of this scheduler process
	 */
	@Override
	public long getMvccVersion();

	/**
	 * Sets the mvcc version of this scheduler process.
	 *
	 * @param mvccVersion the mvcc version of this scheduler process
	 */
	@Override
	public void setMvccVersion(long mvccVersion);

	/**
	 * Returns the scheduler process ID of this scheduler process.
	 *
	 * @return the scheduler process ID of this scheduler process
	 */
	public long getSchedulerProcessId();

	/**
	 * Sets the scheduler process ID of this scheduler process.
	 *
	 * @param schedulerProcessId the scheduler process ID of this scheduler process
	 */
	public void setSchedulerProcessId(long schedulerProcessId);

	/**
	 * Returns the company ID of this scheduler process.
	 *
	 * @return the company ID of this scheduler process
	 */
	@Override
	public long getCompanyId();

	/**
	 * Sets the company ID of this scheduler process.
	 *
	 * @param companyId the company ID of this scheduler process
	 */
	@Override
	public void setCompanyId(long companyId);

	/**
	 * Returns the user ID of this scheduler process.
	 *
	 * @return the user ID of this scheduler process
	 */
	@Override
	public long getUserId();

	/**
	 * Sets the user ID of this scheduler process.
	 *
	 * @param userId the user ID of this scheduler process
	 */
	@Override
	public void setUserId(long userId);

	/**
	 * Returns the user uuid of this scheduler process.
	 *
	 * @return the user uuid of this scheduler process
	 */
	@Override
	public String getUserUuid();

	/**
	 * Sets the user uuid of this scheduler process.
	 *
	 * @param userUuid the user uuid of this scheduler process
	 */
	@Override
	public void setUserUuid(String userUuid);

	/**
	 * Returns the user name of this scheduler process.
	 *
	 * @return the user name of this scheduler process
	 */
	@AutoEscape
	@Override
	public String getUserName();

	/**
	 * Sets the user name of this scheduler process.
	 *
	 * @param userName the user name of this scheduler process
	 */
	@Override
	public void setUserName(String userName);

	/**
	 * Returns the create date of this scheduler process.
	 *
	 * @return the create date of this scheduler process
	 */
	@Override
	public Date getCreateDate();

	/**
	 * Sets the create date of this scheduler process.
	 *
	 * @param createDate the create date of this scheduler process
	 */
	@Override
	public void setCreateDate(Date createDate);

	/**
	 * Returns the modified date of this scheduler process.
	 *
	 * @return the modified date of this scheduler process
	 */
	@Override
	public Date getModifiedDate();

	/**
	 * Sets the modified date of this scheduler process.
	 *
	 * @param modifiedDate the modified date of this scheduler process
	 */
	@Override
	public void setModifiedDate(Date modifiedDate);

	/**
	 * Returns the name of this scheduler process.
	 *
	 * @return the name of this scheduler process
	 */
	@AutoEscape
	public String getName();

	/**
	 * Sets the name of this scheduler process.
	 *
	 * @param name the name of this scheduler process
	 */
	public void setName(String name);

	/**
	 * Returns the type of this scheduler process.
	 *
	 * @return the type of this scheduler process
	 */
	@AutoEscape
	public String getType();

	/**
	 * Sets the type of this scheduler process.
	 *
	 * @param type the type of this scheduler process
	 */
	public void setType(String type);

	/**
	 * Returns the type settings of this scheduler process.
	 *
	 * @return the type settings of this scheduler process
	 */
	@AutoEscape
	public String getTypeSettings();

	/**
	 * Sets the type settings of this scheduler process.
	 *
	 * @param typeSettings the type settings of this scheduler process
	 */
	public void setTypeSettings(String typeSettings);

	/**
	 * Returns the system of this scheduler process.
	 *
	 * @return the system of this scheduler process
	 */
	public boolean getSystem();

	/**
	 * Returns <code>true</code> if this scheduler process is system.
	 *
	 * @return <code>true</code> if this scheduler process is system; <code>false</code> otherwise
	 */
	public boolean isSystem();

	/**
	 * Sets whether this scheduler process is system.
	 *
	 * @param system the system of this scheduler process
	 */
	public void setSystem(boolean system);

	/**
	 * Returns the active of this scheduler process.
	 *
	 * @return the active of this scheduler process
	 */
	public boolean getActive();

	/**
	 * Returns <code>true</code> if this scheduler process is active.
	 *
	 * @return <code>true</code> if this scheduler process is active; <code>false</code> otherwise
	 */
	public boolean isActive();

	/**
	 * Sets whether this scheduler process is active.
	 *
	 * @param active the active of this scheduler process
	 */
	public void setActive(boolean active);

	/**
	 * Returns the cron expression of this scheduler process.
	 *
	 * @return the cron expression of this scheduler process
	 */
	@AutoEscape
	public String getCronExpression();

	/**
	 * Sets the cron expression of this scheduler process.
	 *
	 * @param cronExpression the cron expression of this scheduler process
	 */
	public void setCronExpression(String cronExpression);

	/**
	 * Returns the start date of this scheduler process.
	 *
	 * @return the start date of this scheduler process
	 */
	public Date getStartDate();

	/**
	 * Sets the start date of this scheduler process.
	 *
	 * @param startDate the start date of this scheduler process
	 */
	public void setStartDate(Date startDate);

	/**
	 * Returns the end date of this scheduler process.
	 *
	 * @return the end date of this scheduler process
	 */
	public Date getEndDate();

	/**
	 * Sets the end date of this scheduler process.
	 *
	 * @param endDate the end date of this scheduler process
	 */
	public void setEndDate(Date endDate);

}