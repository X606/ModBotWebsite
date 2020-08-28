function downloadMod(modID) {
	window.open("/api/?operation=downloadMod&id=" + modID);
};
function downloadTempFile(key) {
	window.open("/api/?operation=downloadTempFile&key=" + key);
};

export { downloadMod, downloadTempFile };