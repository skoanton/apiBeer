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
const searchBar = document.getElementById("searchBar") as HTMLInputElement | null;

//Search elements
const searchListEl: HTMLElement | null = document.getElementById("searchList");

//Buttons
const randBeerBtn  = document.getElementById("randBeerBtn") as HTMLButtonElement | null;
const seeMoreButton = document.getElementById("seeMoreButton") as HTMLButtonElement | null
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement | null;
const backButton = document.getElementById("back-button") as HTMLButtonElement | null;
const searchPreviousPageButton = document.getElementById("searchPreviousPageButton")as HTMLButtonElement | null;
const searchNextPageButton = document.getElementById("searchNextPageButton")as HTMLButtonElement | null;
const advancedSearchButton = document.getElementById("advancedSearch") as HTMLButtonElement | null;
const searchAdvButton = document.getElementById("advSearchButton") as HTMLInputElement | null;
//different Views

const overviewEl: HTMLElement | null = document.getElementById("overview");
const searchView: HTMLElement | null = document.getElementById("searchView");
const infoView: HTMLElement | null = document.getElementById("infoView");
const advancedSearchView: HTMLElement | null = document.getElementById("advancedSearchView");
const views: HTMLElement[] | null = [overviewEl!, searchView!, infoView!,advancedSearchView!];


//advanced search

const advSearchName = document.getElementById("searchName") as HTMLInputElement | null;
const advSearchHops = document.getElementById("searchHops") as HTMLInputElement | null;
const advSearchMalt = document.getElementById("searchMalt") as HTMLInputElement | null;
const advSearchAbvMin = document.getElementById("abvMin") as HTMLInputElement | null;
const advSearchAbvMax = document.getElementById("abvMax") as HTMLInputElement | null;
const advSearchBrewYearMin = document.getElementById("brewYearMin") as HTMLInputElement | null;
const advSearchBrewYearMax = document.getElementById("brewYearMax") as HTMLInputElement | null;

