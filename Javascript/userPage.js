import { API } from "./Modules/API/Api.js";
import { getImageDimentions } from "./Modules/imageHandeling.js";

var asyncOnStart = async function () {
	const urlParams = new URLSearchParams(window.location.search);
	const userID = urlParams.get("userID");

	if (!userID) {
		console.error("No user provided");
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
	const usernameDisplay = document.getElementsByClassName("userName")[0];
	usernameDisplay.innerHTML = userData.username;
	usernameDisplay.style = "color: " + userData.color;

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

	document.getElementById("hideElements").innerHTML = "#mainHolder > * { opacity: 1; transition-duration: 1s; transition-property: opacity;}";
}
asyncOnStart();

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