import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name Required !!"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email Required !!"],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password Required !!"],
  },
  about: {
    type: String,
    default: "",
  },
  profileURL: String,
  //   address: {
  //     street: String,
  //     city: String,
  //     country: String,
  //     pinCode: Number,
  //   },
});

export const User =
  mongoose.models.users || mongoose.model("users", UserSchema);
