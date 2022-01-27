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

package com.liferay.fragment.renderer;

import com.liferay.fragment.model.FragmentEntryLink;

import java.util.Locale;
import java.util.Optional;

import org.osgi.annotation.versioning.ProviderType;

/**
 * @author Jorge Ferrer
 */
@ProviderType
public interface FragmentRendererContext {

	public Optional<Object> getDisplayObjectOptional();

	public String getFragmentElementId();

	public FragmentEntryLink getFragmentEntryLink();

	public Locale getLocale();

	public String getMode();

	public long getPreviewClassNameId();

	public long getPreviewClassPK();

	public int getPreviewType();

	public String getPreviewVersion();

	public long[] getSegmentsEntryIds();

	public boolean isUseCachedContent();

}