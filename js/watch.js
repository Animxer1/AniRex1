//Code for getting parameters from URL
var url_string = window.location;
var url = new URL(url_string);
var query = url.searchParams.get("query");
var ep = url.searchParams.get("ep");
var id = url.searchParams.get("id");
var no = url.searchParams.get("no");

//Code which fetches API and displays info and other stuff
fetch('https://api.consumet.org/anime/enime/info?id=' + id)
    .then(response => response.json())
    .then(data => {
        const anime = data;
        const capitalizedAnimeType = anime.type.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
        const sideDataDiv = document.createElement('div');
        sideDataDiv.innerHTML = ` 

    `;
        document.getElementById('info').appendChild(sideDataDiv);
        document.title =  anime.title + ' ' + 'Episode ' + no + '- hanabi';
        fetch('https://api.consumet.org/anime/enime/info?id=' + id)
        .then(response => response.json())
        .then(data => {
          const episodesDiv = document.getElementById("episodesw");
      
          let html = "";
      
          const sortedEpisodes = data.episodes.sort((a, b) => a.number - b.number);
      
          sortedEpisodes.forEach(episode => {
            html += `<a href="watch?id=${id}&ep=${episode.id}&no=${episode.number}"> <text class="iepisode"> ${episode.number} </a> </text>`;
          });
      
          episodesDiv.innerHTML = `<h2>Episodes (${sortedEpisodes.length})</h2>` + html;
        });
      

        fetch('https://api.consumet.org/anime/enime/watch?episodeId=' + ep)
        .then(response => response.json())
        .then(data => {
          const episodewatchDiv = document.getElementById('episodewatch');
          const refererDiv = document.createElement('div');
          const f = parseInt(no);
          const currentEpisodeNumber = f;
          const currentEpisode = anime.episodes.find(episode => episode.number === currentEpisodeNumber);
          const { id: epId, title } = currentEpisode;
          const titleHtml = title ? ` ${title}` : '';
          refererDiv.innerHTML = `<h2> <a href="anime?id=${anime.id}"> ${anime.title} </a> Episode ${currentEpisodeNumber} : ${titleHtml}</h2>  <iframe scrolling="no" frameBorder="0" allowfullscreen = "true" height="700" width="1200" src="${data.headers.Referer}" </iframe> <p></p>`
          console.log(`f = ${f}, anime.episodes.length = ${anime.episodes.length}`);
          episodewatchDiv.appendChild(refererDiv);
        });
      

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

console.log('%c Code: %c watch.js ', 'background-color:#0396ff ; border-radius: 5px; color: white;', '');
