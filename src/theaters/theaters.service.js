const knex = require("../db/connection");

function getTheaters() {
  return knex("theaters").select("*");
}

function list() {
  return getTheaters().then((theaters) => {
    let promises = [];
    for (let theater of theaters) {
      let promise = knex("movies_theaters as mt")
        .select("*")
        .join("movies as m", "m.movie_id", "mt.movie_id")
        .where({ theater_id: theater.theater_id });
      promises.push(promise);
    }
    return Promise.all(promises).then((movies) => {
      for (let showing of movies) {
        let theater_id = showing[0].theater_id;
        let theater = theaters.find((el) => theater_id === el.theater_id);
        theater.movies = showing;
      }
      return theaters;
    });
  });
}

module.exports = {
  list,
  getTheaters,
};
