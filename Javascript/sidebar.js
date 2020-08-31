import { API } from "./Modules/API/Api.js";
import { createPopup, FormData } from "./Modules/popup.js";

async function asyncOnLoad() {
	const sessionID = await API.getCurrentSessionId();

	if (sessionID != "") { // if is signed in
		var sidebarIframe = document.getElementsByClassName("sidebar")[0];

		var onLoad = function () {
			var sidebarDocument = sidebarIframe.contentDocument;

			sidebarDocument.getElementById("userActions").style = "";

			const getCurrentUserAsync = async function () {
				const currentUserID = await API.getCurrentUser();
				sidebarDocument.getElementById("userHeader").src += "?userID=" + currentUserID;
			};
			getCurrentUserAsync();

			sidebarDocument.getElementById("logoutButton").addEventListener("click", async function () {
				await API.signOut();
				window.location.reload();
			});
			sidebarDocument.getElementById("changeAvatarButton").addEventListener("click", async function () {
				createPopup(function (popup) {
					popup.createTitle("Upload profile picture");
					popup.createFileInput("profile picture", ".png, .jpg, .gif", "file");
					popup.createHidden(sessionID, "session");
					popup.createSubmitInput("Upload mod");
				}, new FormData("/api/?operation=uploadProfilePicture", "multipart/form-data", "post"));
			});
		};
		sidebarIframe.src = sidebarIframe.src;
		sidebarIframe.addEventListener("load", onLoad);
	} else {
		var sidebarIframe = document.getElementsByClassName("sidebar")[0];

		var onLoad = function () {
			var sidebarDocument = sidebarIframe.contentDocument;
			var buttonHolder = sidebarDocument.getElementById("userButtons");

			buttonHolder.style = "";
			sidebarDocument.getElementById("signupButton").addEventListener("click", function () {
				createPopup(function (popup) {
					popup.createTitle("Sign up");
					popup.createError("usernameError");
					popup.createTextInput("username", "Username");
					popup.createError("passwordError");
					popup.createPasswordInput("password", "Password");
					popup.createError("passwordConfirmationError");
					popup.createPasswordInput("passwordConfirmation", "Confirm password");
					popup.createBreak();
					popup.createError("genericError");
					popup.createButtonInput("Create account", async function () {
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

						if (password.value != passwordConfirmation.value) {
							passwordError.innerHTML = "Passwords don't match.";
							password.value = "";
							passwordConfirmation.value = "";
							return;
						} else if (isNullOrWhitespace(username.value)) {
							usernameError.innerHTML = "Username field must be filled out.";
							return;
						} else if (isNullOrWhitespace(password.value)) {
							passwordError.innerHTML = "Password field must be filled out.";
							return;
						} else if (isNullOrWhitespace(passwordConfirmation.value)) {
							passwordConfirmationError.innerHTML = "Re-write same password..";
							return;
						}

						const returnValue = await API.createAccount(username.value, password.value);

						if (returnValue.isError) {
							var error = returnValue.error;
							if (error == "That username is already taken") {
								usernameError.innerHTML = error;
							} else {
								genericError.innerHTML = error;
							}
							return;
						}
						popup.close();

						// Takes some time for firefox to save cookies.
						setTimeout(function () {
							window.location.reload();
						}, 10);

					});
				});
			});

			sidebarDocument.getElementById("loginButton").addEventListener("click", function () {
				createPopup(function (popup) {
					popup.createTitle("Log in");
					popup.createError("usernameError");
					popup.createTextInput("username", "Username");
					popup.createError("passwordError");
					popup.createPasswordInput("password", "Password");
					popup.createBreak();
					popup.createError("genericError");
					popup.createButtonInput("Log in", async function () {
						var username = document.getElementById("username");
						var password = document.getElementById("password");

						var usernameError = document.getElementById("usernameError");
						var passwordError = document.getElementById("passwordError");
						var genericError = document.getElementById("genericError");

						usernameError.innerHTML = "";
						passwordError.innerHTML = "";
						genericError.innerHTML = "";

						if (isNullOrWhitespace(username.value)) {
							usernameError.innerHTML = "Username field must be filled out.";
							return;
						} else if (isNullOrWhitespace(password.value)) {
							passwordError.innerHTML = "Password field must be filled out.";
							return;
						}

						const returnValue = await API.signIn(username.value, password.value);

						if (returnValue.error) {
							genericError.innerHTML = returnValue.error;
							return;
						}
						popup.close();

						// Takes some time for firefox to save cookies.
						setTimeout(function () {
							window.location.reload();
						}, 10);

					});
				});
			});
		};
		sidebarIframe.src = sidebarIframe.src;
		sidebarIframe.addEventListener("load", onLoad);
	}

}
asyncOnLoad();

function isNullOrWhitespace( input ) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
}