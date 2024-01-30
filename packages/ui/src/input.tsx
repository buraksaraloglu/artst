import * as React from "react";

import { cn } from "@artst/utils";

import { ErrorMessage } from "./error-message";
import { Label } from "./label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string | null;
	description?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, label, description, error, type, ...props }, ref) => {
		return (
			<div className="space-y-1">
				{label && <Label htmlFor={props.id}>{label}</Label>}
				{description && <p className="text-muted-foreground text-sm">{description}</p>}
				<input
					type={type}
					className={cn(
						"border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					ref={ref}
					{...props}
				/>
				{error && <ErrorMessage message={error} />}
			</div>
		);
	},
);
Input.displayName = "Input";

const InputWithLabel = React.forwardRef<
	HTMLInputElement,
	InputProps & { label: string; error?: React.ReactNode; description?: string }
>(({ label, error, description, ...props }, ref) => {
	return (
		<div className="grid w-full items-center gap-2">
			<Label htmlFor={props.id}>{label}</Label>
			{description && <p className="text-muted-foreground text-sm">{description}</p>}
			<Input
				{...props}
				ref={ref}
				type={props.type}
				name={props.name}
				id={props.id}
				placeholder={props.placeholder}
			/>
			{error && <ErrorMessage message={error} />}
		</div>
	);
});
InputWithLabel.displayName = "InputWithLabel";

export { Input, InputWithLabel };
