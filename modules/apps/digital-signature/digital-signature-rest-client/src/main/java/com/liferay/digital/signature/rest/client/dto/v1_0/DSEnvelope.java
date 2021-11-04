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

package com.liferay.digital.signature.rest.client.dto.v1_0;

import com.liferay.digital.signature.rest.client.function.UnsafeSupplier;
import com.liferay.digital.signature.rest.client.serdes.v1_0.DSEnvelopeSerDes;

import java.io.Serializable;

import java.util.Date;
import java.util.Objects;

import javax.annotation.Generated;

/**
 * @author José Abelenda
 * @generated
 */
@Generated("")
public class DSEnvelope implements Cloneable, Serializable {

	public static DSEnvelope toDTO(String json) {
		return DSEnvelopeSerDes.toDTO(json);
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	public void setDateCreated(
		UnsafeSupplier<Date, Exception> dateCreatedUnsafeSupplier) {

		try {
			dateCreated = dateCreatedUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected Date dateCreated;

	public Date getDateModified() {
		return dateModified;
	}

	public void setDateModified(Date dateModified) {
		this.dateModified = dateModified;
	}

	public void setDateModified(
		UnsafeSupplier<Date, Exception> dateModifiedUnsafeSupplier) {

		try {
			dateModified = dateModifiedUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected Date dateModified;

	public DSDocument[] getDsDocument() {
		return dsDocument;
	}

	public void setDsDocument(DSDocument[] dsDocument) {
		this.dsDocument = dsDocument;
	}

	public void setDsDocument(
		UnsafeSupplier<DSDocument[], Exception> dsDocumentUnsafeSupplier) {

		try {
			dsDocument = dsDocumentUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected DSDocument[] dsDocument;

	public DSRecipient[] getDsRecipient() {
		return dsRecipient;
	}

	public void setDsRecipient(DSRecipient[] dsRecipient) {
		this.dsRecipient = dsRecipient;
	}

	public void setDsRecipient(
		UnsafeSupplier<DSRecipient[], Exception> dsRecipientUnsafeSupplier) {

		try {
			dsRecipient = dsRecipientUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected DSRecipient[] dsRecipient;

	public String getEmailBlurb() {
		return emailBlurb;
	}

	public void setEmailBlurb(String emailBlurb) {
		this.emailBlurb = emailBlurb;
	}

	public void setEmailBlurb(
		UnsafeSupplier<String, Exception> emailBlurbUnsafeSupplier) {

		try {
			emailBlurb = emailBlurbUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String emailBlurb;

	public String getEmailSubject() {
		return emailSubject;
	}

	public void setEmailSubject(String emailSubject) {
		this.emailSubject = emailSubject;
	}

	public void setEmailSubject(
		UnsafeSupplier<String, Exception> emailSubjectUnsafeSupplier) {

		try {
			emailSubject = emailSubjectUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String emailSubject;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setId(UnsafeSupplier<String, Exception> idUnsafeSupplier) {
		try {
			id = idUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String id;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setName(UnsafeSupplier<String, Exception> nameUnsafeSupplier) {
		try {
			name = nameUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String name;

	public String getSenderEmailAddress() {
		return senderEmailAddress;
	}

	public void setSenderEmailAddress(String senderEmailAddress) {
		this.senderEmailAddress = senderEmailAddress;
	}

	public void setSenderEmailAddress(
		UnsafeSupplier<String, Exception> senderEmailAddressUnsafeSupplier) {

		try {
			senderEmailAddress = senderEmailAddressUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String senderEmailAddress;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public void setStatus(
		UnsafeSupplier<String, Exception> statusUnsafeSupplier) {

		try {
			status = statusUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String status;

	@Override
	public DSEnvelope clone() throws CloneNotSupportedException {
		return (DSEnvelope)super.clone();
	}

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof DSEnvelope)) {
			return false;
		}

		DSEnvelope dsEnvelope = (DSEnvelope)object;

		return Objects.equals(toString(), dsEnvelope.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		return DSEnvelopeSerDes.toJSON(this);
	}

}