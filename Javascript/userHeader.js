import { API } from "/api?operation=getAPI";
import { getImageDimentions } from "./Modules/imageHandeling.js";

const urlParams = new URLSearchParams(window.location.search);
const userID = urlParams.get("userID");

async function asyncOnLoad() {
	const userData = await API.getUser(userID);

	if (userData.isError) {
		var nameDisplay = document.getElementsByClassName("name")[0];
		nameDisplay.innerHTML = "[Deleted user]";
		
		document.getElementsByClassName("userAvatar")[0].remove();
		document.body.style = "transition-duration: 1s; transition-property: opacity;";
		return;
	}

	var nameDisplay = document.getElementsByClassName("name")[0];
	nameDisplay.innerHTML = userData.username;
	nameDisplay.style = "color: " + userData.color;
	API.setImageElementToProfilePicture(document.getElementsByClassName("userAvatar")[0], userID);

	var icon = document.getElementById("icon");
	switch (userData.authenticationLevel) {
		case 4:
			icon.innerHTML = "miscellaneous_services";
			icon.title = "Admin"
			icon.style = "color: var(--tertiaryRed)";
			break;
		case 3:
			icon.innerHTML = "construction";
			icon.title = "Modder"
			icon.style = "color: var(--tertiaryOrange)";
			break;
		case 2:
			icon.innerHTML = "verified";
			icon.title = "Verified"
			icon.style = "color: var(--tertiaryBlue)";
			break;
	}

	document.getElementById("link").href += "?userID=" + userID;
	document.body.style = "transition-duration: 1s; transition-property: opacity;";
}
if (userID) {
	asyncOnLoad();
}