import { cn } from "@artst/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
	"inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "bg-primary hover:bg-primary/80 border-transparent text-primary-foreground",
				secondary:
					"bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground",
				destructive:
					"bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground",
				outline: "text-foreground",
				violet: "border-violet-600 bg-violet-600 text-white",
				blue: "border-blue-500 bg-blue-500 text-white",
				sky: "border-sky-900 bg-sky-900 text-white",
				black: "border-black bg-black text-white",
				gray: "border-gray-200 bg-gray-200 text-gray-800",
				neutral: "border-gray-400 text-gray-500",
				rainbow: "bg-gradient-to-r from-violet-600 to-pink-600 text-white border-transparent",
			},
		},
		defaultVariants: {
			variant: "neutral",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
