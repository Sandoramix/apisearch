const _API = {
	GITHUB: `https://github.com/davemachado/public-api`,
	BASE_URL: `https://api.publicapis.org`,
};
const _LS = {
	CATEGORIES: `categories`
};

const API = {
	ENTRIES: `${_API.BASE_URL}/entries`,
	CATEGORIES: `${_API.BASE_URL}/categories`
};


async function getEntries(query = "", category = "") {
	const params = new URLSearchParams({
		title: query, description: query, category
	});
	const req = await fetch(API.ENTRIES + `?` + params);
	const json = await req.json();
	return json.entries ?? [];
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