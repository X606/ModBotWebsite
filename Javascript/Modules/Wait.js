function waitFor(condition) {
	return new Promise(async resolve => {
		const check = function () {
			if (condition()) {
				resolve();
				return;
			}

			setTimeout(check, 1);
		}
		setTimeout(check, 1);
	});
}

export { waitFor };