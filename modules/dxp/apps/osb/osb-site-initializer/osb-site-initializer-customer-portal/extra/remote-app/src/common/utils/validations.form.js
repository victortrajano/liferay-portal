/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const LOWCASE_NUMBERS_REGEX = /^[0-9a-z]+$/;

const required = (value) => {
	if (!value) {
		return 'This field is required.';
	}
};

const maxLength = (value, max) => {
	if (value.length > max) {
		return `This field exceeded ${max} characters.`;
	}
};

const isValidEmail = (value, isValidDomain) => {
	if (value && !EMAIL_REGEX.test(value)) {
		return 'Please insert a valid e-mail.';
	}

	if (!isValidDomain) {
		return 'E-mail domain not allowed.';
	}
};

const isLowercaseAndNumbers = (value) => {
	if (!LOWCASE_NUMBERS_REGEX.test(value)) {
		return 'Lowercase letters and numbers only.';
	}
};

const validate = (validations, value) => {
	let error;

	if (validations) {
		validations.forEach((validation) => {
			const callback = validation(value);

			if (callback) {
				error = callback;
			}
		});
	}

	return error;
};

export {isLowercaseAndNumbers, isValidEmail, maxLength, required, validate};
