import mongoose, { Schema } from "mongoose";

//////////////////////////////////////  make schema for user  //////////////////////////////////////
// This schema is used to define the structure of user documents in the MongoDB database.
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  passwordResetToken: {
    token: String,
    expires: Date,
  },
});

const User = mongoose.model("User", userSchema);

//////////////////////////////////////  export user model  //////////////////////////////////////

export default User;
