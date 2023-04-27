const apiKey = '880d4ee5-c556-40d2-8ad3-8ec7879f8646'
const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const options = {
  method: 'GET',
  headers: {
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json',
  },
}

let page = 1;

const elements = {
  filmWrapper: document.querySelector(".films"),
  loader: document.querySelector(".loader-wrapper"),
  showMoreButton: document.querySelector(".show-more"),
  movieFull: document.querySelector(".movie"),
  containerRight: document.querySelector(".container-right"),
  closeButton: document.querySelector(".close")
}

async function fetchData(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  return data
}


async function fetchAndRender() {
  elements.loader.classList.remove("none");
  const data = await fetchData(url + `top?page=${page}`, options);
  if (data.pagesCount > 1) page++;
  renderFilms(data.films);
  if (data.pagesCount > 1) elements.showMoreButton.classList.remove("none");
  elements.loader.classList.add("none");
  if (page > data.pagesCount) elements.showMoreButton.classList.add("none");
}




function renderFilms(films) {
  for (film of films) {

    const card = document.createElement("div");
    card.classList.add('card');
    card.id = film.filmId;

    card.onclick = openFilmDetails;


    const html = `<div class="film-card">
                  <img src="${film.posterUrlPreview}" alt="" class="film-card__image">
                  <h3 class="film-card__title">${film.nameRu}</h3>
                  <p class="film-card__year">${film.year}</p>
                  <p class="film-card__rating">Рейтинг ${film.rating}</p>
                  </div>`

    card.insertAdjacentHTML("beforeend", html)

    elements.filmWrapper.insertAdjacentElement("beforeend", card)
  }
}

async function openFilmDetails(e) {
  const id = e.currentTarget.id;
  const data = await fetchData(url + id, options);

  const html = `
  <div class="movie__title">${data.nameRu}</div>
  <div class="movie__img">
    <img src="${data.coverUrl}" alt="" class="movie__cover">
  </div>
  <div class="movie__desc">
    <p class="movie__detail">Год ${data.year}</p>
    <p class="movie__detail">Рейтинг ${data.ratingKinopoisk}</p>
    <p class="movie__detail">Продолжительность ${convertToTime(data.filmLength)}</p>
    <p class="movie__detail">Страна: ${getCountries(data.countries)}</p>
    <p class="movie__text">${data.description}</p>
  </div>
  `
  elements.movieFull.innerHTML = html;
  elements.containerRight.classList.remove("none")

  elements.closeButton.addEventListener("click", () => {
    elements.containerRight.classList.add("none")
  })
}

function convertToTime(num) {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return `${hours} ч ${minutes} мин`;
}

function getCountries(countries) {
  let result = []
  for (const obj in countries) {
    const country = countries[obj].country
    result.push(country)
  }
  return result.join(',')
}

fetchAndRender().catch(err => console.log(err));

elements.showMoreButton.addEventListener("click", () => {
  fetchAndRender().catch(err => console.log(err));
})
