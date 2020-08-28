import { API } from "./Modules/API/Api.js";

async function onLoad() {
	var a = await API.getAllModIds();
	for (var i = 0; i < a.length; i++) {
		console.log(a[i]);
		console.log(await API.getModData(a[i]));
		console.log(await API.getSpecialModData(a[i]));
	}
}
onLoad();
/*



API.OnLoadedWhenSignedIn = [];
API.OnLoadedWhenNotSignedIn = [];

function RunOnLoadedWhenSignedIn(callback) {
	API.OnLoadedWhenSignedIn.push(callback);
}

function RunOnLoadedWhenNotSignedIn(callback) {
	API.OnLoadedWhenNotSignedIn.push(callback);
}

function SetCurrentSession(sessionID) {
	API.IsValidSession(sessionID, function(e) {
		if (e === true) {
			ForceSetCurrentSession(sessionID);
		} else {
			console.error("the passed session \"" + sessionID + "\" was not valid");
		}
	});	
}
function ForceSetCurrentSession(sessionID) {
	setCookie("SessionID", sessionID, 60);
	API.SessionID = sessionID;
}

const callbacksOnLoad = [];
function CallOnLoad(callback) {
	callbacksOnLoad.push(callback);
}
window.onload = function() {
	for(var i = 0; i < callbacksOnLoad.length; i++) {
		callbacksOnLoad[i]();
	}
}

var savedSessionID = getCookie("SessionID");
API.IsValidSession(savedSessionID, function(e){
	if (e === true) {
		API.SessionID = savedSessionID;
		for(var i = 0; i < API.OnLoadedWhenSignedIn.length; i++) {
			API.OnLoadedWhenSignedIn[i]();
		}
	} else {
		API.SessionID = "";
		setCookie("SessionID", "", -5);
		console.log("The saved session id is now invalid");

		for(var i = 0; i < API.OnLoadedWhenNotSignedIn.length; i++) {
			API.OnLoadedWhenNotSignedIn[i]();
		}
	}
});
*/