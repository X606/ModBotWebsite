import { API } from "/api?operation=getAPI";
import {ProcessTagString} from "/Javascript/Modules/Tags.js";

var tags = null;

async function onLoad() {
	const prefab = document.getElementById("tagBoxPrefab");
	const holder = document.getElementById("tagsHolder");
	tags = (await API.getTags()).tags;
	
	for(let i = 0; i < tags.length; i++) {
		if(!tags[i].Verified) {
			continue;
		}
		let cloned = prefab.cloneNode(true);

		cloned.querySelector("#tagHolder").insertAdjacentHTML("beforeend", ProcessTagString(tags[i].Body));
		cloned.querySelector("#tagTitle").insertAdjacentHTML("beforeend", tags[i].TagName);
		cloned.querySelector("#userHeader").src = "/api?operation=getUserHeader&userID=" + tags[i].CreatorId;
		cloned.style = "";

		holder.appendChild(cloned);
	}
}

onLoad();