import { API } from "./Modules/API/Api.js";
import { createBanner } from "./Modules/popup.js";

async function asyncOnLoad() {
	const sessionID = await API.getCurrentSessionId();
	if (sessionID == "") {
		createBanner("You are not signed in :/", "", "", 3000);
		setTimeout(() => window.location.replace("/"), 3200);
		return;
	}
	const user = await API.getUser(await API.getCurrentUser());

	document.getElementById("usernameInput").value = user.username;

	var bio = user.bio.split("<br>").join("\n");
	document.getElementById("bioInput").value = bio;
	document.getElementById("borderStyleInput").value = user.borderStyle;

	document.getElementById("newPassword1").value = "";
	document.getElementById("newPassword2").value = "";

	document.getElementById("password").value = "";

	document.getElementById("doneButton").addEventListener("click", async function () {

		document.getElementById("doneButton").style = "display: none";

		var username = document.getElementById("usernameInput").value;
		username = username != "" ? username : null;

		var bio = document.getElementById("bioInput").value;
		bio = bio != "" ? bio : null;

		var borderstyle = document.getElementById("borderStyleInput").value;
		borderstyle = borderstyle != "" ? borderstyle : null;

		var password1 = document.getElementById("newPassword1").value;
		password1 = password1 != "" ? password1 : null;
		var password2 = document.getElementById("newPassword2").value;
		password2 = password2 != "" ? password2 : null;

		if ((password1 != null || password2 != null) && password1 != password2) {
			document.getElementById("error").innerHTML = "The new passwords do not match";
			document.getElementById("doneButton").style = "";
			return;
		}

		var password = document.getElementById("password").value;
		password = password != "" ? password : null;

		if (password == null) {
			document.getElementById("error").innerHTML = "You have to provide a password to change your user data";
			document.getElementById("doneButton").style = "";
			return;
		}

		var result = await API.updateUserData(await API.getCurrentSessionId(), password, username, bio, password1, borderstyle);
		if (result.isError) {
			document.getElementById("error").innerHTML = result.message;
			document.getElementById("doneButton").style = "";
			return;
		}
		var currentUserID = await API.getCurrentUser();

		window.location.replace("/userPage.html?userID=" + currentUserID);
	});

	document.getElementById("hideElements").remove();

}
asyncOnLoad();