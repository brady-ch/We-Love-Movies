const knex = require("../db/connection");

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

function destroy(review_id) {
  return knex("reviews").where({ review_id: review_id }).del();
}

function readCritic(critic_id) {
  return knex("critics").where({ critic_id: critic_id }).first();
}

module.exports = {
  update,
  read,
  destroy,
  readCritic,
};
