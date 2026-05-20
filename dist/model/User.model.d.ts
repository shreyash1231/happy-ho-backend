import { Document, Model } from "mongoose";
export interface IUser extends Document {
    email: string;
    password: string;
    role: "admin";
    createdAt: Date;
    updatedAt: Date;
}
declare const User: Model<IUser>;
export default User;
//# sourceMappingURL=User.model.d.ts.map