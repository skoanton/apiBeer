"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "https://api.punkapi.com/v2/";
//infoView elements
const infoBeerName = document.getElementById("infoBeerName");
const infoBeerAbv = document.getElementById("infoBeerAbv");
const infoBeerVolume = document.getElementById("infoBeerVolume");
const infoBeerDescription = document.getElementById("infoBeerDescription");
const infoBeerIngridentsHops = document.getElementById("infoBeerIngridientsHops");
const infoBeerIngridientsMalt = document.getElementById("infoBeerIngridientsMalt");
const infoBeerIngridientsYest = document.getElementById("infoBeerIngridientsYest");
const infoBeerFoodPairing = document.getElementById("infoBeerFoodPairing");
const infoBeerBrewerTips = document.getElementById("infoBeerBrewerTips");
//overview elements
const beerPictureEL = document.getElementById("beerPicture");
const beerText = document.getElementById("beerName");
const searchBar = document.getElementById("searchBar");
//Search elements
const searchListEl = document.getElementById("searchList");
//Buttons
const randBeerBtn = document.getElementById("randBeerBtn");
const seeMoreButton = document.getElementById("seeMoreButton");
const searchBtn = document.getElementById("searchBtn");
const backButton = document.getElementById("back-button");
const searchPreviousPageButton = document.getElementById("searchPreviousPageButton");
const searchNextPageButton = document.getElementById("searchNextPageButton");
const advancedSearchButton = document.getElementById("advancedSearch");
const searchAdvButton = document.getElementById("advSearchButton");
//different Views
const overviewEl = document.getElementById("overview");
const searchView = document.getElementById("searchView");
const infoView = document.getElementById("infoView");
const advancedSearchView = document.getElementById("advancedSearchView");
const views = [overviewEl, searchView, infoView, advancedSearchView];
//advanced search
const advSearchName = document.getElementById("searchName");
const advSearchHops = document.getElementById("searchHops");
const advSearchMalt = document.getElementById("searchMalt");
const advSearchAbvMin = document.getElementById("abvMin");
const advSearchAbvMax = document.getElementById("abvMax");
const advSearchBrewYearMin = document.getElementById("brewYearMin");
const advSearchBrewYearMax = document.getElementById("brewYearMax");
let currentId;
let currentSearchWord;
let currentPage = 1;
let cachedData = [];
function grabBeer(URL) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const respone = yield fetch(URL);
            if (respone.status === 200) {
                const data = yield respone.json();
                return data;
            }
            else {
                throw Error("något gick fel");
            }
        }
        catch (error) {
            console.error("error");
        }
    });
}
function addEventListners() {
    randBeerBtn === null || randBeerBtn === void 0 ? void 0 : randBeerBtn.addEventListener("click", function () {
        addBeerInfo();
    });
    searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener("click", () => {
        searchForBeer();
    });
    seeMoreButton === null || seeMoreButton === void 0 ? void 0 : seeMoreButton.addEventListener("click", () => {
        switchView(infoView);
        populateInfoView();
    });
    backButton === null || backButton === void 0 ? void 0 : backButton.addEventListener("click", () => {
        switchView(overviewEl);
    });
    searchNextPageButton === null || searchNextPageButton === void 0 ? void 0 : searchNextPageButton.addEventListener("click", () => {
        swichSearchPage(currentSearchWord, 1);
    });
    searchPreviousPageButton === null || searchPreviousPageButton === void 0 ? void 0 : searchPreviousPageButton.addEventListener("click", () => {
        swichSearchPage(currentSearchWord, 0);
    });
    advancedSearchButton === null || advancedSearchButton === void 0 ? void 0 : advancedSearchButton.addEventListener("click", () => {
        switchView(advancedSearchView);
    });
    searchAdvButton === null || searchAdvButton === void 0 ? void 0 : searchAdvButton.addEventListener("click", () => {
        searchForBeer();
    });
}
function addBeerInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const imgEl = document.createElement("img");
        let data = yield grabBeer(`${BASE_URL}beers/random`);
        if (data && data.length > 0) {
            currentId = data[0].id;
            imgEl.setAttribute("src", data[0].image_url);
            while (beerPictureEL === null || beerPictureEL === void 0 ? void 0 : beerPictureEL.firstChild) {
                beerPictureEL.firstChild.remove();
            }
            beerPictureEL === null || beerPictureEL === void 0 ? void 0 : beerPictureEL.appendChild(imgEl);
            if (beerText != null) {
                beerText.innerHTML = data[0].name;
            }
        }
        else {
            console.error("gick inte ladda");
        }
    });
}
function switchView(ElementToShow) {
    views === null || views === void 0 ? void 0 : views.forEach(view => {
        if (!view.classList.contains("hide")) {
            view.classList.add("hide");
        }
    });
    ElementToShow === null || ElementToShow === void 0 ? void 0 : ElementToShow.classList.remove("hide");
}
function populateInfoView() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        removeCurrentInfo();
        let data = yield grabBeer(`${BASE_URL}beers/${currentId}`);
        if (data && data.length > 0) {
            (_a = document.getElementById("infoImage")) === null || _a === void 0 ? void 0 : _a.setAttribute("src", data[0].image_url);
            if (infoBeerName) {
                infoBeerName.innerHTML = data[0].name;
            }
            if (infoBeerAbv) {
                infoBeerAbv.innerHTML = data[0].abv.toString() + "%";
            }
            if (infoBeerVolume) {
                infoBeerVolume.innerHTML = `${data[0].volume.value} ${data[0].volume.unit}`;
            }
            if (infoBeerDescription) {
                infoBeerDescription.innerHTML = data[0].description;
            }
            if (infoBeerIngridentsHops) {
                for (let i = 0; i < data[0].ingredients.hops.length; i++) {
                    let liEl = document.createElement("li");
                    liEl.innerHTML = data[0].ingredients.hops[i].name;
                    infoBeerIngridentsHops.appendChild(liEl);
                }
            }
            if (infoBeerIngridientsMalt) {
                for (let i = 0; i < data[0].ingredients.malt.length; i++) {
                    let liEl = document.createElement("li");
                    liEl.innerHTML = data[0].ingredients.malt[i].name;
                    infoBeerIngridientsMalt.appendChild(liEl);
                }
            }
            if (infoBeerIngridientsYest) {
                let liEl = document.createElement("li");
                liEl.innerHTML = data[0].ingredients.yeast;
                infoBeerIngridientsYest.appendChild(liEl);
            }
            if (infoBeerFoodPairing) {
                for (let i = 0; i < data[0].food_pairing.length; i++) {
                    let liEl = document.createElement("li");
                    liEl.innerHTML = data[0].food_pairing[i];
                    infoBeerFoodPairing.appendChild(liEl);
                }
            }
            if (infoBeerBrewerTips) {
                infoBeerBrewerTips.innerHTML = data[0].brewers_tips;
            }
        }
    });
}
function populateSearchView() {
    //hiding back button in searchview isf needed
    if (currentPage === 1) {
        searchPreviousPageButton === null || searchPreviousPageButton === void 0 ? void 0 : searchPreviousPageButton.classList.add("hide");
    }
    else {
        searchPreviousPageButton === null || searchPreviousPageButton === void 0 ? void 0 : searchPreviousPageButton.classList.remove("hide");
    }
    //removing old info in list
    while (searchListEl === null || searchListEl === void 0 ? void 0 : searchListEl.firstChild) {
        searchListEl.firstChild.remove();
    }
    if (cachedData.length > 0) {
        cachedData.forEach(data => {
            let liEl = document.createElement("li");
            let buttonEl = document.createElement("button");
            buttonEl.setAttribute("id", data.id.toString());
            buttonEl.classList.add("link-button");
            buttonEl.innerHTML = data.name;
            buttonEl.addEventListener("click", () => {
                switchView(infoView);
                currentId = Number(buttonEl.getAttribute("id"));
                populateInfoView();
            });
            liEl.appendChild(buttonEl);
            searchListEl === null || searchListEl === void 0 ? void 0 : searchListEl.appendChild(liEl);
        });
    }
}
function removeCurrentInfo() {
    while (infoBeerIngridentsHops === null || infoBeerIngridentsHops === void 0 ? void 0 : infoBeerIngridentsHops.firstChild) {
        infoBeerIngridentsHops.firstChild.remove();
    }
    while (infoBeerIngridientsMalt === null || infoBeerIngridientsMalt === void 0 ? void 0 : infoBeerIngridientsMalt.firstChild) {
        infoBeerIngridientsMalt.firstChild.remove();
    }
    while (infoBeerIngridientsYest === null || infoBeerIngridientsYest === void 0 ? void 0 : infoBeerIngridientsYest.firstChild) {
        infoBeerIngridientsYest.firstChild.remove();
    }
    while (infoBeerFoodPairing === null || infoBeerFoodPairing === void 0 ? void 0 : infoBeerFoodPairing.firstChild) {
        infoBeerFoodPairing.firstChild.remove();
    }
}
function swichSearchPage(searchWord, nr) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (nr) {
            case 1:
                currentPage++;
                break;
            case 0:
                currentPage--;
                break;
            default:
                console.error("can´t switch view");
                break;
        }
        if (currentPage > 0 && cachedData.length > 0) {
            populateSearchView();
        }
        else {
            switch (nr) {
                case 1:
                    currentPage--;
                    break;
                case 0:
                    currentPage++;
                    break;
                default:
                    console.error("wrong with switching page");
                    break;
            }
        }
    });
}
function checkLength(maxLength, urlLength, serachUrl) {
    if (urlLength > maxLength) {
        serachUrl += "&";
    }
    return serachUrl;
}
function searchForBeer() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let searchURL = `${BASE_URL}beers?`;
        let maxLength = searchURL.length;
        if (searchBar === null || searchBar === void 0 ? void 0 : searchBar.value) {
            console.log("normal serach bar");
            searchURL += `beer_name=${searchBar.value}`;
            currentSearchWord = searchBar.value;
            searchBar.value = "";
        }
        if (advSearchName === null || advSearchName === void 0 ? void 0 : advSearchName.value) {
            console.log("adv serach bar");
            searchURL += `beer_name=${advSearchName.value}`;
            currentSearchWord = advSearchName === null || advSearchName === void 0 ? void 0 : advSearchName.value;
            advSearchName.value = "";
        }
        if (advSearchHops === null || advSearchHops === void 0 ? void 0 : advSearchHops.value) {
            searchURL = checkLength(maxLength, searchURL.length, searchURL);
            console.log("adv serach bar hops");
            searchURL += `hops=${advSearchHops.value}`;
            advSearchHops.value = "";
        }
        if (advSearchMalt === null || advSearchMalt === void 0 ? void 0 : advSearchMalt.value) {
            searchURL = checkLength(maxLength, searchURL.length, searchURL);
            searchURL += `malt=${advSearchMalt.value}`;
            advSearchMalt.value = "";
        }
        if (advSearchAbvMin === null || advSearchAbvMin === void 0 ? void 0 : advSearchAbvMin.value) {
            searchURL = checkLength(maxLength, searchURL.length, searchURL);
            searchURL += `abv_gt=${advSearchAbvMin.value}`;
            advSearchAbvMin.value = "";
        }
        if (advSearchAbvMax === null || advSearchAbvMax === void 0 ? void 0 : advSearchAbvMax.value) {
            searchURL = checkLength(maxLength, searchURL.length, searchURL);
            searchURL += `abv_lt=${advSearchAbvMax}`;
            advSearchAbvMax.value = "";
        }
        if (advSearchBrewYearMin === null || advSearchBrewYearMin === void 0 ? void 0 : advSearchBrewYearMin.value) {
            searchURL = checkLength(maxLength, searchURL.length, searchURL);
            searchURL += `brewed_after=${advSearchBrewYearMin}`;
            advSearchBrewYearMin.value = "";
        }
        if (advSearchBrewYearMax === null || advSearchBrewYearMax === void 0 ? void 0 : advSearchBrewYearMax.value) {
            searchURL = checkLength(maxLength, searchURL.length, searchURL);
            searchURL += `brewed_before${advSearchBrewYearMax}`;
            advSearchBrewYearMax.value = "";
        }
        /* searchURL +="&per_page=10"  */
        console.log(searchURL);
        let data = yield grabBeer(searchURL);
        console.log(data);
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                console.log("foor loop");
                const newData = { id: data[i].id, name: data[i].name };
                console.log(newData);
                cachedData.push(newData);
            }
            console.log(cachedData);
            switchView(searchView);
            populateSearchView();
        }
        else {
            (_a = document.getElementById("noSearchResult")) === null || _a === void 0 ? void 0 : _a.classList.remove("hide");
        }
    });
}
addBeerInfo();
addEventListners();
