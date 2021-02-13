import { createPopup, FormData } from "./Modules/popup.js";
import { API } from "/api?operation=getAPI";

var searchBox = document.getElementById("search");
var sortingType = document.getElementById("modSortingType");
var sortingDirection = document.getElementById("modSortingDirection");

async function onLoadAsync() {
	const sessionId = await API.getCurrentSessionId();

	if (sessionId == "") {
		document.getElementById("signInText").style = "";
	} else {
		if (await API.getMyAuth() >= 2) {
			var uploadButton = document.getElementById("uploadButton");
			uploadButton.style = "";
			uploadButton.addEventListener("click", function () {
				createPopup(function (popup) {
					popup.createTitle("Upload mod");
					popup.createLink("How to make and upload mods.", "404.html");
					popup.createBreak();
					popup.createBreak();
					popup.createFileInput("modFile", ".zip", "file");
					popup.createBreak();
					popup.createHidden(sessionId, "session");
					popup.createSubmitInput("Upload mod");
				}, new FormData("/api/?operation=uploadMod", "multipart/form-data", "post"));
			});
		} else {
			document.getElementById("signInText").style = "";
		}
	}
	resort();
}

async function resort() {
	var searchRequest = new API.search();
	searchRequest.sortOrder = sortingType.value;
	searchRequest.searchString = searchBox.value;

	var modIds = (await searchRequest.Send()).ModIds;
	
	if (sortingDirection.value == "low") {
		modIds = modIds.reverse();
	}

	const element = document.getElementById("modsHolder");
	var innerHTML = "";
	for (var i = 0; i < modIds.length; i++) {
		innerHTML += "<iframe class=\"modBox fade\" src=\"mod.html?modID=" + modIds[i] + "\" frameborder=\"0\"></iframe>\n";
	}
	element.innerHTML = innerHTML;
}

searchBox.addEventListener("change", function() {
	resort();
});

sortingType.addEventListener("change", function() {
	resort();
});

sortingDirection.addEventListener("change", function() {
	resort();
});

onLoadAsync();