const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const list = async (req, res, next) => {
  const isShowing = req.query.is_showing;
  if (isShowing) {
    const moviesThatAreShowing = await service.listIsShowing();
    res.json({ data: moviesThatAreShowing });
  } else {
    const allMovies = await service.list();
    res.json({ data: allMovies });
  }
};

const movieIdExists = async (req, res, next) => {
  const movieId = req.params.movieId;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    next();
  } else {
    return next({
      status: 404,
      message: `movie with ID: ${movieId} cannot be found`,
    });
  }
};

const getTheaters = async (req, res, next) => {
  const movieId = req.params.movieId;
  const theaters = await service.getTheatersByMovieId(movieId);
  res.json({ data: theaters });
};

const read = async (req, res, next) => {
  const movie = res.locals.movie;
  res.json({ data: movie });
};

const getReviews = async (req, res, next) => {
  const movieId = req.params.movieId;
  const reviews = await service.getReviewsByMovieId(movieId);
  res.json({ data: reviews });
};

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieIdExists), asyncErrorBoundary(read)],
  getTheaters: [asyncErrorBoundary(getTheaters)],
  getReviews: [asyncErrorBoundary(getReviews)],
};
