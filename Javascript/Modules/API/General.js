function Post(url, data) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data));

	return new Promise(resolve => {
		xhr.onload = function () {
			resolve(xhr.responseText);
		}
	});
	
}

export {Post};