function getImageDimentions(image) {
	return new Promise(resolve => {
		let img = new Image();
		img.onload = function () {
			resolve([this.width, this.height]);
		}
		img.src = image;
	});

}

export { getImageDimentions };