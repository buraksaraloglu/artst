import { getDomainWithoutWWW } from "@artst/utils";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initiate Redis instance by connecting to REST URL
export const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL || "",
	token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export const ratelimitRedis = new Redis({
	url: process.env.RATELIMIT_UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL || "",
	token:
		process.env.RATELIMIT_UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Create a new ratelimiter, that allows 10 requests per 10 seconds by default
export const ratelimit = (
	requests: number = 10,
	seconds: `${number} ms` | `${number} s` | `${number} m` | `${number} h` | `${number} d` = "10 s",
) => {
	return new Ratelimit({
		redis: ratelimitRedis,
		limiter: Ratelimit.slidingWindow(requests, seconds),
		analytics: true,
		prefix: "artst",
	});
};

/**
 * Recording metatags that were generated via `/api/edge/metatags`
 * If there's an error, it will be logged to a separate redis list for debugging
 **/
export async function recordMetatags(url: string, error: boolean) {
	if (url === "https://github.com/artstio/artst") {
		// don't log metatag generation for default URL
		return null;
	}

	if (error) {
		return await ratelimitRedis.zincrby("metatags-error-zset", 1, url);
	}

	const domain = getDomainWithoutWWW(url);
	return await ratelimitRedis.zincrby("metatags-zset", 1, domain);
}
