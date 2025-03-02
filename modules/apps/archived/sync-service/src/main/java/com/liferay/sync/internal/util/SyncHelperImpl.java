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

package com.liferay.sync.internal.util;

import com.liferay.document.library.kernel.exception.NoSuchFileVersionException;
import com.liferay.document.library.kernel.model.DLFileEntry;
import com.liferay.document.library.kernel.model.DLFileEntryConstants;
import com.liferay.document.library.kernel.model.DLFileVersion;
import com.liferay.document.library.kernel.model.DLFolder;
import com.liferay.document.library.kernel.service.DLFileVersionLocalService;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.lock.Lock;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.model.role.RoleConstants;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.repository.model.Folder;
import com.liferay.portal.kernel.security.SecureRandom;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.permission.ModelPermissions;
import com.liferay.portal.kernel.service.permission.ModelPermissionsFactory;
import com.liferay.portal.kernel.util.Base64;
import com.liferay.portal.kernel.util.ClassUtil;
import com.liferay.portal.kernel.util.Digester;
import com.liferay.portal.kernel.util.DigesterUtil;
import com.liferay.portal.kernel.util.FileUtil;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.PrefsPropsUtil;
import com.liferay.portal.kernel.util.PwdGenerator;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Time;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.uuid.PortalUUIDUtil;
import com.liferay.sync.SyncSiteUnavailableException;
import com.liferay.sync.constants.SyncConstants;
import com.liferay.sync.constants.SyncDLObjectConstants;
import com.liferay.sync.constants.SyncPermissionsConstants;
import com.liferay.sync.internal.configuration.SyncServiceConfigurationValues;
import com.liferay.sync.model.SyncDLObject;
import com.liferay.sync.model.SyncDevice;
import com.liferay.sync.model.impl.SyncDLObjectImpl;
import com.liferay.sync.service.SyncDLObjectLocalService;
import com.liferay.sync.service.configuration.SyncServiceConfigurationKeys;
import com.liferay.sync.service.io.delta.ByteChannelReader;
import com.liferay.sync.service.io.delta.ByteChannelWriter;
import com.liferay.sync.service.io.delta.DeltaUtil;
import com.liferay.sync.util.SyncHelper;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import java.lang.reflect.InvocationTargetException;

import java.math.BigInteger;

import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.Provider;
import java.security.cert.X509Certificate;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.portlet.PortletPreferences;

import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Dennis Ju
 */
@Component(immediate = true, service = SyncHelper.class)
public class SyncHelperImpl implements SyncHelper {

	@Override
	public void addChecksum(long modifiedTime, long typePK, String checksum) {
		String id = modifiedTime + StringPool.PERIOD + typePK;

		_checksums.put(id, checksum);
	}

	@Override
	public void addSyncDLObject(
			SyncDLObject syncDLObject,
			SyncDLObjectLocalService syncDLObjectLocalService)
		throws PortalException {

		String event = syncDLObject.getEvent();

		if (event.equals(SyncDLObjectConstants.EVENT_DELETE) ||
			event.equals(SyncDLObjectConstants.EVENT_TRASH)) {

			syncDLObjectLocalService.addSyncDLObject(
				0, syncDLObject.getUserId(), syncDLObject.getUserName(),
				syncDLObject.getModifiedTime(), 0, 0,
				syncDLObject.getTreePath(), StringPool.BLANK, StringPool.BLANK,
				StringPool.BLANK, StringPool.BLANK, StringPool.BLANK,
				StringPool.BLANK, StringPool.BLANK, 0, 0, StringPool.BLANK,
				event, StringPool.BLANK, null, 0, StringPool.BLANK,
				syncDLObject.getType(), syncDLObject.getTypePK(),
				StringPool.BLANK);
		}
		else {
			syncDLObjectLocalService.addSyncDLObject(
				syncDLObject.getCompanyId(), syncDLObject.getUserId(),
				syncDLObject.getUserName(), syncDLObject.getModifiedTime(),
				syncDLObject.getRepositoryId(),
				syncDLObject.getParentFolderId(), syncDLObject.getTreePath(),
				syncDLObject.getName(), syncDLObject.getExtension(),
				syncDLObject.getMimeType(), syncDLObject.getDescription(),
				syncDLObject.getChangeLog(), syncDLObject.getExtraSettings(),
				syncDLObject.getVersion(), syncDLObject.getVersionId(),
				syncDLObject.getSize(), syncDLObject.getChecksum(),
				syncDLObject.getEvent(), syncDLObject.getLanTokenKey(),
				syncDLObject.getLockExpirationDate(),
				syncDLObject.getLockUserId(), syncDLObject.getLockUserName(),
				syncDLObject.getType(), syncDLObject.getTypePK(),
				syncDLObject.getTypeUuid());
		}
	}

