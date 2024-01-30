"use client";

import useReleases from "@/lib/swr/use-releases";
// import useReleasesCount from "@/lib/swr/use-releases-count";
import { MaxWidthWrapper } from "@artst/ui";
import { Suspense } from "react";
import { useLinkFiltersModal } from "../modals/link-filters-modal";
import NoReleasesPlaceholder from "./no-releases-placeholder";
import ReleaseCardPlaceholder from "./release-card-placeholder";
import ReleaseCard from "./release-card";

export default function ReleasesContainer({
	AddEditReleaseButton,
}: {
	AddEditReleaseButton: () => JSX.Element;
}) {
	const { releases, isValidating } = useReleases();
	// const { data: count } = useReleasesCount();
	// const { ReleaseFiltersButton, ReleaseFiltersModal } = useReleaseFiltersModal();

	return (
		<>
			{/* <LinkFiltersModal /> */}
			<MaxWidthWrapper className="mt-4 md:mt-6">
				{/* <div className="my-5 flex h-10 w-full justify-center lg:justify-end"> */}
				{/* <ReleaseFiltersButton /> */}
				{/* <Suspense>
						<LinkSort />
					</Suspense> */}
				{/* </div> */}
				<div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
					{/* <div className="scrollbar-hide sticky top-32 col-span-2 hidden max-h-[calc(100vh-150px)] self-start overflow-auto rounded-lg border border-gray-100 bg-white shadow lg:block">
						<Suspense>
							<LinkFilters />
						</Suspense>
					</div> */}
					<div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-full">
						<ul className="grid min-h-[66.5vh] auto-rows-min gap-3">
							{releases && !isValidating ? (
								releases.length > 0 ? (
									releases.map((props) => (
										<Suspense key={props.id} fallback={<ReleaseCardPlaceholder />}>
											<ReleaseCard {...props} />
										</Suspense>
									))
								) : (
									<NoReleasesPlaceholder />
								)
							) : (
								Array.from({ length: 10 }).map((_, i) => <ReleaseCardPlaceholder key={i} />)
							)}
						</ul>
						{/* {count && count > 0 ? (
							<Suspense>
								<LinkPagination />
							</Suspense>
						) : null} */}
					</div>
				</div>
			</MaxWidthWrapper>
		</>
	);
}
