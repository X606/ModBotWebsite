import { Post } from "../General";

searchSortTypes = {
	Liked: "liked",
	Downloads: "downloads",
	PostDate: "postedDate",
	EditedDate: "editedDate"
};
function SearchRequest (callback) {
	this.searchString = null;
	this.includeDescriptionsInSearch = false;
	this.userID = null;

	this.sortOrder = "liked";

	this.setSortOrder = function (sortOrder) {
		this.sortOrder = sortOrder;
	}
	this.setUserId = function (userId) {
		this.userID = userId;
	}
	this.setSearchString = function (searchString) {
		this.searchString = searchString;
	}

	this.Send = function () {
		return new Promise(async resolve => {

			var result = await Post("/api/?operation=search",
				{
					searchString: this.searchString,
					includeDescriptionsInSearch: this.includeDescriptionsInSearch,
					userID: this.userID,
					sortOrder: this.sortOrder
				});
			resolve(result);

		});
	}
}

export { searchSortTypes, SearchRequest };