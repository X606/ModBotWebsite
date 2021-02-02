function shortenNumber(number) {
	if(number < 1000) {
		return number;

	} else if(number < 10000) {
		return (Math.round(number / 100) / 10) + "k";

	} else if(number < 1000000) {
		return Math.round(number / 1000) + "k";
	} else {
		return "Lots!";
	}
}

function processText(rawText) {
	return rawText.replace(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm, function(link) {
		return "<a target='_blank' class='link' href='" + link + "'>" + link + "</a>";
	});
}

export {shortenNumber, processText};