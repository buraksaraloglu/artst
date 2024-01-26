import { withAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ARTST_DOMAINS, LEGAL_USER_ID } from "@artst/utils";
import { NextResponse } from "next/server";

// GET /api/links – get all user links
export const GET = withAdmin(async ({ searchParams }) => {
	const {
		domain,
		tagId,
		search,
		sort = "createdAt",
		page,
		userId,
	} = searchParams as {
		domain?: string;
		tagId?: string;
		search?: string;
		sort?: "createdAt" | "clicks" | "lastClicked";
		page?: string;
		userId?: string;
	};
	const response = await prisma.link.findMany({
		where: {
			...(domain
				? { domain }
				: {
						domain: {
							in: ARTST_DOMAINS.map((domain) => domain.slug),
						},
				  }),
			...(search && {
				OR: [
					{
						key: { contains: search },
					},
					{
						url: { contains: search },
					},
				],
			}),
			userId: {
				not: LEGAL_USER_ID,
			},
		},
		include: {
			user: true,
		},
		orderBy: {
			[sort]: "desc",
		},
		take: 100,
		...(page && {
			skip: (parseInt(page) - 1) * 100,
		}),
	});

	return NextResponse.json(response);
});
