//Code for homepage
const errorContainer = document.createElement("div");
errorContainer.style.color = "red";

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