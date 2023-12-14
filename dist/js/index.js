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
const randBeerBtn = document.getElementById("randBeerBtn");
const beerPictureEL = document.getElementById("beerPicture");
const beerText = document.getElementById("beerName");
const searchBtn = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");
function grabBeer(URL) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(URL);
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
randBeerBtn === null || randBeerBtn === void 0 ? void 0 : randBeerBtn.addEventListener("click", function () {
    addBeerInfo();
});
searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener("click", () => {
    searchForBeer(searchBar.value);
});
function addBeerInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("adding beer info");
        const imgEl = document.createElement("img");
        let data = yield grabBeer(`${BASE_URL}beers/random`);
        if (data && data.length > 0) {
            console.log(data[0].image_url);
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
function searchForBeer(searchWord) {
    console.log(searchWord);
}
addBeerInfo();
