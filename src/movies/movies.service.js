const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}

function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ movie_id: movieId })
    .then((movie) => movie[0]);
}

function listIsShowing() {
  return knex("movies_theaters as mt")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .where({ is_showing: 1 })
    .select("m.*")
    .groupBy("m.movie_id");
}

function getTheatersByMovieId(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*")
    .where({ movie_id: movieId });
}

function getReviewsByMovieId(movieId) {
  return knex("reviews")
    .select("*")
    .where({ movie_id: movieId })
    .then((reviewsForMovies) => {
      const addedCritics = reviewsForMovies.map((movieReview) => {
        return knex("critics")
          .select("*")
          .where({ critic_id: movieReview.critic_id })
          .then((critic) => {
            movieReview.critic = critic[0];
            return movieReview;
          });
      });
      const toReturn = Promise.all(addedCritics);
      return toReturn;
    });
}

module.exports = {
  list,
  listIsShowing,
  read,
  getTheatersByMovieId,
  getReviewsByMovieId,
};
