
/**
 * @function fillSelect Add options to a <select> element with the given list
 * @param  {any[]} list List with values to add to the \<select>
 * @param  {HTMLSelectElement} selectContainer \<select> element to populate
 * @return {void}
 */
function fillSelect(list, selectContainer) {
	list.forEach(value => {
		const option = document.createElement(`option`);
		option.value = value;
		option.innerText = value;
		selectContainer.append(option);
	});
	selectContainer.disabled = false;
};

/**
 * @function generateApiItem Populate API's `selectorItems` data from `apiObject` (via reference)
 * @param  {{
 * API: string,
 * Description: string,
 * Auth: string,
 * HTTPS: boolean,
 * Cors: "yes" | "no" | "unknown",
 * Category:string
 * }} apiObject  API's given data
 * @param  {NodeListOf<Element>} selectorItems Selectors with `data-key` attribute
 * @return {void}
 */
function generateApiItem(apiObject, selectorItems) {
	selectorItems.forEach(element => {
		const key = element.getAttribute(`data-key`);
		if (key.toUpperCase() === 'URL') {
			element.href = apiObject.Link;
			return;
		}
		let fixedText = apiObject[key];
		fixedText = fixedText == '' ? 'N/A' : fixedText;
		element.textContent = fixedText;
	});
};