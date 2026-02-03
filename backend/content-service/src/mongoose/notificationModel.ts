import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["EVENT", "POST", "RESOURCE", "CLUB", "SYSTEM"],
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      // ID of related event/post/resource
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type", // optional polymorphic reference
    },
  },
  {
    timestamps: true,
    collection: "notifications",
  }
);

export default mongoose.model("Notification", notificationSchema);
