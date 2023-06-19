const API_KEY = "31581fb70bfe123b6cab23244fcf0d8a";
const BASE_PATH = "https://api.themoviedb.org/3";

// Movie
export function topfetch() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function popularfetch() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
export function upcomefetch() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

// Tv

export function airTodayTvfetch() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function popularTvfetch() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
export function topTvfetch() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
export function trandTvfetch() {
  return fetch(`${BASE_PATH}/trending/tv/week?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

// Search
export function tvSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`
  ).then((response) => response.json());
}

export function movieSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`
  ).then((response) => response.json());
}
