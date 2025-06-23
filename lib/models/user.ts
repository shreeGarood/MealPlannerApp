import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
  },
  passwordHash: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
})

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.passwordHash)
}

export default mongoose.models.User || mongoose.model("User", UserSchema)
