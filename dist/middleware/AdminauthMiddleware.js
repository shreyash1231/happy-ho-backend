// middleware/adminAuth.middleware.ts
import jwt from "jsonwebtoken";
import User from "../model/User.model.js";
export const adminAuthMiddleware = async (req, res, next) => {
    try {
        // 1. Extract token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ success: false, message: "No token provided" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ success: false, message: "Invalid token format" });
            return;
        }
        // 2. Verify & decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 3. Check role is admin from token
        if (decoded.role !== "admin") {
            res.status(403).json({ success: false, message: "Access denied: Admins only" });
            return;
        }
        // 4. Check if user with that id exists in DB
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            res.status(401).json({ success: false, message: "User not found" });
            return;
        }
        // 5. Double-check role from DB
        if (user.role !== "admin") {
            res.status(403).json({ success: false, message: "Access denied: Not an admin" });
            return;
        }
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ success: false, message: "Token expired" });
            return;
        }
        if (error.name === "JsonWebTokenError") {
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
//# sourceMappingURL=AdminauthMiddleware.js.map