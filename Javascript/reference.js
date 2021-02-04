const urlParams = new URLSearchParams(window.location.search);
let docsPath = urlParams.get("path");

var pages;/* = 
[
	new ContentItem("Page1", "LevelScripting/aLotInFact.html"),
	new ContentItem("Page2", "LevelScripting/index.html"),
	new ContentItem("Page3", "LevelScripting/veryManyThings.html",
		[
			new ContentItem("A", "LevelScripting/someOtherThing/index.html"),
			new ContentItem("B", "LevelScripting/someOtherThing/godILoveThisThing.html",
				[
					new ContentItem("1", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("2", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("3", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("4", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("5", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("6", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("7", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("8", "LevelScripting/someOtherThing/index.html",
						[
							new ContentItem("1", "LevelScripting/someOtherThing/index.html"),
							new ContentItem("2", "LevelScripting/someOtherThing/index.html", 
								[
									new ContentItem("1", "LevelScripting/someOtherThing/index.html"),
									new ContentItem("2", "LevelScripting/someOtherThing/index.html"),
									new ContentItem("3", "LevelScripting/someOtherThing/index.html"),
									new ContentItem("4", "LevelScripting/someOtherThing/index.html")
								]),
							new ContentItem("3", "LevelScripting/someOtherThing/index.html"),
							new ContentItem("4", "LevelScripting/someOtherThing/index.html")
						]),
					new ContentItem("9", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("10", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("11", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("12", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("13", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("14", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("15", "LevelScripting/someOtherThing/index.html")
				]),
			new ContentItem("C", "LevelScripting/someOtherThing/fantastic.html"),
			new ContentItem("D", "LevelScripting/someOtherThing/itsVeryGood/index.html",
				[
					new ContentItem("1", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("2", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("3", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("4", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("5", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("6", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("7", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("8", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("9", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("10", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("11", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("12", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("13", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("14", "LevelScripting/someOtherThing/index.html"),
					new ContentItem("15", "LevelScripting/someOtherThing/index.html")
				])
		]),
	new ContentItem("Page4", "LevelScripting/someOtherThing/itsVeryGood/aaaa.html")
];*/

window.getPages = () => {
	return pages;
}

function onLoad() {

	httpGetAsync(document.getElementById("layout").getAttribute("layout"), function(result) {
		//console.log(result);
		pages = parseContentsToContentsTree(result);

		let generatedCode = generateContents(pages);
		document.getElementById("contents").innerHTML = generatedCode;

		let items = document.getElementsByTagName("item");

		for(let i = 0; i < items.length; i++) {
			items[i].addEventListener("click", function(e) {
				let target = e.target;
			
				if (target.parentNode.tagName == "BUTTON") {
					target = target.parentNode;
				}

				if (target.tagName == "BUTTON") {
					let ul = target.parentNode.parentNode.children[1];
					let targetLength = 0;

					ul.style.transition = "";

					if (ul.style.height == "0px") {
						targetLength = ul.scrollHeight;
						//ul.style.height = ul.scrollHeight + "px";
						target.children[0].style.transform = "rotate(90deg)";

					} else {
						//ul.style.height = "0px";
						targetLength = 0;

						target.children[0].style.transform = "rotate(0deg)";

					}

					refreshContentExpand(ul, targetLength);
					return;
				}

				setPage(items[i].getAttribute("href"));
			});
		}

		if(docsPath != null) {
			setPage(docsPath);
		}

	});

}
onLoad();

function setPage(path) {
	let page = document.getElementById("page");

	page.style = "opacity: 0;";
	httpGetAsync(path, response => {
		page.innerHTML = response;
		page.style = "opacity: 1; transition: opacity 0.5s ease-out 0s;";

		let pres = page.querySelectorAll("pre");
		for(let i = 0; i < pres.length; i++) {
			let PRE = pres[i];

			let HEADER = document.createElement("div");
			HEADER.setAttribute("class", "header");

			let maxHeight = 0;
			let headerItems = [];
			let codeBlocks = PRE.querySelectorAll("code");
			for(let j = 0; j < codeBlocks.length; j++) {
				let HEADERITEM = document.createElement("span");
				if (j == 0) {
					HEADERITEM.setAttribute("class", "headerItem selectedItem");
					codeBlocks[j].setAttribute("style", "");
				}
				else {
					HEADERITEM.setAttribute("class", "headerItem");
					codeBlocks[j].setAttribute("style", "display: none;");
				}
				
				headerItems[j] = HEADERITEM;

				HEADERITEM.addEventListener("click", function() {
					for(let k = 0; k < codeBlocks.length; k++) {
						codeBlocks[k].setAttribute("style", "display: none;");
						headerItems[k].setAttribute("class", "headerItem");
					}
					codeBlocks[j].setAttribute("style", "");
					headerItems[j].setAttribute("class", "headerItem selectedItem");
				});

				let language = "";
				if (codeBlocks[j].classList.contains("language-javascript")){
					language = "js";
				}
				else if (codeBlocks[j].classList.contains("language-csharp")) {
					language = "C#"
				}
				else if (codeBlocks[j].classList.contains("language-lua")) {
					language = "lua";
				}

				codeBlocks[j].innerHTML = codeBlocks[j].innerHTML.trim();

				let SPAN = document.createElement("span");
				SPAN.innerHTML = language;

				HEADERITEM.appendChild(SPAN);
				HEADER.appendChild(HEADERITEM);


				hljs.highlightBlock(codeBlocks[j]);

				maxHeight = Math.max(maxHeight, codeBlocks[j].scrollHeight);
			}
			PRE.prepend(HEADER);

			let overrideHeight = PRE.getAttribute("height");
			if (overrideHeight != null)
			{
				PRE.style.height = overrideHeight;
			}
			else {
				PRE.style.height = (maxHeight + 50) + "px";
			}
		}

		let notes = page.querySelectorAll("note");
		for(let i = 0; i < notes.length; i++) {
			let DIV = document.createElement("div");
			DIV.innerHTML = "Note";

			notes[i].prepend(DIV);
		}

		let warnings = page.querySelectorAll("warning");
		for(let i = 0; i < warnings.length; i++) {
			let DIV = document.createElement("div");
			DIV.innerHTML = "Warning";

			warnings[i].prepend(DIV);
		}

		let links = page.querySelectorAll("a");
		for(let i = 0; i < links.length; i++) {
			let href = links[i].getAttribute("href");
			if (href == null) {
				let name = links[i].innerHTML.trim();

				href = findPageFromName(name, pages);

				if (href == null)
					continue;

				links[i].setAttribute("href", href.Href);
			}

			links[i].addEventListener("click", function(e) {
				let href = this.getAttribute("href");

				setPage(href);
				
				
				e.preventDefault();
			});
		}

	});
	setQuery(path);

	highlightSelected();

}

