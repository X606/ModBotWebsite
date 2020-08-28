const urlParams = new URLSearchParams(window.location.search);
const userID = urlParams.get("userID");

if (userID) {

	API.GetUser(userID, function (userData) {
		var nameDisplay = document.getElementsByClassName("name")[0];
		nameDisplay.innerHTML = userData.username;
		nameDisplay.style = "color: " + userData.color;
		API.SetImageElementToProfilePicture(document.getElementsByClassName("userAvatar")[0], userID);

		document.getElementById("link").href += "?userID=" + userID;
		
		
		document.body.style = "transition-duration: 1s; transition-property: opacity;";
	});
}