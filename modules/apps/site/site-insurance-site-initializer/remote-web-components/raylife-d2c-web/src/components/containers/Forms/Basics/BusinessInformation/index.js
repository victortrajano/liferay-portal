/* eslint-disable react-hooks/exhaustive-deps */

import React, {useEffect} from 'react';
import {useFormContext, useWatch} from 'react-hook-form';

import {BusinessInformationAddress} from './Address';
import {AVAILABLE_STEPS} from '../../../../../utils/constants';
import {LiferayService} from '../../../../../services/liferay';
import {useStepWizard} from '../../../../../hooks/useStepWizard';
import {CardFormActionsWithSave} from '../../../../fragments/Card/FormActionsWithSave';
import {EmailControlledInput} from '../../../../connectors/Controlled/Input/Email';
import {WebsiteControlledInput} from '../../../../connectors/Controlled/Input/Website';
import {PhoneControlledInput} from '../../../../connectors/Controlled/Input/WithMask/Phone';
import {ControlledInput} from '../../../../connectors/Controlled/Input';
import {useCustomEvent} from '../../../../../hooks/useCustomEvent';
import {TIP_EVENT} from '../../../../../events';

const setFormPath = (value) => `basics.businessInformation.${value}`;

export const FormBasicBusinessInformation = () => {
	const form = useWatch();
	const {selectedStep, setSection} = useStepWizard();
	const [dispatchEvent] = useCustomEvent(TIP_EVENT);
	const {
		control,
		formState: {isValid},
	} = useFormContext();

	useEffect(() => {
		dispatchEvent({
			step: selectedStep,
			templateData: {
				firstName: '! 👋',
			},
			templateName: 'hi-template',
		});
	}, []);

	const onSave = async () => {
		try {
			await LiferayService.createBasicsApplication(form.basics);
		} catch (error) {
			console.error(error);
		}
	};

	const goToPreviousForm = () =>
		setSection(AVAILABLE_STEPS.BASICS_BUSINESS_TYPE);

	const goToNextForm = () => {
		onSave();
		setSection(AVAILABLE_STEPS.BASICS_PRODUCT_QUOTE);
	};

	return (
		<div className="card">
			<div className="card-content">
				<div className="content-row">
					<ControlledInput
						control={control}
						label="First Name"
						inputProps={{
							maxLength: 256,
							onBlur: () =>
								dispatchEvent({
									templateName: 'hi-template',
									step: selectedStep,
									inputName: setFormPath('firstName'),
									value:
										form?.basics?.businessInformation
											?.firstName,
									templateData: {
										firstName: ` ${form?.basics?.businessInformation?.firstName?.trim()}! 👋`,
									},
								}),
						}}
						name={setFormPath('firstName')}
						rules={{
							required: 'First name is required.',
						}}
					/>
					<ControlledInput
						control={control}
						label="Last Name"
						inputProps={{
							maxLength: 256,
						}}
						name={setFormPath('lastName')}
						rules={{
							required: 'Last name is required.',
						}}
					/>
				</div>
				<EmailControlledInput
					control={control}
					label="Business Email"
					name={setFormPath('business.email')}
					rules={{
						required: 'Email is required.',
					}}
				/>
				<PhoneControlledInput
					control={control}
					label="Phone"
					name={setFormPath('business.phone')}
					rules={{
						required: 'Phone number is required.',
					}}
				/>
				<WebsiteControlledInput
					control={control}
					label="Business Website (optional)"
					name={setFormPath('business.website')}
				/>
				<BusinessInformationAddress />
			</div>
			<CardFormActionsWithSave
				isValid={isValid}
				onNext={goToNextForm}
				onPrevious={goToPreviousForm}
				onSave={onSave}
			/>
		</div>
	);
};
