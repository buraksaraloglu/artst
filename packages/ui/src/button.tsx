"use client";

import { cn } from "@artst/utils";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import { LoadingSpinner } from "./icons";

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
// text: string;
// variant?: "primary" | "secondary" | "outline" | "success" | "danger";
// loading?: boolean;
// icon?: ReactNode;
// shortcut?: string;
// disabledTooltip?: string | ReactNode;
// }

// variant?: "primary" | "secondary" | "outline" | "success" | "danger";

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				primary: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				success: "border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500",
				outline: "border border-input hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "underline-offset-4 hover:underline text-primary",
			},
			size: {
				default: "py-2 px-4 gap-1",
				xs: "p-2 rounded-md gap-0.5",
				sm: "h-9 px-3 rounded-md",
				lg: "h-11 px-8 rounded-md",
				icon: "h-9 w-9 rounded-md",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	loading?: boolean;
	text: string;
	icon?: React.ReactNode;
	shortcut?: string;
	disabledTooltip?: string | React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, icon, loading, shortcut, disabledTooltip, ...props }, ref) => {
		return (
			<button
				type={props.type ?? props.onClick ? "button" : "submit"}
				className={cn(buttonVariants({ variant, size, className }), {
					"cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400": props.disabled || loading,
				})}
				ref={ref}
				{...props}
			>
				{loading ? <LoadingSpinner /> : icon ? icon : null}
				<span>{props.text}</span>
				{shortcut && (
					<kbd className="hidden rounded bg-zinc-700 px-2 py-0.5 text-xs font-light text-gray-400 transition-all duration-75 group-hover:bg-gray-100 group-hover:text-gray-500 md:inline-block">
						{shortcut}
					</kbd>
				)}
			</button>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
