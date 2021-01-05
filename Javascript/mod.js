import { API } from "./Modules/API/Api.js";
import { copyToClipboard } from "./Modules/API/General.js";

async function asyncOnLoad() {
	const urlParams = new URLSearchParams(window.location.search);
	const modID = urlParams.get("modID");

	if (!modID)
		return;

	var asyncGetModData = async function () {
		var modData = await API.getModData(modID);

		API.setImageElementToModImage(document.getElementsByClassName("modImage")[0], modID);

		document.getElementsByClassName("modTitle")[0].innerHTML = modData.DisplayName;

		var description = modData.Description;
		if (description == undefined) {
			description = "";
		}

		document.getElementsByClassName("modDescription")[0].innerHTML = description;
		document.getElementsByClassName("previewLink")[0].href += "?modID=" + modID;

		document.getElementById("rateButton").addEventListener("click", function() {
			window.top.location.href = document.getElementsByClassName("previewLink")[0].href;
		});
		document.getElementById("copyButton").addEventListener("click", function() {
			copyToClipboard(modID);
		});

		document.getElementById("downloadButton").addEventListener("click", function() {
			API.downloadMod(modID);
		});

		setTimeout(function () {
			document.body.style = "transition-duration: 1s; transition-property: opacity;";
		}, 2);
	};
	asyncGetModData();
	var asyncGetSpecialModData = async function () {
		var modData = await API.getSpecialModData(modID);

		document.getElementsByClassName("userHeader")[0].src += "?userID=" + modData.OwnerID;
		document.getElementById("likedCount").innerHTML = modData.Likes;
		document.getElementById("downloadCount").innerHTML = modData.Downloads;
	};
	asyncGetSpecialModData();
	

}
asyncOnLoad();