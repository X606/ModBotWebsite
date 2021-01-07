const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get("error");
const notError = urlParams.get("notError");

if (notError) {
	document.getElementsByClassName("successTitle")[0].style = "";
	document.getElementsByClassName("greyText")[0].style = "display: none;"
} else {
	document.getElementsByClassName("errorTitle")[0].style = "";
}


document.getElementsByClassName("text")[0].innerHTML = error;