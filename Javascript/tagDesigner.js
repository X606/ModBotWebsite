import { API } from "/api?operation=getAPI";
import { createPopup, createBanner, FormData } from "/Javascript/Modules/popup.js";

window.createPopup = createPopup;
window.createBanner = createBanner;
window.FormData = FormData;

const urlParams = new URLSearchParams(window.location.search);

var tagName;
var characterDatas;
var isEditing = false;

var tagID = null;

async function onStartup() {
	tagID = urlParams.get('tagID');
	if (tagID != null) {
		let tag = await API.getTag(tagID);
		console.log(tag);
		if (tag == null) {
			setTagName("[New Tag]");
			GenerateString(tagName);
			tagID = null;
			return;
		}

		Import(tag.Body);
	}

}
onStartup();



function setTagName(name) {
	tagName = name;
	characterDatas = [];
	for(let i = 0; i < name.length; i++) {
		characterDatas[i] = new CharacterData("#ffffff", false, false, null);
	}
}

function GenerateString(str) {
	let tagHolder = document.getElementById("tag");
	
	let constructedString = "";
	for(let i = 0; i < str.length; i++) 
	{
		let characterData = characterDatas[i];
		
		if (characterData == undefined) 
		{
			constructedString += "<span id=\"" + i + "\">" + str[i] + "</span>";
		} else {
			var style = "color:" + characterData.color + ";";
			if (characterData.italics)
				style += "font-style: italic;";
			if(characterData.bold)
				style += "font-weight: bold;";

			constructedString += "<span style=\"" + style +"\" id=\"" + i + "\">" + str[i] + "</span>";

		}

	}
	
	tagHolder.innerHTML = constructedString;
}

function Import(tag) {
	let name = "";
	let characters = [];
	
	function matches(str, index, comp) {
		for(let i = 0; i < comp.length; i++) {
			if (str[index+i] != comp[i])
			{
				return false;
			}
		}

		return true;
	}

	let color = "#ffffff";
	let useBold = false;
	let useItalics = false;

	let index = 0;

	for(let i = 0; i < tag.length; i++) {
		if (matches(tag, i, "<color=")) {
			i += "<color=".length;
			color = tag.substring(i, i+"#ffffff".length);
			i += "#ffffff>".length-1;
			continue;
		}
		if (matches(tag, i, "</color>")) {
			color = "#ffffff";
			i += "</color>".length-1;
			continue;
		}
		if (matches(tag, i, "<b>")) {
			useBold = true;
			i += "<b>".length-1;
			continue;
		}
		if (matches(tag, i, "</b>")) {
			useBold = false;
			i += "</b>".length-1;
			continue;
		}
		if (matches(tag, i, "<i>")) {
			useItalics = true;
			i += "<i>".length-1;
			continue;
		}
		if (matches(tag, i, "</i>")) {
			useItalics = false;
			i += "</i>".length-1;
			continue;
		}

		characters[index] = new CharacterData(color, useItalics, useBold, null);
		name += tag[i];
		index++;
	}

	tagName = name;
	characterDatas = characters;
	GenerateString(name);
}
window.Import = Import;

