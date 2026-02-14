import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
    },
    schoolId: {
      type: String,
      required: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    foundedYear: {
      type: Number,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    teacherInCharge: {
      name: {
        type: String,
        required: true,
      },
      contactEmail: {
        type: String,
      },
    },
    socialLinks: {
      website: { type: String },
      instagram: { type: String },
      facebook: { type: String },
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "clubs",
  }
);

export default mongoose.model("Club", clubSchema);
