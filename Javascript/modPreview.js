import { API } from "/api?operation=getAPI";
import { createPopup, createBanner } from "./Modules/popup.js";
import { shortenNumber, processText } from "./Modules/textHandeling.js";

function copyToClipboard(str) {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);

	createBanner("Copied \"" + str + "\" to clipboard.", null, "check", 1000);
};

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
var isSignedIn = false;

async function asyncOnLoad() {
	sessionID = await API.getCurrentSessionId();
	isSignedIn = (await API.isValidSession(sessionID) == "true"); // Returns a string "true" or "false"...

	if (isSignedIn) { // is signed in
		document.getElementById("commentPoster").style = "";
	}
	else  // is not signed in
	{
		document.getElementById("signInText").style = "";
	}

	const likeButton = document.getElementById("rateButton");
	const likeImage = likeButton.querySelector("img");
	
	const asyncGetModData = async function () {
		var modData = await API.getModData(modID);
		if (modData == null) {
			window.location.replace("/404.html");
			return;
		}

		var image = document.getElementsByClassName("modImage")[0];
		API.getModImage(image, modID, true);

		document.getElementsByClassName("modTitle")[0].childNodes[1].nodeValue = modData.DisplayName;

		var description = modData.Description;
		if (!description) {
			description = "";
		}
		document.getElementsByClassName("modDescription")[0].innerHTML = processText(description);

		var favoriteButton = document.getElementById("favoriteButton");
		if(isSignedIn) {
			async function getUserInfo() {
				var userID = await API.getCurrentUser();
				var userInfo = await API.getUser(userID);
				var hasFavorited = userInfo.favoritedMods.includes(modID);;

				const favoriteText = document.getElementById("favoriteText");
				const favoriteImage = document.getElementById("favoriteImage");

				function updateButton() {
					if(hasFavorited) {
						favoriteButton.style = "color: var(--primaryColor);";
						favoriteText.childNodes[1].nodeValue = "Unfavorite mod";
						favoriteImage.src = "/Assets/Icons/starred.png";
					} else {
						favoriteButton.style = "";
						favoriteText.childNodes[1].nodeValue = "Favorite mod";
						favoriteImage.src = "/Assets/Icons/star.png";
					}
				}
				updateButton();
				
				favoriteButton.addEventListener("click", function() {
					hasFavorited = !hasFavorited;
					API.favoriteMod(modID, hasFavorited);
					updateButton();
				});
			}
			getUserInfo();
		} else {
			favoriteButton.addEventListener("click", function() {
				createBanner("You have to be signed in to favorite mods.", null, "error", 2000);
			});
		}

		document.getElementById("linkButton").addEventListener("click", function () {
			copyToClipboard("https://modbot.org/modPreview.html?modID=" + modID);
		});
		document.getElementById("embedButton").addEventListener("click", function () {
			copyToClipboard("<iframe src=\"https://modbot.org/mod.html?modID=" + modID + "\" frameborder=\"0\" style=\"width: 15em; height: 30em\"></iframe>");
		});

		document.getElementById("copyButton").addEventListener("click", function () {
			copyToClipboard(modID);
		});
		
		likeButton.addEventListener("click", async function () {
			if (isSignedIn) {
				var hasLikedMod = await API.hasLiked(modID);

				var likes = Number.parseInt(document.getElementById("likedCount").innerHTML);
				

				if (!hasLikedMod) {
					likeButton.style = "color: var(--primaryColor);";
					likeButton.childNodes[1].nodeValue = "Unlike"
					likeImage.src = "/Assets/Icons/liked.png";
					likes++;
				} else {
					likeButton.style = "";
					likeButton.childNodes[1].nodeValue = "Like"
					likeImage.src = "/Assets/Icons/like.png";
					likes--;
				}
				API.like(modID, !hasLikedMod);

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
			if (returnValue.Error != null) {
				commentError.innerHTML = returnValue.Error;
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

		document.getElementById("modAuthor").src = "/api?operation=getUserHeader&userID=" + modData.OwnerID;
		document.getElementById("likedCount").innerHTML = shortenNumber(modData.Likes);
		document.getElementById("downloadCount").innerHTML = shortenNumber(modData.Downloads);

		if(!modData.Verified) {
			document.getElementsByClassName("modWarning")[0].style = "";
			document.getElementsByClassName("warningIcon")[0].style = "";
			document.getElementById("modBackground").style = "background-color: #3a1a1a;";

			document.getElementById("downloadButton").addEventListener("click", function () {
				createPopup(function(popup) {
					popup.createTitle("Are you sure?");
					popup.createParagraph("This mod has NOT been checked for malware and could contain viruses.")
					popup.createParagraph("Only download if you trust the author.")
					popup.createButtonInput("Download", function() {
						API.downloadMod(modID);
						popup.close();
					}, null, "orange");
					popup.createButtonInput("Cancel", function() {
						popup.close();
					});
				});
			});
		} else {
			document.getElementById("downloadButton").addEventListener("click", function () {
				API.downloadMod(modID);
			});
		}

		const asyncHasLikedMod = async function () { // Wait, can't this be moved outside asyncGetSpecialModData?
			if(isSignedIn) {
				const hasLikedMod = await API.hasLiked(modID);

				if(hasLikedMod) {
					likeButton.style = "color: var(--primaryColor);";
					likeButton.childNodes[1].nodeValue = "Unlike"
					likeImage.src = "/Assets/Icons/liked.png";
				}
			}
		}
		asyncHasLikedMod();

		document.getElementById("uploadDate").innerHTML = formatDate(new Date(modData.PostedDate * 1000));
		document.getElementById("updateDate").innerHTML = formatDate(new Date(modData.UpdatedDate * 1000));

		const sort = urlParams.get("comments");
		if (sort == "newest") {
			DownloadedNonSpawnedComments = modData.Comments.sort(async function (a, b) { // put the current users comments first, otherwise sort after posted time
				if(isSignedIn) {
					var localuser = await API.getCurrentUser();
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
				} else {
					return a.PostedUTCTime - b.PostedUTCTime;
				}
			});
		}
		else {
			DownloadedNonSpawnedComments = modData.Comments.sort(async function (a, b) { // put the current users comments first, otherwise sort after likes
				if(isSignedIn) {
					var localuser = await API.getCurrentUser();
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
				} else {
					return a.UsersWhoLikedThis.length - b.UsersWhoLikedThis.length;
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
		let userHeader = cloned.querySelector(".userHeader").src ="/api?operation=getUserHeader&userID=" + comment.PosterUserId;
		cloned.querySelector("#postTime").innerHTML = timeDifference(new Date().getTime(), comment.PostedUTCTime*1000);
		var content = cloned.querySelector(".commentContent");
		content.innerHTML = processText(comment.CommentBody);

		cloned.querySelector(".commentLikedCount").innerHTML = shortenNumber(comment.UsersWhoLikedThis.length);
		const likeButton = cloned.querySelector(".likeButton");
		const likeImage = likeButton.querySelector("img");

		const asyncHasLikedComment = async function () {
			if(!isSignedIn) {
				likeButton.style = "";
				return;
			}

			const hasLikedComment = await API.hasLikedComment(modID, comment.CommentID);
			if (hasLikedComment) {
				likeButton.style = "color: var(--primaryColor);";
				likeButton.childNodes[1].nodeValue = "Unlike";
				likeImage.src = "/Assets/Icons/liked.png";
			}
		}
		asyncHasLikedComment();

		likeButton.addEventListener("click", async function () {
			if (isSignedIn) {
				var hasLikedComment = await API.hasLikedComment(modID, comment.CommentID);
				const commentLikedCountDisplay = likeButton.querySelector(".commentLikedCount");

				var likes = Number.parseInt(commentLikedCountDisplay.innerHTML);
				if (!hasLikedComment) {
					likeButton.style = "color: var(--primaryColor);";
					likeButton.childNodes[1].nodeValue = "Unlike";
					likeImage.src = "/Assets/Icons/liked.png";
					likes++;
				} else {
					likeButton.style = "";
					likeButton.childNodes[1].nodeValue = "Like";
					likeImage.src = "/Assets/Icons/like.png";
					likes--;
				}

				API.likeComment(modID, comment.CommentID, !hasLikedComment);
				commentLikedCountDisplay.innerHTML = shortenNumber(likes);
			} else {
				createBanner("You have to be signed in to like comments.", null, "error", 2000);
			}
			
		});
		
		const deleteButton = cloned.querySelector(".deleteButton");
		deleteButton.addEventListener("click", function () {
			if (confirm("Are you sure you want to delete this comment?")) {
				API.deleteComment(modID, comment.CommentID);
				cloned.remove();
			}
		});

		var asyncIsCommentMine = async function () {
			if(!isSignedIn) {
				return;
			}

			const arr = await Promise.all([API.isCommentMine(modID, comment.CommentID), API.getMyAuth()]);
			const isCommentMine = arr[0];
			const isAdmin = arr[1] == 4;

			if (isCommentMine || isAdmin) {
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