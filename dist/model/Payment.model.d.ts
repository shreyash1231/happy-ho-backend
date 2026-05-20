import mongoose, { Document, Types } from "mongoose";
export interface IPayment extends Document {
    userId: Types.ObjectId;
    orderId: string;
    paymentId?: string;
    signature?: string;
    status: "pending" | "paid" | "failed";
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const Payment: mongoose.Model<IPayment, {}, {}, {}, mongoose.Document<unknown, {}, IPayment, {}, mongoose.DefaultSchemaOptions> & IPayment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPayment>;
export default Payment;
//# sourceMappingURL=Payment.model.d.ts.map