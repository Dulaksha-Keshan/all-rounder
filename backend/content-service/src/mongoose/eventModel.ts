import mongoose from "mongoose";


const HostSchema = new mongoose.Schema({
  hostType: {
    type: String,
    enum: ["school", "organization"],
    required: true,
  },
  hostId: {
    type: String,    // firebase UUID for school or a org
    required: true,
  },
  hostName: {
    type: String,    // Denormalized - stored at time of creation
    required: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
}, { _id: false });


const eventSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        "workshop",
        "competition",
        "seminar",
        "webinar",
        "conference",
        "other",
      ],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    hosts: {
      type: [HostSchema],
    },
    eligibility: {
      type: String,
      required: true,
    },
    registrationUrl: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "events",
  }
);

export default mongoose.model("Event", eventSchema);
