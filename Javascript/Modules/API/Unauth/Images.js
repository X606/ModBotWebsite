function setImageElementToModImage(element, modID) {
	element.src = "/api/?operation=getModImage&id=" + modID;
};
function setImageElementToProfilePicture(element, userID) {
	element.src = "/api/?operation=getProfilePicture&id=" + userID;
};

export { setImageElementToModImage, setImageElementToProfilePicture };