// DOM element
const favoritesList = document.getElementById("favoritesList");

// Retrieve favorites from local storage (if any)
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Function to display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = "";
    favorites.forEach((movie) => {
        const favoriteItem = document.createElement("div");
        favoriteItem.classList.add("favorite-item");
        favoriteItem.innerHTML = `
            <h3>${movie.Title}</h3>
            <img src="${movie.Poster}" alt="${movie.Title} Poster">
            <button class="remove-button">Remove from Favorites</button>
        `;
        favoritesList.appendChild(favoriteItem);

        // Add event listener to the remove button
        const removeButton = favoriteItem.querySelector(".remove-button");
        removeButton.addEventListener("click", () => removeFromFavorites(movie));
    });
}

// Function to remove a movie from favorites
function removeFromFavorites(movie) {
    favorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
    // Update local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

// Display favorite movies when the page loads
displayFavorites();
