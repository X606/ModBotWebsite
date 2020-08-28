import { Post } from "../General.js";

function getModData(modID) {
	return new Promise(async resove => {
		var e = await Post("/api/?operation=getModData&id=" + modID, {});

		e = JSON.parse(e);

		resove(e);
	});
};
function getSpecialModData(modId) {
	return new Promise(async resolve => {
		var e = await Post("/api/?operation=getSpecialModData&id=" + modId, {});
		e = JSON.parse(e);

		resolve(e);
	});
};

export { getModData, getSpecialModData};