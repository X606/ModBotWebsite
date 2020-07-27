const urlParams = new URLSearchParams(window.location.search);
const userID = urlParams.get("userID");

if (!userID) {
	console.error("No user provided");
}

API.GetUser(userID, function (userData) {
	const usernameDisplay = document.getElementsByClassName("userName")[0];
	usernameDisplay.innerHTML = userData.username;
	usernameDisplay.style = "color: " + userData.color;

	document.getElementsByClassName("userDescription")[0].innerHTML = userData.bio;

	document.getElementById("copyButton").addEventListener("click", function () {
		copyToClipboard(userID);
	});
	document.getElementById("followButton").addEventListener("click", function () {
		alert("TODO: make the follow button work");
	});
	document.getElementById("reportButton").addEventListener("click", function () {
		alert("TODO: make the report button work");
	});

	API.SetImageElementToProfilePicture(document.getElementsByClassName("userAvatar")[0], userID);
	//document.getElementsByClassName("modsHolder")[0].innerHTML = ""; TODO: send request to get the featured mods

	document.getElementById("hideElements").innerHTML = "#mainHolder > * { opacity: 1; transition-duration: 1s; transition-property: opacity;}";
});

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

	alert("Copied \"" + str + "\" to clipboard");
};