	@Override
	public String buildExceptionMessage(Throwable throwable) {

		// SYNC-1253

		StringBundler sb = new StringBundler(9);

		if (throwable instanceof InvocationTargetException) {
			throwable = throwable.getCause();
		}

		String throwableMessage = throwable.getMessage();

		if (Validator.isNull(throwableMessage)) {
			throwableMessage = throwable.toString();
		}

		sb.append(StringPool.QUOTE);
		sb.append(throwableMessage);
		sb.append("\", \"error\": ");
		sb.append(
			JSONUtil.put(
				"message", throwableMessage
			).put(
				"type", ClassUtil.getClassName(throwable)
			).toString());
		sb.append(", \"throwable\": \"");
		sb.append(throwable.toString());
		sb.append(StringPool.QUOTE);

		if (throwable.getCause() == null) {
			return StringUtil.unquote(sb.toString());
		}

		sb.append(", \"rootCause\": ");

		Throwable rootCauseThrowable = throwable;

		while (rootCauseThrowable.getCause() != null) {
			rootCauseThrowable = rootCauseThrowable.getCause();
		}

		throwableMessage = rootCauseThrowable.getMessage();

		if (Validator.isNull(throwableMessage)) {
			throwableMessage = rootCauseThrowable.toString();
		}

		sb.append(
			JSONUtil.put(
				"message", throwableMessage
			).put(
				"type", ClassUtil.getClassName(rootCauseThrowable)
			));

		return StringUtil.unquote(sb.toString());
	}

	@Override
	public void checkSyncEnabled(long groupId) throws PortalException {
		SyncDevice syncDevice = SyncDeviceThreadLocal.getSyncDevice();

		if (syncDevice != null) {
			syncDevice.checkStatus();
		}

		if (groupId == 0) {
			return;
		}

		Group group = _groupLocalService.fetchGroup(groupId);

		if ((group == null) || !isSyncEnabled(group)) {
			throw new SyncSiteUnavailableException();
		}
	}

	@Override
	public void enableLanSync(long companyId) throws Exception {
		String lanServerUuid = PrefsPropsUtil.getString(
			companyId, SyncConstants.SYNC_LAN_SERVER_UUID);

		if (Validator.isNotNull(lanServerUuid)) {
			return;
		}

		lanServerUuid = PortalUUIDUtil.generate();

		X500Name x500Name = new X500Name("CN=" + lanServerUuid);

		KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");

		keyPairGenerator.initialize(2048);

		KeyPair keyPair = keyPairGenerator.generateKeyPair();

		X509v3CertificateBuilder x509v3CertificateBuilder =
			new JcaX509v3CertificateBuilder(
				x500Name, new BigInteger(64, new SecureRandom()),
				new Date(System.currentTimeMillis() - Time.YEAR),
				new Date(System.currentTimeMillis() + (Time.YEAR * 1000)),
				x500Name, keyPair.getPublic());

		PrivateKey privateKey = keyPair.getPrivate();

		JcaContentSignerBuilder jcaContentSignerBuilder =
			new JcaContentSignerBuilder("SHA256WithRSAEncryption");

		JcaX509CertificateConverter jcaX509CertificateConverter =
			new JcaX509CertificateConverter();

		jcaX509CertificateConverter.setProvider(_provider);

		X509Certificate x509Certificate =
			jcaX509CertificateConverter.getCertificate(
				x509v3CertificateBuilder.build(
					jcaContentSignerBuilder.build(privateKey)));

		x509Certificate.verify(keyPair.getPublic());

		PortletPreferences portletPreferences = PrefsPropsUtil.getPreferences(
			companyId);

		portletPreferences.setValue(
			SyncConstants.SYNC_LAN_CERTIFICATE,
			Base64.encode(x509Certificate.getEncoded()));
		portletPreferences.setValue(
			SyncConstants.SYNC_LAN_KEY, Base64.encode(privateKey.getEncoded()));
		portletPreferences.setValue(
			SyncConstants.SYNC_LAN_SERVER_UUID, lanServerUuid);

		portletPreferences.store();
	}

