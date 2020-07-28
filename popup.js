var hasCreatedPopup = false;
const basePopupHtml = "<div id='popupBackground' class='popupBackground'><div id='popupFrame' class='popupFrame'><button id='xit' class='red'>X</button></div></div>"

function htmlToElem(html) {
	let temp = document.createElement('template');
	html = html.trim(); // Never return a space text node as a result
	temp.innerHTML = html;
	return temp.content;
}
  
function createPopup(onPopupCreated)
{
	if(hasCreatedPopup)
	{
		console.error("Failed to open new popup since one already exists.");
		return;
	}
	hasCreatedPopup = true;
	document.body.style.overflowY = "hidden"

	var generatedElement = htmlToElem(basePopupHtml);
	document.body.insertBefore(generatedElement, document.body.firstChild);
	
	var popup = new Popup(document.getElementById("popupBackground"), document.getElementById("popupFrame"));
	onPopupCreated(popup);

	document.getElementById("xit").addEventListener("click", function() {
		popup.close();
	});
}

function Popup(popupBackground, popupFrame)
{
	this.createTitle = function(text) {
		var itemToAdd = "";

		itemToAdd += "<h3>";
		itemToAdd += text;
		itemToAdd += "</h3>";

		popupFrame.innerHTML += itemToAdd;
	};

	this.createParagraph = function(text) {
		var itemToAdd = "";

		itemToAdd += "<p>";
		itemToAdd += text;
		itemToAdd += "</p>";

		popupFrame.innerHTML += itemToAdd;
	};

	this.createError = function(id) {
		var itemToAdd = "";

		itemToAdd += "<p id='";
		itemToAdd += id;
		itemToAdd += "' class='errorText'></p>";

		popupFrame.innerHTML += itemToAdd;
	};

	this.createBreak = function() {
		popupFrame.innerHTML += "<br>";
	};

	this.createTextInput = function(id, placeholder) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' placeholder='";
		itemToAdd += placeholder;
		itemToAdd += "' type='text'></input>";

		popupFrame.innerHTML += itemToAdd;
	};

	this.createPasswordInput = function(id, placeholder) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' placeholder='";
		itemToAdd += placeholder;
		itemToAdd += "' type='password'></input>";

		popupFrame.innerHTML += itemToAdd;
	};

	this.createEmailInput = function(id, placeholder) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' placeholder='";
		itemToAdd += placeholder;
		itemToAdd += "' type='email'></input>";

		popupFrame.innerHTML += itemToAdd;
	};

	this.createUrlInput = function(id, placeholder) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' placeholder='";
		itemToAdd += placeholder;
		itemToAdd += "' type='url'></input>";

		popupFrame.innerHTML += itemToAdd;
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

		popupFrame.innerHTML += itemToAdd;
	};

	this.createFileInput = function(id) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' type='file'></input>";

		popupFrame.innerHTML += itemToAdd;
	};

	this.createColorInput = function(id) {
		var itemToAdd = "";

		itemToAdd += "<input id='";
		itemToAdd += id;
		itemToAdd += "' type='color'></input>";

		popupFrame.innerHTML += itemToAdd;
	};

	this.createButtonInput = function(text, callback) {
		var itemToAdd = "";

		itemToAdd += "<button class='green'>";
		itemToAdd += text;
		itemToAdd += "</button>";

		popupFrame.innerHTML += itemToAdd;

		popupFrame.lastChild.addEventListener("click", callback);
	};

	this.close = function() {
		popupBackground.remove();
		document.body.style.overflowY = "scroll"
		hasCreatedPopup = false;
	}
}