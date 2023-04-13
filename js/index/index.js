const CATEGORY_SELECT = document.getElementById(`category`);

getAllCategories()
	.then(data => fillCategories(data, CATEGORY_SELECT))
	.catch();


