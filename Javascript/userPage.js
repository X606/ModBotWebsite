import { API } from "/api?operation=getAPI";
import { createBanner } from "./Modules/popup.js";
import {processText} from "./Modules/textHandeling.js"

function copyToClipboard(str) {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);

	createBanner("Copied \"" + str + "\" to clipboard.", null, "check_circle", 1000);
};

var asyncOnStart = async function () {
	const urlParams = new URLSearchParams(window.location.search);
	const userID = urlParams.get("userID");

	if (!userID || userID == "") {
		window.location.replace("/404.html");
		return;
	}

	const asyncGetData = async function () {
		var searchRequest = new API.search();
		searchRequest.userID = userID;
		searchRequest.sortOrder = searchRequest.Liked;
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
	var authText = document.getElementById("userType");
	switch (userData.authenticationLevel) {
		case 4:
			icon.innerHTML = "miscellaneous_services";
			icon.style = "color: var(--tertiaryRed);";
			authText.innerHTML = "Admin";
			authText.style = "color: var(--tertiaryRed);"
			break;
		case 3:
			icon.innerHTML = "construction";
			icon.style = "color: var(--tertiaryOrange);";
			authText.innerHTML = "Modder";
			authText.style = "color: var(--tertiaryOrange);"
			break;
		case 2:
			icon.innerHTML = "verified";
			icon.style = "color: var(--tertiaryBlue);";
			authText.innerHTML = "Verified";
			authText.style = "color: var(--tertiaryBlue);"
			break;
	}

	document.getElementsByClassName("userDescription")[0].innerHTML = processText(userData.bio);

	document.getElementById("copyButton").addEventListener("click", function () {
		copyToClipboard(userID);
	});

	var userAvatar = document.getElementsByClassName("userAvatar")[0];
	API.getProfilePicture(userAvatar, userID);
	switch (userData.borderStyle) {
		case 1:
			userAvatar.style = "border-radius: 25%;";
			break;
		case 2:
			userAvatar.style = "border-radius: 50%;";
			break;
	}
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