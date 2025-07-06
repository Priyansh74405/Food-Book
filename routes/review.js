const express = require("express");
const router = express.Router({ mergeParams: true });
const { recipeSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Recipe = require("../models/recipe");
const review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
  let result = req.body;
  console.log(result);

  if (!result || Object.keys(result).length === 0) {
    throw new ExpressError(400, "Send Some Valid Data For Review!");
  }

  let { error } = reviewSchema.validate(result);
  console.log(error);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router.post("/", validateReview, isLoggedIn, wrapAsync(createReview));

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

router.delete(
  "/:review_id",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(destroyReview)
);

module.exports = router;
