"use client";

import { ModalContext } from "@/ui/modals/provider";
import { BlurImage } from "@/ui/shared/blur-image";
import { useContext } from "react";

export default function NoReleasesPlaceholder() {
	const { setShowAddEditReleaseModal } = useContext(ModalContext);

	return (
		<div className="col-span-full flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12">
			<h2 className="z-10 text-xl font-semibold text-gray-700">You don't have any releases yet!</h2>
			<BlurImage
				src="/_static/illustrations/shopping-call.svg"
				alt="No releases yet"
				width={400}
				height={400}
				className="pointer-events-none -my-8"
			/>
			<button
				onClick={() => setShowAddEditReleaseModal(true)}
				className="rounded-md border border-black bg-black px-10 py-2 text-sm font-medium text-white transition-all duration-75 hover:bg-white hover:text-black active:scale-95"
			>
				Create a release
			</button>
		</div>
	);
}
