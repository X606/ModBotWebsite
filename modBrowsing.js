CallOnLoad(function () {
	API.GetAllModIds(function (modIds) {
		const element = document.getElementById("modsHolder");

		var innerHTML = "";
		for (var i = 0; i < modIds.length; i++) {
			innerHTML += "<iframe class=\"modBox fade\" src=\"mod.html?modID=" + modIds[i] + "\" frameborder=\"0\"></iframe>\n";
		}

		element.innerHTML = innerHTML;
		
	});

});