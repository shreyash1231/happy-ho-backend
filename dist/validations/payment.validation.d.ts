import { z } from "zod";
export declare const createOrderSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodEmail;
    phoneNumber: z.ZodString;
    selectedService: z.ZodString;
    selectedGuide: z.ZodString;
    sessionType: z.ZodEnum<{
        Online: "Online";
        Offline: "Offline";
    }>;
    preferredDateTime: z.ZodString;
    concernArea: z.ZodString;
    session: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=payment.validation.d.ts.map