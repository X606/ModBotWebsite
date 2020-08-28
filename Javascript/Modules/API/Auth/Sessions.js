import { getCookie, setCookie, removeCookie } from "./../../Cookies.js";
import { isValidSessionId } from "./IsValidSessionId.js";

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


export { getCurrentSessionId, setCurrentSessionId};