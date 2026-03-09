const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true
    },

    address: {
      type: String
    },

    company: {
      type: String
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User"
     }

     },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Client || mongoose.model("Client", clientSchema);