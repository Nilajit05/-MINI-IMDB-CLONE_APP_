//1-8 DOM elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const movieList = document.getElementById("movieList");
const favoritesList = document.getElementById("favoritesList"); 
const favoritesPage = document.getElementById("favoritesPage");
const moviePage = document.getElementById("moviePage");
const movieDetails = document.getElementById("movieDetails");

//  Store favorites in memory
let favorites = JSON.parse(localStorage.getItem("favorites")) || []; 

// 2 Handle search button click
searchButton.addEventListener("click", () => {
    searchMovies();
});

// 3 Handle search input and fetch movies
searchInput.addEventListener("input", debounce(searchMovies, 500));

// 4 Fetch movie details when a movie item is clicked
movieList.addEventListener("click", (event) => {
    const movieItem = event.target.closest(".movie-item");
    if (movieItem) {
        const imdbID = movieItem.dataset.imdbid;
        fetchMovieDetails(imdbID);
    }
});

//  Display favorites page
favoritesPage.addEventListener("click", () => {
    displayFavorites();
});

// 5 Debounce function to delay search
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    };
}

// 6 Function to search movies
async function searchMovies() {
    const searchTerm = searchInput.value;
    if (searchTerm.trim() === "") {
        movieList.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=4c5aee86`);
        const data = await response.json();

        if (data.Search) {
            const movies = data.Search;
            displayMovies(movies);
        } else {
            movieList.innerHTML = "No results found.";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// 7 Function to display search results
function displayMovies(movies) {
    movieList.innerHTML = "";
    movies.forEach((movie) => {
        const movieItem = document.createElement("div");
        movieItem.classList.add("movie-item");
        movieItem.dataset.imdbid = movie.imdbID;
        movieItem.innerHTML = `
            <h3>${movie.Title}</h3>
            <img src="${movie.Poster}" alt="${movie.Title} Poster">
            <button class="favorite-button">Add to Favorites</button>
        `;
        movieList.appendChild(movieItem);

        //  Add event listener to the favorite button
        const favoriteButton = movieItem.querySelector(".favorite-button");
        favoriteButton.addEventListener("click", () => addToFavorites(movie));

        //  Trigger the animation for the newly added movie item
        movieItem.style.animation = "none"; // Reset animation
        void movieItem.offsetWidth; // Trigger reflow
        movieItem.style.animation = null; // Start animation
    });
}

// 8 Function to add a movie to favorites
function addToFavorites(movie) {
    if (movie.imdbID) {
        const isAlreadyFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
        if (!isAlreadyFavorite) {
            favorites.push(movie);
            // Update local storage
            localStorage.setItem("favorites", JSON.stringify(favorites));
            displayFavorites();
        }
    }
}





// 9 Function to fetch and display movie details
async function fetchMovieDetails(imdbID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=4c5aee86`);
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
}

// 10 Function to display movie details
movieList.addEventListener("click", (event) => {
    const movieItem = event.target.closest(".movie-item");
    if (movieItem) {
        const imdbID = movieItem.dataset.imdbid;
        navigateToMovieDetails(imdbID); // Navigate to movie details page
    }
});

// 11 Function to navigate to the movie details page
function navigateToMovieDetails(imdbID) {
    window.location.href = `movie.html?imdbID=${imdbID}`;
}

//  Initialize the app
searchInput.focus();
