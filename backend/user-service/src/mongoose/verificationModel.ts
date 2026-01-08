import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },

    userType: {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
      required: true,
    },

    verificationMethod: {
      type: String,
      enum: ["DOCUMENT_AI", "TEACHER_APPROVAL", "ADMIN_APPROVAL"],
      required: true,
    },

    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    verificationRequestedBy: {
      type: Number,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "verifications",
  }
);

export default mongoose.model("Verification", verificationSchema);
