

const apiKey = 'e531ffc5c1cf409cdf67cd69dcb812e3'
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];
const closeButton = document.getElementById('cerrar')

// Fetch and display popular movies
async function fetchPopularMovies() {
    try {
        // tu codigo aqui: realiza una solicitud para obtener las películas populares
        const response= await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=es-MX&pag`);
        if (!response.ok){throw new Error('Error en la solicitud')}
        const movies = await response.json();
        displayMovies(movies.results);
        console.log(movies);

        // y llama a displayMovies con los resultados

    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span style= "font-size: 18px">${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    try {
        // tu codigo aqui: realiza una solicitud para obtener los detalles de la película
        // y actualiza el contenedor de detalles con la información de la película
        const response= await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=es-MX`);
        if(!response.ok){throw new Error('Error en la solicitud');};
        const movieD = await response.json();
       movieDetails.hidden = false;
       movieDetails.removeAttribute('hidden');
       movieDetails.style.display = 'block';
        detailsContainer.innerHTML=`
        <h3>${movieD.title}</h3>
        <img src="https://image.tmdb.org/t/p/w500${movieD.poster_path}" alt="${movieD.title}">
        <p>${movieD.overview}</p>
        <p><strong>Fecha de lanzamiento</strong>: ${movieD.release_date}`;
        selectedMovieId = movieId
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            // tu codigo aqui: realiza una solicitud para buscar películas
            // y llama a displayMovies con los resultados de la búsqueda
            const response = await fetch(`${apiUrl}/search/movie?&query=${encodeURIComponent(query)}&api_key=${apiKey}&language=es-MX`);
            if(!response.ok){throw new Error('Error en la solicitud');}
            const searchResult = await response.json();
            displayMovies(searchResult.results);
            }
         catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            const li = document.createElement('li');
        
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            li.innerHTML = `
            JSON.stringify(favoriteMovies)

            
        `;
            displayFavorites(); // Muestra la lista actualizada de favoritos
        }
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

closeButton.addEventListener('click', () => {
    movieDetails.style.display='none';


}
)

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas