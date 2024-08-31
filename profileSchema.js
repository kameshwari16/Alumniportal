const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profileType: {
    type: String,
    enum: ["student", "alumni"],
    required: true,
  },
  graduationYear: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
  },
  bio: {
    type: String,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
