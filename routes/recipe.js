const express = require("express");
const router = express.Router();
const { recipeSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Recipe = require("../models/recipe");
const ExpressError = require("../utils/expressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const {
  index,
  newRecipe,
  showRecipe,
  editRecipe,
  addRecipe,
  updateRecipe,
  destoryRecipe,
} = require("../controllers/recipe.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateRecipe = (req, res, next) => {
  let result = req.body;
  console.log("validaterecioe", result);

  if (!result || Object.keys(result).length === 0) {
    throw new ExpressError(400, "Send Some Valid Data For Recipe!");
  }

  let { error } = recipeSchema.validate(result);
  console.log("validateRecipe", error);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateRecipe,
    wrapAsync(addRecipe)
  );

router.get("/new", isLoggedIn, newRecipe);

router
  .route("/:id")
  .get(wrapAsync(showRecipe))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateRecipe,
    wrapAsync(updateRecipe)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(destoryRecipe));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editRecipe));

module.exports = router;
