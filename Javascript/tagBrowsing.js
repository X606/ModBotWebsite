import { API } from "/api?operation=getAPI";
import { ProcessTagString } from "/Javascript/Modules/Tags.js";
import { createBanner, createPopup } from "/Javascript/Modules/popup.js";

var tags = null;
var myTags = [];

const paddingBetweenTags = 10;

function getMyTags() {
	return myTags;
}
window.getMyTags = getMyTags;

function setMyTags(val) {
	myTags = val;
	onMyTagsChanged();
}
window.setMyTags = setMyTags;

function flip(i1, i2) {
	if (i1 < 0 || i2 < 0) {
		return;
	}

	let arr = getMyTags();

	if (i1 >= arr.length || i2 >= arr.length) {
		return;
	}

	let temp = arr[i1];
	arr[i1] = arr[i2];
	arr[i2] = temp;

	setMyTags(arr);
}
window.flip = flip;

async function loadSignedInContent() {
	const sessionId = await API.getCurrentSessionId();

	if (sessionId == "") {
		document.getElementById("signInText").style = "";
	} else {
		if ( await API.getMyAuth() >= 2) {
			document.getElementById("uploadButton").style = "";
			document.getElementById("tagOrderEditor").style = "";
		} else {
			document.getElementById("signInText").style = "";
		}
	}
}
loadSignedInContent();

function getTag(tagId) {
	for(let i = 0; i < tags.length; i++) {
		if (tags[i].TagID == tagId) {
			return tags[i];
		}
	}

	return null;
}

var selectedTag = null;

function onDisplayTagClicked(e) {
	// hack to get the id of the clicked tag:
	let element = e.target;
	while(element.id == "")
	{
		element = element.parentNode;
	}

	let id = element.id.substr(4);
	let index = myTags.indexOf(id);

	if (selectedTag == null) {
		element.style.setProperty("background-color", "#00aa00");
		selectedTag = element;
	} else {
		let otherId = selectedTag.id.substr(4);
		let otherIndex = myTags.indexOf(otherId);

		if (index != otherIndex) {
			flip(index, otherIndex);
		}

		selectedTag.style.setProperty("background-color", "");
		selectedTag = null;
	}
}

async function onMyTagsChanged(onDone) {
	let result = await API.setPlayerTags(myTags);
	if (!result.isError) {
		createBanner(result.message, "Success", "check_circle", 1000);

		if (onDone)
			onDone(true);
	} else 
	{
		createBanner(result.message, "Error", "error", 2000);
		myTags = (await API.getMyTags()).Tags;
		
		if (onDone)
			onDone(false);
		return;
	}
	
	const holder = document.getElementById("tagDisplayHolder");

	let currentTags = document.getElementsByClassName("tagDisplay");
	for(let i = 0; i < currentTags.length; i++) {
		let foundMatch = false;
		for(let j = 0; j < myTags.length; j++) {
			if (currentTags[i].id == ("tag_" + myTags[j]))
				foundMatch = true;
		}
		if (!foundMatch)
			currentTags[i].remove();

	}

	let offset = 0;
	for(let i = 0; i < myTags.length; i++) {
		let oldElement = document.getElementById("tag_" + myTags[i]);
		let element = null;
		if (oldElement != null) {
			element = oldElement;
		} else {
			element = document.createElement("span")
			element.setAttribute("class", "tagDisplay");
			element.id = "tag_" + myTags[i];
			element.innerHTML = ProcessTagString(getTag(myTags[i]).Body);
			element.addEventListener("click", onDisplayTagClicked);
			holder.appendChild(element);
		}

		element.style = "left: " + offset + "px;";

		offset += element.getBoundingClientRect().width + paddingBetweenTags;
	}

}
function onTagsSet() {
	const holder = document.getElementById("tagDisplayHolder");
	holder.innerHTML = "";
	let offset = 0;

	for(let i = 0; i < myTags.length; i++) {
		let span = document.createElement("span")
		span.setAttribute("class", "tagDisplay");
		span.style = "left: " + offset + "px;";
		span.id = "tag_" + myTags[i];
		span.innerHTML = ProcessTagString(getTag(myTags[i]).Body);
		span.addEventListener("click", onDisplayTagClicked);
		holder.appendChild(span);

		offset += span.getBoundingClientRect().width + paddingBetweenTags;
	}
}

async function loadTags() {
	const prefab = document.getElementById("tagBoxPrefab");
	const holder = document.getElementById("tagsHolder");

	let localUser = "";
	let authenticaionLevel = 0;

	if (API.getCurrentSessionId() == "" || await API.getMyAuth() < 2) {
		
		tags = (await API.getTags()).tags;

	} else {
		let result = await Promise.all([API.getCurrentUser(), API.getTags(), API.getMyAuth(), API.getMyTags()]);

		localUser = result[0];
		tags = result[1].tags;
		authenticaionLevel = result[2];
		myTags = result[3].Tags;
		onTagsSet();
	}

	

	for(let i = 0; i < tags.length; i++) {
		const index = i;

		if(!tags[i].Verified) {
			continue;
		}
		let cloned = prefab.cloneNode(true);

		cloned.querySelector("#tagHolder").insertAdjacentHTML("beforeend", ProcessTagString(tags[i].Body));
		cloned.querySelector("#tagTitle").insertAdjacentHTML("beforeend", tags[i].TagName);
		cloned.querySelector("#userHeader").src = "/api?operation=getUserHeader&userID=" + tags[i].CreatorId;
		cloned.querySelector("#editTagButton").addEventListener("click", () => {
			window.location = "/tagDesigner.html?tagID=" + tags[index].TagID;
		});
		cloned.querySelector("#deleteTagButton").addEventListener("click", async () => {
			if (confirm("Are you sure you want to delete this tag?")) {
				let response = await API.removeTag(tags[index].TagID);
				
				if (response.isError) {
					createBanner(response.message, "Error", "error", 2500);
				} else {
					createBanner(response.message, "Success", "check_circle", 2500);
					setTimeout(() => {
						location.reload();
					}, 1000);
				}

			}

		});
		const useTagButton = cloned.querySelector("#useTagButton");
		if (myTags.includes(tags[i].TagID)) {
			useTagButton.style = "color: var(--primaryColor);";
		}
		useTagButton.addEventListener("click", () => {
			if (myTags.includes(tags[index].TagID)) {
				
				const ind = myTags.indexOf(tags[index].TagID);
				if (ind > -1) {
					myTags.splice(ind, 1);
				}
				onMyTagsChanged((worked) => {
					if(worked) {
						useTagButton.style = "";
					}
				});
				
				
			} else {
				myTags.push(tags[index].TagID);
				onMyTagsChanged((worked) => {
					if(worked) {
						useTagButton.style = "color: var(--primaryColor)";
					}
				});

			}
		});
		if (authenticaionLevel < 4 && localUser != tags[i].CreatorId) {
			cloned.querySelector(".menu").style = "display: none;";
		}
		if (authenticaionLevel < 2) {
			cloned.querySelector("#useTagButton").style = "display: none;";
		}
		cloned.style = "";

		holder.appendChild(cloned);
	}
}
loadTags();
