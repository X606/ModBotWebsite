// Auth
import { isValidSessionId } from "./Auth/IsValidSessionId.js";
import { createAccount } from "./Auth/CreateAccount.js";
import { getCurrentSessionId, setCurrentSessionId } from "./Auth/Sessions.js";
import { hasLikedMod } from "./Auth/ModLiking.js";
import { hasLikedComment, isCommentMine, postComment, deleteComment, likeComment } from "./Auth/Comments.js";
import { isSignedIn, signIn, signOut } from "./Auth/SignInOut.js";
import { downloadModTemplate } from "./Auth/DownloadTemplate.js"


// Unauth
import { getAllModIds } from "./Unauth/GetAllMods.js";
import { getAllModInfos } from "./Unauth/GetAllModInfos.js";
import { setImageElementToModImage, setImageElementToProfilePicture } from "./Unauth/Images.js"
import { getModData, getSpecialModData } from "./Unauth/GetModData.js";
import { SearchRequest, searchSortTypes } from "./Unauth/Search.js";


// other
import { downloadMod, downloadTempFile } from "./Files.js";
import { getCurrentUser, getUser } from "./Auth/User";


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

API.getAllModIds = getAllModIds;
API.getAllModInfos = getAllModInfos;
API.setImageElementToModImage = setImageElementToModImage;
API.setImageElementToProfilePicture = setImageElementToProfilePicture;
API.getModData = getModData;
API.getSpecialModData = getSpecialModData;
API.getUser = getUser;
API.SearchRequest = SearchRequest;
API.searchSortTypes = searchSortTypes;

API.downloadMod = downloadMod;
API.downloadTempFile = downloadTempFile;


export { API };