const Recipe = require("../models/recipe");

module.exports.index = async (req, res) => {
  console.log("hello");
  let allRecipe = await Recipe.find({});
  res.render("recipe/index.ejs", { allRecipe });
};

module.exports.newRecipe = (req, res) => {
  res.render("recipe/new.ejs");
};

module.exports.showRecipe = async (req, res) => {
  let { id } = req.params;
  console.log("hello", id);
  let recipe = await Recipe.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!recipe) {
    console.log("Inside show");
    req.flash("error", "Recipe Does not exist!");
    res.redirect("/food");
  } else {
    console.log(recipe);
    res.render("recipe/show.ejs", { recipe });
  }
};

module.exports.editRecipe = async (req, res) => {
  let { id } = req.params;
  console.log("in edit");
  let recipe = await Recipe.findById(id);
  if (!recipe) {
    console.log("Inside show");
    req.flash("error", "Recipe Does not exist!");
    res.redirect("/food");
  } else {
    let originalUrl = recipe.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/h_150,w_250");
    res.render("recipe/edit.ejs", { recipe, originalUrl });
  }
};

module.exports.addRecipe = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let result = req.body;
  console.log(url, "....", filename);
  let newRecipe = new Recipe(result);
  newRecipe.image = { url, filename };
  newRecipe.owner = req.user._id;
  await newRecipe.save();
  req.flash("success", "Recipe Added");
  res.redirect("/food");
};

module.exports.updateRecipe = async (req, res) => {
  console.log("inside put");
  let { id } = req.params;

  let recipe = await Recipe.findByIdAndUpdate(id, req.body);

  if (typeof req.file !== "undefined") {
    console.log("inside put 2");
    let url = req.file.path;
    let filename = req.file.filename;
    recipe.image = { url, filename };
    await recipe.save();
  }
  req.flash("success", "Recipe Updated!!");
  res.redirect("/food");
};

module.exports.destoryRecipe = async (req, res) => {
  let { id } = req.params;
  await Recipe.findByIdAndDelete(id);
  req.flash("success", "Recipe Deleted!!");
  res.redirect("/food");
};
