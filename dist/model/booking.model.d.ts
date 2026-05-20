import mongoose, { Document } from "mongoose";
export interface IBooking extends Document {
    fullName: string;
    email: string;
    phoneNumber: string;
    selectedService: string;
    selectedGuide: string;
    sessionType: "Online" | "Offline";
    preferredDateTime: Date;
    concernArea: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Booking: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, mongoose.DefaultSchemaOptions> & IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBooking>;
export default Booking;
//# sourceMappingURL=booking.model.d.ts.map