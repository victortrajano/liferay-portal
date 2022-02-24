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

import {Formik, useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import {Badge, Button} from '../../../components';
import {ROLE_TYPES} from '../../../utils/constants';
import getInitialInvite from '../../../utils/getInitialInvite';
import Layout from '../Layout';
import Helper from './components/Helper';
import FormInvites from './containers/FormInvites';
import useGraphQL from './hooks/useGraphQL';

const INITIAL_INVITES_COUNT = 3;

const SLA = {
	gold: 'Gold',
	platinum: 'Platinum',
};

const ROLE_NAME_KEY = {
	[ROLE_TYPES.admin.key]: ROLE_TYPES.admin.name,
	[ROLE_TYPES.member.key]: ROLE_TYPES.member.name,
};

const InviteTeamMembersPage = ({handlePage, leftButton}) => {
	const {
		errors,
		setFieldValue,
		setTouched,
		touched,
		values,
	} = useFormikContext();

	const {
		accountAccountRoles,
		koroneikiAccount,
		promiseMutations,
	} = useGraphQL();

	const [baseButtonDisabled, setBaseButtonDisabled] = useState();
	const [hasInitialError, setInitialError] = useState();
	const [accountMemberRole, setAccountMemberRole] = useState();
	const [accountRolesOptions, setAccountRolesOptions] = useState([]);
	const [accountRoles, setAccountRoles] = useState([]);
	const [availableAdminsRoles, setAvailableAdminsRoles] = useState(1);

	const projectHasSLAGoldPlatinum =
		koroneikiAccount?.slaCurrent?.includes(SLA.gold) ||
		koroneikiAccount?.slaCurrent?.includes(SLA.platinum);

	useEffect(() => {
		const isProjectPartner = koroneikiAccount?.partner;

		if (accountAccountRoles.items) {
			const roles = accountAccountRoles.items?.reduce(
				(rolesAccumulator, role) => {
					let isValidRole = true;

					if (!projectHasSLAGoldPlatinum) {
						isValidRole = role.name !== ROLE_TYPES.requestor.key;
					}

					if (!isProjectPartner) {
						isValidRole =
							role.name !== ROLE_TYPES.partnerManager.key &&
							role.name !== ROLE_TYPES.partnerMember.key;
					}

					if (isValidRole) {
						const roleName = ROLE_NAME_KEY[role.name] || role.name;

						rolesAccumulator.push({
							...role,
							name: roleName,
						});
					}

					return rolesAccumulator;
				},
				[]
			);

			const accountMember = roles?.find(
				({name}) => name === ROLE_TYPES.member.name
			);

			setAccountMemberRole(accountMember);

			setFieldValue(
				'invites[0].role',
				koroneikiAccount?.maxRequestors < 2
					? accountMember
					: roles?.find(
							({name}) =>
								name === ROLE_TYPES.requestor.name ||
								name === ROLE_TYPES.admin.name
					  )
			);

			for (let i = 1; i < INITIAL_INVITES_COUNT; i++) {
				setFieldValue(`invites[${i}].role`, accountMember);
			}

			setAccountRoles(roles);
			setAccountRolesOptions(
				roles?.map((role) => ({
					disabled: false,
					label: role.name,
					value: role.id,
				}))
			);
		}
	}, [
		accountAccountRoles.items,
		koroneikiAccount.maxRequestors,
		koroneikiAccount.partner,
		projectHasSLAGoldPlatinum,
		setFieldValue,
	]);

	useEffect(() => {
		if (values && accountRoles?.length) {
			const totalAdmins = values.invites?.reduce(
				(totalInvites, currentInvite) => {
					if (
						currentInvite.role.name === ROLE_TYPES.requestor.name ||
						currentInvite.role.name === ROLE_TYPES.admin.name
					) {
						return ++totalInvites;
					}

					return totalInvites;
				},
				1
			);

			const remainingAdmins =
				koroneikiAccount?.maxRequestors - totalAdmins;

			if (remainingAdmins < 1) {
				setAccountRolesOptions((previousAccountRoles) =>
					previousAccountRoles.map((previousAccountRole) => ({
						...previousAccountRole,
						disabled:
							previousAccountRole.label ===
								ROLE_TYPES.requestor.name ||
							previousAccountRole.label === ROLE_TYPES.admin.name,
					}))
				);
			}

			setAvailableAdminsRoles(remainingAdmins);
		}
	}, [values, koroneikiAccount.maxRequestors, accountRoles]);

	useEffect(() => {
		const filledEmails =
			values?.invites?.filter(({email}) => email)?.length || 0;
		const totalEmails = values?.invites?.length || 0;
		const failedEmails =
			errors?.invites?.filter((email) => email)?.length || 0;

		if (filledEmails) {
			const sucessfullyEmails = totalEmails - failedEmails;

			setInitialError(false);
			setBaseButtonDisabled(sucessfullyEmails !== totalEmails);
		} else if (touched['invites']?.some((field) => field?.email)) {
			setInitialError(true);
			setBaseButtonDisabled(true);
		}
	}, [touched, values, errors]);

	const handleSubmit = async () => {
		const filledEmails = values?.invites?.filter(({email}) => email) || [];

		if (filledEmails.length) {
			await Promise.all(
				filledEmails.map(({email, role}) =>
					promiseMutations(role, email)
				)
			);

			handlePage();
		} else {
			setInitialError(true);
			setBaseButtonDisabled(true);
			setTouched({
				invites: [{email: true}],
			});
		}
	};

	const handleSelectOnChange = (roleId, index) =>
		setFieldValue(
			`invites[${index}].role`,
			accountRoles?.find(({id}) => id === +roleId)
		);

	const handleAddMoreMembers = () => {
		setBaseButtonDisabled(false);
		setFieldValue('invites', [
			...values?.invites,
			getInitialInvite(accountMemberRole),
		]);
	};

	if (koroneikiAccount.loading || accountAccountRoles.loading) {
		return <>oi</>;
	}

	return (
		<Layout
			footerProps={{
				leftButton: (
					<Button borderless onClick={handlePage}>
						{leftButton}
					</Button>
				),
				middleButton: (
					<Button
						disabled={baseButtonDisabled}
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
			{hasInitialError && (
				<Badge>
					<span className="pl-1">
						Add at least one user&apos;s email to send an
						invitation.
					</span>
				</Badge>
			)}

			<FormInvites
				accountRolesOptions={accountRolesOptions}
				handleAddMoreMembers={handleAddMoreMembers}
				handleSelectOnChange={handleSelectOnChange}
				hasInitialError={hasInitialError}
				invites={values?.invites}
				koroneikiAccount={koroneikiAccount}
			></FormInvites>

			<Helper
				availableAdminsRoles={availableAdminsRoles}
				koroneikiAccount={koroneikiAccount}
			></Helper>
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
			validateOnChange
		>
			<InviteTeamMembersPage {...props} />
		</Formik>
	);
};

export default InviteTeamMembersForm;
