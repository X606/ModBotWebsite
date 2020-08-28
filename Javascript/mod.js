CallOnLoad(function () {
	const urlParams = new URLSearchParams(window.location.search);
	const modID = urlParams.get("modID");

	if (!modID)
		return;

	API.GetModData(modID, function (modData) {
		API.SetImageElementToModImage(document.getElementsByClassName("modImage")[0], modID);

		document.getElementsByClassName("modTitle")[0].innerHTML = modData.DisplayName;

		var description = modData.Description;
		if (description == undefined) {
			description = "";
		}

		document.getElementsByClassName("modDescription")[0].innerHTML = description;
		document.getElementsByClassName("previewLink")[0].href += "?modID=" + modID;

		document.getElementById("downloadButton").addEventListener("click", function () {
			API.DownloadMod(modID);
		});
		document.getElementById("copyButton").addEventListener("click", function () {
			copyToClipboard(modID);
		});

		setTimeout(function () {
			document.body.style = "transition-duration: 1s; transition-property: opacity;";
		}, 2);
	});
	API.GetSpecialModData(modID, function (modData) {
		document.getElementsByClassName("userHeader")[0].src += "?userID=" + modData.OwnerID;
	});

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

	alert("Copied \"" + str + "\" to clipboard.");
};