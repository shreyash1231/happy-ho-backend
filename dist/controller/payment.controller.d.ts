import { Request, Response } from "express";
declare class OrderController {
    createOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: OrderController;
export default _default;
//# sourceMappingURL=payment.controller.d.ts.map