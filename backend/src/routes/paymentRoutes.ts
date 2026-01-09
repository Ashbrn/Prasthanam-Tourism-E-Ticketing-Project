import { Router, Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/paymentService";
import { verifyWebhookSignature } from "../utils/payment";
import { AppError } from "../middleware/error";

const router = Router();
const paymentService = new PaymentService();

router.post("/verify", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paymentService.verifyPayment(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/webhook",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers["x-razorpay-signature"] as string;
      const body = JSON.stringify(req.body);
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

      const isValid = verifyWebhookSignature(body, signature, secret);

      if (!isValid) {
        throw new AppError(401, "Invalid webhook signature");
      }

      const result = await paymentService.handleWebhookEvent(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
