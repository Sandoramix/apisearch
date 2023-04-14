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

const offsetOptions = [5, 10, 25, 50];
var pageOffset = 5;



const loadQueryValues = () => {
	CATEGORY_SELECT.value = queryCategory ?? "";
	QUERY_INPUT.value = queryQuery ?? "";
};
const loadOffset = () => {
	fillSelect(offsetOptions, OFFSET_SWITCHER_SELECT);
	try {
		const lsData = localStorage.getItem(LS.OFFSET);
		const parsedNumber = Number.parseInt(lsData);
		if (isNaN(parsedNumber)) throw 'Not A Number';
		pageOffset = parsedNumber;
	} catch (error) {
		pageOffset = offsetOptions[0];
	}
};

const updateCurrentPageParagraph = () => {
	CURRENT_PAGE_PARAGRAPH.textContent = currentPage;
};
const updateOffset = () => {
	let parsedOffset = undefined;
	try {
		parsedOffset = Number.parseInt(OFFSET_SWITCHER_SELECT.value);
	} catch (error) {
		parsedOffset = offsetOptions[0];
	}
	pageOffset = parsedOffset;
	localStorage.setItem(LS.OFFSET, pageOffset.toString());

	calculateTotalPages();
	goToPage(1);
};

/**
 * @function showResults Show the given list of APIs on the page
 * @param  {{
 *  API: string;
 *  Description: string;
 *  Auth: string;
 *  HTTPS: boolean;
 *  Cors: ”yes” | ”no” | ”unknown”;
 *  Link: string;
 *  Category: string;
 * }[]} list 
 * @return {type} {description}
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
	totalPages = Math.ceil(resultForgedElements.length / pageOffset);
	if (totalPages === 0) {
		PAGE_SWITCHER_DIV.classList.toggle(`!flex`, false);
		return;
	}
	PAGE_SWITCHER_DIV.classList.toggle(`!flex`, true);

	TOTAL_PAGES_COUNT.textContent = totalPages;
};


/**
 * @function canGoToPage Check if the page is in bounds and if the buttons (next/previous) should be shown
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

	updateCurrentPageParagraph();

	const currentIndex = (currentPage - 1) * pageOffset;
	const chunk = list.slice(currentIndex, currentIndex + pageOffset);

	showResults(chunk);
};

// STARTING CALLING THE NEEDED FUNCTIONS

PREVIOUS_PAGE_BTN.addEventListener('click', () => {
	goToPage(currentPage - 1);
});
NEXT_PAGE_BTN.addEventListener('click', () => {
	goToPage(currentPage + 1);
});
OFFSET_SWITCHER_SELECT.addEventListener(`input`, () => {
	updateOffset();
});


loadOffset();
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