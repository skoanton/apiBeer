const BASE_URL: string = "https://api.punkapi.com/v2/";

//infoView elements
const infoBeerName: HTMLElement | null = document.getElementById("infoBeerName");
const infoBeerAbv: HTMLElement | null = document.getElementById("infoBeerAbv");
const infoBeerVolume: HTMLElement | null = document.getElementById("infoBeerVolume");
const infoBeerDescription: HTMLElement | null = document.getElementById("infoBeerDescription");
const infoBeerIngridentsHops: HTMLElement | null = document.getElementById("infoBeerIngridientsHops");
const infoBeerIngridientsMalt: HTMLElement | null = document.getElementById("infoBeerIngridientsMalt");
const infoBeerIngridientsYest: HTMLElement | null = document.getElementById("infoBeerIngridientsYest");
const infoBeerFoodPairing: HTMLElement | null = document.getElementById("infoBeerFoodPairing");
const infoBeerBrewerTips: HTMLElement | null = document.getElementById("infoBeerBrewerTips");

//overview elements
const beerPictureEL: HTMLElement | null = document.getElementById("beerPicture");
const beerText: HTMLElement | null = document.getElementById("beerName");
const searchBar = <HTMLInputElement>document.getElementById("searchBar");

//Search elements
const searchListEl: HTMLElement | null = document.getElementById("searchList");

//Buttons
const randBeerBtn: HTMLElement | null = document.getElementById("randBeerBtn");
const seeMoreButton = <HTMLButtonElement>document.getElementById("seeMoreButton");
const searchBtn: HTMLElement | null = document.getElementById("searchBtn");
const backButton: HTMLElement | null = document.getElementById("back-button");
const searchPreviousPageButton: HTMLElement | null = document.getElementById("searchPreviousPageButton");
const searchNextPageButton: HTMLElement | null = document.getElementById("searchNextPageButton");

//different Views

const overviewEl: HTMLElement | null = document.getElementById("overview");
const searchView: HTMLElement | null = document.getElementById("searchView");
const infoView: HTMLElement | null = document.getElementById("infoView");
const views: HTMLElement[] | null = [overviewEl!, searchView!, infoView!];

let currentId: number;
let currentSearchWord: string | null;
let currentPage: number | null = 1;

interface BeerInfo {
    id: number;
    name: string;
    description: string;
    image_url: string;
    abv: number;
    volume: {
        unit: string,
        value: number
    };
    ingredients: {
        hops: { name: string }[],
        malt: { name: string }[],
        yeast: string,
    };
    food_pairing: string[];
    brewers_tips: string;

}

async function grabBeer(URL: RequestInfo) {
    
    try {
        const respone: Response = await fetch(URL);
        if (respone.status === 200) {
            const data: BeerInfo[] | null = await respone.json();
            
            return data;
        }
        else {
            throw Error("något gick fel");

        }
    } catch (error) {
        console.error("error");
    }

}


function addEventListners() {

    randBeerBtn?.addEventListener("click", function () {
        addBeerInfo();
    });

    searchBtn?.addEventListener("click", () => {
        searchForBeer(searchBar!.value);
    });
    seeMoreButton?.addEventListener("click", () => {
        
        switchView(infoView);
        populateInfoView();
    });

    backButton?.addEventListener("click", () => {
        switchView(overviewEl);
    })

    searchNextPageButton?.addEventListener("click", () => {
        
        switchPage(currentSearchWord, 1);

    })

    searchPreviousPageButton?.addEventListener("click", () => {
        
        switchPage(currentSearchWord, 0);

    })

}

async function addBeerInfo() {
    

    const imgEl = document.createElement("img");

    let data = await grabBeer(`${BASE_URL}beers/random`);
    if (data && data.length > 0) {

        currentId = data[0].id;
        
        imgEl.setAttribute("src", data![0].image_url);

        while (beerPictureEL?.firstChild) {
            beerPictureEL.firstChild.remove();
        }
        beerPictureEL?.appendChild(imgEl);

        if (beerText != null) {
            beerText.innerHTML = data![0].name;
        }
    }

    else {
        console.error("gick inte ladda");
    }

}

