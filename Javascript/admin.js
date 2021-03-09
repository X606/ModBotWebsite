import {API} from "/api?operation=getAPI";
import {ProcessTagString} from "/Javascript/Modules/Tags.js";
import {createBanner, createPopup} from "/Javascript/Modules/popup.js";
import {processText} from "./Modules/textHandeling.js"

async function loadTags() {
	const tagsHolder = document.getElementsByClassName("tagsHolder")[0];
	const tagBox = document.getElementsByClassName("tagBox")[0];

	let tags = (await API.getTags()).tags.filter(function(tag) {
		return !tag.Verified;
	});

	for(let i = 0; i < tags.length; i++) {
		let cloned = tagBox.cloneNode(true);
		cloned.querySelector(".tagHolder").insertAdjacentHTML("beforeend", ProcessTagString(tags[i].Body));
		cloned.style = "";

		cloned.querySelector("#verify").addEventListener("click", async function() {
			let response = await API.verifyTag(tags[i].TagID);
			if(response.Error != null) {
				createBanner(response.Error, "Error", "error");
			} else {
				cloned.remove();
				createBanner("Verified tag \"" + tags[i].TagName + "\".", "Success", "check", 2500);
			}
		});

		cloned.querySelector("#removeButton").addEventListener("click", async function() {
			let response = await API.removeTag(tags[i].TagID);
			if(response.Error != null) {
				createBanner(response.Error, "Error", "error");
			} else {
				cloned.remove();
				createBanner("Remove tag \"" + tags[i].TagName + "\".", "Success", "check", 2500);
			}
		});

		tagsHolder.appendChild(cloned);
	}
}
loadTags();

async function loadMods() {
	const modsHolder = document.getElementsByClassName("modsHolder")[0];
	const modListing = document.getElementsByClassName("modListing")[0];

	let modInfos = (await API.getAllModInfos()).ModInfos;
	for(let i = 0; i < modInfos.length; i++) {
		let specialData = await API.getSpecialModData(modInfos[i].UniqueID);

		if(!specialData.Verified) {
			let cloned = modListing.cloneNode(true);
			cloned.querySelector(".modTitle").innerHTML = modInfos[i].DisplayName
			cloned.querySelector(".modDescription").innerHTML = processText(modInfos[i].Description);
			cloned.querySelector("#link").href += "?modID=" + modInfos[i].UniqueID;
			cloned.querySelector("#modAuthor").src = "/api?operation=getUserHeader&userID=" + specialData.OwnerID;
			
			cloned.querySelector("#verify").addEventListener("click", async function() {
				if(!window.confirm("You are about to VERIFY the mod \"" + modInfos[i].DisplayName + "\", do you want to continue?")) {
					return;
				}
				let response = await API.verifyMod(modInfos[i].UniqueID);
				if(response.Error != null) {
					createBanner(response.Error, "Error", "error");
				} else {
					cloned.remove();
					createBanner("Verified mod \"" + modInfos[i].DisplayName + "\".", "Success", "check", 2500);
				}
			});

			cloned.querySelector("#removeButton").addEventListener("click", async function() {
				if(!window.confirm("You are about to REMOVE the mod \"" + modInfos[i].DisplayName + "\", do you want to continue?")) {
					return;
				}
				let response = await API.removeMod(modInfos[i].UniqueID);
				if(response.Error != null) {
					createBanner(response.Error, "Error", "error");
				} else {
					cloned.remove();
					createBanner("Removed mod \"" + modInfos[i].DisplayName + "\".", "Success", "check", 2500);
				}
			});
			
			API.getModImage(cloned.querySelector(".modImage"), modInfos[i].UniqueID, true);
			
			cloned.style = "";
			modsHolder.appendChild(cloned);
		}
	}
}

loadMods();