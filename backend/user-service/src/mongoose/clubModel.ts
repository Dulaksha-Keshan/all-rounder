import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,

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
      type: Date,
    },
    members: [
      {
        uid: { type: String, required: true },
        userType: { type: String, required: true },
        joinedAt: { type: Date, default: Date.now }
      }
    ],
    admins: [
      {
        type: String,
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
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
