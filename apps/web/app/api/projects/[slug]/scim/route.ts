import { withAuth } from "@/lib/auth";
import jackson from "@/lib/jackson";
import { NextResponse } from "next/server";

// GET /api/projects/[slug]/scim – get all SCIM directories
export const GET = withAuth(async ({ project }) => {
	const { directorySyncController } = await jackson();

	const { data, error } = await directorySyncController.directories.getByTenantAndProduct(
		project.id,
		"Artst",
	);
	if (error) {
		return new Response(error.message, { status: 500 });
	}

	return NextResponse.json({
		directories: data,
	});
});

// POST /api/projects/[slug]/scim – create a new SCIM directory
export const POST = withAuth(
	async ({ req, project }) => {
		const { provider = "okta-scim-v2", currentDirectoryId } = await req.json();

		const { directorySyncController } = await jackson();

		const [data, _] = await Promise.all([
			directorySyncController.directories.create({
				name: "Artst SCIM Directory",
				tenant: project.id,
				product: "Artst",
				type: provider,
			}),
			currentDirectoryId && directorySyncController.directories.delete(currentDirectoryId),
		]);

		return NextResponse.json(data);
	},
	{
		requiredRole: ["owner"],
		requiredPlan: ["enterprise"],
	},
);

// DELETE /api/projects/[slug]/scim – delete a SCIM directory

export const DELETE = withAuth(
	async ({ searchParams }) => {
		const { directoryId } = searchParams;

		if (!directoryId) {
			return new Response(`Missing SCIM directory ID`, { status: 400 });
		}

		const { directorySyncController } = await jackson();

		const response = await directorySyncController.directories.delete(directoryId);

		return NextResponse.json(response);
	},
	{
		requiredRole: ["owner"],
		requiredPlan: ["enterprise"],
	},
);
