import { cn } from "@artst/utils";

import { MaxWidthWrapper, Typography } from "@artst/ui";

type PageHeaderProps = {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	description?: string;
	actions?: React.ReactNode;
	badges?: React.ReactNode;
	withGutter?: boolean;
	withBorder?: boolean;
};

export function PageHeader({
	title,
	subtitle,
	description,
	badges,
	actions,
	withGutter,
	withBorder,
}: PageHeaderProps) {
	return (
		<div className="flex items-center border-b border-gray-200 bg-white">
			<MaxWidthWrapper>
				<div
					className={cn("grid gap-4 py-4 sm:gap-4 md:py-8", {
						"border-b": withBorder,
						"px-4 md:px-6": withGutter,
					})}
				>
					<div className="flex justify-between">
						<div className="grow-0">
							<div className="flex flex-col items-start gap-2 md:gap-4">
								<Typography as="h1" variant="h1" className="flex items-center gap-2">
									{title}
								</Typography>

								{badges && badges}
							</div>

							{subtitle && <Typography variant="muted">{subtitle}</Typography>}
							{description && (
								<div>
									{/* <Balancer> */}
									<Typography variant="muted" className="mt-2" size="sm">
										{description}
									</Typography>
									{/* </Balancer> */}
								</div>
							)}
						</div>

						{actions && <div className="grow-0">{actions}</div>}
					</div>
				</div>
			</MaxWidthWrapper>
		</div>
	);
}
