import { API } from "/api?operation=getAPI";
import { ProcessTagString } from "/Javascript/Modules/Tags.js";
import { createBanner, createPopup } from "/Javascript/Modules/popup.js";

async function onLoad() {
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
				createBanner("Verified tag \"" + tags[i].TagName + "\".", "Success", "check_circle", 2500);
			}
		});

		cloned.querySelector("#removeButton").addEventListener("click", async function() {
			let response = await API.removeTag(tags[i].TagID);
			if(response.Error != null) {
				createBanner(response.Error, "Error", "error");
			} else {
				cloned.remove();
				createBanner("Deleted tag \"" + tags[i].TagName + "\".", "Success", "check_circle", 2500);
			}
		});

		tagsHolder.appendChild(cloned);
	}
}
onLoad();