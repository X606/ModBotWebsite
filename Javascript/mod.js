import { API } from "/api?operation=getAPI";
import {createPopup} from "./Modules/popup.js";
import {shortenNumber, processText} from "./Modules/textHandeling.js"

async function asyncOnLoad() {
	const urlParams = new URLSearchParams(window.location.search);
	const modID = urlParams.get("modID");

	var likeCount = document.getElementById("likedCount");

	var downloadButton = document.getElementById("downloadButton");
	var downloadCount = document.getElementById("downloadCount");

	if (!modID)
		return;

	var asyncGetModData = async function () {
		var modData = await API.getModData(modID);

		API.getModImage(document.getElementsByClassName("modImage")[0], modID);

		document.getElementsByClassName("modTitle")[0].childNodes[1].nodeValue = modData.DisplayName;

		var description = modData.Description;
		if (description == undefined) {
			description = "";
		}

		document.getElementsByClassName("modDescription")[0].innerHTML = processText(description);
		document.getElementsByClassName("previewLink")[0].href += "?modID=" + modID;

		setTimeout(function () {
			document.body.style = "transition-duration: 1s; transition-property: opacity;";
		}, 2);
	};
	asyncGetModData();
	var asyncGetSpecialModData = async function () {
		var modData = await API.getSpecialModData(modID);
		
		if(!modData.Verified) {
			document.getElementsByClassName("warningIcon")[0].style = "";
			document.getElementsByClassName("descriptionGradient")[0].style = "background-image: linear-gradient(#ffffff00, #3a1a1a 25%)";
			let styleElement = document.createElement("style");
			styleElement.innerHTML = "body.modBackground {background-color: #3a1a1a;}";
			document.body.appendChild(styleElement);

			downloadButton.addEventListener("click", function () {
				createPopup(function(popup) {
					popup.createTitle("Are you sure?");
					popup.createParagraph("This mod has NOT been checked for malware and could contain viruses.")
					popup.createParagraph("Only download if you trust the author.")
					popup.createButtonInput("Download", function() {
						API.downloadMod(modID);
						popup.close();
					}, null, "orange");
					popup.createButtonInput("Cancel", function() {
						popup.close();
					});
				});
			});
		} else {
			downloadButton.addEventListener("click", function () {
				API.downloadMod(modID);
			});
		}

		let userHeader = document.getElementsByClassName("userHeader")[0];
		userHeader.contentWindow.location.replace("/api?operation=getUserHeader&userID=" + modData.OwnerID); // redirect iframe to new url without making the browser add a back step
		likeCount.innerHTML = shortenNumber(modData.Likes);
		downloadCount.innerHTML = shortenNumber(modData.Downloads);
	};
	asyncGetSpecialModData();
	

}
asyncOnLoad();