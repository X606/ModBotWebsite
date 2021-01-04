import { API } from "./Modules/API/Api.js";
import { createBanner } from "./Modules/popup.js";
import { copyToClipboard } from "./Modules/API/General.js";

const urlParams = new URLSearchParams(window.location.search);
const modID = urlParams.get("modID");


if (!modID || modID == "") {
	window.location.replace("/404.html");
}



var selector = document.getElementById("commentSorting");
var currentSort = urlParams.get("comments");
	
if(currentSort == "newest") {
	selector.value = "new";
} else {
	selector.value = "liked"
}

selector.addEventListener("change", function () {
	var pathNameWithoutQuery = window.location.pathname;

	if (selector.value == "new" && currentSort != "newest") {
		window.location.href = pathNameWithoutQuery + "?modID=" + modID + "&comments=newest";

	} else if (selector.value == "liked" && currentSort == "newest") {
		window.location.href = pathNameWithoutQuery + "?modID=" + modID;
	}
});

var sessionID = "";

async function asyncOnLoad() {
	sessionID = await API.getCurrentSessionId();

	if (sessionID == "") { // is not signed in
		document.getElementById("signInText").style = "";
	}
	else // is signed in
	{
		document.getElementById("commentPoster").style = "";
	}

	
	const asyncGetModData = async function () {
		var modData = await API.getModData(modID);
		if (modData == null) {
			window.location.replace("/404.html");
			return;
		}

		var image = document.getElementsByClassName("modImage")[0];
		API.setImageElementToModImage(image, modID);

		document.getElementsByClassName("modTitle")[0].innerHTML = modData.DisplayName;

		var description = modData.Description;
		if (!description) {
			description = "";
		}
		document.getElementsByClassName("modDescription")[0].innerHTML = description;

		document.getElementById("copyButton").addEventListener("click", function () {
			copyToClipboard(modID);
		});
		document.getElementById("downloadButton").addEventListener("click", function () {
			API.downloadMod(modID);
		});
		document.getElementById("rateButton").addEventListener("click", async function () {
			var isSingnedIn = sessionID != "";
			if (isSingnedIn) {
				var hasLikedMod = await API.hasLikedMod(modID);

				var likes = Number.parseInt(document.getElementById("likedCount").innerHTML);

				if (!hasLikedMod) {
					document.getElementById("rateButton").style = "color: var(--primaryColor);";
					likes++;
				} else {
					document.getElementById("rateButton").style = "";
					likes--;
				}
				API.setLikedMod(modID, !hasLikedMod);

				document.getElementById("likedCount").innerHTML = likes;
			} else {
				createBanner("You have to be signed in to like mods.", null, "error", 2000);
			}
		});
		document.getElementById("postCommentButton").addEventListener("click", async function () {
			var comment = document.getElementById("commentTextArea");
			var commentError = document.getElementById("commentError")

			if (isNullOrWhitespace(comment.value)) {
				commentError.innerHTML = "Unable to post empty comment.";
				return;
			}

			var returnValue = await API.postComment(modID, comment.value);
			if (returnValue.isError) {
				commentError.innerHTML = returnValue.message;
				return;
			}
			comment.value = "";
			window.location.reload();

		});

		document.getElementById("hideElements").innerHTML = "#mainHolder > * { opacity: 1; transition-duration: 1s; transition-property: opacity;}";
	}
	asyncGetModData();

	const asyncGetSpecialModData = async function () {
		var modData = await API.getSpecialModData(modID);
		if (modData == null)
			return;

		document.getElementById("modAuthor").src += "?userID=" + modData.OwnerID;
		document.getElementById("likedCount").innerHTML = modData.Likes;

		const asyncHasLikedMod = async function () {
			const hasLikedMod = await API.hasLikedMod(modID);

			if (hasLikedMod) {
				document.getElementById("rateButton").style = "color: var(--primaryColor);";
			}
		}
		asyncHasLikedMod();

		document.getElementById("uploadDate").innerHTML = formatDate(new Date(modData.PostedDate * 1000));
		document.getElementById("updateDate").innerHTML = formatDate(new Date(modData.UpdatedDate * 1000));

		const sort = urlParams.get("comments");
		if (sort == "newest") {
			var localuser = await API.getCurrentUser();
			DownloadedNonSpawnedComments = modData.Comments.sort(function (a, b) { // put the current users comments first, otherwise sort after posted time
				var aIsUser = a.PosterUserId == localuser;
				var bIsUser = b.PosterUserId == localuser;
				if (aIsUser == bIsUser) {
					return a.PostedUTCTime - b.PostedUTCTime;
				}

				if (aIsUser) {
					return 1;
				}
				else if (bIsUser) {
					return -1;
				}
			});
		}
		else {
			var localuser = await API.getCurrentUser();
			DownloadedNonSpawnedComments = modData.Comments.sort(function (a, b) { // put the current users comments first, otherwise sort after likes
				var aIsUser = a.PosterUserId == localuser;
				var bIsUser = b.PosterUserId == localuser;
				if (aIsUser == bIsUser) {
					return a.UsersWhoLikedThis.length - b.UsersWhoLikedThis.length;
				}

				if (aIsUser) {
					return 1;
				}
				else if (bIsUser) {
					return -1;
				}
			});
		}


		SpawnNextComments();

		document.getElementById("loadButton").addEventListener("click", function () {
			SpawnNextComments();
		});
	}
	asyncGetSpecialModData();

}
asyncOnLoad();

