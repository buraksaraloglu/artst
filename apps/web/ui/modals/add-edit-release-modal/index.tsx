"use client";

import useDomains from "@/lib/swr/use-domains";
import useProject from "@/lib/swr/use-project";
import { InputWithLabel } from "@artst/ui";
import { BlurImage } from "@/ui/shared/blur-image";
import { AlertCircleFill, Lock, Random, X } from "@/ui/shared/icons";
import { Button, LoadingCircle, Logo, Modal, TooltipContent, useRouterStuff } from "@artst/ui";
import {
	DEFAULT_RELEASE_PROPS,
	GOOGLE_FAVICON_URL,
	cn,
	deepEqual,
	getApexDomain,
	getDomainWithoutWWW,
	getUrlWithoutUTMParams,
	isValidUrl,
	linkConstructor,
	truncate,
} from "@artst/utils";
import { type Release as ReleaseProps } from "@prisma/client";
import { useParams, usePathname, useRouter } from "next/navigation";
import punycode from "punycode/";
import {
	Dispatch,
	SetStateAction,
	UIEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { useDebounce } from "use-debounce";
import AndroidSection from "./android-section";
import CommentsSection from "./comments-section";
import ExpirationSection from "./expiration-section";
import GeoSection from "./geo-section";
import IOSSection from "./ios-section";
import OGSection from "./og-section";
import PasswordSection from "./password-section";
import Preview from "./preview";
import RewriteSection from "./rewrite-section";
import TagsSection from "./tags-section";
import UTMSection from "./utm-section";

/**
 * Create a new release
 * Steps:
 * 1. Paste a URL
 * 2. URL should be a valid spotify track or album link
 * 3. Fetch the spotify data
 * 4. if data exists, populate the form
 * 5. if data doesn't exist, show pre-release form
 */

function validateSpotifyUrl(url: string) {
	if (url.startsWith("spotify:")) {
		const spotifyUriRegex = /^spotify:(track|album):[a-zA-Z0-9]+$/;
		return spotifyUriRegex.test(url);
	}
	const spotifyUrlRegex = /^https?:\/\/open\.spotify\.com\/(track|album)\/[a-zA-Z0-9]+$/;

	// clean url from search params and trailing slashes
	const cleanUrl = url.replace(/\?.*$/, "").replace(/\/$/, "");
	return spotifyUrlRegex.test(cleanUrl);
}

async function fetchSpotifyData(url: string) {
	const res = await fetch(`/api/spotify?url=${url}`);
	const data = await res.json();
	return data;
}

async function fetchSpotifyDataFromUri(uri: string) {}

function AddEditReleaseModal({
	showAddEditReleaseModal,
	setShowAddEditReleaseModal,
	props,
	duplicateProps,
	homepageDemo,
}: {
	showAddEditReleaseModal: boolean;
	setShowAddEditReleaseModal: Dispatch<SetStateAction<boolean>>;
	props?: ReleaseProps;
	duplicateProps?: ReleaseProps;
	homepageDemo?: boolean;
}) {
	const params = useParams() as { slug?: string };
	const { slug } = params;
	const router = useRouter();
	const pathname = usePathname();

	const [keyError, setKeyError] = useState<string | null>(null);
	const [urlError, setUrlError] = useState<string | null>(null);
	const [generatingKey, setGeneratingKey] = useState(false);
	const [saving, setSaving] = useState(false);

	const [data, setData] = useState<ReleaseProps>(
		props ||
			duplicateProps || {
				...DEFAULT_RELEASE_PROPS,
				archived: false,
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: "",
				spotifyUrl: "",
			},
	);

	const { id, title, releaseDate, releaseAudio, projectId, coverImage, spotifyUrl } = data;
	const [debouncedSpotifyUrl] = useDebounce(spotifyUrl, 500);

	useEffect(() => {
		/**
		 * Only check if spotifyUrl exists if:
		 * - modal is open
		 * - spotifyUrl is not empty
		 * - spotifyUrl is not the same as the existing spotifyUrl
		 **/
		if (
			showAddEditReleaseModal &&
			debouncedSpotifyUrl &&
			debouncedSpotifyUrl.length > 0 &&
			debouncedSpotifyUrl !== props?.spotifyUrl
		) {
			if (!validateSpotifyUrl(debouncedSpotifyUrl)) {
				setUrlError(
					`Invalid Spotify URL.
					Correct format: spotify:track:6bdlDtybZYnm6hZtiEWeUs or https://open.spotify.com/track/6bdlDtybZYnm6hZtiEWeUs`,
				);
				return;
			} else {
				setUrlError(null);
			}
			// fetch(`/api/releases/exists?domain=${domain}&key=${debouncedKey}&projectSlug=${slug}`).then(
			// 	async (res) => {
			// 		if (res.status === 200) {
			// 			const exists = await res.json();
			// 			setKeyError(exists ? "Duplicate key: This short link already exists." : null);
			// 		}
			// 	},
			// );
			console.log("fetching spotify url", spotifyUrl);
		}
	}, [debouncedSpotifyUrl, props?.spotifyUrl, showAddEditReleaseModal]);

	// const generateRandomKey = useCallback(async () => {
	// 	setKeyError(null);
	// 	setGeneratingKey(true);
	// 	const res = await fetch(`/api/links/random?domain=${domain}&projectSlug=${slug}`);
	// 	const key = await res.json();
	// 	setData((prev) => ({ ...prev, key }));
	// 	setGeneratingKey(false);
	// }, [domain, slug]);

	// useEffect(() => {
	// 	// when someone pastes a URL
	// 	if (showAddEditReleaseModal && url.length > 0) {
	// 		// if it's a new link and there are matching default domains, set it as the domain
	// 		if (!props && defaultDomains) {
	// 			const urlDomain = getDomainWithoutWWW(url) || "";
	// 			const defaultDomain = defaultDomains.find(({ allowedHostnames }) =>
	// 				allowedHostnames.includes(urlDomain),
	// 			);
	// 			if (defaultDomain) {
	// 				setData((prev) => ({ ...prev, domain: defaultDomain.slug }));
	// 			}
	// 		}

	// 		// if there's no key, generate a random key
	// 		if (!key) {
	// 			generateRandomKey();
	// 		}
	// 	}
	// }, [showAddEditReleaseModal, url]);

	// const [generatingMetatags, setGeneratingMetatags] = useState(props ? true : false);
	// const [debouncedUrl] = useDebounce(getUrlWithoutUTMParams(url), 500);
	// useEffect(() => {
	// 	// if there's a password, no need to generate metatags
	// 	if (password) {
	// 		setGeneratingMetatags(false);
	// 		setData((prev) => ({
	// 			...prev,
	// 			title: "Password Required",
	// 			description: "This link is password protected. Please enter the password to view it.",
	// 			image: "/_static/password-protected.png",
	// 		}));
	// 		return;
	// 	}
	// 	/**
	// 	 * Only generate metatags if:
	// 	 * - modal is open
	// 	 * - custom OG proxy is not enabled
	// 	 * - url is not empty
	// 	 **/
	// 	if (showAddEditReleaseModal && !proxy && debouncedUrl.length > 0) {
	// 		setData((prev) => ({
	// 			...prev,
	// 			title: null,
	// 			description: null,
	// 			image: null,
	// 		}));
	// 		try {
	// 			// if url is valid, continue to generate metatags, else return null
	// 			new URL(debouncedUrl);
	// 			setGeneratingMetatags(true);
	// 			fetch(`/api/edge/metatags?url=${debouncedUrl}`).then(async (res) => {
	// 				if (res.status === 200) {
	// 					const results = await res.json();
	// 					setData((prev) => ({
	// 						...prev,
	// 						...{
	// 							title: truncate(results.title, 120),
	// 							description: truncate(results.description, 240),
	// 							image: results.image,
	// 						},
	// 					}));
	// 				}
	// 				// set timeout to prevent flickering
	// 				setTimeout(() => setGeneratingMetatags(false), 200);
	// 			});
	// 		} catch (e) {
	// 			console.log("not a valid url");
	// 		}
	// 	} else {
	// 		setGeneratingMetatags(false);
	// 	}
	// }, [debouncedUrl, password, showAddEditReleaseModal, proxy]);

	// const logo = useMemo(() => {
	// 	// if the link is password protected, or if it's a new link and there's no URL yet, return the default Artst logo
	// 	// otherwise, get the favicon of the URL
	// 	const url = password || !debouncedUrl ? null : debouncedUrl || props?.url;

	// 	return url ? (
	// 		<BlurImage
	// 			src={`${GOOGLE_FAVICON_URL}${getApexDomain(url)}`}
	// 			alt="Logo"
	// 			className="h-10 w-10 rounded-full"
	// 			width={20}
	// 			height={20}
	// 		/>
	// 	) : (
	// 		<Logo />
	// 	);
	// }, [password, debouncedUrl, props]);

	// const endpoint = useMemo(() => {
	// 	if (props?.key) {
	// 		return {
	// 			method: "PUT",
	// 			url: `/api/links/${props.id}?projectSlug=${slug}`,
	// 		};
	// 	} else {
	// 		return {
	// 			method: "POST",
	// 			url: `/api/links?projectSlug=${slug}`,
	// 		};
	// 	}
	// }, [props, slug, domain]);

	const [atBottom, setAtBottom] = useState(false);
	const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
		const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
		if (Math.abs(scrollHeight - scrollTop - clientHeight) < 5) {
			setAtBottom(true);
		} else {
			setAtBottom(false);
		}
	}, []);

	const saveDisabled = useMemo(() => {
		/*
      Disable save if:
      - modal is not open
      - saving is in progress
      - key is invalid
      - url is invalid
      - metatags is being generated
      - for an existing link, there's no changes
    */
		// if (
		// 	!showAddEditReleaseModal ||
		// 	saving ||
		// 	keyError ||
		// 	urlError ||
		// 	(props &&
		// 		Object.entries(props).every(([key, value]) => {
		// 			// If the key is "title" or "description" and proxy is not enabled, return true (skip the check)
		// 			if ((key === "title" || key === "description" || key === "image") && !proxy) {
		// 				return true;
		// 			} else if (key === "geo") {
		// 				const equalGeo = deepEqual(props.geo as object, data.geo as object);
		// 				return equalGeo;
		// 			}
		// 			// Otherwise, check for discrepancy in the current key-value pair
		// 			return data[key] === value;
		// 		}))
		// ) {
		// 	return true;
		// } else {
		// 	return false;
		// }
		return true;
	}, [showAddEditReleaseModal, saving, keyError, urlError, props, data]);

	const randomIdx = Math.floor(Math.random() * 100);

	const [lockKey, setLockKey] = useState(true);

	const welcomeFlow = pathname === "/welcome";
	const keyRef = useRef<HTMLInputElement>(null);
	// useEffect(() => {
	// 	if (key && key.endsWith("-copy")) {
	// 		keyRef.current?.select();
	// 	}
	// }, [key]);

	return (
		<Modal
			showModal={showAddEditReleaseModal}
			setShowModal={setShowAddEditReleaseModal}
			className="max-w-screen-md"
			preventDefaultClose={homepageDemo ? false : true}
			{...(welcomeFlow && { onClose: () => router.back() })}
		>
			<div className="scrollbar-hide max-h-[90vh]c grid h-full max-w-full divide-x divide-gray-100 overflow-auto md:overflow-hidden">
				{!welcomeFlow && !homepageDemo && (
					<button
						onClick={() => setShowAddEditReleaseModal(false)}
						className="group absolute right-0 top-0 z-20 m-3 hidden rounded-full p-2 text-gray-500 transition-all duration-75 hover:bg-gray-100 focus:outline-none active:bg-gray-200 md:block"
					>
						<X className="h-5 w-5" />
					</button>
				)}

				<div
					className="scrollbar-hide rounded-l-2xl md:max-h-[90vh] md:overflow-y-auto"
					onScroll={handleScroll}
				>
					<div className="z-10 flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white py-6 px-4 transition-all md:sticky md:top-0 md:px-16">
						{/* {logo} */}
						<h3 className="truncate text-lg font-medium">
							{/* {props
								? `Edit ${linkConstructor({
										key: props.key,
										domain: props.domain ? punycode.toUnicode(props.domain) : undefined,
										pretty: true,
								  })}`
								: "Create a new link"} */}
							Create a new release
						</h3>
					</div>

					<form
					// onSubmit={async (e) => {
					// 	e.preventDefault();
					// 	setSaving(true);
					// 	// @ts-ignore – exclude the extra `user` attribute from `data` object before sending to API
					// 	const { user, ...rest } = data;
					// 	fetch(endpoint.url, {
					// 		method: endpoint.method,
					// 		headers: {
					// 			"Content-Type": "application/json",
					// 		},
					// 		body: JSON.stringify(rest),
					// 	})
					// 		.then(async (res) => {
					// 			if (res.status === 200) {
					// 				await mutate(
					// 					(key) => typeof key === "string" && key.startsWith("/api/links"),
					// 					undefined,
					// 					{ revalidate: true },
					// 				);
					// 				// for welcome page, redirect to links page after adding a link
					// 				if (pathname === "/welcome") {
					// 					router.push("/links");
					// 					setShowAddEditReleaseModal(false);
					// 				}
					// 				// copy shortlink to clipboard when adding a new link
					// 				if (!props) {
					// 					await navigator.clipboard.writeText(
					// 						linkConstructor({
					// 							// remove leading and trailing slashes
					// 							key: data.key.replace(/^\/+|\/+$/g, ""),
					// 							domain,
					// 						}),
					// 					);
					// 					toast.success("Copied shortlink to clipboard!");
					// 				} else {
					// 					toast.success("Successfully updated shortlink!");
					// 				}
					// 				setShowAddEditReleaseModal(false);
					// 			} else {
					// 				const error = await res.text();
					// 				if (error) {
					// 					toast.error(error);
					// 					if (error.toLowerCase().includes("key")) {
					// 						setKeyError(error);
					// 					} else if (error.toLowerCase().includes("url")) {
					// 						setUrlError(error);
					// 					}
					// 				}
					// 			}
					// 			setSaving(false);
					// 		})
					// 		.catch((e) => {
					// 			toast.error(e);
					// 			setSaving(false);
					// 		});
					// }}
					// className="grid gap-6 bg-gray-50 pt-8"
					>
						<div className="grid gap-6 px-4 md:px-16">
							<div className="py-4">
								<span className="break-all text-sm font-medium text-gray-700">
									https://open.spotify.com/album/33ENvc7ldlU7sZP8nSSM9G?si=w8K7MdtVTVyG612-RJvlywc
								</span>
								<InputWithLabel
									label="Spotify URL"
									name="spotifyUrl"
									id={`url-${randomIdx}`}
									placeholder="spotify:album:6bdlDtybZYnm6hZtiEWeUs or https://open.spotify.com/album/6bdlDtybZYnm6hZtiEWeUs"
									error={urlError}
									autoComplete="off"
									value={spotifyUrl || ""}
									onChange={(e) => {
										setUrlError(null);
										setData({ ...data, spotifyUrl: e.target.value });
									}}
									// autoFocus={}
								/>
								{/* <div className="flex items-center justify-between">
									<label
										htmlFor={`url-${randomIdx}`}
										className="block text-sm font-medium text-gray-700"
									>
										Destination URL
									</label>
									{urlError && (
										<p className="text-sm text-red-600" id="key-error">
											Invalid url.
										</p>
									)}
								</div> */}
								{/* <div className="relative mt-1 flex rounded-md shadow-sm"> */}
								{/* <input
										name="url"
										id={`url-${randomIdx}`}
										type="url"
										required
										placeholder={
											domains?.find(({ slug }) => slug === domain)?.placeholder ||
											"https://artst.io/help/article/what-is-artst"
										}
										value={url}
										autoFocus={!key}
										autoComplete="off"
										onChange={(e) => {
											setUrlError(null);
											setData({ ...data, url: e.target.value });
										}}
										className={`${
											urlError
												? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
												: "border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:ring-gray-500"
										} block w-full rounded-md focus:outline-none sm:text-sm`}
										aria-invalid="true"
									/>
									{urlError && (
										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
											<AlertCircleFill className="h-5 w-5 text-red-500" aria-hidden="true" />
										</div>
									)} */}
								{/* </div> */}
							</div>
							<div className="relative mt-1 flex rounded-md shadow-sm">
								{/* <select
										disabled={props && lockKey}
										value={domain}
										onChange={(e) => {
											setData({ ...data, domain: e.target.value });
										}}
										className={`${
											props && lockKey ? "cursor-not-allowed" : ""
										} w-40 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-5 text-sm text-gray-500 focus:border-gray-300 focus:outline-none focus:ring-0`}
									>
										{domains?.map(({ slug }) => (
											<option key={slug} value={slug}>
												{punycode.toUnicode(slug || "")}
											</option>
										))}
									</select> */}
								{/* <input
										ref={keyRef}
										type="text"
										name="key"
										id={`key-${randomIdx}`}
										required
										pattern="[\p{L}\p{N}\p{Pd}\/]+"
										onInvalid={(e) => {
											e.currentTarget.setCustomValidity(
												"Only letters, numbers, '-', and '/' are allowed.",
											);
										}}
										disabled={props && lockKey}
										autoComplete="off"
										className={cn(
											"block w-full rounded-r-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm",
											{
												"border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500":
													keyError,
												"cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-500":
													props && lockKey,
											},
										)}
										placeholder="github"
										value={key}
										onChange={(e) => {
											setKeyError(null);
											e.currentTarget.setCustomValidity("");
											setData({ ...data, key: e.target.value });
										}}
										aria-invalid="true"
										aria-describedby="key-error"
									/>
									{keyError && (
										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
											<AlertCircleFill className="h-5 w-5 text-red-500" aria-hidden="true" />
										</div>
									)}
								</div>
								{keyError && (
									<p className="mt-2 text-sm text-red-600" id="key-error">
										{keyError}
									</p>
								)} */}
							</div>
						</div>

						<div
							className={cn(
								!atBottom && "md:shadow-[0_-20px_30px_-10px_rgba(0,0,0,0.1)]",
								"z-10 bg-gray-50 px-4 pt-8 transition-all md:sticky md:bottom-0 md:px-16",
								"pb-16 sm:pb-8",
							)}
						>
							{homepageDemo ? (
								<Button
									disabledTooltip="This is a demo release. You can't edit it."
									text="Save changes"
								/>
							) : (
								<Button
									text={props ? "Save changes" : "Create release"}
									disabled={saveDisabled}
									loading={saving}
								/>
							)}
						</div>
					</form>
				</div>
				{/* <div className="scrollbar-hide rounded-r-2xl md:max-h-[90vh] md:overflow-auto">
					<Preview data={data} generatingMetatags={generatingMetatags} />
				</div> */}
			</div>
		</Modal>
	);
}

