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

import {gql, useMutation} from '@apollo/client';

const CREATE_TEAM_MEMBER_INVITATION = gql`
	mutation createTeamMemberInvitation(
		$scopeKey: String!
		$teamMemberInvitation: InputC_TeamMemberInvitation!
	) {
		c {
			createTeamMemberInvitation(
				scopeKey: $scopeKey
				TeamMemberInvitation: $teamMemberInvitation
			) {
				teamMemberInvitationId
				accountKey
				email
				role
			}
		}
	}
`;

export function useCreateTeamMemberInvitation() {
	return useMutation(CREATE_TEAM_MEMBER_INVITATION);
}
