import { z } from "zod";
// Service -> Guides Map
const servicesMap = new Map([
    ["Tarot Guidance", ["Jwalant S.", "Nona", "Saachi A.", "Monika S."]],
    ["Energy Healing", ["Pooja", "Nona", "Monika"]],
    ["Astrology", ["Monika"]],
    ["Numerology", ["Saachi A."]],
    ["Name Correction", ["Saachi A."]],
    ["Conscious Guidance", ["Pooja"]],
    ["Meditation", ["Jwalant S."]],
    ["Vastu", ["Saachi A."]],
]);
// Service -> Session Map (ONLY for specific services)
const sessionMap = new Map([
    [
        "Meditation",
        [
            "Single Session: ₹5,000",
            "5 Sessions: ₹25,000",
            "10 Sessions: ₹45,000",
        ],
    ],
    [
        "Vastu",
        ["Site Visit: ₹11,000", "Detailed Report: ₹40,000"],
    ],
]);
export const createOrderSchema = z
    .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.email("Invalid email address"),
    phoneNumber: z
        .string()
        .regex(/^\+\d{1,4}\d{6,14}$/, "Invalid phone number format"),
    selectedService: z.string(),
    selectedGuide: z.string(),
    sessionType: z.enum(["Online", "Offline"]),
    preferredDateTime: z
        .string()
        .min(1, "Preferred date & time is required"),
    concernArea: z.string().min(5, "Concern area is required"),
    // 👇 optional field (important for validation rules)
    session: z.string().optional(),
})
    .superRefine((data, ctx) => {
    // -------------------------
    // Validate Service
    // -------------------------
    if (!servicesMap.has(data.selectedService)) {
        ctx.addIssue({
            code: "custom",
            path: ["selectedService"],
            message: "Invalid selected service",
        });
        return;
    }
    // -------------------------
    // Validate Guide
    // -------------------------
    const allowedGuides = servicesMap.get(data.selectedService);
    if (!allowedGuides?.includes(data.selectedGuide)) {
        ctx.addIssue({
            code: "custom",
            path: ["selectedGuide"],
            message: `Guide is not available for ${data.selectedService}`,
        });
    }
    // -------------------------
    // Validate Session (ONLY for Meditation & Vastu)
    // -------------------------
    const allowedSessions = sessionMap.get(data.selectedService);
    if (allowedSessions) {
        // session is required
        if (!data.session) {
            ctx.addIssue({
                code: "custom",
                path: ["session"],
                message: `${data.selectedService} requires session selection`,
            });
        }
        else if (!allowedSessions.includes(data.session)) {
            ctx.addIssue({
                code: "custom",
                path: ["session"],
                message: "Invalid session selected",
            });
        }
    }
    else {
        // session should NOT exist
        if (data.session) {
            ctx.addIssue({
                code: "custom",
                path: ["session"],
                message: "Session not allowed for this service",
            });
        }
    }
});
