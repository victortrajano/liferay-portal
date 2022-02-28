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
import {useEffect, useState} from 'react';
import useDebounce from '../../../../common/hooks/useDebounce';
import ProjectCard from '../../components/ProjectCard';
import SearchProject from '../../components/SearchProject';
import HomeSkeleton from './Skeleton';
import useGraphQL from './hooks/useGraphQL';

const THRESHOLD_COUNT = 4;

const Home = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [lastSearchTerm, setLastSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const [
		koroneikiAccounts,
		{initialTotalCount, refetch, totalCount},
	] = useGraphQL();

	const hasManyAccounts = initialTotalCount > THRESHOLD_COUNT;

	useEffect(() => {
		if (debouncedSearchTerm !== lastSearchTerm) {
			refetch({
				filter:
					debouncedSearchTerm &&
					`contains(name, '${debouncedSearchTerm}')`,
			});

			setLastSearchTerm(debouncedSearchTerm);
		}
	}, [refetch, debouncedSearchTerm, lastSearchTerm]);

	return (
		<div>
			<div
				className={classNames({
					'd-flex flex-column align-items-center': hasManyAccounts,
					'ml-3': !hasManyAccounts,
				})}
			>
				{hasManyAccounts && (
					<div className="align-items-center cp-search-projects d-flex justify-content-between mb-4">
						<SearchProject
							onChange={setSearchTerm}
							value={debouncedSearchTerm}
						/>

						<h5 className="m-0 text-neutral-7">
							{debouncedSearchTerm && !koroneikiAccounts.loading
								? `${totalCount} result${
										totalCount === 1 ? '' : 's'
								  }`
								: `${initialTotalCount} project${
										initialTotalCount === 1 ? '' : 's'
								  }`}
						</h5>
					</div>
				)}

				{!koroneikiAccounts.loading ? (
					<div className="cp-wrap-projects overflow-auto w-100">
						<div
							className={classNames('d-flex flex-wrap', {
								'cp-home-projects px-5 cp-project-cards-container': !hasManyAccounts,
								'cp-home-projects-sm pt-2 cp-project-cards-container-sm mx-auto': hasManyAccounts,
							})}
						>
							{totalCount ? (
								<>
									{koroneikiAccounts.items?.map(
										(koroneikiAccount, index) => (
											<ProjectCard
												isSmall={hasManyAccounts}
												key={index}
												{...koroneikiAccount}
											/>
										)
									)}
								</>
							) : (
								<p className="mx-auto">
									No projects match these criteria.
								</p>
							)}
						</div>
					</div>
				) : (
					<>Loading...</>
				)}
			</div>
		</div>
	);
};

Home.Skeleton = HomeSkeleton;

export default Home;
