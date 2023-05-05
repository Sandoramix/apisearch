const RANDOM_API_CONTAINER = document.getElementById(`item-container`);
const API_ITEM_SELECTORS = document.querySelectorAll(`[data-key]`);



function getRandom() {
	toggleLoadingSpinner(true);
	getRandomEntry()
		.catch(console.error)
		.then(data => {
			generateApiItem(data, API_ITEM_SELECTORS);
			RANDOM_API_CONTAINER.classList.toggle(`!grid`, true);


			toggleLoadingSpinner();
		});
}

getRandom();
