import rateLimit, { ipKeyGenerator } from "express-rate-limit";
export const paymentRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return ipKeyGenerator(req.ip || "");
    },
});