function AddEditReleaseButton({
	setShowAddEditReleaseModal,
}: {
	setShowAddEditReleaseModal: Dispatch<SetStateAction<boolean>>;
}) {
	const { plan, exceededLinks } = useProject();
	const { queryParams } = useRouterStuff();

	const onKeyDown = useCallback((e: KeyboardEvent) => {
		const target = e.target as HTMLElement;
		const existingModalBackdrop = document.getElementById("modal-backdrop");
		// only open modal with keyboard shortcut if:
		// - c is pressed
		// - user is not pressing cmd/ctrl + c
		// - user is not typing in an input or textarea
		// - there is no existing modal backdrop (i.e. no other modal is open)
		// - project has not exceeded links limit
		if (
			e.key === "c" &&
			!e.metaKey &&
			!e.ctrlKey &&
			target.tagName !== "INPUT" &&
			target.tagName !== "TEXTAREA" &&
			!existingModalBackdrop &&
			!exceededLinks
		) {
			e.preventDefault(); // or else it'll show up in the input field since that's getting auto-selected
			setShowAddEditReleaseModal(true);
		}
	}, []);

	// listen to paste event, and if it's a URL, open the modal and input the URL
	const handlePaste = (e: ClipboardEvent) => {
		const pastedContent = e.clipboardData?.getData("text");
		const target = e.target as HTMLElement;
		const existingModalBackdrop = document.getElementById("modal-backdrop");

		// make sure:
		// - pasted content is a valid URL
		// - user is not typing in an input or textarea
		// - there is no existing modal backdrop (i.e. no other modal is open)
		// - project has not exceeded links limit
		if (
			pastedContent &&
			isValidUrl(pastedContent) &&
			target.tagName !== "INPUT" &&
			target.tagName !== "TEXTAREA" &&
			!existingModalBackdrop &&
			!exceededLinks
		) {
			setShowAddEditReleaseModal(true);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("paste", handlePaste);
		return () => {
			document.removeEventListener("keydown", onKeyDown),
				document.removeEventListener("paste", handlePaste);
		};
	}, [onKeyDown]);

	return (
		<Button
			text="Create release"
			shortcut="C"
			disabledTooltip={
				exceededLinks ? (
					<TooltipContent
						title="Your project has exceeded its releases limit. We're still collecting data on your existing releases, but you need to upgrade to release more."
						cta={`Upgrade to ${plan === "free" ? "Pro" : "Business"}`}
						onClick={() => {
							queryParams({
								set: {
									upgrade: plan === "free" ? "pro" : "business",
								},
							});
						}}
					/>
				) : undefined
			}
			onClick={() => setShowAddEditReleaseModal(true)}
		/>
	);
}

