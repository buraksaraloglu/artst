import spotify from "@/lib/spotify";
import prisma from "@/lib/prisma";

async function seedMarkets() {
	const { markets } = await spotify.markets.getAvailableMarkets();
	if (!markets.length) return;
	const marketsInput = markets.map((market) => ({
		code: market,
		name: market,
	}));

	try {
		const created = await prisma.spotifyMarket.createMany({
			data: marketsInput,
			skipDuplicates: true,
		});
		if (created.count === 0 && markets.length > 0) {
			console.log("✅ Markets already seeded");
			return;
		}
		console.log(`✅ Seeded ${created.count} markets`);
		return created;
	} catch (error) {
		if (error.code === "P2002") {
			console.log("✅ Markets already seeded");
			return;
		}
		console.log("error", error);
	}
}

async function seedGenres() {
	const { genres } = await spotify.recommendations.genreSeeds();
	if (!genres.length) return;
	const genresInput = genres.map((genre) => ({
		seed: genre,
		name: genre,
	}));

	try {
		const created = await prisma.spotifyGenreSeeds.createMany({
			data: genresInput,
			skipDuplicates: true,
		});
		if (created.count === 0 && genres.length > 0) {
			console.log("✅ Genres already seeded");
			return;
		}
		console.log(`✅ Seeded ${created.count} genres`);
		return created;
	} catch (error) {
		if (error.code === "P2002") {
			console.log("✅ Genres already seeded");
			return;
		}
		console.log("error", error);
	}
}

function main() {
	return Promise.all([seedMarkets(), seedGenres()]);
}

main();
