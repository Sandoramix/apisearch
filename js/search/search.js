// HEADER
const CATEGORY_SELECT = document.getElementById(`category`);
const QUERY_INPUT = document.getElementById(`query`);
// MAIN
const TOTAL_COUNT_PARAGRAPH = document.getElementById(`total-count`);
const RESULT_LIST = document.getElementById(`list`);

const SEARCH_RESULT_TEMPLATE = document.getElementById(`search-result-item`);

// FOOTER
const PAGE_SWITCHER_DIV = document.getElementById(`page-switcher`);
const CURRENT_PAGE_PARAGRAPH = document.getElementById(`current-page`);
const TOTAL_PAGES_COUNT = document.getElementById(`total-pages-count`);
const PREVIOUS_PAGE_BTN = document.getElementById(`page-switch-previous`);
const NEXT_PAGE_BTN = document.getElementById(`page-switch-next`);
const OFFSET_SWITCHER_SELECT = document.getElementById(`offset-switcher`);


var { query: queryQuery, category: queryCategory } = getPageParams();

var resultForgedElements = [];


var currentPage = 1;
var totalPages = undefined;

const itemsCountPerPageOptions = [5, 10, 25, 50];
var itemsCountPerPage = 5;


/**
 * @function loadQueryValues Update the query's <input> and category's <select> values in DOM
 * @return {void}
 */
const loadQueryValues = () => {
	CATEGORY_SELECT.value = queryCategory ?? "";
	QUERY_INPUT.value = queryQuery ?? "";
};

/**
 * @function loadItemsCountPerPage Load the number of items to show in a page from LocalStorage (or fallback)
 * @return {void}
 */
const loadItemsCountPerPage = () => {
	fillSelect(itemsCountPerPageOptions, OFFSET_SWITCHER_SELECT);
	try {
		const lsData = localStorage.getItem(LS.OFFSET);
		const parsedNumber = Number.parseInt(lsData);
		if (isNaN(parsedNumber)) throw 'Not A Number';
		itemsCountPerPage = parsedNumber;
	} catch (error) {
		itemsCountPerPage = itemsCountPerPageOptions[0];
	}
};


/**
 * @function updateItemsCountPerPage Update itemsCountPerPage, save it to LocalStorage, recalculate totalPages and then go to page 1.
 * @return {void}
 */
const updateItemsCountPerPage = () => {
	let parsedOffset = undefined;
	try {
		parsedOffset = Number.parseInt(OFFSET_SWITCHER_SELECT.value);
	} catch (error) {
		parsedOffset = itemsCountPerPageOptions[0];
	}
	itemsCountPerPage = parsedOffset;
	localStorage.setItem(LS.OFFSET, itemsCountPerPage.toString());

	calculateTotalPages();
	goToPage(1);
};


/**
 * @function showResults
 * @param  {DocumentFragment[]} list List Of API objects
 * @return {void}
 */
const showResults = (list) => {
	RESULT_LIST.innerHTML = ``;

	list.forEach(el => {
		RESULT_LIST.appendChild(el.cloneNode(true));
	});
	const size = resultForgedElements.length;
	TOTAL_COUNT_PARAGRAPH.textContent = `${currentPage > 1 ? `Page ${currentPage} of` : `Found`} ${size} result${size === 1 ? `` : `s`}`;
};

/**
 * @function calculateTotalPages Recalculate totalPages count and show it in a paragraph
 * @return {void}
 */
const calculateTotalPages = () => {
	totalPages = Math.ceil(resultForgedElements.length / itemsCountPerPage);
	if (totalPages === 0) {
		PAGE_SWITCHER_DIV.classList.toggle(`!flex`, false);
		return;
	}
	PAGE_SWITCHER_DIV.classList.toggle(`!flex`, true);

	TOTAL_PAGES_COUNT.textContent = totalPages;
};


/**
 * @function canGoToPage Check if the page is in bounds and if the buttons (`next`/`previous`) should be shown
 * @param  {number} page The page number
 * @return {{
 * 	previousButton:boolean,
 *  nextButton:boolean,
 *  result:boolean
 * }} 
 */
function canGoToPage(page) {
	return {
		previousButton: (page > 1 && totalPages !== 0),
		nextButton: (page < totalPages && totalPages !== 0),
		result: (page >= 1 && page <= totalPages && totalPages !== 0)
	};
}
/**
 * @function goToPage Change the page of results
 * @param  {number} page The page number
 * @return {void}
 */
const goToPage = (page = 1) => {

	const check = canGoToPage(page);

	PREVIOUS_PAGE_BTN.disabled = !check.previousButton;
	NEXT_PAGE_BTN.disabled = !check.nextButton;
	if (!check.result) {
		return;
	}
	currentPage = page;

	CURRENT_PAGE_PARAGRAPH.textContent = currentPage;

	const currentIndex = (currentPage - 1) * itemsCountPerPage;
	const chunk = resultForgedElements.slice(currentIndex, currentIndex + itemsCountPerPage);

	showResults(chunk);
};

// STARTING CALLING THE NEEDED FUNCTIONS & LISTENERS
PREVIOUS_PAGE_BTN.addEventListener('click', () => {
	goToPage(currentPage - 1);
});
NEXT_PAGE_BTN.addEventListener('click', () => {
	goToPage(currentPage + 1);
});
OFFSET_SWITCHER_SELECT.addEventListener(`input`, () => {
	updateItemsCountPerPage();
});


loadItemsCountPerPage();
loadQueryValues();

getAllCategories()
	.then(data => {
		fillSelect(data, CATEGORY_SELECT);
		loadQueryValues();
	})
	.catch(console.error);


getEntries(queryQuery, queryCategory)
	.then(data => {
		resultForgedElements = data.map(api => {
			const copy = document.importNode(SEARCH_RESULT_TEMPLATE.content, true);
			const selectorElements = copy.querySelectorAll('[data-key]');
			generateApiItem(api, selectorElements);

			return copy;
		});
		calculateTotalPages();
		goToPage(1);
	});