export function useAddEditReleaseModal({
	props,
	duplicateProps,
	homepageDemo,
}: {
	props?: ReleaseProps;
	duplicateProps?: ReleaseProps;
	homepageDemo?: boolean;
} = {}) {
	const [showAddEditReleaseModal, setShowAddEditReleaseModal] = useState(false);

	const AddEditReleaseModalCallback = useCallback(() => {
		return (
			<AddEditReleaseModal
				showAddEditReleaseModal={showAddEditReleaseModal}
				setShowAddEditReleaseModal={setShowAddEditReleaseModal}
				props={props}
				duplicateProps={duplicateProps}
				homepageDemo={homepageDemo}
			/>
		);
	}, [showAddEditReleaseModal, setShowAddEditReleaseModal]);

	const AddEditReleaseButtonCallback = useCallback(() => {
		return <AddEditReleaseButton setShowAddEditReleaseModal={setShowAddEditReleaseModal} />;
	}, [setShowAddEditReleaseModal]);

	return useMemo(
		() => ({
			showAddEditReleaseModal,
			setShowAddEditReleaseModal,
			AddEditReleaseModal: AddEditReleaseModalCallback,
			AddEditReleaseButton: AddEditReleaseButtonCallback,
		}),
		[
			showAddEditReleaseModal,
			setShowAddEditReleaseModal,
			AddEditReleaseModalCallback,
			AddEditReleaseButtonCallback,
		],
	);
}
