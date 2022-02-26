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

import {FieldArray, Formik, useFormikContext} from 'formik';
import {useEffect, useMemo} from 'react';
import {Badge, Button} from '../../../components';
import {ROLE_TYPES} from '../../../utils/constants';
import getInitialInvite from '../../../utils/getInitialInvite';
import Layout from '../Layout';
import Helper from './components/Helper';
import FormInvites from './containers/FormInvites';
import useAccountRolesOptions from './hooks/useAccountRolesOptions';
import useGraphQL from './hooks/useGraphQL';
import getTotalAdmins from './utils/getTotalAdmins';
import getValidAccountRoles from './utils/getValidAccountRoles';

const INITIAL_INVITES_COUNT = 3;

const InviteTeamMembers = ({handlePage, leftButton}) => {
	const {
		isValid,
		setErrors,
		setFieldValue,
		setTouched,
		values,
	} = useFormikContext();

	const {
		accountAccountRoles,
		koroneikiAccount,
		promiseMutations,
	} = useGraphQL();

	const accountRoles = useMemo(
		() =>
			getValidAccountRoles(
				accountAccountRoles.items,
				koroneikiAccount?.slaCurrent,
				koroneikiAccount?.partner
			),
		[
			accountAccountRoles.items,
			koroneikiAccount.partner,
			koroneikiAccount.slaCurrent,
		]
	);

	const availableAdminsRoles = useMemo(() => {
		const totalAdmins = getTotalAdmins(values.invites);

		return koroneikiAccount?.maxRequestors - totalAdmins;
	}, [koroneikiAccount?.maxRequestors, values.invites]);

	const accountRolesOptions = useAccountRolesOptions(
		accountRoles,
		availableAdminsRoles
	);
	const accountMember = accountRoles?.find(
		({name}) => name === ROLE_TYPES.member.name
	);

	const filledEmails = useMemo(
		() => values.invites?.filter(({email}) => !!email) || [],
		[values.invites]
	);
	const showFormError = !filledEmails?.length && !isValid;

	useEffect(() => {
		if (accountRoles) {
			const accountRequestorOrAdmin = accountRoles?.find(
				({name}) =>
					name === ROLE_TYPES.requestor.name ||
					name === ROLE_TYPES.admin.name
			);

			setFieldValue(
				'invites[0].role',
				koroneikiAccount?.maxRequestors < 2
					? accountMember
					: accountRequestorOrAdmin
			);

			for (let i = 1; i < INITIAL_INVITES_COUNT; i++) {
				setFieldValue(`invites[${i}].role`, accountMember);
			}
		}
	}, [
		accountMember,
		koroneikiAccount.maxRequestors,
		accountRoles,
		setFieldValue,
	]);

	const invalidateFirstInput = () => {
		setTouched(
			{
				invites: [{email: true}],
			},
			false
		);
		setErrors({
			invites: [{email: true}],
		});
	};

	const handleSubmit = async () => {
		if (filledEmails.length) {
			await Promise.all(
				filledEmails.map(({email, role}) =>
					promiseMutations(role, email)
				)
			);

			handlePage(koroneikiAccount);
		}
		else {
			invalidateFirstInput();
		}
	};

	const handleSelectOnChange = (roleId, index) =>
		setFieldValue(
			`invites[${index}].role`,
			accountRoles?.find(({id}) => id === +roleId)
		);

	if (koroneikiAccount.loading || accountAccountRoles.loading) {
		return <>Loading...</>;
	}

	return (
		<Layout
			footerProps={{
				leftButton: (
					<Button
						borderless
						onClick={() => handlePage(koroneikiAccount)}
					>
						{leftButton}
					</Button>
				),
				middleButton: (
					<Button
						disabled={!isValid}
						displayType="primary"
						onClick={handleSubmit}
					>
						Send Invitations
					</Button>
				),
			}}
			headerProps={{
				helper:
					'Team members will receive an email invitation to access this project on Customer Portal.',
				title: 'Invite Your Team Members',
			}}
		>
			<FieldArray
				name="invites"
				render={({push}) => (
					<>
						{showFormError && (
							<Badge>
								<span className="pl-1">
									Add at least one user&apos;s email to send
									an invitation.
								</span>
							</Badge>
						)}

						<FormInvites
							accountRolesOptions={accountRolesOptions}
							handleAddMoreMembers={() =>
								push(getInitialInvite(accountMember))
							}
							handleSelectOnChange={handleSelectOnChange}
							invites={values?.invites}
							koroneikiAccount={koroneikiAccount}
						></FormInvites>

						<Helper
							availableAdminsRoles={availableAdminsRoles}
							koroneikiAccount={koroneikiAccount}
						></Helper>
					</>
				)}
			/>
		</Layout>
	);
};

const InviteTeamMembersForm = (props) => {
	return (
		<Formik
			initialValues={{
				invites: [...new Array(INITIAL_INVITES_COUNT)].map(() =>
					getInitialInvite()
				),
			}}
		>
			<InviteTeamMembers {...props} />
		</Formik>
	);
};

export default InviteTeamMembersForm;
