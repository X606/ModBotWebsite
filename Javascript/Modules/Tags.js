function ProcessTagString(tagFormatString) {
	let tags = getTags(tagFormatString);
	return _processTagString(tags);
}
function _processTagString(tags) {
	let output = "";
		
	for(let i = 0; i < tags.length; i++) {
		let currentTag = tags[i];
		
		if ((typeof currentTag) == "string") {
			output += currentTag;
		} else {
				
			if (currentTag.tagName == "color") {
				output += "<span style=\"color:" + tags[i].tagData + ";\">";
			}
			else if (currentTag.tagName == "size") {
				output += "<span style=\"font-size:" + tags[i].tagData + "px;\">";
			}
			else if(currentTag.tagName == "b")
			{
				output += "<span style=\"font-weight: bold;\">"
			}
			else if(currentTag.tagName == "i") {
				output += "<span style=\"font-style: italic;\">"
			}
			else {
				output += "<span>";
			}
			output += _processTagString(tags[i].content);
			output += "</span>";
		}
	}
		
	return output;
}
function getTags(str) {
		
	let parts = parseOutTagParts(str, "<", ">");
	return _getTags(parts);
}
function _getTags(parts) {
	if(parts.length < 3){
		return parts.join("");
	}
		
	let output = [];
		
	let tagDepth = 0;
	let lastIndex = -1;
		
	for(let i = 0; i < parts.length; i++) {
		let isTag = parts[i][0] == "<";
		if (isTag) {
			let isClosingTag = parts[i][1] == "/";
				
			if (isClosingTag) {
				tagDepth--;
				if(tagDepth === 0) {
					let lastTag = parts[lastIndex];
					let tagNameContent = lastTag.substring(1,lastTag.length-1).split("=");
						
					let tagName = tagNameContent[0];
					let tagData = tagNameContent[1];
					let content = _getTags(parts.slice(lastIndex+1, i));
						
						
					let tag = new Tag(tagName, content, tagData);
					output.push(tag);
				}
			} else {
				if(tagDepth === 0) {
					lastIndex = i;
				}
				tagDepth++;
			}
		}
			
	}
	return output;
}
function parseOutTagParts(content, start, end) {
		
	let output = [];
		
	let lastIndex = -1;
	let depth = 0;
	for(let i = 0; i < content.length; i++) {
			
		if (content[i] == start){
			if (depth === 0){
				let data = content.substring(lastIndex+1, i);
				if (data.length != 0) {
					output.push(data);
				}
				lastIndex = i;
			}
				
			depth++;
		}
		if (content[i] == end){
			depth--;
			if (depth === 0) {
				let data = content.substring(lastIndex+1, i);
				if (data.length != 0) {
					output.push("<" + data + ">");
				}
				lastIndex = i;
			}
				
		}
			
			
	}
	return output;
}
function Tag(name, content, data) {
	this.content = content;
	this.tagName = name;
	this.tagData = data;
}

export { ProcessTagString };