const serverUrl = "http://10.40.201.230";
const navServerUrl = `${serverUrl}/api/Navigation`;
const carouselServerUrl = `${serverUrl}/api/Carousels`;
const articleServerUrl = `${serverUrl}/api/Management`;
const tabColumnServerUrl = `${serverUrl}/api/Management`;

const servers = {
	getPublicKeyUrl: `${serverUrl}/api/Admin/GetPublicKey`,
	loginUrl: `${serverUrl}/api/Admin/PostAdminLogin`,
	getNavUrl: `${navServerUrl}/GetNav`,
	updateNavUrl: `${navServerUrl}/PostUpData`,
	deleteNavUrl: `${articleServerUrl}/PostDeleteAreaId`,
	navLinkArticlesUrl: `${articleServerUrl}/PostLinkNews`,
	getCarouselsUrl: `${carouselServerUrl}/GetCarousels`,
	updateCarouselsUrl: `${carouselServerUrl}/UpDataCar`,
	getArticleUrl: `${articleServerUrl}/GetBackstageNewsByID`,
	getArticlesLenUrl: `${articleServerUrl}/GetNumberOfPartitions`,
	getArticlesUrl: `${articleServerUrl}/GetNews`,
	updateArticleUrl: `${articleServerUrl}/PostUpNews`,
	deleteArticleUrl: `${articleServerUrl}/PostDeleteNews`,
	uploadArticleImgUrl: `${articleServerUrl}/PostUpimg`,
	allocationArticleIdUrl: `${articleServerUrl}/GetNewsID`,
	getTabUrl: `${tabColumnServerUrl}/getTab`,
	updateTabUrl: `${tabColumnServerUrl}/PostUpTab`,
};

const frontServers = {
	getArticlesUrl: `${articleServerUrl}/GetFrontEndAllNews`,
	getAreaArticlesUrl: `${articleServerUrl}/GetNewsByAreaID`,
};

export {
	navServerUrl,
	carouselServerUrl,
	articleServerUrl,
	serverUrl,
	tabColumnServerUrl,
	servers,
	frontServers,
};
