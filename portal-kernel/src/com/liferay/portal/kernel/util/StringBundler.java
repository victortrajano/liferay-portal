/**
 * Copyright (c) 2000-2009 Liferay, Inc. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package com.liferay.portal.kernel.util;

/**
 * <a href="StringBundler.java.html"><b><i>View Source</i></b></a>
 *
 * <p>
 * See http://support.liferay.com/browse/LPS-6072.
 * </p>
 *
 * @author Shuyang Zhou
 * @author Brian Wing Shun Chan
 */
public class StringBundler {

	public StringBundler() {
		_array = new String[_DEFAULT_ARRAY_CAPACITY];
	}

	public StringBundler(int arrayCapacity) {
		if (arrayCapacity <= 0) {
			throw new IllegalArgumentException();
		}

		_array = new String[arrayCapacity];
	}

	public StringBundler(String s) {
		_array = new String[_DEFAULT_ARRAY_CAPACITY];

		_array[0] = s;

		_arrayIndex = 1;
	}

	public StringBundler append(boolean b) {
		return append(Boolean.valueOf(b).toString());
	}

	public StringBundler append(double d) {
		return append(Double.toString(d));
	}

	public StringBundler append(float f) {
		return append(Float.toString(f));
	}

	public StringBundler append(int i) {
		return append(Integer.toString(i));
	}

	public StringBundler append(long l) {
		return append(Long.toString(l));
	}

	public StringBundler append(Object obj) {
		return append(String.valueOf(obj));
	}

	public StringBundler append(String s) {
		if (_arrayIndex >= _array.length) {
			expandCapacity();
		}

		_array[_arrayIndex++] = s;

		return this;
	}

	public int length() {
		int length = 0;

		for (int i = 0; i < _arrayIndex; i++) {
			length += _array[i].length();
		}

		return length;
	}

	public String stringAt(int index) {
		if (index >= _arrayIndex) {
			throw new ArrayIndexOutOfBoundsException();
		}

		return _array[index];
	}

	public String toString() {
		if (_arrayIndex == 0) {
			return StringPool.BLANK;
		}

		String s = null;

		if (_arrayIndex <= 3) {
			s = _array[0];

			for (int i = 1; i < _arrayIndex; i++) {
				s = s.concat(_array[i]);
			}
		}
		else {
			int length = length();

			StringBundler sb = new StringBundler(length);

			for (int i = 0; i < _arrayIndex; i++) {
				sb.append(_array[i]);
			}

			s = sb.toString();
		}

		return s;
	}

	protected void expandCapacity() {
		String[] newArray = new String[_array.length << 1];

		System.arraycopy(_array, 0, newArray, 0, _array.length);

		_array = newArray;
	}

	private static final int _DEFAULT_ARRAY_CAPACITY = 16;

	private String[] _array;
	private int _arrayIndex;

}