function setQuery(docPath) {
	if (history.pushState) {
		let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?path=" + docPath;
		window.history.pushState({path:newurl},"",newurl);
	}

	docsPath = docPath;
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function ContentItem(displayName, href, subObjects = []) {
	this.DisplayName = displayName;
	this.Href = href;
	this.SubObjects = subObjects;
}

function generateContents(contents) {
	let output = "";

	for(let i = 0; i < contents.length; i++) 
	{
		output += "<li>";

		let subObjects = contents[i].SubObjects;

		output += "<item href=\"" + contents[i].Href + "\">";
		
		if (subObjects.length != 0)
		{
			output += "<button style=\"text-decoration: none;\"><div style=\"transition: transform 0.2s; transform: rotate(0deg); font-family: inherit;\">></div></button>";
		}

		output += contents[i].DisplayName + "</item>";


		if (subObjects.length != 0) {
			output += "<ul style=\"height: 0px;\">";
			output += generateContents(subObjects);
			output += "</ul>";
			
		}

		output += "</li>";
	}

	return output;
}

function highlightSelected() {
	let items = document.getElementsByTagName("item");
	for(let i = 0; i < items.length; i++) {
		let isSelected = items[i].getAttribute("href") == docsPath;

		if (isSelected) {
			items[i].style.backgroundColor = "var(--primaryGrey)";
		}
		else {
			items[i].style.backgroundColor = "";
		}

	}
}
function refreshContentExpand(ul, targetLength) {
	let uls = [];

	let selected = ul;
	while(selected.id != "contents") {
		if (selected.tagName == "UL") {
			uls.push(selected);
		}
		selected = selected.parentNode;
	}

	let oldHeights = [];
	let currentHeights = [];
	let newHeights = [];

	for(let i = 0; i < uls.length; i++) {
		currentHeights[i] = uls[i].clientHeight + "px";
	}

	ul.style.height = targetLength + "px";

	for(let i = 0; i < uls.length; i++) {

		oldHeights[i] = uls[i].style.height;

		if (oldHeights[i] == "0px") {
			uls[i].style.height = "0px";
		} else {
			uls[i].style.height = "";
			uls[i].style.height = uls[i].scrollHeight + "px";
		}
		

		newHeights[i] = uls[i].style.height;
	}


	// transition: height 0.5s;

	for(let i = 0; i < uls.length; i++) {
		uls[i].style.height = currentHeights[i];
	}

	setTimeout(() => {
		for(let i = 0; i < uls.length; i++) {
			uls[i].style.transition = "height 0.3s";
		}

		for(let i = 0; i < uls.length; i++) {
			uls[i].style.height = newHeights[i];
		}

	}, 20);
}

function parseContentsToContentsTree(content) {
	let output = [];

	let lines = content.split("\n");
	for(let i = 0; i < lines.length; i++) {
		if (isNullOrWhitespace(lines[i]))
			continue;

		let endQuoteIndex = findOtherQuote(lines[i], 0)

		let displayName = lines[i].substring(1,endQuoteIndex);
		
		let next = endQuoteIndex+1;
		while(lines[i][next] == " "){
			next++;
		}

		let path = lines[i].substring(next+1,findOtherQuote(lines[i], next));

		let subs = "";
		for(let j = i+1; j < lines.length; j++) {
			if (lines[j][0] != "\t") {
				i = j -1;
				break;
			}

			subs += lines[j].substr(1) + "\n";
		}

		let generatedSubs = parseContentsToContentsTree(subs);

		output.push(new ContentItem(displayName, path, generatedSubs));
	}

	return output;
}
function findOtherQuote(str, index) {
	if (str[index] != "\"")
		throw "No quote found at the provided index, found '" + str[index] + "'";
	
	for(let i = index+1; i < str.length; i++) {
		if (str[i] == "\"")
			return i;
	}

	throw "Unable to find matching quote";
}
function isNullOrWhitespace( input ) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
}
function findPageFromName(name, pges) {
	for(let i = 0; i < pges.length; i++) {
		if (pges[i].DisplayName == name) {
			return pges[i];
		}
		
		let subObjectsResult = findPageFromName(name, pges[i].SubObjects);
		if (subObjectsResult != null)
			return subObjectsResult;
	}

	return null;
}