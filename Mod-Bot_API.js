
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function setCookie(cname, cvalue, exmins) {
  var d = new Date();
  d.setTime(d.getTime() + (exmins*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict";
}

const API = {};
API.SessionID;
API.CreateAccount = function(username, password, callback) {
	Post("/api/?operation=createAccout", 
	{
		username: username,
		password: password
	}, function(e) {
		e = JSON.parse(e);
		
		if (e.isError == false) {
			SetCurrentSession(e.sessionID);
		}
		
		if (callback != null) {
			callback(e);
		} else {
			console.log(e);
		}
	});
};
API.DownloadMod = function(modID) {
	window.open("/api/?operation=downloadMod&id=" + modID);
};
API.GetAllModIds = function(callback) {
	Post("/api/?operation=getAllModIds",{}, 
	function(e) {
		e = JSON.parse(e);
		
		if (callback != null) {
			callback(e);
		} else {
			console.log(e);
		}
	});
};
API.GetAllModInfos = function(callback) {
	Post("/api/?operation=getAllModInfos",{}, 
	function(e) {
		e = JSON.parse(e);
		
		if (callback != null) {
			callback(e);
		} else {
			console.log(e);
		}
	});
};
API.SetImageElementToModImage = function(element, modID) {
	element.src = "/api/?operation=getModImage&id=" + modID;
};
API.SetImageElementToProfilePicture = function (element, userID) {
	element.src = "/api/?operation=getProfilePicture&id=" + userID;
};
API.GetModData = function(modID, callback) {
	Post("/api/?operation=getModData&id="+modID,{}, 
	function(e) {
		e = JSON.parse(e);
		
		if (callback != null) {
			callback(e);
		} else {
			console.log(e);
		}
	});
};
API.GetSpecialModData = function(modId, callback) {
	Post("/api/?operation=getSpecialModData&id="+modId,{}, 
	function(e) {
		e = JSON.parse(e);
		
		if (callback != null) {
			callback(e);
		} else {
			console.log(e);
		}
	});
};
API.HasLikedMod = function(modID, callback) {
	API.IsSignedIn(function(isSignedIn) {
		if (!isSignedIn) {
			var message = false;
			if (callback != null) {
				callback(message);
			} else {
				console.log(message);
			}
			return;
		}
		
		Post("/api/?operation=hasLiked", 
		{
			sessionId: API.SessionID,
			modId: modID
		}, function(e) {
			e = JSON.parse(e);
			
			if (callback != null) {
				callback(e);
			} else {
				console.log(e);
			}
		});
	});
	
};
API.HasLikedComment = function (modID, commentID, callback) {
	API.IsSignedIn(function (isSignedIn) {
		if (!isSignedIn) {
			var message = false;
			if (callback != null) {
				callback(message);
			} else {
				console.log(message);
			}
			return;
		}

		Post("/api/?operation=hasLikedComment",
			{
				sessionId: API.SessionID,
				modId: modID,
				commentId: commentID
			}, function (e) {
				e = JSON.parse(e);

				if (callback != null) {
					callback(e);
				} else {
					console.log(e);
				}
			});
	});

};
API.IsCommentMine = function (modID, commentID, callback) {
	API.IsSignedIn(function (isSignedIn) {
		if (!isSignedIn) {
			var message = false;
			if (callback != null) {
				callback(message);
			} else {
				console.log(message);
			}
			return;
		}

		Post("/api/?operation=isCommentMine",
			{
				sessionId: API.SessionID,
				modId: modID,
				commentId: commentID
			}, function (e) {
				e = JSON.parse(e);

				if (callback != null) {
					callback(e);
				} else {
					console.log(e);
				}
			});
	});

};
API.IsValidSession = function(sessionID, callback) {
	Post("/api/?operation=isValidSession", 
	{
		sessionId: sessionID,
	}, function(e) {
		e = JSON.parse(e);
		
		if (callback != null) {
			callback(e);
		} else {
			console.log(e);
		}
	});
};
API.SetLikedMod = function(modID, state, callback) {
	API.IsSignedIn(function(isSignedIn) {
		if (!isSignedIn) {
			var message = {isError:true, message: "You are not signed in"};
			if (callback != null) {
				callback(message);
			} else {
				console.log(message);
			}
			return;
		}
		
		Post("/api/?operation=like", 
		{
			sessionId: API.SessionID,
			likedModId: modID,
			likeState: state
		}, function(e) {
			e = JSON.parse(e);
			if (callback != null) {
				callback(e);
			} 
			else {
				console.log(e);
			}
		});
	});
}
API.SignIn = function(username, password, callback) {
	Post("/api/?operation=signIn", 
	{
		username: username,
		password: password
	}, function(e) {
		e = JSON.parse(e);
		
		if (e.sessionID != null) {
			SetCurrentSession(e.sessionID);
		}
		
		if (callback != null) {
			callback(e);
		}
		else {
			console.log(e);
		}
	});
};
API.SignOut = function(callback) {
	API.IsSignedIn(function(isSignedIn) {
		if (!isSignedIn) {
			var message = {isError:true, message: "You are not signed in"};
			if (callback != null) {
				callback(message);
			} else {
				console.log(message);
			}
			return;
		}
		Post("/api/?operation=signOut", 
		{
			sessionID: API.SessionID
		}, function(e) {
			e = JSON.parse(e);
			
			if (!e.isError) {
				API.SessionID = "";
				setCookie("SessionID", "", -5);
			}
			
			if (callback != null) {
				callback(e);
			}
			else {
				console.log(e);
			}
		});
	});
};
API.IsSignedIn = function(callback) {
	if (API.SessionID == "")
	{
		if (callback != null) {
			callback(false);
		} else {
			console.log(false);
		}
		return;
	}
	
	API.IsValidSession(API.SessionID, function(e) {
		e = JSON.parse(e);
		
		if (callback != null) {
			callback(e);
		} else {
			console.log(e);
		}
	});
};
API.PostComment = function(targetModID, commentBody, callback) {
	API.IsSignedIn(function(isSignedIn) {
		if (!isSignedIn) {
			var message = {isError:true, message: "You are not signed in"};
			if (callback != null) {
				callback(message);
			} else {
				console.log(message);
			}
			return;
		}
		
		Post("/api/?operation=postComment", 
		{
			targetModId: targetModID,
			sessionId: API.SessionID,
			commentBody: commentBody
		}, function(e) {
			e = JSON.parse(e);
			if (callback != null) {
				callback(e);
			} 
			else {
				console.log(e);
			}
		});
	});
};
API.DeleteComment = function(targetModID, targetCommentId, callback) {
	API.IsSignedIn(function(isSignedIn) {
		if (!isSignedIn) {
			var message = {isError:true, message: "You are not signed in"};
			if (callback != null) {
				callback(message);
			} else {
				console.log(message);
			}
			return;
		}
		
		Post("/api/?operation=deleteComment", 
		{
			targetModId: targetModID,
			sessionId: API.SessionID,
			targetCommentId: targetCommentId
		}, function(e) {
			e = JSON.parse(e);
			if (callback != null) {
				callback(e);
			} 
			else {
				console.log(e);
			}
		});
	});
};
API.LikeComment = function(targetModID, targetCommentId, state, callback) {
	API.IsSignedIn(function(isSignedIn) {
		if (!isSignedIn) {
			var message = {isError:true, message: "You are not signed in"};
			if (callback != null) {
				callback(message);
			} else {
				console.log(message);
			}
			return;
		}
		
		Post("/api/?operation=likeComment", 
		{
			likeState: state,
			sessionId: API.SessionID,
			modId: targetModID,
			commentId: targetCommentId
		}, function(e) {
			e = JSON.parse(e);
			if (callback != null) {
				callback(e);
			} 
			else {
				console.log(e);
			}
		});
	});
};
API.GetUser = function (userID, callback) {
	Post("/api/?operation=getUser&id=" + userID, {},
		function (e) {
			e = JSON.parse(e);

			if (callback != null) {
				callback(e);
			} else {
				console.log(e);
			}
		});
}

API.GetCurrentUser = function(callback) {
	API.IsSignedIn(function(isSignedIn) {
		if (!isSignedIn) {
			var message = "null";
			if (callback != null) {
				callback(message);
			} else {
				console.log(message);
			}
			return;
		}
		Post("/api/?operation=getCurrentUser", 
		{
			sessionId: API.SessionID
		}, function(e) {
			if (callback != null) {
				callback(e);
			} 
			else {
				console.log(e);
			}
		});
	});
};

API.GetUploadModForm = function () {
	var formElement = document.createElement("form");
	formElement.action = "/api/?operation=uploadMod";
	formElement.enctype = "multipart/form-data";
	formElement.method = "post";
	
	var fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.name = "file";
	fileInput.accept = ".zip";
	formElement.appendChild(fileInput);

	formElement.appendChild(document.createElement("br"));

	var sessionInput = document.createElement("input");
	sessionInput.type = "hidden";
	sessionInput.name = "session";
	sessionInput.value = API.SessionID;
	formElement.appendChild(sessionInput);

	var submitButton = document.createElement("input");
	submitButton.type = "submit";
	submitButton.value = "Upload";
	submitButton.class = "green";
	formElement.appendChild(submitButton);

	return formElement;
};

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

function Post(url, data, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data));
	xhr.onload = function() {
		callback(xhr.responseText);
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