const _API = {
	GITHUB: `https://github.com/davemachado/public-api`,
	BASE_URL: `https://api.publicapis.org`,
};
const LS = {
	OFFSET: `offset`
};

const API = {
	ENTRIES: `${_API.BASE_URL}/entries`,
	CATEGORIES: `${_API.BASE_URL}/categories`,
	RANDOM: `${_API.BASE_URL}/random`
};

/**
 * @function getEntries get all APIs matching the parameters
 * @param  {string} query    The title & description to search.If equal to an empty string, APIs will be matched
 * @param  {string} category Category to search. If equal to an empty string, all categories will be matched
 * @return {{
 * API: string,
 * Description: string,
 * Auth: string,
 * HTTPS: boolean,
 * Cors: "yes" | "no" | "unknown",
 * Category:string
 * }[]} list of API objects
 */
async function getEntries(query = "", category = "") {
	const params = new URLSearchParams({
		title: query, description: query, category
	});
	const req = await fetch(API.ENTRIES + `?` + params);
	const json = await req.json();
	return json.entries ?? [];
}

/**
 * @function getRandomEntry Get a single & random API object
 * @return {{
 * API: string,
 * Description: string,
 * Auth: string,
 * HTTPS: boolean,
 * Cors: "yes" | "no" | "unknown",
 * Category:string
 * }} API object
 */
async function getRandomEntry() {
	const req = await fetch(API.RANDOM);
	const json = await req.json();

	return json.entries[0] ?? undefined;
}

/**
 * @function getAllCategories Get all available categories
 * @return {string[]} list of strings
 */
async function getAllCategories() {
	const req = await fetch(API.CATEGORIES);
	if (!req.ok) return undefined;
	const data = await req.json();
	return data.categories;
}

/**
 * @function getPageParams Transform the page URI's parameters into an object
 * @param  {string} uri Optional. Page's URI. If nothing given, the current page's uri will be used
 * @return {{[key:string]:string}} Params Object
 */
function getPageParams(uri = undefined) {
	const urlSearchParams = new URLSearchParams(uri ?? window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	return params;
}