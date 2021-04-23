const service = require("./reviews.service");
const asyncErrorBoundry = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  } else {
    return next({
      status: 404,
      message: `Review cannot be found`,
    });
  }
}

async function getCritic(req, res, next) {
  const review = res.locals.review;
  const critic = await service.readCritic(review.critic_id);
  res.locals.critic = critic;
  next();
}

async function update(req, res, next) {
  const data = req.body.data;
  const review = res.locals.review;
  const critic = res.locals.critic;
  const updatedReview = { ...review, ...data };
  await service.update(updatedReview);
  updatedReview.critic = critic;
  res.json({ data: updatedReview });
}

async function destroy(req, res, next) {
  const review_id = req.params.reviewId;
  await service.destroy(review_id);
  res.status(204).send("204 No Content");
}

module.exports = {
  update: [
    asyncErrorBoundry(reviewExists),
    asyncErrorBoundry(getCritic),
    asyncErrorBoundry(update),
  ],
  delete: [asyncErrorBoundry(reviewExists), asyncErrorBoundry(destroy)],
};
