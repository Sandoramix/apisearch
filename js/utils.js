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


async function getEntries(query = "", category = "") {
	const params = new URLSearchParams({
		title: query, description: query, category
	});
	const req = await fetch(API.ENTRIES + `?` + params);
	const json = await req.json();
	return json.entries ?? [];
}
async function getRandomEntry() {
	const req = await fetch(API.RANDOM);
	const json = await req.json();

	return json.entries[0];
}

async function getAllCategories() {
	const req = await fetch(API.CATEGORIES);
	if (!req.ok) return undefined;
	const data = await req.json();
	return data.categories;
}


function getPageParams(uri = undefined) {
	const urlSearchParams = new URLSearchParams(uri ?? window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	return params;
}