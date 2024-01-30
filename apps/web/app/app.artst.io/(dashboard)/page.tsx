import CreateArtistButton from "@/ui/projects/create-artist-button";
import ProjectList from "@/ui/projects/project-list";
import { MaxWidthWrapper } from "@artst/ui";

export default function App() {
	return (
		<>
			<div className="flex h-36 items-center border-b border-gray-200 bg-white">
				<MaxWidthWrapper>
					<div className="flex items-center justify-between">
						<h1 className="text-2xl text-gray-600">My Artists</h1>
						<CreateArtistButton />
					</div>
				</MaxWidthWrapper>
			</div>
			<MaxWidthWrapper>
				<div className="my-10 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
					<ProjectList />
				</div>
			</MaxWidthWrapper>
		</>
	);
}
