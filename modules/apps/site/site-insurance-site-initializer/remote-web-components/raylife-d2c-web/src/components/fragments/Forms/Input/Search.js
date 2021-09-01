import React from 'react';

import {InputAreaWithError} from '../InputArea/WithError';
import {Label} from '../Label';

export const SearchInput = React.forwardRef(
	(
		{
			children,
			error,
			label,
			name,
			renderActions,
			required = false,
			...props
		},
		ref
	) => {
		return (
			<>
				{label && (
					<Label label={label} name={name} required={required}>
						{renderActions}
					</Label>
				)}
				<div className="content-row">
					<InputAreaWithError error={error}>
						<input
							{...props}
							maxLength={255}
							name={name}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
								}
							}}
							ref={ref}
							required={required}
						/>
					</InputAreaWithError>
					{children}
				</div>
			</>
		);
	}
);
