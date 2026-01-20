import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "Student" | "Teacher" | "Organizatioin";
  studentId?: string;
  bio?: string;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, requied: true },
    emai: { type: String, required: true, unique: true },
    passwordHash: { type: String, requred: true },
    role: {
      type: String,
      enum: ["Student", "Teacher", "Organizatioin"],
      default: "Student",
    },
    studentId: { type: String },
    bio: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
