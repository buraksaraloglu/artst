import { getStats } from "@/lib/stats";
import "dotenv-flow/config";
import * as fs from "fs";
import * as Papa from "papaparse";
import { linkConstructor } from "./utils";

const domain = "xxx";

async function main() {
	const topLinks = await getStats({
		domain,
		endpoint: "top_links",
	});

	const processedLinks = topLinks.map(({ domain, key, clicks }) => ({
		link: linkConstructor({
			domain,
			key,
		}),
		clicks,
	}));

	fs.writeFileSync("xxx.csv", Papa.unparse(processedLinks));
}

main();
