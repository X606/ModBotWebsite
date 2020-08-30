var hasCreatedPopup = false;
var currentBanners = 0;
const basePopupHtml = "<div id='popupBackground' class='popupBackground'><div id='popupFrame' class='popupFrame'><button id='xit' class='red'>X</button></div></div>";
const baseBannerHtml = "<div id='bannerFrame' class='bannerFrame'><button id='xit' class='red'>X</button></div>";

function htmlToElem(html) {
	let temp = document.createElement('template');
	html = html.trim(); // Never return a space text node as a result
	temp.innerHTML = html;
	return temp.content;
}
  
function createPopup(onPopupCreated, formData)
{
	if(hasCreatedPopup)
	{
		console.error("Failed to open new popup since one already exists.");
		return;
	}
	hasCreatedPopup = true;
	document.body.style.overflowY = "hidden"

	var generatedElement = htmlToElem(basePopupHtml);
	var form = null;

	if(formData) {
		form = document.createElement("form");
		form.action = formData.Action;
		form.enctype = formData.Enctype;
		form.method = formData.Method;

		generatedElement.getElementById("popupFrame").appendChild(form);
	}

	document.body.insertBefore(generatedElement, document.body.firstChild);

	var targetFrame = document.getElementById("popupFrame");
	if(formData) {
		targetFrame = form;
	}
	
	var popup = new Popup(document.getElementById("popupBackground"), targetFrame, formData);
	onPopupCreated(popup);

	document.getElementById("xit").addEventListener("click", function() {
		popup.close();
	});
}

function FormData(action, enctype, method) {
	this.Action = action;
	this.Enctype = enctype;
	this.Method = method;
}

function Popup(popupBackground, popupFrame, formData)
{
	this.createTitle = function(text) {
		var itemToAdd = "";

		itemToAdd += "<h3>";
		itemToAdd += text;
		itemToAdd += "</h3>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createParagraph = function(text) {
		var itemToAdd = "";

		itemToAdd += "<p>";
		itemToAdd += text;
		itemToAdd += "</p>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createLabel = function(text) {
		var itemToAdd = "";

		itemToAdd += "<label>";
		itemToAdd += text;
		itemToAdd += "</label>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createError = function(id) {
		var itemToAdd = "";

		itemToAdd += "<p id='";
		itemToAdd += id;
		itemToAdd += "' class='errorText'></p>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createBreak = function() {
		popupFrame.appendChild(htmlToElem("<br>"));
	};

	this.createTextInput = function(id, placeholder, name) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' placeholder='";
		itemToAdd += placeholder;
		if(formData && name) {
			itemToAdd += "' name='";
			itemToAdd += name;
		}
		itemToAdd += "' type='text'>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createPasswordInput = function(id, placeholder, name) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' placeholder='";
		itemToAdd += placeholder;
		if(formData && name) {
			itemToAdd += "' name='";
			itemToAdd += name;
		}
		itemToAdd += "' type='password'>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createEmailInput = function(id, placeholder, name) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' placeholder='";
		itemToAdd += placeholder;
		if(formData && name) {
			itemToAdd += "' name='";
			itemToAdd += name;
		}
		itemToAdd += "' type='email'>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createUrlInput = function(id, placeholder, name) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' placeholder='";
		itemToAdd += placeholder;
		if(formData && name) {
			itemToAdd += "' name='";
			itemToAdd += name;
		}
		itemToAdd += "' type='url'>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createTextAreaInput = function(id, rows, placeholder) {
		var itemToAdd = "";

		itemToAdd += "<textarea id='";
		itemToAdd += id;
		itemToAdd += "' rows='";
		itemToAdd += rows;
		itemToAdd += "' placeholder='";
		itemToAdd += placeholder;
		itemToAdd += "'></textarea>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createFileInput = function(id, accept, name) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' accept='";
		itemToAdd += accept;
		if(formData && name) {
			itemToAdd += "' name='";
			itemToAdd += name;
		}
		itemToAdd += "' type='file'>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createColorInput = function(id, name) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		if(formData && name) {
			itemToAdd += "' name='";
			itemToAdd += name;
		}
		itemToAdd += "' type='color'>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createSubmitInput = function(text) {
		var itemToAdd = "";

		itemToAdd += "<input class='green' value='";
		itemToAdd += text;
		itemToAdd += "' type='submit'>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.createButtonInput = function(text, callback) {
		var itemToAdd = "";

		itemToAdd += "<button class='green'>";
		itemToAdd += text;
		itemToAdd += "</button>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
		popupFrame.lastChild.addEventListener("click", callback);
	};

	this.createHidden = function(text, name) {
		var itemToAdd = "";

		itemToAdd += "<input value='";
		itemToAdd += text;
		if(formData && name) {
			itemToAdd += "' name='";
			itemToAdd += name;
		}
		itemToAdd += "' type='hidden'>";

		popupFrame.appendChild(htmlToElem(itemToAdd));
	};

	this.close = function() {
		popupBackground.remove();
		document.body.style.overflowY = "scroll"
		hasCreatedPopup = false;
	}
}

