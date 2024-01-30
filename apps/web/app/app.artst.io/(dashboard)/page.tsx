import { PageHeader } from "@/ui/layout/page";
import CreateArtistButton from "@/ui/projects/create-artist-button";
import ProjectList from "@/ui/projects/project-list";
import { MaxWidthWrapper } from "@artst/ui";

export default function App() {
	return (
		<>
			<PageHeader
				title="My Artists"
				actions={
					<>
						<CreateArtistButton />
					</>
				}
			/>
			<MaxWidthWrapper>
				<div className="my-10 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
					<ProjectList />
				</div>
			</MaxWidthWrapper>
		</>
	);
}
