import { getCurrentSessionId } from "./Sessions.js";
import { Post } from "../General.js";

function hasLikedComment(modID, commentID) {
	return new Promise(async resolve => {
		const sessionID = getCurrentSessionId();
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
		const sessionID = getCurrentSessionId();
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


export { hasLikedComment, isCommentMine, postComment, deleteComment, likeComment };