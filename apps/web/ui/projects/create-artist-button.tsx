"use client";

import useProjects from "@/lib/swr/use-projects";
import { ModalContext } from "@/ui/modals/provider";
import { Button } from "@artst/ui";
import { TooltipContent } from "@artst/ui/src/tooltip";
import { FREE_PROJECTS_LIMIT, HOME_DOMAIN } from "@artst/utils";
import { useContext } from "react";

export default function CreateArtistButton() {
	const { setShowAddArtistModal } = useContext(ModalContext);
	const { freeProjects, exceedingFreeProjects } = useProjects();

	return (
		<div>
			<Button
				text="Create artist"
				disabledTooltip={
					exceedingFreeProjects ? (
						<TooltipContent
							title={`You can only create up to ${FREE_PROJECTS_LIMIT} free artists. Additional projects require a paid plan.`}
							cta="Upgrade to Pro"
							href={
								freeProjects
									? `/${freeProjects[0].slug}/settings/billing?upgrade=pro`
									: `${HOME_DOMAIN}/pricing`
							}
						/>
					) : undefined
				}
				onClick={() => setShowAddArtistModal(true)}
			/>
		</div>
	);
}
