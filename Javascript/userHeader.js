import { API } from "./Modules/API/Api.js";
import { getImageDimentions } from "./Modules/imageHandeling.js";

const urlParams = new URLSearchParams(window.location.search);
const userID = urlParams.get("userID");

async function asyncOnLoad() {
	const userData = await API.getUser(userID);

	var nameDisplay = document.getElementsByClassName("name")[0];
	nameDisplay.innerHTML = userData.username;
	nameDisplay.style = "color: " + userData.color;
	await API.setImageElementToProfilePicture(document.getElementsByClassName("userAvatar")[0], userID);

	document.getElementById("link").href += "?userID=" + userID;


	document.body.style = "transition-duration: 1s; transition-property: opacity;";
}
if (userID) {
	asyncOnLoad();
}