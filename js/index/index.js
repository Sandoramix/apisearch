const CATEGORY_SELECT = document.getElementById(`category`);

getAllCategories()
	.catch(console.error)
	.then(data => fillSelect(data, CATEGORY_SELECT))



