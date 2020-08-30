// Auth
import {
	isValidSessionId,
	createAccount,
	getCurrentSessionId,
	setCurrentSessionId,
	hasLikedMod,
	hasLikedComment,
	isCommentMine,
	postComment,
	deleteComment,
	likeComment,
	isSignedIn,
	signIn,
	signOut,
	downloadModTemplate,
	getCurrentUser,
	getUser,
	setLikedMod
} from "./Auth.js";


// Unauth
import {
	getAllModIds,
	getAllModInfos,
	setImageElementToModImage,
	setImageElementToProfilePicture,
	getModData,
	getSpecialModData,
	SearchRequest,
	searchSortTypes,
	getProfilePictureLink
} from "./Unauth.js";

// other
import { downloadMod, downloadTempFile } from "./Files.js";


const API = {};

API.isValidSessionId = isValidSessionId;
API.createAccount = createAccount;
API.getCurrentSessionId = getCurrentSessionId;
API.setCurrentSessionId = setCurrentSessionId;
API.hasLikedMod = hasLikedMod;
API.hasLikedComment = hasLikedComment;
API.isCommentMine = isCommentMine;
API.isSignedIn = isSignedIn;
API.signIn = signIn;
API.signOut = signOut;
API.postComment = postComment;
API.deleteComment = deleteComment;
API.likeComment = likeComment;
API.downloadModTemplate = downloadModTemplate;
API.getCurrentUser = getCurrentUser;
API.setLikedMod = setLikedMod;

API.getAllModIds = getAllModIds;
API.getAllModInfos = getAllModInfos;
API.setImageElementToModImage = setImageElementToModImage;
API.setImageElementToProfilePicture = setImageElementToProfilePicture;
API.getModData = getModData;
API.getSpecialModData = getSpecialModData;
API.getUser = getUser;
API.SearchRequest = SearchRequest;
API.searchSortTypes = searchSortTypes;
API.getProfilePictureLink = getProfilePictureLink;

API.downloadMod = downloadMod;
API.downloadTempFile = downloadTempFile;


export { API };