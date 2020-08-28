import { Post } from "./../General.js";

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

export { isValidSessionId };