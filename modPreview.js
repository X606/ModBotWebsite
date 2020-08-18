const urlParams = new URLSearchParams(window.location.search);
const modID = urlParams.get("modID");

if (!modID) {
	console.error("No mod provided");
}

CallOnLoad(function() {
	var selector = document.getElementById("commentSorting");
	var currentSort = urlParams.get("comments");
	
	if(currentSort == "newest") {
		selector.value = "new";
	} else {
		selector.value = "liked"
	}

	selector.addEventListener("change", function() {
		var pathNameWithoutQuery = window.location.pathname;

		if(selector.value == "new" && currentSort != "newest") {
			window.location.href = pathNameWithoutQuery + "?modID=" + modID + "&comments=newest";

		} else if(selector.value == "liked" && currentSort == "newest") {
			window.location.href = pathNameWithoutQuery + "?modID=" + modID;
		}
	});
});

RunOnLoadedWhenSignedIn(function() {
	document.getElementById("commentPoster").style = "";
});

RunOnLoadedWhenNotSignedIn(function() {
	document.getElementById("signInText").style = "";
});

API.GetModData(modID, function (modData) {
	var image = document.getElementsByClassName("modImage")[0];
	API.SetImageElementToModImage(image, modID);

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
		API.DownloadMod(modID);
	});
	document.getElementById("rateButton").addEventListener("click", function () {

		API.IsSignedIn(function (isSingnedIn) {
			if (isSingnedIn) {
				API.HasLikedMod(modID, function (hasLikedMod) {
					var likes = Number.parseInt(document.getElementById("likedCount").innerHTML);

					if (!hasLikedMod) {
						document.getElementById("rateButton").style = "color: var(--primaryColor);";
						likes++;
					} else {
						document.getElementById("rateButton").style = "";
						likes--;
					}
					API.SetLikedMod(modID, !hasLikedMod);

					document.getElementById("likedCount").innerHTML = likes;
				});
			} else {
				createBanner("You have to be signed in to like mods.", null, "error", 2000);
			}
		});
	});
	document.getElementById("postCommentButton").addEventListener("click", function() {
		var comment = document.getElementById("commentTextArea");
		var commentError = document.getElementById("commentError")

		if(isNullOrWhitespace(comment.value)) {
			commentError.innerHTML = "Unable to post empty comment.";
			return;
		}

		API.PostComment(modID ,comment.value, function(returnValue) {
			if(returnValue.isError) {
				commentError.innerHTML = returnValue.message;
				return;
			}
			comment.value = "";
			window.location.reload();
		});
	});
	
	document.getElementById("hideElements").innerHTML = "#mainHolder > * { opacity: 1; transition-duration: 1s; transition-property: opacity;}";
});

API.GetSpecialModData(modID, function (modData) {
	document.getElementById("likedCount").innerHTML = modData.Likes;

	API.HasLikedMod(modID, function (hasLikedMod) {
		if (hasLikedMod) {
			document.getElementById("rateButton").style = "color: var(--primaryColor);";
		}
	});

	document.getElementById("uploadDate").innerHTML = formatDate(new Date(modData.PostedDate*1000));
	document.getElementById("updateDate").innerHTML = formatDate(new Date(modData.UpdatedDate*1000));

	const sort = urlParams.get("comments");
	if (sort == "newest") {
		DownloadedNonSpawnedComments = modData.Comments;
	}
	else
	{
		DownloadedNonSpawnedComments = modData.Comments.sort(function (a, b) {
			return a.UsersWhoLikedThis.length - b.UsersWhoLikedThis.length;
		});
	}
	

	SpawnNextComments();

	document.getElementById("loadButton").addEventListener("click", function () {
		SpawnNextComments();
	});
});

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
		API.HasLikedComment(modID, comment.CommentID, function (hasLikedComment) {
			if (hasLikedComment) {
				likeButton.style = "color: var(--primaryColor);";
			} else {
				likeButton.style = "";
			}
		});
		likeButton.addEventListener("click", function () {
			API.IsSignedIn(function (isSingedIn) {
				if (isSingedIn) {
					API.HasLikedComment(modID, comment.CommentID, function (hasLikedComment) {
						const commentLikedCountDisplay = likeButton.querySelector(".commentLikedCount");

						var likes = Number.parseInt(commentLikedCountDisplay.innerHTML);
						if (!hasLikedComment) {
							likeButton.style = "color: var(--primaryColor);";
							likes++;
						} else {
							likeButton.style = "";
							likes--;
						}

						API.LikeComment(modID, comment.CommentID, !hasLikedComment);
						commentLikedCountDisplay.innerHTML = likes;
					});
				} else {
					createBanner("You have to be signed in to like comments.", null, "error", 2000);
				}
			})
			
		});
		
		const deleteButton = cloned.querySelector(".deleteButton");
		deleteButton.addEventListener("click", function () {
			if (confirm("Are you sure you want to delete your comment?")) {
				API.DeleteComment(modID, comment.CommentID);
				cloned.remove();
			}
		});
		API.IsCommentMine(modID, comment.CommentID, function (isCommentMine) {
			if (isCommentMine) {
				deleteButton.style = "";
			}
		});

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

	createBanner("Copied \"" + str + "\" to clipboard.", null, "check_circle", 1000);
};

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