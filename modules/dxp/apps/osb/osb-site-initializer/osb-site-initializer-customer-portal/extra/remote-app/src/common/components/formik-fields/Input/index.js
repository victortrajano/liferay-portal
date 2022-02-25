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

import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {useField} from 'formik';
import {Badge} from '../..';
import {required, validate} from '../../../utils/validations.form';

const Input = ({groupStyle, helper, label, validations, ...props}) => {
	if (props.required) {
		validations = validations
			? [...validations, (value) => required(value)]
			: [(value) => required(value)];
	}

	const [field, meta] = useField({
		...props,
		validate: (value) => validate(validations, value),
	});

	const getBottomInfo = () => {
		if (meta.touched) {
			return (
				meta.error &&
				typeof meta.error === 'string' && (
					<Badge>
						<span className="pl-1">{meta.error}</span>
					</Badge>
				)
			);
		}

		return (
			helper && (
				<div className="ml-3 pl-3 text-neutral-6 text-paragraph-sm">
					{helper}
				</div>
			)
		);
	};

	return (
		<ClayForm.Group
			className={classNames('w-100', {
				groupStyle,
				'has-error': meta.touched && meta.error,
				'has-success': meta.touched && !meta.error,
			})}
		>
			<label>
				{label}

				{props.required && (
					<span className="inline-item-after reference-mark text-warning">
						<ClayIcon symbol="asterisk" />
					</span>
				)}

				<ClayInput {...field} {...props} />
			</label>

			{getBottomInfo()}
		</ClayForm.Group>
	);
};

export default Input;
