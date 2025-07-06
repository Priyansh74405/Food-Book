const Recipe = require("../models/recipe");
const review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let recipe = await Recipe.findById(id);
  let newReview = new review(req.body);
  newReview.author = req.user._id;
  console.log(newReview);
  recipe.reviews.push(newReview);

  await newReview.save();
  await recipe.save();

  req.flash("success", "New Review Added!!");
  res.redirect(`/food/${recipe.id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, review_id } = req.params;
  console.log("efevf");
  console.log(id);
  await Recipe.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
  await review.findByIdAndDelete(review_id);

  req.flash("success", "Review Deleted!!");
  res.redirect(`/food/${id}`);
};
