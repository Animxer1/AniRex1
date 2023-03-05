//Code for homepage
const errorContainer = document.createElement("div");
errorContainer.style.color = "red";

fetch('https://api.consumet.org/anime/gogoanime/top-airing')
    .then(response => response.json())
    .then(data => {
        var cardDiv = document.getElementById("card");
        data.results.slice(0, 8).forEach(anime => {
            var animeDiv = document.createElement("div");
            animeDiv.style.display = "inline-block";
            animeDiv.style.marginBottom = "20px";
            animeDiv.style.width = "300px";
            var title = anime.title;
            var shortTitle = title.substring(0, 50);
            if (title.length > 50)
                shortTitle += "...";
            animeDiv.innerHTML = `<img height="350" width="250" src="${anime.image}" alt="${anime.title}"> <a href="anime?id=${anime.id}"> <h2  class="sTitle">${shortTitle}</h2> </a> `;
            cardDiv.appendChild(animeDiv);
        });
    })
    .catch(error => {
        errorContainer.innerText = "Error loading. Please refresh";
        document.body.appendChild(errorContainer);
    });


    fetch('https://api.consumet.org/anime/gogoanime/recent-episodes')
    .then(response => response.json())
    .then(data => {
        var rrcardDiv = document.getElementById("rrcard");
        data.results.slice(0, 8).forEach(anime => {
            var rranimeDiv = document.createElement("div");
            rranimeDiv.style.display = "inline-block";
            rranimeDiv.style.marginBottom = "20px";
            rranimeDiv.style.width = "300px";
            var title = anime.title;
            var shortTitle = title.substring(0, 30);
            if (title.length > 50)
                shortTitle += "...";
            rranimeDiv.innerHTML = `<img height="350" width="250" src="${anime.image}" alt="${anime.title}"> <a href="watch?id=${anime.id}&ep=${anime.id}-episode-${anime.episodeNumber}&no=${anime.episodeNumber}"> <h2  class="sTitle">${shortTitle} (${anime.episodeNumber}) </h2> </a> `;
            rrcardDiv.appendChild(rranimeDiv);
        });
    })
    .catch(error => {
        errorContainer.innerText = "Error loading. Please refresh";
        document.body.appendChild(errorContainer);
    });


//Code for searching the last query the user made
const queryInput = document.getElementById("query");
if (localStorage.getItem("query")) {
    queryInput.value = localStorage.getItem("query");
}
queryInput.addEventListener("input", function() {
    localStorage.setItem("query", this.value);
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

    fetch('https://api.consumet.org/anime/gogoanime/' + query)
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