	@Override
	public String getChecksum(DLFileVersion dlFileVersion) {
		if (dlFileVersion.getSize() >
				SyncServiceConfigurationValues.
					SYNC_FILE_CHECKSUM_THRESHOLD_SIZE) {

			return StringPool.BLANK;
		}

		try {
			return DigesterUtil.digestBase64(
				Digester.SHA_1, dlFileVersion.getContentStream(false));
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(exception);
			}

			return StringPool.BLANK;
		}
	}

	@Override
	public String getChecksum(File file) {
		if (file.length() >
				SyncServiceConfigurationValues.
					SYNC_FILE_CHECKSUM_THRESHOLD_SIZE) {

			return StringPool.BLANK;
		}

		try (FileInputStream fileInputStream = new FileInputStream(file)) {
			return DigesterUtil.digestBase64(Digester.SHA_1, fileInputStream);
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(exception);
			}

			return StringPool.BLANK;
		}
	}

	@Override
	public String getChecksum(long modifiedTime, long typePK) {
		String id = modifiedTime + StringPool.PERIOD + typePK;

		return _checksums.remove(id);
	}

	@Override
	public File getFileDelta(File sourceFile, File targetFile)
		throws PortalException {

		File checksumsFile = FileUtil.createTempFile();

		try (FileInputStream sourceFileInputStream = new FileInputStream(
				sourceFile);
			FileChannel sourceFileChannel = sourceFileInputStream.getChannel();
			OutputStream checksumsOutputStream = new FileOutputStream(
				checksumsFile);
			WritableByteChannel checksumsWritableByteChannel =
				Channels.newChannel(checksumsOutputStream)) {

			ByteChannelWriter checksumsByteChannelWriter =
				new ByteChannelWriter(checksumsWritableByteChannel);

			DeltaUtil.checksums(sourceFileChannel, checksumsByteChannelWriter);

			checksumsByteChannelWriter.finish();
		}
		catch (Exception exception) {
			throw new PortalException(exception);
		}

		File deltaFile = FileUtil.createTempFile();

		try (FileInputStream targetFileInputStream = new FileInputStream(
				targetFile);
			ReadableByteChannel targetReadableByteChannel =
				targetFileInputStream.getChannel();
			InputStream checksumsInputStream = new FileInputStream(
				checksumsFile);
			ReadableByteChannel checksumsReadableByteChannel =
				Channels.newChannel(checksumsInputStream);
			OutputStream deltaOutputStream = new FileOutputStream(deltaFile);
			WritableByteChannel deltaOutputStreamWritableByteChannel =
				Channels.newChannel(deltaOutputStream)) {

			ByteChannelReader checksumsByteChannelReader =
				new ByteChannelReader(checksumsReadableByteChannel);

			ByteChannelWriter deltaByteChannelWriter = new ByteChannelWriter(
				deltaOutputStreamWritableByteChannel);

			DeltaUtil.delta(
				targetReadableByteChannel, checksumsByteChannelReader,
				deltaByteChannelWriter);

			deltaByteChannelWriter.finish();
		}
		catch (Exception exception) {
			throw new PortalException(exception);
		}
		finally {
			FileUtil.delete(checksumsFile);
		}

		return deltaFile;
	}

	@Override
	public String getLanTokenKey(
		long modifiedTime, long typePK, boolean addToMap) {

		String id = modifiedTime + StringPool.PERIOD + typePK;

		String lanTokenKey = _lanTokenKeys.remove(id);

		if (lanTokenKey != null) {
			return lanTokenKey;
		}

		lanTokenKey = PwdGenerator.getPassword();

		if (addToMap) {
			_lanTokenKeys.put(id, lanTokenKey);
		}

		return lanTokenKey;
	}

	@Override
	public boolean isSupportedFolder(DLFolder dlFolder) {
		if (dlFolder.isHidden() || dlFolder.isMountPoint()) {
			return false;
		}

		return true;
	}

	@Override
	public boolean isSupportedFolder(Folder folder) {
		if (!(folder.getModel() instanceof DLFolder)) {
			return false;
		}

		DLFolder dlFolder = (DLFolder)folder.getModel();

		return isSupportedFolder(dlFolder);
	}

	@Override
	public boolean isSyncEnabled(Group group) {
		if (group.isUser() &&
			!PrefsPropsUtil.getBoolean(
				group.getCompanyId(),
				SyncServiceConfigurationKeys.SYNC_ALLOW_USER_PERSONAL_SITES,
				SyncServiceConfigurationValues.
					SYNC_ALLOW_USER_PERSONAL_SITES)) {

			return false;
		}

		return GetterUtil.getBoolean(
			group.getTypeSettingsProperty("syncEnabled"), !group.isCompany());
	}

	@Override
	public void patchFile(File originalFile, File deltaFile, File patchedFile)
		throws PortalException {

		try (FileInputStream originalFileInputStream = new FileInputStream(
				originalFile);
			FileChannel originalFileChannel =
				originalFileInputStream.getChannel();
			FileOutputStream patchedFileOutputStream = new FileOutputStream(
				patchedFile);
			WritableByteChannel patchedWritableByteChannel =
				Channels.newChannel(patchedFileOutputStream);
			FileInputStream deltaFileInputStream = new FileInputStream(
				deltaFile);
			ReadableByteChannel deltaReadableByteChannel = Channels.newChannel(
				deltaFileInputStream)) {

			ByteChannelReader deltaByteChannelReader = new ByteChannelReader(
				deltaReadableByteChannel);

			DeltaUtil.patch(
				originalFileChannel, patchedWritableByteChannel,
				deltaByteChannelReader);
		}
		catch (Exception exception) {
			throw new PortalException(exception);
		}
	}

	@Override
	public void setFilePermissions(
		Group group, boolean folder, ServiceContext serviceContext) {

		int syncSiteMemberFilePermissions = GetterUtil.getInteger(
			group.getTypeSettingsProperty("syncSiteMemberFilePermissions"));

		if (syncSiteMemberFilePermissions ==
				SyncPermissionsConstants.PERMISSIONS_DEFAULT) {

			serviceContext.setDeriveDefaultPermissions(true);

			return;
		}

		String[] resourceActions = null;

		if (folder) {
			resourceActions = SyncPermissionsConstants.getFolderResourceActions(
				syncSiteMemberFilePermissions);
		}
		else {
			resourceActions = SyncPermissionsConstants.getFileResourceActions(
				syncSiteMemberFilePermissions);
		}

		ModelPermissions modelPermissions =
			serviceContext.getModelPermissions();

		if (modelPermissions == null) {
			if (folder) {
				modelPermissions = ModelPermissionsFactory.create(
					Folder.class.getName());
			}
			else {
				modelPermissions = ModelPermissionsFactory.create(
					FileEntry.class.getName());
			}
		}
		else {
			if (folder) {
				modelPermissions.setResourceName(Folder.class.getName());
			}
			else {
				modelPermissions.setResourceName(FileEntry.class.getName());
			}
		}

		modelPermissions.addRolePermissions(
			RoleConstants.PLACEHOLDER_DEFAULT_GROUP_ROLE, resourceActions);

		serviceContext.setModelPermissions(modelPermissions);
	}

	@Override
	public SyncDLObject toSyncDLObject(
			DLFileEntry dlFileEntry, String event, boolean calculateChecksum)
		throws PortalException {

		return toSyncDLObject(dlFileEntry, event, calculateChecksum, false);
	}

	@Override
	public SyncDLObject toSyncDLObject(
			DLFileEntry dlFileEntry, String event, boolean calculateChecksum,
			boolean excludeWorkingCopy)
		throws PortalException {

		DLFileVersion dlFileVersion = null;

		Date lockExpirationDate = null;
		long lockUserId = 0;
		String lockUserName = StringPool.BLANK;
		String type = null;

		Lock lock = dlFileEntry.getLock();

		if ((lock == null) || excludeWorkingCopy) {
			dlFileVersion = _dlFileVersionLocalService.getFileVersion(
				dlFileEntry.getFileEntryId(), dlFileEntry.getVersion());

			type = SyncDLObjectConstants.TYPE_FILE;
		}
		else {
			try {
				dlFileVersion = _dlFileVersionLocalService.getFileVersion(
					dlFileEntry.getFileEntryId(),
					DLFileEntryConstants.PRIVATE_WORKING_COPY_VERSION);

				lockExpirationDate = lock.getExpirationDate();
				lockUserId = lock.getUserId();
				lockUserName = lock.getUserName();
				type = SyncDLObjectConstants.TYPE_PRIVATE_WORKING_COPY;
			}
			catch (NoSuchFileVersionException noSuchFileVersionException) {

				// LPS-52675

				if (_log.isDebugEnabled()) {
					_log.debug(noSuchFileVersionException);
				}

				// Publishing a checked out file entry on a staged site will
				// get the staged file entry's lock even though the live
				// file entry is not checked out

				dlFileVersion = _dlFileVersionLocalService.getFileVersion(
					dlFileEntry.getFileEntryId(), dlFileEntry.getVersion());

				type = SyncDLObjectConstants.TYPE_FILE;
			}
		}

		SyncDLObject syncDLObject = new SyncDLObjectImpl();

		syncDLObject.setCompanyId(dlFileVersion.getCompanyId());
		syncDLObject.setUserId(dlFileVersion.getStatusByUserId());
		syncDLObject.setUserName(dlFileVersion.getStatusByUserName());
		syncDLObject.setCreateDate(dlFileVersion.getCreateDate());
		syncDLObject.setModifiedDate(dlFileVersion.getModifiedDate());
		syncDLObject.setRepositoryId(dlFileVersion.getRepositoryId());
		syncDLObject.setParentFolderId(dlFileVersion.getFolderId());
		syncDLObject.setTreePath(dlFileVersion.getTreePath());
		syncDLObject.setName(dlFileVersion.getTitle());
		syncDLObject.setExtension(dlFileVersion.getExtension());
		syncDLObject.setMimeType(dlFileVersion.getMimeType());
		syncDLObject.setDescription(dlFileVersion.getDescription());
		syncDLObject.setChangeLog(dlFileVersion.getChangeLog());
		syncDLObject.setVersion(dlFileVersion.getVersion());
		syncDLObject.setVersionId(dlFileVersion.getFileVersionId());
		syncDLObject.setSize(dlFileVersion.getSize());

		if (calculateChecksum) {
			if (Validator.isNull(dlFileVersion.getChecksum())) {
				syncDLObject.setChecksum(getChecksum(dlFileVersion));
			}
			else {
				syncDLObject.setChecksum(dlFileVersion.getChecksum());
			}
		}

		syncDLObject.setEvent(event);
		syncDLObject.setLockExpirationDate(lockExpirationDate);
		syncDLObject.setLockUserId(lockUserId);
		syncDLObject.setLockUserName(lockUserName);
		syncDLObject.setType(type);
		syncDLObject.setTypePK(dlFileEntry.getFileEntryId());
		syncDLObject.setTypeUuid(dlFileEntry.getUuid());

		return syncDLObject;
	}

	@Override
	public SyncDLObject toSyncDLObject(
		DLFolder dlFolder, long userId, String userName, String event) {

		SyncDLObject syncDLObject = new SyncDLObjectImpl();

		syncDLObject.setCompanyId(dlFolder.getCompanyId());
		syncDLObject.setUserId(userId);
		syncDLObject.setUserName(userName);
		syncDLObject.setCreateDate(dlFolder.getCreateDate());
		syncDLObject.setModifiedDate(dlFolder.getModifiedDate());
		syncDLObject.setRepositoryId(dlFolder.getRepositoryId());
		syncDLObject.setParentFolderId(dlFolder.getParentFolderId());
		syncDLObject.setTreePath(dlFolder.getTreePath());
		syncDLObject.setName(dlFolder.getName());
		syncDLObject.setDescription(dlFolder.getDescription());
		syncDLObject.setEvent(event);
		syncDLObject.setType(SyncDLObjectConstants.TYPE_FOLDER);
		syncDLObject.setTypePK(dlFolder.getFolderId());
		syncDLObject.setTypeUuid(dlFolder.getUuid());

		return syncDLObject;
	}

	@Override
	public SyncDLObject toSyncDLObject(DLFolder dlFolder, String event) {
		PermissionChecker permissionChecker =
			PermissionThreadLocal.getPermissionChecker();

		if (permissionChecker == null) {
			return toSyncDLObject(dlFolder, 0, StringPool.BLANK, event);
		}

		User user = permissionChecker.getUser();

		return toSyncDLObject(
			dlFolder, user.getUserId(), user.getFullName(), event);
	}

	@Override
	public SyncDLObject toSyncDLObject(FileEntry fileEntry, String event)
		throws PortalException {

		return toSyncDLObject(fileEntry, event, false);
	}

	@Override
	public SyncDLObject toSyncDLObject(
			FileEntry fileEntry, String event, boolean calculateChecksum)
		throws PortalException {

		if (fileEntry.getModel() instanceof DLFileEntry) {
			DLFileEntry dlFileEntry = (DLFileEntry)fileEntry.getModel();

			return toSyncDLObject(dlFileEntry, event, calculateChecksum);
		}

		throw new PortalException(
			"FileEntry must be an instance of DLFileEntry");
	}

	@Override
	public SyncDLObject toSyncDLObject(Folder folder, String event)
		throws PortalException {

		if (folder.getModel() instanceof DLFolder) {
			DLFolder dlFolder = (DLFolder)folder.getModel();

			return toSyncDLObject(dlFolder, event);
		}

		throw new PortalException("Folder must be an instance of DLFolder");
	}

	@Reference(unbind = "-")
	protected void setDLFileVersionLocalService(
		DLFileVersionLocalService dlFileVersionLocalService) {

		_dlFileVersionLocalService = dlFileVersionLocalService;
	}

	@Reference(unbind = "-")
	protected void setGroupLocalService(GroupLocalService groupLocalService) {
		_groupLocalService = groupLocalService;
	}

	private static final Log _log = LogFactoryUtil.getLog(SyncHelperImpl.class);

	private final Map<String, String> _checksums = new ConcurrentHashMap<>();
	private DLFileVersionLocalService _dlFileVersionLocalService;
	private GroupLocalService _groupLocalService;
	private final Map<String, String> _lanTokenKeys = new ConcurrentHashMap<>();
	private final Provider _provider = new BouncyCastleProvider();

}