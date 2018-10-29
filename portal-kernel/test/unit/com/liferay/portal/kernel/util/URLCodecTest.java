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

package com.liferay.portal.kernel.util;

import com.liferay.petra.string.CharPool;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.exception.LoggedExceptionInInitializerError;

import java.net.URLEncoder;

import org.junit.Assert;
import org.junit.Test;

/**
 * @author Shuyang Zhou
 * @author Brian Wing Shun Chan
 */
public class URLCodecTest {

	@Test
	public void testConstructor() {
		new URLCodec();
	}

	@Test
	public void testDecodeURL() throws Exception {
		for (int i = 0; i < _RAW_URLS.length; i++) {
			Assert.assertEquals(
				_RAW_URLS[i], URLCodec.decodeURL(_ENCODED_URLS[i]));

			Assert.assertEquals(
				_RAW_URLS[i],
				URLCodec.decodeURL(_ENCODED_URLS[i], StringPool.UTF8));

			Assert.assertEquals(
				_RAW_URLS[i],
				URLCodec.decodeURL(_ESCAPE_SPACES_ENCODED_URLS[i]));

			Assert.assertEquals(
				_RAW_URLS[i],
				URLCodec.decodeURL(
					_ESCAPE_SPACES_ENCODED_URLS[i], StringPool.UTF8));
		}

		testDecodeURL("%");
		testDecodeURL("%0");
		testDecodeURL("%00%");
		testDecodeURL("%00%0");
		testDecodeURL("%0" + (char)(CharPool.NUMBER_0 - 1));
		testDecodeURL("%0" + (char)(CharPool.NUMBER_9 + 1));
		testDecodeURL("%0" + (char)(CharPool.UPPER_CASE_A - 1));
		testDecodeURL("%0" + (char)(CharPool.UPPER_CASE_F + 1));
		testDecodeURL("%0" + (char)(CharPool.LOWER_CASE_A - 1));
		testDecodeURL("%0" + (char)(CharPool.LOWER_CASE_F + 1));
	}

	@Test
	public void testDecodeURLWithPercentageInURLParameters() throws Exception {
		testDecodeURL("http://localhost:8080/?id=%'");
	}

	@Test
	public void testEncodeURL() throws Exception {
		for (int i = 0; i < _RAW_URLS.length; i++) {
			Assert.assertEquals(
				_ENCODED_URLS[i], URLCodec.encodeURL(_RAW_URLS[i]));

			Assert.assertEquals(
				_ENCODED_URLS[i], URLCodec.encodeURL(_RAW_URLS[i], false));

			Assert.assertEquals(
				_ENCODED_URLS[i],
				URLCodec.encodeURL(_RAW_URLS[i], StringPool.UTF8, false));

			Assert.assertEquals(
				_ESCAPE_SPACES_ENCODED_URLS[i],
				URLCodec.encodeURL(_RAW_URLS[i], true));

			Assert.assertEquals(
				_ESCAPE_SPACES_ENCODED_URLS[i],
				URLCodec.encodeURL(_RAW_URLS[i], StringPool.UTF8, true));
		}
	}

	@Test
	public void testHandlingFourBytesUTFWithSurrogates() throws Exception {
		StringBundler sb = new StringBundler(
			_UNICODE_CATS_AND_DOGS.length * 4 * 2);

		int[] animalsInts = new int[_UNICODE_CATS_AND_DOGS.length];

		for (int i = 0; i < animalsInts.length; i++) {
			animalsInts[i] = Integer.valueOf(_UNICODE_CATS_AND_DOGS[i], 16);
		}

		String animalsString = new String(animalsInts, 0, animalsInts.length);

		for (byte animalsByte : animalsString.getBytes(StringPool.UTF8)) {
			sb.append(StringPool.PERCENT);
			sb.append(Integer.toHexString(0xFF & animalsByte));
		}

		String escapedAnimalsString = sb.toString();

		Assert.assertEquals(
			animalsString,
			URLCodec.decodeURL(escapedAnimalsString, StringPool.UTF8));
		Assert.assertEquals(
			StringUtil.toUpperCase(escapedAnimalsString),
			URLCodec.encodeURL(animalsString, StringPool.UTF8, false));
	}

	protected void testDecodeURL(String encodedURLString) {
		try {
			URLCodec.decodeURL(encodedURLString, StringPool.UTF8);

			Assert.fail(encodedURLString);
		}
		catch (IllegalArgumentException iae) {
		}
	}

	private static final String[] _ENCODED_URLS;

	private static final String[] _ESCAPE_SPACES_ENCODED_URLS;

	private static final String[] _RAW_URLS = {
		null, StringPool.BLANK, "abcdefghijklmnopqrstuvwxyz",
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789", ".-*_", " ",
		"~`!@#$%^&()+={[}]|\\:;\"'<,>?/", "中文测试", "/abc/def", "abc <def> ghi"
	};

	private static final String[] _UNICODE_CATS_AND_DOGS = {
		"1f408", "1f431", "1f415", "1f436"
	};

	static {
		_ENCODED_URLS = new String[_RAW_URLS.length];
		_ESCAPE_SPACES_ENCODED_URLS = new String[_RAW_URLS.length];

		_ENCODED_URLS[0] = null;
		_ESCAPE_SPACES_ENCODED_URLS[0] = null;

		try {
			for (int i = 1; i < _RAW_URLS.length; i++) {
				_ENCODED_URLS[i] = URLEncoder.encode(
					_RAW_URLS[i], StringPool.UTF8);

				_ESCAPE_SPACES_ENCODED_URLS[i] = StringUtil.replace(
					_ENCODED_URLS[i], CharPool.PLUS, "%20");
			}
		}
		catch (Exception e) {
			throw new LoggedExceptionInInitializerError(e);
		}
	}

}