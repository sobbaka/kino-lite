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
  if (data.pagesCount > 1 && data.pagesCount > page) elements.showMoreButton.classList.remove("none");
  elements.loader.classList.add("none");
}




function renderFilms(films) {
  for (film of films) {
    const html = `<div class="film-card">
                  <img src="${film.posterUrlPreview}" alt="" class="film-card__image">
                  <h3 class="film-card__title">${film.nameRu}</h3>
                  <p class="film-card__year">${film.year}</p>
                  <p class="film-card__rating">Рейтинг ${film.rating}</p>
                  </div>`

    elements.filmWrapper.insertAdjacentHTML("beforeend", html)
  }
}


fetchAndRender().catch(err => console.log(err));

elements.showMoreButton.addEventListener("click", () => {
  fetchAndRender().catch(err => console.log(err));
})
