import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
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
      type: String,
      required: function (this: { userType?: string }) {
        return this.userType === "STUDENT";
      },
    },

    attachment: {
      type: String,
      trim: true,
      required: function (this: { verificationMethod?: string }) {
        return this.verificationMethod === "DOCUMENT_AI";
      },
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
