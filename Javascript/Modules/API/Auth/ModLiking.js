import { getCurrentSessionId } from "./Sessions.js";
import { Post } from "../General.js";

function hasLikedMod(modID) {
	return new Promise(async resolve => {
		const sessionId = await getCurrentSessionId();
		if (sessionId == "") {
			resolve(false);
			return;
		}

		const hasLikedMod = await Post("/api/?operation=hasLiked",
			{
				sessionId: sessionId,
				modId: modID
			});

		return hasLikedMod;
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
				sessionId: sessionId;
				likedModId: modID,
				likeState: state
			});
		e = JSON.parse(e);
		resolve(e);
	});
}

export { hasLikedMod };