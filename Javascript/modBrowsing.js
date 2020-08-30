import { createPopup, FormData } from "./Modules/popup.js";
import { API } from "./Modules/API/Api.js";

async function onLoadAsync() {
	const sessionId = await API.getCurrentSessionId();

	if (sessionId == "") {
		document.getElementById("signInText").style = "";
	} else {
		var uploadButton = document.getElementById("uploadButton");
		uploadButton.style = "";
		uploadButton.addEventListener("click", function () {
			createPopup(function (popup) {
				popup.createTitle("Upload mod");
				popup.createFileInput("modFile", ".zip", "file");
				popup.createHidden(API.SessionID, "session");
				popup.createSubmitInput("Upload mod");
			}, new FormData("/api/?operation=uploadMod", "multipart/form-data", "post"));
		});
	}

	var modIds = await API.getAllModIds();

	const element = document.getElementById("modsHolder");

	var innerHTML = "";
	for (var i = 0; i < modIds.length; i++) {
		innerHTML += "<iframe class=\"modBox fade\" src=\"mod.html?modID=" + modIds[i] + "\" frameborder=\"0\"></iframe>\n";
	}

	element.innerHTML = innerHTML;
}
onLoadAsync();
