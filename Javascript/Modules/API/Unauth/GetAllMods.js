import { Post } from "../General.js";

function getAllModIds() {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=getAllModIds", {});
		e = JSON.parse(e);

		resolve(e);
	});
}

export { getAllModIds };