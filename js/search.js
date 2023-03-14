//Code for getting parameters from URL
var url_string = window.location;
var url = new URL(url_string);
var query = url.searchParams.get("query");
var tvid = url.searchParams.get("id");

let showingResultsForDisplayed = false;

//Code which fetches API and displays info and other stuff
const errorContainer = document.createElement("div");
errorContainer.style.color = "red";

fetch('https://api.consumet.org/anime/enime/' + query)
    .then(response => response.json())
    .then(data => {
        var cardDiv = document.getElementById("card");

        document.title = "Searching for " + query;

        for (var i = 0; i < data.results.length; i++) {
            var anime = data.results[i];
            var animeDiv = document.createElement("div");
            var cardDiv = document.getElementById("card");
            cardDiv.style.marginTop = "20px";
            animeDiv.style.display = "inline-block";
            animeDiv.style.marginBottom = "20px";
            animeDiv.style.width = "300px";
            animeDiv.innerHTML = `<a href="anime?id=${anime.id}"  </a> <img class="searchimg" height="350" width="250" src="${anime.image}" alt="${anime.title}"> <h2 class="sTitle">${anime.title}</h2> `;
            cardDiv.appendChild(animeDiv);
        }
    })
    .catch(error => {
        errorContainer.innerText = "Error loading. Please refresh";
        document.body.appendChild(errorContainer);
    });

//Code for searching the last query the user made
const queryInput = document.getElementById("query");
if (sessionStorage.getItem("query")) {
    queryInput.value = sessionStorage.getItem("query");
}
queryInput.addEventListener("input", function() {
    sessionStorage.setItem("query", this.value);
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