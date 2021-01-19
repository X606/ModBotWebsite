function shortenNumber(number) {
	if(number < 1000) {
		return number;

	} else if(number < 10000) {
		return (Math.round(number / 100) / 10) + "k"

	} else if(number < 1000000) {
		return Math.round(number / 1000) + "k"
	} else {
		return "Lots!"
	}
}

export {shortenNumber};