RunOnLoadedWhenSignedIn(function() {
	var sidebarIframe = document.getElementsByClassName("sidebar")[0];

	var onLoad = function() {
		var sidebarDocument = sidebarIframe.contentDocument;

		sidebarDocument.getElementById("userActions").style = "";
		API.GetCurrentUser(function(userId) {
			sidebarDocument.getElementById("userHeader").src += "?userID=" + userId;
		});

		sidebarDocument.getElementById("logoutButton").addEventListener("click", function() {
			API.SignOut(function(returnValue) {
				window.location.reload();
			});
		});
	};
	sidebarIframe.src = sidebarIframe.src;
	sidebarIframe.addEventListener("load", onLoad);
});

RunOnLoadedWhenNotSignedIn(function() {
	var sidebarIframe = document.getElementsByClassName("sidebar")[0];

	var onLoad = function() {
		var sidebarDocument = sidebarIframe.contentDocument;
		var buttonHolder = sidebarDocument.getElementById("userButtons");

		buttonHolder.style = "";
		sidebarDocument.getElementById("signupButton").addEventListener("click", function() {
			createPopup(function(popup) {
				popup.createTitle("Sign up");
				popup.createError("usernameError");
				popup.createTextInput("username", "Username");
				popup.createError("passwordError");
				popup.createPasswordInput("password", "Password");
				popup.createError("passwordConfirmationError");
				popup.createPasswordInput("passwordConfirmation", "Confirm password");
				popup.createBreak();
				popup.createError("genericError");
				popup.createButtonInput("Create account", function() {
					var username = document.getElementById("username");
					var password = document.getElementById("password");
					var passwordConfirmation = document.getElementById("passwordConfirmation");

					var usernameError = document.getElementById("usernameError");
					var passwordError = document.getElementById("passwordError");
					var passwordConfirmationError = document.getElementById("passwordError");
					var genericError = document.getElementById("genericError");

					usernameError.innerHTML = "";
					passwordError.innerHTML = "";
					genericError.innerHTML = "";

					if(password.value != passwordConfirmation.value) {
						passwordError.innerHTML = "Passwords don't match.";
						password.value = "";
						passwordConfirmation.value = "";
						return;
					} else if(isNullOrWhitespace(username.value)) {
						usernameError.innerHTML = "Username field must be filled out.";
						return;
					} else if(isNullOrWhitespace(password.value)) {
						passwordError.innerHTML = "Password field must be filled out.";
						return;
					} else if(isNullOrWhitespace(passwordConfirmation.value)) {
						passwordConfirmationError.innerHTML = "Re-write same password..";
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
						
						// Takes some time for firefox to save cookies.
						setTimeout(function() {
							window.location.reload();
						}, 10);
					});
				});
			});
		});

		sidebarDocument.getElementById("loginButton").addEventListener("click", function() {
			createPopup(function(popup) {
				popup.createTitle("Log in");
				popup.createError("usernameError");
				popup.createTextInput("username", "Username");
				popup.createError("passwordError");
				popup.createPasswordInput("password", "Password");
				popup.createBreak();
				popup.createError("genericError");
				popup.createButtonInput("Log in", function() {
					var username = document.getElementById("username");
					var password = document.getElementById("password");

					var usernameError = document.getElementById("usernameError");
					var passwordError = document.getElementById("passwordError");
					var genericError = document.getElementById("genericError");

					usernameError.innerHTML = "";
					passwordError.innerHTML = "";
					genericError.innerHTML = "";

					if(isNullOrWhitespace(username.value)) {
						usernameError.innerHTML = "Username field must be filled out.";
						return;
					} else if(isNullOrWhitespace(password.value)) {
						passwordError.innerHTML = "Password field must be filled out.";
						return;
					}

					API.SignIn(username.value, password.value, function(returnValue) {
						if(returnValue.error) {
							genericError.innerHTML = returnValue.error;
							return;
						}
						popup.close();

						// Takes some time for firefox to save cookies.
						setTimeout(function() {
							window.location.reload();
						}, 10);
					});
				});
			});
		});
	};
	sidebarIframe.src = sidebarIframe.src;
	sidebarIframe.addEventListener("load", onLoad);
});

function isNullOrWhitespace( input ) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
}