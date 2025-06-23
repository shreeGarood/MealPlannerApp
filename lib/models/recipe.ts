import mongoose from "mongoose"

const RecipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
  },
  ingredients: [
    {
      name: String,
      amount: Number,
      unit: String,
    },
  ],
  steps: [
    {
      type: String,
      required: true,
    },
  ],
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  nutrition: {
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema)
