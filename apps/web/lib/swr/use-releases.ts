import { useRouterStuff } from "@artst/ui";
import { fetcher } from "@artst/utils";
import { type Release as ReleaseProps } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { UserProps } from "../types";

export default function useReleases() {
	const { slug } = useParams() as { slug?: string };
	const { getQueryString } = useRouterStuff();

	const [admin, setAdmin] = useState(false);
	useEffect(() => {
		if (window.location.host.startsWith("admin.")) {
			setAdmin(true);
		}
	}, []);

	const { data: releases, isValidating } = useSWR<
		(ReleaseProps & {
			user: UserProps;
		})[]
	>(
		slug
			? `/api/releases${getQueryString(
					{ projectSlug: slug },
					{
						ignore: ["import", "upgrade"],
					},
			  )}`
			: admin
			? `/api/admin/releases${getQueryString()}`
			: null,
		fetcher,
		{
			dedupingInterval: 20000,
			revalidateOnFocus: false,
			keepPreviousData: true,
		},
	);

	return {
		releases,
		isValidating,
	};
}
