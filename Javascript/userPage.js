import { API } from "./Modules/API/Api.js";
import { copyToClipboard } from "./Modules/API/General.js";
import { createBanner } from "./Modules/popup.js";

var asyncOnStart = async function () {
	const urlParams = new URLSearchParams(window.location.search);
	const userID = urlParams.get("userID");

	if (!userID || userID == "") {
		window.location.replace("/404.html");
		return;
	}

	const asyncGetData = async function () {
		var searchRequest = new API.SearchRequest();
		searchRequest.userID = userID;
		searchRequest.sortOrder = API.searchSortTypes.Liked;
		var mods = await searchRequest.Send();

		var generatedHTML = "";

		var items = Math.max(4, mods.length);

		for (var i = 0; i < items; i++) {
			const mod = mods[i];
			if (mod == null) {
				generatedHTML += "<div class=\"modBox\"></div>";
			} else {
				var href = "mod.html?modID=" + mod;

				generatedHTML += `<iframe class="modBox" src="${href}" frameborder="0"></iframe>`;
			}
		}

		if (mods.length != 0) {
			document.getElementById("modsHolder").innerHTML = generatedHTML;
		}

	}
	asyncGetData();

	var userData = await API.getUser(userID);
	if (userData.isError) {
		window.location.replace("/404.html");
		return;
	}

	const usernameDisplay = document.getElementsByClassName("userName")[0];
	usernameDisplay.innerHTML = userData.username;
	usernameDisplay.style = "color: " + userData.color;

	var icon = document.getElementById("icon");
	/*switch (userData.authenticationLevel) {
		case 4:*/
			icon.innerHTML = "miscellaneous_services";
			icon.style = "color: var(--tertiaryRed)";
			/*break;
		case 3:
			icon.innerHTML = "construction";
			icon.style = "color: var(--tertiaryOrange)";
			break;
		case 2:
			icon.innerHTML = "verified";
			icon.style = "color: var(--tertiaryBlue)";
			break;
	}*/

	document.getElementsByClassName("userDescription")[0].innerHTML = userData.bio;

	document.getElementById("copyButton").addEventListener("click", function () {
		copyToClipboard(userID);
	});
	document.getElementById("followButton").addEventListener("click", function () {
		createBanner("Make the follow button work.", "TODO", "warning", 2000);
	});
	document.getElementById("reportButton").addEventListener("click", function () {
		createBanner("Make the report button work.", "TODO", "warning", 2000);
	});

	await API.setImageElementToProfilePicture(document.getElementsByClassName("userAvatar")[0], userID);
	//document.getElementsByClassName("modsHolder")[0].innerHTML = ""; TODO: send request to get the featured mods

	var mods = userData.favoritedMods;
	var generatedHTML = "";
	var items = Math.max(4, mods.length);
	for (var i = 0; i < items; i++) {
		const mod = mods[i];
		if (mod == null) {
			generatedHTML += "<div class=\"modBox\"></div>";
		} else {
			var href = "mod.html?modID=" + mod;
			generatedHTML += `<iframe class="modBox" src="${href}" frameborder="0"></iframe>`;
		}
	}
	if (mods.length != 0) {
		document.getElementById("favoritedMod").innerHTML = generatedHTML;
	}

	document.getElementById("hideElements").innerHTML = "#mainHolder > * { opacity: 1; transition-duration: 1s; transition-property: opacity;}";
}
asyncOnStart();