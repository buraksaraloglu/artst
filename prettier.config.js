// prettier.config.js
module.exports = {
	bracketSpacing: true,
	semi: true,
	trailingComma: "all",
	printWidth: 100,
	tabWidth: 2,
	useTabs: true,
	plugins: [
		// comment for better diff
		"prettier-plugin-organize-imports",
		"prettier-plugin-tailwindcss",
	],
};
