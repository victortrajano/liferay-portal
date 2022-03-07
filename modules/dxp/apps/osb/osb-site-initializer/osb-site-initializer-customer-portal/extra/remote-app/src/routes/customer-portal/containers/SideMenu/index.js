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

import classNames from 'classnames';
import {useEffect, useMemo, useRef, useState} from 'react';
import Button from '../../../../common/components/Button';
import {useGetAccountSubscriptionGroupsByAccountKey} from '../../../../common/services/liferay/graphql/account-subscription-groups';
import {MENU_TYPES} from '../../utils/constants';
import getKebabCase from '../../utils/getKebabCase';
import SideMenuSkeleton from './Skeleton';
import MenuItem from './components/MenuItem';

const ACTIVATION_PATH = 'activation';

const SideMenu = () => {
	const [isOpenedProductsMenu, setIsOpenedProductsMenu] = useState(false);
	const [menuItemActiveStatus, setMenuItemActiveStatus] = useState([]);

	const {
		accountSubscriptionGroups,
		loading,
	} = useGetAccountSubscriptionGroupsByAccountKey();

	const productActivationMenuRef = useRef();

	const hasSomeMenuItemActive = useMemo(
		() => menuItemActiveStatus.some((menuItemActive) => !!menuItemActive),
		[menuItemActiveStatus]
	);

	useEffect(() => {
		const expandedHeightProducts = isOpenedProductsMenu
			? accountSubscriptionGroups?.length * 48
			: 0;

		if (productActivationMenuRef?.current) {
			productActivationMenuRef.current.style.maxHeight = `${expandedHeightProducts}px`;
		}
	}, [
		accountSubscriptionGroups?.length,
		hasSomeMenuItemActive,
		isOpenedProductsMenu,
	]);

	const accountSubscriptionGroupsMenuItem = useMemo(
		() =>
			accountSubscriptionGroups?.map(({name}, index) => {
				const redirectPage = getKebabCase(name);

				const menuUpdateStatus = (isActive) =>
					setMenuItemActiveStatus((previousMenuItemActiveStatus) => {
						const menuItemStatus = [
							...previousMenuItemActiveStatus,
						];
						menuItemStatus[index] = isActive;

						return menuItemStatus;
					});

				return (
					<MenuItem
						iconKey={redirectPage.split('-')[0]}
						key={`${name}-${index}`}
						setActive={menuUpdateStatus}
						to={`${ACTIVATION_PATH}/${redirectPage}`}
					>
						{name}
					</MenuItem>
				);
			}),
		[accountSubscriptionGroups]
	);

	if (loading.accountSubscriptionGroups || loading.koroneikiAccount) {
		return <>Loading...</>;
	}

	return (
		<div className="bg-neutral-1 cp-side-menu mr-4 pl-4 pt-4">
			<ul className="list-unstyled mr-2">
				<MenuItem to="">{MENU_TYPES.overview}</MenuItem>

				<li>
					<Button
						appendIcon="angle-right-small"
						appendIconClassName="ml-auto"
						className={classNames(
							'align-items-center btn-borderless d-flex px-3 py-2 rounded text-neutral-10 w-100',
							{
								'cp-product-activation-active': isOpenedProductsMenu,
								'cp-products-list-active': hasSomeMenuItemActive,
							}
						)}
						onClick={() =>
							setIsOpenedProductsMenu(
								(previousIsOpenedProductsMenu) =>
									!previousIsOpenedProductsMenu
							)
						}
					>
						{MENU_TYPES.productActivation}
					</Button>

					<ul
						className={classNames(
							'cp-products-list list-unstyled ml-3 overflow-hidden mb-1',
							{
								'cp-products-list-active': isOpenedProductsMenu,
							}
						)}
						ref={productActivationMenuRef}
					>
						{accountSubscriptionGroupsMenuItem}
					</ul>
				</li>

				<MenuItem to={getKebabCase(MENU_TYPES.teamMembers)}>
					{MENU_TYPES.teamMembers}
				</MenuItem>
			</ul>
		</div>
	);
};

SideMenu.Skeleton = SideMenuSkeleton;
export default SideMenu;
