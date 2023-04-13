function fillCategories(list, selectContainer) {
	list.forEach(category => {
		const option = document.createElement(`option`);
		option.value = category;
		option.innerText = category;
		selectContainer.append(option);
	});
	selectContainer.disabled = false;
};