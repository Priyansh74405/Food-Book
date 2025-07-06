const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  instructions: String,
  time: Number,
  image: {
    url: String,
    filename: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

recipeSchema.post("findOneAndDelete", async (recipe) => {
  if (recipe) {
    console.log(recipe);
    await review.deleteMany({ _id: { $in: recipe.reviews } });
  }
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