function Export() {
	function Span(start, end, key, data) {
		this.start = start;
		this.end = end;
		
		this.key = key;
		this.data = data;

		this.getStartTag = () =>
		{
			if (key == "color") {
				return "<color=" + this.data + ">";
			}
			if (key == "italics") {
				return "<i>";
			}
			if (key == "bold") {
				return "<b>";
			}

			return "";
		}
		this.getEndTag = () =>
		{
			if (key == "color") {
				return "</color>";
			}
			if (key == "italics") {
				return "</i>";
			}
			if (key == "bold") {
				return "</b>";
			}

			return "";
		}
	}
	var spans = [];

	let oldColor = "";
	let oldColorLastIndex = 0;
	let oldItalics = false;
	let oldItalicsLastIndex = 0;
	let hasItalics = false;
	let oldBold = false;
	let oldBoldLastIndex = 0;
	let hasBold = false;

	for(let i = 0; i < characterDatas.length; i++) {
		let characterData = characterDatas[i];

		if (characterData.color != oldColor) {
			if(oldColor != "") {
				spans.push(new Span(oldColorLastIndex, i, "color", oldColor));
			}

			oldColorLastIndex = i;
			oldColor = characterData.color;
		}
		if (characterData.italics != oldItalics) {
			
			if(characterData.italics) {
				oldItalicsLastIndex = i;
			} else {
				spans.push(new Span(oldItalicsLastIndex, i, "italics", null));
			}
			
			oldItalics = characterData.italics;
		}
		if (characterData.bold != oldBold) {
			
			if(characterData.bold) {
				oldBoldLastIndex = i;
			} else {
				spans.push(new Span(oldBoldLastIndex, i, "bold", null));
			}
			
			oldBold = characterData.bold;
		}

	}

	if (oldColor != "") {
		spans.push(new Span(oldColorLastIndex, characterDatas.length, "color", oldColor));
	}
	if (oldItalics) {
		spans.push(new Span(oldItalicsLastIndex, characterDatas.length, "italics", null));
	}
	if (oldBold) {
		spans.push(new Span(oldBoldLastIndex, characterDatas.length, "bold", null));
	}

	/*for(let i = 0; i < spans.length; i++) {
		console.log(spans[i]);
	}*/

	function getAllSpansThatStartAt(index) {
		let selected = [];
		for(let i = 0; i < spans.length; i++) {
			if (spans[i].start == index) {
				selected.push(spans[i]);
			}
		}
		
		selected.sort((a,b) => b.end - a.end);
		return selected;
	}
	function getAllSpansThatEndAt(index) {
		let selected = [];
		for(let i = 0; i < spans.length; i++) {
			if (spans[i].end == index) {
				selected.push(spans[i]);
			}
		}
		
		selected.sort((a,b) => a.start - b.start);
		return selected;
	}

	let output = "";
	let stack = [];

	for(let i = 0; i < tagName.length; i++) {
		//console.log(i);
		//console.log("start:");
		let selectedStart = getAllSpansThatStartAt(i);
		/*
		for(let i = 0; i < selectedStart.length; i++) {
			console.log(selectedStart[i]);
		}*/

		//console.log("end:");
		let selectedEnd = getAllSpansThatEndAt(i);
		/*for(let i = 0; i < selectedEnd.length; i++) {
			console.log(selectedEnd[i]);
		}*/


		for(let j = 0; j < selectedEnd.length; j++) {

			let select = selectedEnd[j];

			let smallStack = [];

			while(stack.length != 0) {
				let element = stack.pop();
				
				if (element.key != select.key) {
					output += element.getEndTag();
					smallStack.push(element);
					continue;
				} else {
					output += element.getEndTag();
					break;
				}
			}

			while(smallStack.length != 0) {
				let popped = smallStack.pop();
				output += popped.getStartTag();

				stack.push(popped);
			}

		}
		
		for(let j = 0; j < selectedStart.length; j++) {
			output += selectedStart[j].getStartTag();

			stack.push(selectedStart[j]);
		}

		output += tagName[i];
	}
	
	while(stack.length != 0) {
		let element = stack.pop();
		output += element.getEndTag();
	}
	/*
	let oldColor = "";
	let oldItalics = false;
	let hasItalics = false;
	let oldBold = false;
	let hasBold = false;

	for(let i = 0; i < tagName.length; i++) {
		let characterData = characterDatas[i];
		if (characterData.color != oldColor) {
			if (oldColor != "") {
				output += "</color>";
			}
			output += "<color=" + characterData.color + ">";
			
			oldColor = characterData.color;
		}
		if (characterData.italics != oldItalics) {
			if (characterData.italics) {
				output += "<i>";
			} else {
				if (hasItalics) {
					output += "</i>";
				}
			}
			
			oldItalics = characterData.italics;
			hasItalics = true;
		}
		if (characterData.bold != oldBold) {
			if (characterData.bold) {
				output += "<b>";
			} else {
				if (hasBold) {
					output += "</b>";
				}
			}
			
			oldBold = characterData.bold;
			hasBold = true;
		}
		
		output += tagName[i];
	}
	
	if(oldColor != "") {
		output += "</color>";
	}
	if (hasItalics && oldItalics){
		output += "</i>";
	}
	if (hasBold && oldBold){
		output += "</b>";
	}
	*/

	return output;
}
window.Export = Export;

