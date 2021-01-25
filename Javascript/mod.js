import { API } from "/api?operation=getAPI";
import { createBanner } from "./Modules/popup.js";
import {shortenNumber} from "./Modules/textHandeling.js"

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

async function asyncOnLoad() {
	const urlParams = new URLSearchParams(window.location.search);
	const modID = urlParams.get("modID");

	var likeButton = document.getElementById("rateButton");
	var likeCount = document.getElementById("likedCount");

	var downloadButton = document.getElementById("downloadButton");
	var downloadCount = document.getElementById("downloadCount");

	if (!modID)
		return;

	var asyncGetModData = async function () {
		var modData = await API.getModData(modID);

		API.getModImage(document.getElementsByClassName("modImage")[0], modID);

		document.getElementsByClassName("modTitle")[0].innerHTML = modData.DisplayName;

		var description = modData.Description;
		if (description == undefined) {
			description = "";
		}

		document.getElementsByClassName("modDescription")[0].innerHTML = description;
		document.getElementsByClassName("previewLink")[0].href += "?modID=" + modID;

		likeButton.addEventListener("click", function() {
			window.top.location.href = document.getElementsByClassName("previewLink")[0].href;
		});
		document.getElementById("copyButton").addEventListener("click", function() {
			copyToClipboard(modID);
		});

		downloadButton.addEventListener("click", function() {
			API.downloadMod(modID);
		});

		setTimeout(function () {
			document.body.style = "transition-duration: 1s; transition-property: opacity;";
		}, 2);
	};
	asyncGetModData();
	var asyncGetSpecialModData = async function () {
		var modData = await API.getSpecialModData(modID);
		
		let userHeader = document.getElementsByClassName("userHeader")[0];
		userHeader.contentWindow.location.replace("/api?operation=getUserHeader&userID=" + modData.OwnerID); // redirect iframe to new url without making the browser add a back step
		likeCount.innerHTML = shortenNumber(modData.Likes);
		downloadCount.innerHTML = shortenNumber(modData.Downloads);
	};
	asyncGetSpecialModData();
	

}
asyncOnLoad();