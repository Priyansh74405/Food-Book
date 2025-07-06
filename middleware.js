const Recipe = require("./models/recipe");
const review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please Login/Signup first");
    return res.redirect("/food");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let recipe = await Recipe.findById(id);
  if (!recipe.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of recipe!");
    return res.redirect("/food");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, review_id } = req.params;
  console.log(req.params);
  console.log(id, ".......", review_id);
  let Review = await review.findById(review_id);
  if (!Review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You did not created this review!!");
    return res.redirect(`/food/${id}`);
  }
  next();
};
