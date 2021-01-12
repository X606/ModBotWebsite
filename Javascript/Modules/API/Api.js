import { getCookie, setCookie, removeCookie } from "../Cookies.js";
import { createBanner } from "../popup.js";
import { getImageDimentions } from "../imageHandeling.js";

// General
function Post(url, data) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data));

	return new Promise(resolve => {
		xhr.onload = function () {
			resolve(xhr.responseText);
		}
	});	
}
function PostRaw(url, data) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(data);

	return new Promise(resolve => {
		xhr.onload = function () {
			resolve(xhr.responseText);
		}
	});	
}

function copyToClipboard(str) {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);

	createBanner("Copied \"" + str + "\" to clipboard.", null, "check_circle", 1000);
};

// Auth
function updateCustomConsoleCss(data) {
	return new Promise(async resolve => {
		var e = await PostRaw("/api/?operation=setCustomConsoleCss", data);
		resolve(e);
	});
};
function hasLikedComment(modID, commentID) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=hasLikedComment",
			{
				modId: modID,
				commentId: commentID
			});
		e = JSON.parse(e);
		resolve(e);
	});
};
function isCommentMine(modID, commentID) {
	return new Promise(async resolve => {

		var e = await Post("/api/?operation=isCommentMine",
			{
				modId: modID,
				commentId: commentID
			});
		e = JSON.parse(e);
		resolve(e);
	});
};
function getMyAuthenticationLevel() {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=getMyAuth", {});

		e = JSON.parse(e);
		resolve(e);
	});
}
function adminCommand(message) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=adminCommand", {Message: message});

		resolve(e);
	});
}

function postComment(targetModID, commentBody) {
	return new Promise(async resolve => {

		var e = await Post("/api/?operation=postComment",
			{
				targetModId: targetModID,
				commentBody: commentBody
			});

		e = JSON.parse(e);
		resolve(e);
	});
};

function deleteComment(targetModID, targetCommentId) {
	return new Promise(async resolve => {

		var e = await Post("/api/?operation=deleteComment",
			{
				targetModId: targetModID,
				targetCommentId: targetCommentId
			});

		e = JSON.parse(e);
		resolve(e);
	});
};

function likeComment(targetModID, targetCommentId, state) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=likeComment",
			{
				likeState: state,
				modId: targetModID,
				commentId: targetCommentId
			});

		e = JSON.parse(e);
		resolve(e);
	});
}

function createAccount(username, password) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=createAccout",
			{
				username: username,
				password: password
			});

		e = JSON.parse(e);

		if (e.isError == false) {
			const success = await setCurrentSessionId(e.sessionID);
			if (!success) {
				console.error('The id we got back from the server when creating the accout was invalid');
			}

			resolve(e);
			return;
		}

		resolve(e);
	});
};



function downloadModTemplate(modName, description, tags) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=getModTemplate",
			{
				modName: modName,
				description: description,
				tags: tags
			});

		e = JSON.parse(e);

		if (e.isError) {
			resolve(e);
			return;
		}

		downloadTempFile(e.fileKey);
		resolve({ isError: false, message: "Downloading file..." });
	});

};



function isValidSessionId(sessionID) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=isValidSession",
			{
				sessionId: sessionID,
			});

		e = JSON.parse(e);

		resolve(e);
	});
};

const sessionIdKey = "SessionID";

function getCurrentSessionId() {
	return new Promise(async resolve => {
		const id = getCookie(sessionIdKey);
		if (id == "") {
			resolve("");
			return;
		}

		const isValid = await isValidSessionId(id);
		if (!isValid) {
			removeCookie(sessionIdKey);
			resolve("");
			return;
		} else {
			resolve(id);
			return;
		}
	});
}
function setCurrentSessionId(sessionId) {
	return new Promise(async resolve => {
		const isValid = await isValidSessionId(sessionId);
		if (isValid) {
			setCookie(sessionIdKey, sessionId, 60);
			resolve(true);
		} else {
			resolve(false);
		}

	});
}


