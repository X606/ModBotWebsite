import { getCurrentSessionId } from "./Sessions";
import { downloadTempFile } from "../Files";
import { Post } from "../General";

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

export { downloadModTemplate };