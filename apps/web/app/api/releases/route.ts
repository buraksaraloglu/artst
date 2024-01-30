import { getReleasesForProject, processRelease } from "@/lib/api/releases";
import { withAuth } from "@/lib/auth";
import { qstash } from "@/lib/cron";
import { ratelimit } from "@/lib/upstash";
import { APP_DOMAIN_WITH_NGROK, LOCALHOST_IP } from "@artst/utils";
import { NextResponse } from "next/server";

// GET /api/releases – get all user links
export const GET = withAuth(async ({ headers, searchParams, project }) => {
	const { domain, tagId, search, sort, page, userId, showArchived } = searchParams as {
		domain?: string;
		tagId?: string;
		search?: string;
		sort?: "createdAt" | "clicks" | "lastClicked";
		page?: string;
		userId?: string;
		showArchived?: string;
	};
	const response = await getReleasesForProject({
		projectId: project.id,
		// domain,
		// tagId,
		search,
		sort,
		page,
		userId,
		showArchived: showArchived === "true" ? true : false,
	});
	return NextResponse.json(response, {
		headers,
	});
});

// POST /api/links – create a new link
export const POST = withAuth(
	async ({ req, headers, session, project }) => {
		let body;
		try {
			body = await req.json();
		} catch (error) {
			return new Response("Missing or invalid body.", { status: 400, headers });
		}
		console.log(body);

		if (!session) {
			const ip = req.headers.get("x-forwarded-for") || LOCALHOST_IP;
			const { success } = await ratelimit(3, "1 d").limit(ip);

			if (!success) {
				return new Response(
					"Rate limited – you can only create up to 3 releases per day without an account.",
					{ status: 429 },
				);
			}
		}

		// const { release, error, status } = await processRelease({
		// 	payload: body,
		// 	project,
		// 	session,
		// });

		// console.log({ release, error, status });
		// if (error) {
		// 	return new Response(error, { status, headers });
		// }

		// const response = await addRelease(release);

		// if (response === null) {
		// 	return new Response("Duplicate key: This release already exists.", {
		// 		status: 409,
		// 		headers,
		// 	});
		// }

		// await qstash.publishJSON({
		// 	url: `${APP_DOMAIN_WITH_NGROK}/api/cron/releases/event`,
		// 	body: {
		// 		linkId: response.id,
		// 		type: "create",
		// 	},
		// });

		return NextResponse.json(null, { headers });
	},
	{
		needNotExceededLinks: true,
		allowAnonymous: true,
	},
);
