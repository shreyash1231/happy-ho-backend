import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin",
        required: true,
    },
}, {
    timestamps: true, // automatically adds createdAt & updatedAt
});
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
