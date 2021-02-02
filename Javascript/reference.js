const urlParams = new URLSearchParams(window.location.search);
const docsPath = urlParams.get("path");

const items = document.getElementsByTagName("item");
const page = document.getElementById("page");

function onLoad() {
	page.addEventListener("load", function() {
		page.style = "opacity: 100%;";
		resizeIframe(page);
	});

	if(docsPath != null) {
		page.src = docsPath;
	}

	for(let i = 0; i < items.length; i++) {
		items[i].addEventListener("click", function() {
			setPage(items[i].getAttribute("href"));
		});
	}
}
onLoad();

function setPage(path) {
	page.style = "opacity: 0%;";
	page.src = path;
	setQuery(path);
}

function resizeIframe(obj) {
	obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + "px";
}

function setQuery(docPath) {
	if (history.pushState) {
		let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?path=" + docPath;
		window.history.pushState({path:newurl},"",newurl);
	}
}