const BASE_URL: string = "https://api.punkapi.com/v2/";
const randBeerBtn: HTMLElement | null = document.getElementById("randBeerBtn");
const beerPictureEL: HTMLElement | null = document.getElementById("beerPicture");
const beerText: HTMLElement | null = document.getElementById("beerName");
const searchBtn: HTMLElement | null = document.getElementById("searchBtn");
const searchBar = <HTMLInputElement> document.getElementById("searchBar");

interface BeerInfo {
    name: string;
    description: string;
    image_url: string;

}

async function grabBeer(URL: RequestInfo) {
    console.log(URL);
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

randBeerBtn?.addEventListener("click", function () {
    addBeerInfo();
});

searchBtn?.addEventListener("click" ,() =>{
    
        
        searchForBeer(searchBar!.value);
    
    
})

async function addBeerInfo() {
    console.log("adding beer info");

    const imgEl = document.createElement("img");

    let data = await grabBeer(`${BASE_URL}beers/random`);
    if (data && data.length > 0) {

        console.log(data![0].image_url);
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

function searchForBeer(searchWord:string | null){
    console.log(searchWord);
}


addBeerInfo();