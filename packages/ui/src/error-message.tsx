export function ErrorMessage({ message }: { message: React.ReactNode }) {
	return <p className="text-destructive text-sm">{message}</p>;
}
