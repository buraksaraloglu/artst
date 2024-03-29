import prisma from "@/lib/prisma";
import { Background } from "@artst/ui";
import { constructMetadata } from "@artst/utils";
import PlaceholderContent from "./placeholder";

export async function generateMetadata({ params }: { params: { domain: string } }) {
	const title = `${params.domain.toUpperCase()} - A ${
		process.env.NEXT_PUBLIC_APP_NAME
	} Custom Domain`;
	const description = `${params.domain.toUpperCase()} is a custom domain on ${
		process.env.NEXT_PUBLIC_APP_NAME
	} - an artist management tool for modern marketing teams to create, share, and track short links.`;

	return constructMetadata({
		title,
		description,
	});
}

export async function generateStaticParams() {
	const domains =
		process.env.VERCEL_ENV === "production"
			? await prisma.domain.findMany({
					where: {
						verified: true,
						target: null,
						NOT: {
							slug: "artst.io",
						},
					},
					select: {
						slug: true,
					},
			  })
			: [];
	return domains.map(({ slug: domain }) => ({
		domain,
	}));
}

export default function CustomDomainPage() {
	return (
		<>
			<Background />
			<PlaceholderContent />
		</>
	);
}
