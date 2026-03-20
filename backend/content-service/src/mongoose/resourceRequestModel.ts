import mongoose from "mongoose";

const resourceRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["funding", "equipment", "mentorship", "venue", "software", "other"],
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    requestedFor: {
      type: String,
      required: true,
    },
    neededBy: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["open", "closed", "fulfilled"],
      default: "open",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    createdBy: {
      type: String,
      required: true,
    },
    schoolId: {
      type: String,
      required: true,
      index: true,
    },
    remarks: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    isDeleted: {
  type: Boolean,
  default: false,
},
deletedAt: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
    collection: "resource_requests",
  }
);

export default mongoose.model("ResourceRequest", resourceRequestSchema);
