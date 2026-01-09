import { Router, Request, Response, NextFunction } from "express";
import { BookingService } from "../services/bookingService";
import { authMiddleware } from "../middleware/auth";
import { AppError } from "../middleware/error";

const router = Router();
const bookingService = new BookingService();

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookingService.createBookingDraft(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.json(booking);
  } catch (error) {
    next(error);
  }
});

router.get("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await bookingService.getUserBookings(req.user.userId, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/cancel", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);
    res.json(booking);
  } catch (error) {
    next(error);
  }
});

export default router;