function switchView(ElementToShow: HTMLElement | null) {
    
    views?.forEach(view => {
        if (!view.classList.contains("hide")) {
            
            view.classList.add("hide");
        }
    });

    ElementToShow?.classList.remove("hide");



}

async function populateInfoView() {
    removeCurrentInfo();

    let data = await grabBeer(`${BASE_URL}beers/${currentId}`);

    if (data && data.length > 0) {

        document.getElementById("infoImage")?.setAttribute("src", data[0].image_url);

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
                let liEl: HTMLElement = document.createElement("li");
                liEl.innerHTML = data[0].ingredients.hops[i].name;
                infoBeerIngridentsHops.appendChild(liEl);
            }
        }

        if (infoBeerIngridientsMalt) {
            for (let i = 0; i < data[0].ingredients.malt.length; i++) {
                let liEl: HTMLElement = document.createElement("li");
                liEl.innerHTML = data[0].ingredients.malt[i].name;
                infoBeerIngridientsMalt.appendChild(liEl);
            }
        }

        if (infoBeerIngridientsYest) {
            let liEl: HTMLElement = document.createElement("li");
            liEl.innerHTML = data[0].ingredients.yeast;
            infoBeerIngridientsYest.appendChild(liEl);
        }

        if (infoBeerFoodPairing) {
            for (let i = 0; i < data[0].food_pairing.length; i++) {
                let liEl: HTMLElement = document.createElement("li");
                liEl.innerHTML = data[0].food_pairing[i];
                infoBeerFoodPairing.appendChild(liEl);
            }
        }

        if (infoBeerBrewerTips) {
            infoBeerBrewerTips.innerHTML = data[0].brewers_tips;
        }


    }
}

async function populateSearchView(data: BeerInfo[]) {
    if(currentPage === 1){
        
        searchPreviousPageButton?.classList.add("hide");
    }
    else{
        searchPreviousPageButton?.classList.remove("hide");
    }
    
    while (searchListEl?.firstChild) {
        searchListEl.firstChild.remove();
    }
    if (data && data.length > 0) {
        data.forEach(data => {
            let liEl = document.createElement("li");
            let buttonEl = document.createElement("button");
            buttonEl.setAttribute("id", data.id.toString());
            buttonEl.classList.add("link-button");
            buttonEl.innerHTML = data.name;
            buttonEl.addEventListener("click", () => {
                switchView(infoView);
                currentId = Number(buttonEl.getAttribute("id"));
                populateInfoView();
            })
            liEl.appendChild(buttonEl);
            searchListEl?.appendChild(liEl);
        });
    }


}

function removeCurrentInfo() {

    while (infoBeerIngridentsHops?.firstChild) {

        infoBeerIngridentsHops.firstChild.remove();
    }

    while (infoBeerIngridientsMalt?.firstChild) {
        infoBeerIngridientsMalt.firstChild.remove();
    }
    while (infoBeerIngridientsYest?.firstChild) {
        infoBeerIngridientsYest.firstChild.remove();
    }
    while (infoBeerFoodPairing?.firstChild) {
        infoBeerFoodPairing.firstChild.remove();
    }


}

async function switchPage(searchWord: string | null, nr: number | null) {


    switch (nr) {
        case 1:
            currentPage!++;
            break;
        case 0:
            currentPage!--;
            break;
        default:
            console.error("hello");
            break;
    }

  
    
    let data = await grabBeer(`${BASE_URL}beers?beer_name=${searchWord}&page=${currentPage}&per_page=10`);
    
        
        
    if(currentPage! > 0 && data!.length > 0 ){
        populateSearchView(data!);
    }

    else{
        switch (nr) {
            case 1:
                    currentPage!--;
                break;
            case 0:
                currentPage!++;
                break;
            default:
                console.error("woops");
                break;
        }
    }

    
}

async function searchForBeer(searchWord: string | null) {
    let data = await grabBeer(`${BASE_URL}beers?beer_name=${searchWord}&per_page=10`);

    if (data && data.length > 0) {
        switchView(searchView);
        populateSearchView(data);
        currentSearchWord = searchWord;
    }

    else {
        document.getElementById("noSearchResult")?.classList.remove("hide");
    }

}


addBeerInfo();
addEventListners();