function createBanner(content, header, icon, autoClose) {
	if(currentBanners <= 0) {
		var newDiv = document.createElement("div");
		newDiv.id = "bannerHolder";
		newDiv.className = "bannerHolder";
		document.body.insertBefore(newDiv, document.body.firstChild);
	}
	currentBanners++;
	
	document.getElementById("bannerHolder").appendChild(htmlToElem(baseBannerHtml))
	var allBanners = document.getElementsByClassName("bannerFrame");
	var banner = allBanners[allBanners.length - 1];
	var itemToAdd = "";

	if(!isNullOrWhitespace(icon)) {
		itemToAdd += "<i class='material-icons'";
		if(icon == "check_circle") {
			itemToAdd += " style='color: var(--tertiaryGreen);'";

		} else if(icon == "error" || icon == "warning" ) {
			itemToAdd += " style='color: var(--tertiaryRed);'";

		} else if(icon == "help") {
			itemToAdd += " style='color: var(--secondaryBlue);'";

		} else if(icon == "storage") {
			itemToAdd += " style='color: var(--secondaryYellow);'";

		}
		itemToAdd += ">";
		itemToAdd += icon;
		itemToAdd += "</i>";

		banner.appendChild(htmlToElem(itemToAdd));
		itemToAdd = "";
	}

	if(!isNullOrWhitespace(header)) {
		itemToAdd += "<h2 class='bannerHeader'>";
		itemToAdd += header;
		itemToAdd += "</h2>";

		banner.appendChild(htmlToElem(itemToAdd));
		itemToAdd = "";
	}

	if(!isNullOrWhitespace(content)) {
		itemToAdd += "<p class='bannerContent'>";
		itemToAdd += content;
		itemToAdd += "</p>";

		banner.appendChild(htmlToElem(itemToAdd));
		itemToAdd = "";
	}

	document.getElementById("bannerHolder").appendChild(banner);

	banner.firstChild.addEventListener("click", function() {
		
		removeBanner(banner);
	});

	if(autoClose) {
		setTimeout(function() {
			if(banner != null) {
				banner.style = "transition-duration: 0.4s; opacity: 0%; max-height: 0px;"
			}
		}, autoClose);
		setTimeout(function() {
			if(banner != null) {
				banner.style = "transition-duration: 0.1s; opacity: 0%; max-height: 0px; margin: 0px; padding: 0px;"
			}
		}, autoClose + 400);
		setTimeout(removeBanner, autoClose + 500, banner);
	}
}

function removeBanner(banner) {
	if(banner != null && document.getElementById("bannerHolder") != null) {
		banner.remove();
		currentBanners--;
		if(currentBanners <= 0) {
			document.getElementById("bannerHolder").remove();
		}
	}
}

function isNullOrWhitespace( input ) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
}

export { createPopup, createBanner, FormData };