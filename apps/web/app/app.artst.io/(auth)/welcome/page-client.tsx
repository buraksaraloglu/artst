"use client";

import { useAddArtistModal } from "@/ui/modals/add-artist-modal";
import { useUpgradePlanModal } from "@/ui/modals/upgrade-plan-modal";
import Interim from "@/ui/welcome/interim";
import Intro from "@/ui/welcome/intro";
import { Background } from "@artst/ui";
import va from "@vercel/analytics";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function WelcomePageClient() {
	const { setShowAddArtistModal, AddArtistModal } = useAddArtistModal();
	const { setShowUpgradePlanModal, UpgradePlanModal } = useUpgradePlanModal();

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		va.track("Sign Up");
	}, []);

	useEffect(() => {
		if (searchParams?.get("type") === "project") {
			setTimeout(() => {
				setShowAddArtistModal(true);
			}, 200);
		} else {
			setShowAddArtistModal(false);
		}
		if (searchParams?.get("type") === "upgrade") {
			setTimeout(() => {
				setShowUpgradePlanModal(true);
			}, 200);
		} else {
			setShowUpgradePlanModal(false);
		}
	}, [searchParams]);

	return (
		<div className="flex h-screen flex-col items-center">
			<Background />
			<AddArtistModal />
			<UpgradePlanModal />
			<AnimatePresence mode="wait">
				{!searchParams?.get("type") && <Intro key="intro" />}
				{searchParams?.get("type") === "interim" && (
					<>
						<button
							className="group fixed left-10 top-10 z-[99] rounded-full p-2 transition-all hover:bg-gray-100"
							onClick={() => router.back()}
						>
							<ArrowLeft
								size={20}
								className="text-gray-500 group-hover:text-gray-700 group-active:scale-90"
							/>
						</button>
						<Interim key="interim" />
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
