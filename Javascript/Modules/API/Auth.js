import { Post } from "./General.js";
import { downloadTempFile } from "./Files";
import { getCookie, setCookie, removeCookie } from "../Cookies.js";

function hasLikedComment(modID, commentID) {
	return new Promise(async resolve => {
		const sessionID = await getCurrentSessionId();
		if (sessionID == "") {
			resolve(false);
			return;
		}

		var e = await Post("/api/?operation=hasLikedComment",
			{
				sessionId: sessionID,
				modId: modID,
				commentId: commentID
			});
		e = JSON.parse(e);
		resolve(e);
	});
};
function isCommentMine(modID, commentID) {
	return new Promise(async resolve => {
		const sessionID = await getCurrentSessionId();
		if (sessionID == "") {
			resolve(false);
			return;
		}

		var e = await Post("/api/?operation=isCommentMine",
			{
				sessionId: sessionID,
				modId: modID,
				commentId: commentID
			});
		e = JSON.parse(e);
		resolve(e);
	});
};

function postComment(targetModID, commentBody) {
	return new Promise(async resolve => {
		const sessionID = await getCurrentSessionId();

		if (sessionID == "") {
			var message = { isError: true, message: "You are not signed in" };
			resolve(message);
			return;
		}

		var e = await Post("/api/?operation=postComment",
			{
				targetModId: targetModID,
				sessionId: sessionID,
				commentBody: commentBody
			});

		e = JSON.parse(e);
		resolve(e);
	});
};

function deleteComment(targetModID, targetCommentId) {
	return new Promise(async resolve => {
		const sessionID = await getCurrentSessionId();

		if (sessionID == "") {
			var message = { isError: true, message: "You are not signed in" };
			resolve(message);
			return;
		}

		var e = await Post("/api/?operation=deleteComment",
			{
				targetModId: targetModID,
				sessionId: sessionID,
				targetCommentId: targetCommentId
			});

		e = JSON.parse(e);
		resolve(e);
	});
};

function likeComment(targetModID, targetCommentId, state) {
	return new Promise(async resolve => {
		const sessionID = await getCurrentSessionId();

		if (sessionID == "") {
			var message = { isError: true, message: "You are not signed in" };
			resolve(message);
			return;
		}

		var e = await Post("/api/?operation=likeComment",
			{
				likeState: state,
				sessionId: sessionID,
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
				console.error("The id we got back from the server when creating the accout was invalid");
			}

			resolve(e);
			return;
		}

		resolve(e);
	});
};



function downloadModTemplate(modName, description, tags) {
	return new Promise(async resolve => {
		const sessionID = await getCurrentSessionId();

		if (sessionID == "") {
			var message = { isError: true, message: "You are not signed in" };
			resolve(message);
			return;
		}

		var e = await Post("/api/?operation=getModTemplate",
			{
				modName: modName,
				description: description,
				tags: tags,
				sessionId: sessionID
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
		const sessionID = await getCurrentSessionId();
		if (sessionID == "") {
			var message = { isError: true, message: "You are not signed in" };
			resolve(message);
		}

		var e = await Post("/api/?operation=signOut",
			{
				sessionID: sessionID
			});

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
		const sessionID = await getCurrentSessionId();
		if (sessionID == "") {
			resolve("null");
			return;
		}

		resolve(await Post("/api/?operation=getCurrentUser", { sessionId: sessionID }));
	});
}
function hasLikedMod(modID) {
	return new Promise(async resolve => {
		const sessionId = await getCurrentSessionId();
		if (sessionId == "") {
			resolve(false);
			return;
		}

		var hasLikedMod = await Post("/api/?operation=hasLiked",
			{
				sessionId: sessionId,
				modId: modID
			});

		hasLikedMod = JSON.parse(hasLikedMod);

		resolve(hasLikedMod);
	});

}

function setLikedMod(modID, state) {
	return new Promise(async resolve => {
		const sessionId = await getCurrentSessionId();
		if (sessionId == "") {
			resolve(false);
			return;
		}

		var e = await Post("/api/?operation=like",
			{
				sessionId: sessionId,
				likedModId: modID,
				likeState: state
			});
		e = JSON.parse(e);
		resolve(e);
	});
}

function updateUserData(sessionID, password, username, bio, newPassword, borderStyle, showFull) {
	return new Promise(async resolve => {
		const sessionId = await getCurrentSessionId();
		if (sessionId == "") {
			resolve(false);
			return;
		}

		var e = await Post("/api/?operation=updateUserData",
			{
				sessionID: sessionID,
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
		const sessionId = await getCurrentSessionId();
		if (sessionId == "") {
			resolve({isError:true, message:"you're not logged in"});
			return;
		}

		var e = await Post("/api/?operation=favoriteMod",
			{
				sessionID: sessionId,
				modID: modID,
				favorite: favorite
			});
		e = JSON.parse(e);
		resolve(e);

	});
}

export {
	hasLikedMod,
	getCurrentUser,
	signIn,
	signOut,
	isSignedIn,
	hasLikedComment,
	isCommentMine,
	postComment,
	deleteComment,
	likeComment,
	createAccount,
	downloadModTemplate,
	isValidSessionId,
	getCurrentSessionId,
	setCurrentSessionId,
	setLikedMod,
	updateUserData,
	favoriteMod
};