const CATEGORY_SELECT = document.getElementById(`category`);
const QUERY_INPUT = document.getElementById(`query`);
const RESULT_LIST = document.getElementById(`list`);


const SEARCH_RESULT_TEMPLATE = document.getElementById(`search-result-item`);

var { query: queryQuery, category: queryCategory } = getPageParams();
queryQuery = queryQuery ?? "";
queryCategory = queryCategory ?? "";

var resultForgedElements = [];


var currentIndex = 0;
var offset = 20;


const loadQueryValues = () => {
	CATEGORY_SELECT.value = queryCategory;
	QUERY_INPUT.value = queryQuery;
};
loadQueryValues();

getAllCategories()
	.then(data => {
		fillCategories(data, CATEGORY_SELECT);
		loadQueryValues();
	})
	.catch(console.error);


function showResults(list) {
	RESULT_LIST.innerHTML = ``;
	list.slice(currentIndex, currentIndex + offset).forEach(el => RESULT_LIST.appendChild(el));
}


getEntries(queryQuery, queryCategory)
	.then(data => {
		resultForgedElements = data.map(api => {
			const copy = document.importNode(SEARCH_RESULT_TEMPLATE.content, true);
			copy.querySelectorAll('[data-key]').forEach(element => {
				const key = element.getAttribute(`data-key`);
				if (key.toUpperCase() === 'URL') {
					element.href = api.Link;
					return;
				}
				element.textContent = api[key];
			});

			return copy;
		});
		console.log({ resultForgedElements });
		return resultForgedElements;
	})
	.then(forgedElements => {
		showResults(forgedElements);
	});