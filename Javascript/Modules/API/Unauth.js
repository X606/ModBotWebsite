import { Post } from "./General.js";
import { getImageDimentions } from "../imageHandeling.js";

const pixelCutoffSize = 32;

function getAllModInfos() {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=getAllModInfos", {});
		e = JSON.parse(e);
		resolve(e);

	});
};

function getAllModIds() {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=getAllModIds", {});
		e = JSON.parse(e);

		resolve(e);
	});
}

function getModData(modID) {
	return new Promise(async resove => {
		var e = await Post("/api/?operation=getModData&id=" + modID, {});

		e = JSON.parse(e);

		resove(e);
	});
};
function getSpecialModData(modId) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=getSpecialModData&id=" + modId, {});
		e = JSON.parse(e);

		resolve(e);
	});
};

function setImageElementToModImage(element, modID) {
	element.src = "/api/?operation=getModImage&id=" + modID;
};
function setImageElementToProfilePicture(element, userID) {
	return new Promise(async resolve => {
		element.src = getProfilePictureLink(userID);

		let dimentions = await getImageDimentions(getProfilePictureLink(userID));

		if (dimentions[0] < pixelCutoffSize || dimentions[1] < pixelCutoffSize) { // if the image is small, display the pixels
			element.style = "image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;";
		}

		resolve(null);
	});
};
function getProfilePictureLink(userID) {
	return "/api/?operation=getProfilePicture&id=" + userID;
}

const searchSortTypes = {
	Liked: "liked",
	Downloads: "downloads",
	PostDate: "postedDate",
	EditedDate: "editedDate"
};
function SearchRequest(callback) {
	this.searchString = null;
	this.includeDescriptionsInSearch = false;
	this.userID = null;

	this.sortOrder = "liked";

	this.setSortOrder = function (sortOrder) {
		this.sortOrder = sortOrder;
	}
	this.setUserId = function (userId) {
		this.userID = userId;
	}
	this.setSearchString = function (searchString) {
		this.searchString = searchString;
	}

	this.Send = function () {
		return new Promise(async resolve => {

			var result = await Post("/api/?operation=search",
				{
					searchString: this.searchString,
					includeDescriptionsInSearch: this.includeDescriptionsInSearch,
					userID: this.userID,
					sortOrder: this.sortOrder
				});
			resolve(result);

		});
	}
}

export {
	searchSortTypes,
	SearchRequest,
	getAllModInfos,
	getAllModIds,
	setImageElementToModImage,
	setImageElementToProfilePicture,
	getModData,
	getSpecialModData,
	getProfilePictureLink
};