function SpawnNextComments() {
	var count = Math.min(DownloadedNonSpawnedComments.length, 2);

	const commentPrefab = document.getElementById("commentPrefab");
	const commentHolder = document.getElementById("commentHolder");

	for (var i = 0; i < count; i++) {
		const comment = DownloadedNonSpawnedComments.pop();

		const cloned = commentPrefab.cloneNode(true);
		cloned.id = "";
		cloned.querySelector(".userHeader").src += "?userID=" + comment.PosterUserId;
		cloned.querySelector("#postTime").innerHTML = timeDifference(new Date().getTime(), comment.PostedUTCTime*1000);
		var content = cloned.querySelector(".commentContent");
		content.innerHTML = comment.CommentBody;

		cloned.querySelector(".commentLikedCount").innerHTML = comment.UsersWhoLikedThis.length;
		const likeButton = cloned.querySelector(".likeButton");

		const asyncHasLikedComment = async function () {
			const hasLikedComment = await API.hasLikedComment(modID, comment.CommentID);
			if (hasLikedComment) {
				likeButton.style = "color: var(--primaryColor);";
			} else {
				likeButton.style = "";
			}
		}
		asyncHasLikedComment();

		likeButton.addEventListener("click", async function () {
			const isSingedIn = sessionID != "";

			if (isSingedIn) {
				var hasLikedComment = await API.hasLikedComment(modID, comment.CommentID);
				const commentLikedCountDisplay = likeButton.querySelector(".commentLikedCount");

				var likes = Number.parseInt(commentLikedCountDisplay.innerHTML);
				if (!hasLikedComment) {
					likeButton.style = "color: var(--primaryColor);";
					likes++;
				} else {
					likeButton.style = "";
					likes--;
				}

				API.likeComment(modID, comment.CommentID, !hasLikedComment);
				commentLikedCountDisplay.innerHTML = likes;
			} else {
				createBanner("You have to be signed in to like comments.", null, "error", 2000);
			}
			
		});
		
		const deleteButton = cloned.querySelector(".deleteButton");
		deleteButton.addEventListener("click", function () {
			if (confirm("Are you sure you want to delete your comment?")) {
				API.deleteComment(modID, comment.CommentID);
				cloned.remove();
			}
		});

		var asyncIsCommentMine = async function () {
			const isCommentMine = await API.isCommentMine(modID, comment.CommentID);

			if (isCommentMine) {
				deleteButton.style = "";
			}
		}
		asyncIsCommentMine();

		const showButton = cloned.querySelector(".showButton");

		if (comment.CommentBody.length < 500) {
			showButton.style = "display: none;";
		}

		showButton.addEventListener("click", function () {
			
			if (showButton.innerHTML == "Show more") {
				cloned.style = "max-height: 1000em;";
				showButton.innerHTML = "Show less";
			} else {
				cloned.style = "";
				showButton.innerHTML = "Show more";
			}
			
		});

		cloned.style = "";
		commentHolder.appendChild(cloned);
		content.style = "opacity: 1; transition-duration: 2s; transition-property: opacity;";
	}

	if (DownloadedNonSpawnedComments.length == 0) {
		document.getElementById("loadButton").style = "display: none;";
	}
}

var DownloadedNonSpawnedComments = [];

function isNullOrWhitespace( input ) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
}
function timeDifference(current, previous) {

	var msPerMinute = 60 * 1000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerDay * 365;

	var elapsed = current - previous;

	if (elapsed < msPerMinute) {
		return Math.round(elapsed / 1000) + ' seconds';
	}

	else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + ' minutes';
	}

	else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + ' hours';
	}

	else if (elapsed < msPerMonth) {
		return 'approximately ' + Math.round(elapsed / msPerDay) + ' days';
	}

	else if (elapsed < msPerYear) {
		return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months';
	}

	else {
		return 'approximately ' + Math.round(elapsed / msPerYear) + ' years';
	}
}
function formatDate(d) {
	var month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;

	return [year, month, day].join('-');
}