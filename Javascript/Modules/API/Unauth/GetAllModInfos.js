import { Post } from "../General.js";

function getAllModInfos() {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=getAllModInfos", {});
		e = JSON.parse(e);
		resolve(e);

	});
};

export { getAllModInfos };