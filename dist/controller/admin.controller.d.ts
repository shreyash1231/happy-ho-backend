import { Request, Response } from "express";
declare class AdminController {
    static register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllBookings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getBookingById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export default AdminController;
//# sourceMappingURL=admin.controller.d.ts.map