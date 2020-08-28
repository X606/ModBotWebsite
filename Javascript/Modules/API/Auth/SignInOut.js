import { setCurrentSessionId, getCurrentSessionId } from "./Sessions.js";
import { Post } from "../General.js";
import { isValidSessionId } from "./IsValidSessionId.js";

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

export { signIn, signOut, isSignedIn };