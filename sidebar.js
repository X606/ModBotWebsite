API.OnLoadedWhenSignedIn = function() {
	var sidebarIframe = document.getElementsByClassName("sidebar")[0];

	var onLoad = function() {
		var sidebarDocument = sidebarIframe.contentDocument;
		var userHeader = sidebarDocument.getElementById("userHeader");

		userHeader.style = "";
		API.GetCurrentUser(function(userId) {
			userHeader.src += "?userID=" + userId;
		});
	};
	sidebarIframe.src = sidebarIframe.src;
	sidebarIframe.addEventListener("load", onLoad);
}

API.OnLoadedWhenNotSignedIn = function() {
	var sidebarIframe = document.getElementsByClassName("sidebar")[0];

	var onLoad = function() {
		var sidebarDocument = sidebarIframe.contentDocument;
		var buttonHolder = sidebarDocument.getElementById("userButtons");

		buttonHolder.style = "";
		sidebarDocument.getElementById("signupButton").addEventListener("click", function() {
			createPopup(function(popup) {
				popup.createTitle("Create account");
				popup.createError("usernameError");
				popup.createTextInput("username", "Username");
				popup.createError("passwordError");
				popup.createPasswordInput("password", "Password");
				popup.createPasswordInput("passwordConfirmation", "Confirm password");
				popup.createBreak();
				popup.createError("genericError");
				popup.createButtonInput("Create account", function() {
					var username = document.getElementById("username");
					var password = document.getElementById("password");
					var passwordConfirmation = document.getElementById("passwordConfirmation");

					var usernameError = document.getElementById("usernameError");
					var passwordError = document.getElementById("passwordError");
					var genericError = document.getElementById("genericError");

					usernameError.innerHTML = "";
					passwordError.innerHTML = "";
					genericError.innerHTML = "";

					if(password.value != passwordConfirmation.value) {
						passwordError.innerHTML = "Passwords don't match.";
						password.value = "";
						passwordConfirmation.value = "";
						return;
					}

					API.CreateAccount(username.value, password.value, function(returnValue) {
						if(returnValue.isError) {
							var error = returnValue.error;
							if(error == "That username is already taken")
							{
								usernameError.innerHTML = error;
							} else {
								genericError.innerHTML = error;
							}
							return;
						}
						popup.close();
						window.location.reload();
					});
				});
			});
		});
	};
	sidebarIframe.src = sidebarIframe.src;
	sidebarIframe.addEventListener("load", onLoad);
}