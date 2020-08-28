import { Post } from "../General";
import { getCurrentSessionId } from "./Sessions";

function getUser(userID) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=getUser&id=" + userID, {});
		e = JSON.parse(e);
		resolve(e);
	});
}

function getCurrentUser() {
	return new Promise(async resolve => {
		const sessionID = await getCurrentSessionId();
		if (sessionID == "") {
			resolve("null");
			return;
		}

		return await Post("/api/?operation=getCurrentUser", { sessionId: sessionID });
	});
}

export { getUser, getCurrentUser };