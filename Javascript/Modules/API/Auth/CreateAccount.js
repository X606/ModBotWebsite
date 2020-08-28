import { Post } from "./../General.js";
import { setCurrentSessionId } from "./Sessions.js"

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

export { createAccount };