let currentId: number;
let currentSearchWord: string | null;
let currentPage: number | null = 1;
let currentItterator = 0;
let cachedData:{
    id:number,
    name: string,
}[] = [];

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
        searchForBeer();
    });
    seeMoreButton?.addEventListener("click", () => {
        
        switchView(infoView);
        populateInfoView();
    });

    backButton?.addEventListener("click", () => {
        switchView(overviewEl);
    })

    searchNextPageButton?.addEventListener("click", () => {
        
        if(sessionStorage.length>=(10*currentPage!)){
            console.log("fel fel fel");
            console.log(sessionStorage.length);
            currentPage!++;
            currentItterator += 10;
            populateSearchView();
        }
        

    })

    searchPreviousPageButton?.addEventListener("click", () => {
       
        currentPage!--;
        currentItterator -= 10;
        populateSearchView();

    })

    advancedSearchButton?.addEventListener("click", ()=>{
        switchView(advancedSearchView)
    })

    searchAdvButton?.addEventListener("click", () =>{
        searchForBeer();
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

function populateSearchView() {

    //hiding back button in searchview isf needed
    if(currentPage === 1){
        
        searchPreviousPageButton?.classList.add("hide");
    }
    else{
        searchPreviousPageButton?.classList.remove("hide");
    }
    
    //removing old info in list
    while (searchListEl?.firstChild) {
        searchListEl.firstChild.remove();
    }

    if (sessionStorage.length > 0 && sessionStorage) {
        for(let i = currentItterator; i<(10*currentPage!); i++){
            if(i > sessionStorage.length){
                console.log("avbryter for loop");
                break;
            }
            let liEl = document.createElement("li");
            let buttonEl = document.createElement("button");   
            let tempKey = sessionStorage.key(i);
            let tempId = sessionStorage.getItem(tempKey!);
            buttonEl.setAttribute("id", tempKey!);
            buttonEl.classList.add("link-button");
            buttonEl.innerHTML = tempId!;
            buttonEl.addEventListener("click", () => {
                switchView(infoView);
                currentId = Number(buttonEl.getAttribute("id"));
                populateInfoView();
            })
            liEl.appendChild(buttonEl);
            searchListEl?.appendChild(liEl);

            /* Object.keys(sessionStorage).forEach(key => {
                let liEl = document.createElement("li");
                let buttonEl = document.createElement("button");
                buttonEl.setAttribute("id", key!);
                buttonEl.classList.add("link-button");
                buttonEl.innerHTML = sessionStorage.getItem(key)!;
                buttonEl.addEventListener("click", () => {
                    switchView(infoView);
                    currentId = Number(buttonEl.getAttribute("id"));
                    populateInfoView();
                })
                liEl.appendChild(buttonEl);
                searchListEl?.appendChild(liEl);
            }); */
        }

       
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

/* async function swichSearchPage(searchWord: string | null) {


     switch (nr) {
        case 1:
            currentPage!++;
            break;
        case 0:
            currentPage!--;
            break;
        default:
            console.error("can´t switch view");
            break;
    } 
          
        
    if(currentPage! > 0 && sessionStorage!.length > 0 ){
        populateSearchView();
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
                console.error("wrong with switching page");
                break;
        }
    }

    
} */

function checkLength(maxLength: number | null,urlLength: number | null, serachUrl: string | null):string{
    if(urlLength! > maxLength!){
        serachUrl += "&";
    }

    return serachUrl!;
}

async function searchForBeer() {
    

    if(sessionStorage.length > 0 && sessionStorage){
        console.log("inside ifsats");
       Object.keys(sessionStorage).forEach(key => {
            console.log("removing storage");
            sessionStorage.removeItem(key);
       });
    }

    let searchURL:string | undefined = `${BASE_URL}beers?`;
    let maxLength: number | null = searchURL.length;

    if(searchBar?.value){
        console.log("normal serach bar");
        searchURL += `beer_name=${searchBar.value}`;
        currentSearchWord = searchBar.value;
        searchBar.value = "";
    }

    if(advSearchName?.value){ 
        console.log("adv serach bar");
        searchURL += `beer_name=${advSearchName.value}`;
        currentSearchWord = advSearchName?.value;
        advSearchName.value = "";
    }

    if(advSearchHops?.value){
        searchURL = checkLength(maxLength,searchURL.length,searchURL);
        console.log("adv serach bar hops");
        searchURL += `hops=${advSearchHops.value}`;
        advSearchHops.value = "";
    }

    if(advSearchMalt?.value){
        searchURL = checkLength(maxLength,searchURL.length,searchURL);
        searchURL += `malt=${advSearchMalt.value}`;
        advSearchMalt.value ="";
    }

    if(advSearchAbvMin?.value){
        searchURL = checkLength(maxLength,searchURL.length,searchURL);
        searchURL += `abv_gt=${advSearchAbvMin.value}`;
        advSearchAbvMin.value = "";
    }

    if(advSearchAbvMax?.value){
        searchURL = checkLength(maxLength,searchURL.length,searchURL);
        searchURL += `abv_lt=${advSearchAbvMax}`;
        advSearchAbvMax.value = "";
    }

    if(advSearchBrewYearMin?.value){
        searchURL = checkLength(maxLength,searchURL.length,searchURL);
        searchURL += `brewed_after=${advSearchBrewYearMin}`;
        advSearchBrewYearMin.value ="";
    }

    if(advSearchBrewYearMax?.value){
        searchURL = checkLength(maxLength,searchURL.length,searchURL);
        searchURL += `brewed_before${advSearchBrewYearMax}`;
        advSearchBrewYearMax.value ="";
    }

    /* searchURL +=`&page=${pageNumber}&per_page=10`; */
    console.log(searchURL);
    let data = await grabBeer(searchURL);

    console.log(data);
    if (data!.length > 0) {

        for(let i = 0; i < data!.length; i++){
            console.log("adding to storage");
            sessionStorage.setItem(data![i].id.toString(), data![i].name);
        }       
        
        switchView(searchView);
        populateSearchView();
        
    }

    else {
        document.getElementById("noSearchResult")?.classList.remove("hide");
        window.alert("no search result");
    } 

}


addBeerInfo();
addEventListners();