function signIn(username, password) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=signIn",
			{
				username: username,
				password: password
			});

		e = JSON.parse(e);
		if (e.sessionID != null) {
			setCurrentSessionId(e.sessionID);
		}

		resolve(e);

	});
}
function signOut() {
	return new Promise(async resolve => {

		var e = await Post("/api/?operation=signOut", {});

		e = JSON.parse(e);
		if (e.sessionID != null) {
			setCurrentSessionId(e.sessionID);
		}

		resolve(e);
	});
}
function isSignedIn() {
	return new Promise(async resolve => {
		const sessionID = await getCurrentSessionId();
		if (sessionID == "") {
			resolve(false);
			return;
		} else {
			resolve(true);
			return;
		}

	});
};

function getCurrentUser() {
	return new Promise(async resolve => {
		resolve(await Post("/api/?operation=getCurrentUser", { }));
	});
}
function hasLikedMod(modID) {
	return new Promise(async resolve => {
		var hasLikedMod = await Post("/api/?operation=hasLiked",
			{
				modId: modID
			});

		hasLikedMod = JSON.parse(hasLikedMod);

		resolve(hasLikedMod);
	});

}

function setLikedMod(modID, state) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=like",
			{
				likedModId: modID,
				likeState: state
			});
		e = JSON.parse(e);
		resolve(e);
	});
}

function updateUserData(sessionID, password, username, bio, newPassword, borderStyle, showFull) {
	return new Promise(async resolve => {

		var e = await Post("/api/?operation=updateUserData",
			{
				password: password,

				username: username,
				bio: bio,
				newPassword: newPassword,
				borderStyle: borderStyle,
				showFull: showFull
			});
		e = JSON.parse(e);
		resolve(e);

	});
}

function favoriteMod(modID, favorite) {
	return new Promise(async resolve => {

		var e = await Post("/api/?operation=favoriteMod",
			{
				modID: modID,
				favorite: favorite
			});
		e = JSON.parse(e);
		resolve(e);

	});
}


// Unauth

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
	Liked: 'liked',
	Downloads: 'downloads',
	PostDate: 'postedDate',
	EditedDate: 'editedDate'
};
function SearchRequest() {
	this.searchString = null;
	this.includeDescriptionsInSearch = false;
	this.userID = null;
	this.modID = null;
	this.sortOrder = 'liked';

	this.Send = function () {
		return new Promise(async resolve => {

			var result = await Post('/api/?operation=search',
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

// files
function downloadMod(modID) {
	window.open("/api/?operation=downloadMod&id=" + modID);
};
function downloadTempFile(key) {
	window.open("/api/?operation=downloadTempFile&key=" + key);
};


const API = {};

API.updateCustomConsoleCss = updateCustomConsoleCss;
API.isValidSessionId = isValidSessionId;
API.createAccount = createAccount;
API.getCurrentSessionId = getCurrentSessionId;
API.setCurrentSessionId = setCurrentSessionId;
API.hasLikedMod = hasLikedMod;
API.hasLikedComment = hasLikedComment;
API.getMyAuthenticationLevel = getMyAuthenticationLevel;
API.adminCommand = adminCommand;
API.isCommentMine = isCommentMine;
API.isSignedIn = isSignedIn;
API.signIn = signIn;
API.signOut = signOut;
API.postComment = postComment;
API.deleteComment = deleteComment;
API.likeComment = likeComment;
API.downloadModTemplate = downloadModTemplate;
API.getCurrentUser = getCurrentUser;
API.setLikedMod = setLikedMod;
API.updateUserData = updateUserData;
API.favoriteMod = favoriteMod;

API.getAllModIds = getAllModIds;
API.getAllModInfos = getAllModInfos;
API.setImageElementToModImage = setImageElementToModImage;
API.setImageElementToProfilePicture = setImageElementToProfilePicture;
API.getModData = getModData;
API.getSpecialModData = getSpecialModData;
API.getUser = getUser;
API.SearchRequest = SearchRequest;
API.searchSortTypes = searchSortTypes;
API.getProfilePictureLink = getProfilePictureLink;
API.BorderStyle = BorderStyle;

API.downloadMod = downloadMod;
API.downloadTempFile = downloadTempFile;


export { API };