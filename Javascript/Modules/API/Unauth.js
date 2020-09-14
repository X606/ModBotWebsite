import { Post } from "./General.js";
import { getImageDimentions } from "../imageHandeling.js";

const pixelCutoffSize = 32;

function getUser(userID) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=getUser&id=" + userID, {});
		e = JSON.parse(e);
		resolve(e);
	});
}

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

const BorderStyle = {
	Square: 0,
	Rounded: 1,
	Round: 2
}

function setImageElementToProfilePicture(element, userID) {
	return new Promise(async resolve => {
		element.src = getProfilePictureLink(userID);

		let dimentions = await getImageDimentions(getProfilePictureLink(userID));
		
		var style = "";
		if (dimentions[0] < pixelCutoffSize || dimentions[1] < pixelCutoffSize) { // if the image is small, display the pixels
			style = "image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; ";
			element.style = style;
			 
		}

		var asyncSetImageStyle = async function () {
			var userData = await getUser(userID);

			if (userData.borderStyle == BorderStyle.Square) {
				element.style = style + "border-radius: 0px; ";
			} else if (userData.borderStyle == BorderStyle.Rounded) {
				element.style = style + "border-radius: 25%; ";
			} else if (userData.borderStyle == BorderStyle.Round) {
				element.style = style + "border-radius: 50%; ";
			}

			if (userData.showFull) {
				element.style = style + "object-fit: contain; ";
			}
		}

		asyncSetImageStyle();

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
function SearchRequest() {
	this.searchString = null;
	this.includeDescriptionsInSearch = false;
	this.userID = null;
	this.modID = null;
	this.sortOrder = "liked";

	this.Send = function () {
		return new Promise(async resolve => {

			var result = await Post("/api/?operation=search",
				{
					searchString: this.searchString,
					includeDescriptionsInSearch: this.includeDescriptionsInSearch,
					userID: this.userID,
					sortOrder: this.sortOrder,
					modID: this.modID
				});
			result = JSON.parse(result);

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
	getProfilePictureLink,
	getUser,
	BorderStyle
};