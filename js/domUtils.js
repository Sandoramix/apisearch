

function fillSelect(list, selectContainer) {
	list.forEach(value => {
		const option = document.createElement(`option`);
		option.value = value;
		option.innerText = value;
		selectContainer.append(option);
	});
	selectContainer.disabled = false;
};

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