function CharacterData(color, italics, bold, size) {
	this.color = color;
	this.italics = italics;
	this.bold = bold;
	this.size = size;
}

function stripHtmlTags(html){
   let doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
}

document.getElementById("tag").addEventListener("keypress", function(e) {
	if(e.which == 13) {   // if this is a newline, cancel it
		e.preventDefault();
		document.getElementById("tag").blur();
	}
});
document.getElementById("tag").addEventListener("paste", function(e) {
  e.preventDefault();
});
document.getElementById("editButton").addEventListener("click", function(e) {

	let tag = document.getElementById("tag");
	tag.innerHTML = tagName;
	tag.setAttribute("contenteditable", "true");
	isEditing = true;

	const onChange = function(e) {
		
		tag.setAttribute("contenteditable", "false");
		let content = stripHtmlTags(tag.innerHTML);

		if (!content.startsWith("[")) {
			content = "[" + content;
		}
		if (!content.endsWith("]")) {
			content = content + "]";
		}



		setTagName(content);
		
		GenerateString(tagName);

		tag.removeEventListener("blur", onChange);
		isEditing = false;
	}

	tag.addEventListener("blur", onChange);
});

document.getElementById("updateButton").addEventListener("click", async function(e) {
	if (tagID == null) {
		createPopup(function (popup) {
			popup.createTitle("Upload tag");
			popup.createTextInput("tagName", "Tag Name");
			popup.createBreak();
			popup.createButtonInput("Upload", async function () {
				let tagname = document.getElementById("tagName").value;
				let body = Export();
				let uploaded = await API.uploadTag(tagname, body);
				popup.close();
				if (uploaded.error) {
					createBanner(uploaded.error, "Error", "error", 3000);
				} else {
					let id = uploaded.ID;
					
					window.location.href = window.location.pathname + "?tagID=" + id;
				}

			}, "uploadButton");
		});
	} else {
		if (confirm("You are about to update this tag, this will mean the tag has to be checked again, are you sure you want to continue?")) {
			let body = Export();
			let response = await API.editTag(tagID, body);
			if (response.isError) {
				createBanner(response.message, "Error", "error", 3000);
			} else {
				createBanner(response.message, "Success", "check_circle", 3000);
			}
		}
	}

	
});
document.onkeyup = function(e) {
	if(isEditing) {
		return;
	}
		
	
    if (e.key == "c" || e.key == "C") {
		let range = window.getSelection().getRangeAt(0);
		
		let endContainer = range.endContainer;

		let start = Number.parseInt(range.startContainer.parentElement.id);
		let end = Number.parseInt(endContainer.parentElement.id);
	
		let color = document.getElementById("color").value;
		for(let i = start; i < end+1; i++)
		{
			characterDatas[i].color = color;
		}

		GenerateString(tagName);

	}
	if (e.key == "b" || e.key == "B") {
		let range = window.getSelection().getRangeAt(0);
		
		let endContainer = range.endContainer;

		let start = Number.parseInt(range.startContainer.parentElement.id);
		let end = Number.parseInt(endContainer.parentElement.id);
	
		let color = document.getElementById("color").value;
		for(let i = start; i < end+1; i++)
		{
			characterDatas[i].bold = !characterDatas[i].bold;
		}

		GenerateString(tagName);

	}
	if (e.key == "i" || e.key == "I") {
		let range = window.getSelection().getRangeAt(0);
		
		let endContainer = range.endContainer;

		let start = Number.parseInt(range.startContainer.parentElement.id);
		let end = Number.parseInt(endContainer.parentElement.id);
	
		let color = document.getElementById("color").value;
		for(let i = start; i < end+1; i++)
		{
			characterDatas[i].italics = !characterDatas[i].italics;
		}

		GenerateString(tagName);

	}
}