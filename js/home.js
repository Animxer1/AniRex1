//Code for homepage
const errorContainer = document.createElement("div");
errorContainer.style.color = "red";

//Code for searching the last query the user made
const queryInput = document.getElementById("query");
if (sessionStorage.getItem("query")) {
    queryInput.value = sessionStorage.getItem("query");
}
queryInput.addEventListener("input", function() {
    sessionStorage.setItem("query", this.value);
});


const recentEpisodesUrl = 'https://api.consumet.org/anime/gogoanime/top-airing';
const enimeBaseUrl = 'https://api.consumet.org/anime/enime/';

// Fetch top airing episodes from gogoanime API, search it on enime and display
fetch(recentEpisodesUrl)
    .then(response => response.json())
    .then(data => {
        const results = data.results;
        const containerDiv = document.createElement('div'); // Create a container div to hold all the cards
        containerDiv.style.display = "flex"; // Set the display property of the container div to flex
        containerDiv.style.flexWrap = "wrap"; // Allow the cards to wrap onto the next line if they can't fit in the same row
        containerDiv.style.justifyContent = "space-between";
        containerDiv.style.margin = "20px";
        results.forEach(result => {
            const animeTitle = result.title;
            const enimeSearchUrl = enimeBaseUrl + animeTitle;
            fetch(enimeSearchUrl)
                .then(response => response.json())
                .then(data => {
                    const enimeResult = data.results[0];
                    // Display enime result in a card div
                    const cardDiv = document.createElement('div');
cardDiv.classList.add('card');
cardDiv.style.width = "300px";
cardDiv.style.marginBottom = "20px";
cardDiv.style.display = "flex";
cardDiv.style.flexDirection = "column";

const titleElement = document.createElement('h2');
titleElement.textContent = enimeResult.title;
titleElement.style.margin = "0";

const linkElement = document.createElement('a');
linkElement.href = `anime?id=${enimeResult.id}`;

const imageElement = document.createElement('img');
imageElement.src = enimeResult.image;
imageElement.style.objectFit = "cover";
imageElement.style.height = "350px";
imageElement.style.width = "250px";

const shortTitleElement = document.createElement('h2');
var title = enimeResult.title;
var shortTitle = title.substring(0, 50);
if (title.length > 50)
    shortTitle += "...";
shortTitleElement.textContent = shortTitle;
shortTitleElement.style.margin = "0";
shortTitleElement.style.fontSize = "28px";

linkElement.appendChild(imageElement);
linkElement.appendChild(shortTitleElement);
cardDiv.appendChild(linkElement);
containerDiv.appendChild(cardDiv);

                })
        })
        const header = document.querySelector('h1');
        header.insertAdjacentElement('afterend', containerDiv); // Add the container div after the h1 element
    })
    .catch(error => {
        console.error('Error fetching anime data: ', error);
    });

//Code which fetches API and displays autocomplete results
let autocompleteResults = document.getElementById("autocomplete-results");

function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, delay);
    };
}

const debouncedInput = debounce(function(event) {
    autocompleteResults.innerHTML = "";

    const query = document.querySelector("#query").value;

    fetch('https://api.consumet.org/anime/enime/' + query)
        .then(response => response.json())
        .then(data => {
            data.results.slice(0, 4).forEach(result => {
                const li = document.createElement("li");
                li.innerText = result.title;

                li.addEventListener("click", function(event) {
                    window.location.href = `anime?id=${result.id}`;
                });

                autocompleteResults.appendChild(li);
            });
        });
}, 500);

queryInput.addEventListener("input", debouncedInput);

document.addEventListener("click", function(event) {
    if (event.target !== autocompleteResults) {
        autocompleteResults.innerHTML = "";
    }
});

console.log('%c Code: %c home.js ', 'background-color:#0396ff ; border-radius: 5px; color: white;', '');